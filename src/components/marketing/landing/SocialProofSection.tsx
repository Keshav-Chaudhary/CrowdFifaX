import { ScrollReveal } from "@/components/ui/ScrollReveal";

function StatPulse({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <p className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-fg to-fg-subtle drop-shadow-sm">{value}</p>
      <p className="mt-3 text-xs font-bold text-[var(--accent)] uppercase tracking-widest">{label}</p>
    </div>
  );
}

export function SocialProofSection() {
  return (
    <section className="bg-surface-2 border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-12 md:px-12">
        {/* PLACEHOLDER: Stat 1 */}
        <ScrollReveal delayMs={100}><StatPulse value="85K+" label="Capacity Managed" /></ScrollReveal>
        <div className="hidden h-12 w-px bg-[var(--border)] md:block" />
        {/* PLACEHOLDER: Stat 2 */}
        <ScrollReveal delayMs={200}><StatPulse value="<10ms" label="Decision Latency" /></ScrollReveal>
        <div className="hidden h-12 w-px bg-[var(--border)] md:block" />
        {/* PLACEHOLDER: Stat 3 */}
        <ScrollReveal delayMs={300}><StatPulse value="24/7" label="Real-time Telemetry" /></ScrollReveal>
      </div>
    </section>
  );
}
