"use client";

import { useEffect, useRef, useState } from "react";
import { useCarbonStore } from "@/store/carbon-store";
import { useAssistantChat } from "./useAssistantChat";
import { OfflineState } from "./chat/OfflineState";
import { ChatLayout } from "./chat/ChatLayout";
import { usePersona } from "@/contexts/PersonaContext";

/**
 * Conversational assistant. Refined dark chat surface — no gradient text, no
 * glow. Replies stream token-by-token and render through a safe inline
 * markdown renderer. Fully keyboard operable; the transcript is an aria-live
 * log and each turn is labelled for screen readers.
 */
export function AssistantChat() {
  const getActivities = useCarbonStore.getState;
  const { persona } = usePersona();
  const { messages, status, enabled, error, send, reset } = useAssistantChat(
    () => getActivities().activities,
    persona
  );
  const [showClearWarning, setShowClearWarning] = useState(false);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streaming = status === "streaming";

  // Keep newest content in view as it streams.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function submit(text: string) {
    if (!text.trim() || streaming) return;
    setInput("");
    await send(text);
    inputRef.current?.focus();
  }

  if (enabled === false) {
    return <OfflineState />;
  }

  const hasMessages = messages.length > 0;

  return (
    <ChatLayout
      hasMessages={hasMessages}
      messages={messages}
      enabled={enabled}
      streaming={streaming}
      error={error}
      input={input}
      setInput={setInput}
      submit={submit}
      reset={reset}
      logRef={logRef}
      inputRef={inputRef}
      showClearWarning={showClearWarning}
      setShowClearWarning={setShowClearWarning}
    />
  );
}
