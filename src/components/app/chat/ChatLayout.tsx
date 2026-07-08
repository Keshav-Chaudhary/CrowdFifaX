import { RefObject } from "react";
import { Dialog, Button } from "@/components/ui";
import { ChatHeader } from "./ChatHeader";
import { ChatComposer } from "./ChatComposer";
import { ChatBody } from "./ChatBody";
import { ChatError } from "./ChatError";
import type { ChatMessage } from "@/services/ai/prompt";
import { usePersona } from "@/contexts/PersonaContext";

interface ChatLayoutProps {
  hasMessages: boolean;
  messages: ChatMessage[];
  enabled: boolean | null;
  streaming: boolean;
  error: string | null;
  input: string;
  setInput: (s: string) => void;
  submit: (text: string) => Promise<void>;
  reset: () => void;
  logRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  showClearWarning: boolean;
  setShowClearWarning: (s: boolean) => void;
}

export function ChatLayout({
  hasMessages,
  messages,
  enabled,
  streaming,
  error,
  input,
  setInput,
  submit,
  reset,
  logRef,
  inputRef,
  showClearWarning,
  setShowClearWarning,
}: ChatLayoutProps) {
  const { persona } = usePersona();
  const title = persona === "fan" ? "Fan Copilot" : persona === "volunteer" ? "Translation AI" : "Operations AI";

  return (
    <div className="flex h-full flex-col bg-surface-1 custom-fade-in">
      <ChatHeader
        enabled={enabled}
        hasMessages={hasMessages}
        onClearClick={() => setShowClearWarning(true)}
      />

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the assistant"
        className="scroll-thin flex-1 overflow-y-auto"
      >
        <ChatBody
          hasMessages={hasMessages}
          messages={messages}
          enabled={enabled}
          streaming={streaming}
          input={input}
          setInput={setInput}
          submit={submit}
          reset={reset}
          inputRef={inputRef}
        />
      </div>

      <ChatError error={error} />

      {hasMessages && (
        <div className="border-t border-[var(--border)] p-3">
          <div className="mx-auto max-w-3xl animate-in slide-in-from-bottom-2 fade-in duration-300">
            <ChatComposer
              isHero={false}
              inputRef={inputRef}
              input={input}
              setInput={setInput}
              submit={submit}
              enabled={enabled}
              streaming={streaming}
              hasMessages={hasMessages}
              reset={reset}
            />
            <p className="mt-2 text-center text-xs text-fg-subtle">
              {title} can make mistakes. Verify important calculations.
            </p>
          </div>
        </div>
      )}

      <Dialog 
        open={showClearWarning} 
        onClose={() => setShowClearWarning(false)}
        title="Clear Intelligence Context?"
        description="This will instantly wipe your active conversation from the AI's memory. This action cannot be undone."
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowClearWarning(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              reset();
              setShowClearWarning(false);
            }}
            className="bg-[var(--critical)] text-[#ffffff] hover:opacity-90 border-transparent shadow-sm"
          >
            Clear Context
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
