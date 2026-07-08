import type { ChatMessage } from "@/services/ai/prompt";

export function appendChunkToLastMessage(messages: ChatMessage[], chunk: string): ChatMessage[] {
  const copy = [...messages];
  const last = copy[copy.length - 1];
  if (last && last.role === "assistant") {
    copy[copy.length - 1] = {
      role: "assistant",
      content: last.content + chunk,
    };
  }
  return copy;
}
