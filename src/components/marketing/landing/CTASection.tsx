import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--border)] bg-surface">
      <div className="absolute inset-0 bg-surface-2 -z-20" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_var(--accent-subtle)_0%,_transparent_70%)] opacity-40 mix-blend-screen" />

      <ScrollReveal className="mx-auto max-w-5xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <h2 className="text-5xl font-black tracking-tight text-fg sm:text-7xl uppercase drop-shadow-sm">
          {/* PLACEHOLDER: CTA Heading */}
          Manage the crowds.<br />
          <span className="text-[var(--accent)]">Master the event.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-xl text-fg-muted font-medium">
          {/* PLACEHOLDER: CTA Subheading */}
          Deploy the GenAI Stadium Solution today. Ensure a world-class experience for the FIFA World Cup 2026 with unparalleled predictive insights.
        </p>
        <div className="mt-14 flex justify-center">
          <Link
            href="/launch"
            className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--accent)] px-12 text-lg font-bold text-[var(--accent-fg)] shadow-[0_0_30px_var(--accent-line)] transition-all hover:scale-105 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-line)]"
          >
            {/* PLACEHOLDER: CTA Button Text */}
            Deploy Command Center
            <ArrowRight aria-hidden="true" className="size-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
