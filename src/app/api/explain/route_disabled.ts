import { z } from "zod";
import { streamChat, AINotConfiguredError } from "@/services/ai/client";
import { isAIEnabled } from "@/services/ai/config";
import { rateLimit } from "@/services/ai/rate-limit";
import { validatePrompt, PromptBlockedError } from "@/services/security/PromptGuard";

export const runtime = "nodejs";

const requestSchema = z.object({
  title: z.string(),
  dataInputs: z.array(z.string()),
  prediction: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).optional(),
});

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "anonymous";
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  if (!isAIEnabled()) {
    return jsonError("AI assistant is not configured.", 503);
  }

  const limit = rateLimit(clientKey(req));
  if (!limit.allowed) {
    return jsonError("Too many requests.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid request.", 400);
  }

  // Validate prompts using PromptGuard to block prompt injection attacks.
  if (parsed.data.messages) {
    try {
      for (const m of parsed.data.messages) {
        if (m.role === "user") {
          validatePrompt(m.content);
        }
      }
    } catch (error) {
      if (error instanceof PromptBlockedError) {
        return jsonError(error.message, 400);
      }
      throw error;
    }
  }

  const systemPrompt = `You are the Explainability AI for CrowdFifaX, a stadium management system.
A predictive model just made the following assessment:
Title: ${parsed.data.title}
Data Inputs: ${parsed.data.dataInputs.join(", ")}
Prediction: ${parsed.data.prediction}`;

  let messagesToRun = [];

  if (parsed.data.messages && parsed.data.messages.length > 0) {
    // Follow-up conversation
    messagesToRun = [
      { role: "system", content: systemPrompt },
      ...parsed.data.messages,
    ];
  } else {
    // Initial explanation generation
    messagesToRun = [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Task: Write a concise, logical 2-3 sentence explanation of the reasoning behind this prediction, as if you are revealing the model's inner weights to the user. Do not preface it with "The model made this prediction because" – just state the reasoning directly.` 
      }
    ];
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamChat(messagesToRun)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        const message = error instanceof AINotConfiguredError ? "AI not configured." : "Service unavailable.";
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
