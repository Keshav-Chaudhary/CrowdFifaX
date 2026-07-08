import type { Metadata } from "next";
import { AssistantChat } from "@/components/app/AssistantChat";

export const metadata: Metadata = {
  title: "Fan Copilot",
};

export default function AssistantPage() {
  // Fill the main content area; the chat manages its own internal scroll.
  return (
    <div className="custom-fade-in">
      <div className="flex h-[calc(100vh-4.5rem)] flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--border-strong)] bg-surface shadow-sm md:h-[calc(100vh-6rem)]">
        <div className="min-h-0 flex-1">
          <AssistantChat />
        </div>
      </div>
    </div>
  );
}
