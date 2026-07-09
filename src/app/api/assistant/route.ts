import { z } from "zod";
import { analyzeFootprint } from "@/services/insights/analyze";
import { activityInputSchema } from "@/store/helpers";
import { streamChat, AINotConfiguredError } from "@/services/ai/client";
import { isAIEnabled, testAIConnection } from "@/services/ai/config";
import {
  buildMessages,
  MAX_USER_MESSAGE_LENGTH,
  MAX_HISTORY_MESSAGES,
} from "@/services/ai/prompt";
import { rateLimit } from "@/services/ai/rate-limit";
import { sanitizeText } from "@/services/security/sanitize";
import { validatePrompt, PromptBlockedError } from "@/services/security/PromptGuard";

// Run on the Node.js runtime so the server-only AI client and its key stay
// strictly server-side.
export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

/** Request body: chat history plus the user's current activity log for grounding. */
const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_USER_MESSAGE_LENGTH),
      }),
    )
    .min(1, "At least one message is required")
    .max(MAX_HISTORY_MESSAGES * 2),
  activities: z.array(activityInputSchema.extend({ id: z.string() })).max(5_000),
  persona: z.string().optional(),
});

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "anonymous";
}

/**
 * Reject cross-site requests. A browser sends `Origin` (or at least `Referer`)
 * on cross-origin POSTs; requiring it to match the host is a lightweight CSRF
 * defense for this state-changing, credential-free endpoint.
 */
function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches may omit Origin; allowed.
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  if (!isAIEnabled()) {
    return jsonError(
      "The AI assistant is not configured on this deployment. The dashboard insights still work fully.",
      503,
    );
  }

  if (!isSameOrigin(req)) {
    return jsonError("Cross-origin requests are not allowed.", 403);
  }

  const limit = rateLimit(clientKey(req));
  if (!limit.allowed) {
    return jsonError("Too many requests. Please wait a moment.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0].message, 400);
  }

  // Sanitize each message before it touches the prompt builder: strip control
  // and invisible characters that can be used to obfuscate prompt injection.
  const sanitizedMessages = parsed.data.messages
    .map((chatMessage) => ({
      role: chatMessage.role,
      content: sanitizeText(chatMessage.content, MAX_USER_MESSAGE_LENGTH),
    }))
    .filter((chatMessage) => chatMessage.content.length > 0);

  if (sanitizedMessages.length === 0) {
    return jsonError("Message content is empty after sanitization.", 400);
  }

  // Validate prompts using PromptGuard to block prompt injection attacks.
  try {
    for (const chatMessage of sanitizedMessages) {
      if (chatMessage.role === "user") {
        validatePrompt(chatMessage.content);
      }
    }
  } catch (error) {
    if (error instanceof PromptBlockedError) {
      return jsonError(error.message, 400);
    }
    throw error;
  }

  // Ground the model in the user's real, deterministically-computed footprint.
  const analysis = analyzeFootprint(parsed.data.activities);
  const messages = buildMessages(analysis, sanitizedMessages, parsed.data.persona);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamChat(messages)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        const message =
          error instanceof AINotConfiguredError
            ? "AI assistant is not configured."
            : "The assistant is temporarily unavailable. Please try again.";
        controller.enqueue(encoder.encode(`\n\n[${message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Lightweight capability probe so the UI can show/hide the assistant. */
export async function GET(): Promise<Response> {
  const isAiConfigured = isAIEnabled();
  if (!isAiConfigured) {
    return new Response(JSON.stringify({ enabled: false, configured: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  const isOnline = await testAIConnection();
  return new Response(JSON.stringify({ enabled: isOnline, configured: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
