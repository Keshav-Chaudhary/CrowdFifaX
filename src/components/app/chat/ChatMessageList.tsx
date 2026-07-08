"use client";

import { cn } from "@/utils/cn";
import { Markdown } from "@/components/app/shared/Markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageListProps {
  messages: Message[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {messages.map((m, i) => (
        <div
          key={i}
          className={cn(
            "flex",
            m.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed shadow-sm",
              m.role === "user"
                ? "rounded-[var(--r-xl)] rounded-br-sm border border-[var(--border-strong)] bg-surface-2 text-fg"
                : "rounded-[var(--r-xl)] rounded-bl-sm border border-[var(--border)] bg-surface text-fg"
            )}
          >
            <span className="sr-only">
              {m.role === "user" ? "You said: " : "Assistant said: "}
            </span>
            {m.role === "assistant" ? (
              m.content ? (
                <Markdown
                  content={m.content.replace(/\[LOG_ACTIVITY:[\s\S]*?(?:\]|$)/g, "").trim()}
                />
              ) : (
                <span className="inline-flex gap-1" aria-label="Thinking">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </span>
              )
            ) : (
              m.content
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
