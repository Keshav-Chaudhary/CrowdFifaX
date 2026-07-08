"use client";

import { ArrowUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";
import { usePersona } from "@/contexts/PersonaContext";

interface ChatComposerProps {
  isHero: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  input: string;
  setInput: (value: string) => void;
  submit: (text: string) => void;
  enabled: boolean | null;
  streaming: boolean;
  hasMessages: boolean;
  reset: () => void;
}

export function ChatComposer({
  isHero,
  inputRef,
  input,
  setInput,
  submit,
  enabled,
  streaming,
  hasMessages,
  reset,
}: ChatComposerProps) {
  const { persona } = usePersona();
  const title = persona === "fan" ? "Fan Copilot" : persona === "volunteer" ? "Translation AI" : "Operations AI";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(input);
      }}
      className={cn(
        "flex items-end gap-2 transition-all",
        isHero
          ? "relative w-full items-center bg-surface border border-[var(--border-strong)] rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-[var(--accent-subtle)] p-2"
          : "rounded-[var(--r-lg)] border border-[var(--border-strong)] bg-surface-2 p-2 shadow-sm focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-subtle)]"
      )}
    >
      <label htmlFor={isHero ? "hero-input" : "assistant-input"} className="sr-only">
        Message the assistant
      </label>
      <textarea
        id={isHero ? "hero-input" : "assistant-input"}
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit(input);
          }
        }}
        rows={1}
        placeholder={`Message ${title}...`}
        disabled={enabled === null}
        className={cn(
          "scroll-thin flex-1 resize-none bg-transparent text-fg placeholder:text-fg-subtle focus:!outline-none focus-visible:!outline-none focus-visible:ring-0",
          isHero ? "min-h-[56px] py-4 px-4 text-base" : "max-h-40 px-2 py-1.5 text-sm"
        )}
      />
      {!isHero && hasMessages && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Start a new conversation"
          className="hidden"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </Button>
      )}
      <Button
        type="submit"
        size={isHero ? "md" : "sm"}
        disabled={streaming || enabled === null || input.trim() === ""}
        aria-label="Send message"
        className={cn(
          "transition-colors",
          isHero
            ? "absolute right-3 bottom-3 size-10 rounded-xl bg-[var(--accent)] text-[#ffffff] hover:bg-[var(--accent-strong)] p-0"
            : "size-9 p-0"
        )}
      >
        <ArrowUp aria-hidden="true" className={isHero ? "size-5" : "size-4"} />
      </Button>
    </form>
  );
}
