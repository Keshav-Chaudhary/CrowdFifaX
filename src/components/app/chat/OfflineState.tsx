import { MessageSquareOff } from "lucide-react";

export function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 custom-fade-in">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-[var(--accent-subtle)] blur-[60px] rounded-full scale-150 animate-pulse-hover pointer-events-none" />
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[var(--r-xl)] border border-[var(--border-strong)] bg-surface-2 shadow-xl">
          <MessageSquareOff className="size-10 text-[var(--accent)]" />
        </div>
      </div>
      
      <h1 className="text-4xl font-black tracking-tight text-fg mb-4">
        AI Assistant offline
      </h1>
      <p className="max-w-md text-lg text-fg-subtle mb-10 leading-relaxed">
        The AI capabilities haven&apos;t been configured for this deployment yet. Don&apos;t worry though—your dashboard and insights will continue to work perfectly using local data.
      </p>
      
      <div className="inline-flex h-14 items-center justify-center gap-3 rounded-[var(--r-xl)] bg-surface-3 border border-[var(--border-strong)] px-8 text-base font-bold text-fg-muted shadow-sm opacity-60 cursor-not-allowed">
        <MessageSquareOff className="size-5" />
        Currently Unavailable
      </div>
    </div>
  );
}
