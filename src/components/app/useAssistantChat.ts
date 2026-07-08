"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/services/ai/prompt";
import type { Activity } from "@/services/emissions/types";
import { useCarbonStore } from "@/store/carbon-store";
import { useToast } from "@/components/ui";
import { appendChunkToLastMessage } from "./chat/processSSEChunk";
import { handleAssistantPayload } from "./chat/handleAssistantPayload";

export type ChatStatus = "idle" | "streaming" | "error";

export interface UseAssistantChat {
  messages: ChatMessage[];
  status: ChatStatus;
  enabled: boolean | null;
  error: string | null;
  send: (text: string) => Promise<void>;
  reset: () => void;
}

export function useAssistantChat(
  getActivities: () => Activity[],
  persona: string = "organizer"
): UseAssistantChat {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activitiesRef = useRef(getActivities);
  
  useEffect(() => {
    activitiesRef.current = getActivities;
  }, [getActivities]);

  const addActivity = useCarbonStore((s) => s.addActivity);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    fetch("/api/assistant")
      .then((r) => r.json())
      .then((d) => active && setEnabled(Boolean(d.enabled)))
      .catch(() => active && setEnabled(false));
    return () => {
      active = false;
    };
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setStatus("idle");
  }, []);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError(null);
    setStatus("streaming");

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };

    const nextWithAssistant = [...messagesRef.current, userMsg, assistantMsg];
    setMessages(nextWithAssistant);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMsg],
          activities: activitiesRef.current(),
          persona,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "The assistant is unavailable.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => appendChunkToLastMessage(m, chunk));
      }

      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last?.role !== "assistant") return m;
        const clean = handleAssistantPayload(last.content, addActivity, toast);
        copy[copy.length - 1] = { role: "assistant", content: clean };
        return copy;
      });

      setStatus("idle");
    } catch (err) {
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === "assistant" && last.content === "") {
          return copy.slice(0, -1);
        }
        return m;
      });
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, [addActivity, toast, persona]);

  return { messages, status, enabled, error, send, reset };
}
