import { Sparkles, Cpu, Target, Lock, Database } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function FeatureSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
      <ScrollReveal animation="custom-fade-in" className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-fg sm:text-5xl">
          {/* PLACEHOLDER: Main Feature Heading */}
          A masterclass in operational intelligence.
        </h2>
        <p className="mt-6 text-xl text-fg-muted leading-relaxed">
          {/* PLACEHOLDER: Main Feature Description */}
          Replace reactive management with an algorithmic, dynamic dashboard. Every crowd movement is calculated, strictly private, and beautifully rendered in real-time.
        </p>
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-3">
        <ScrollReveal delayMs={100} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] md:col-span-2 transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-subtle)] blur-[80px] transition-all group-hover:scale-150" />
          <span className="relative flex size-14 items-center justify-center rounded-2xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] mb-8">
            <Sparkles className="size-7" />
          </span>
          {/* PLACEHOLDER: Feature 1 Heading */}
          <h3 className="relative text-2xl font-bold text-fg">Predictive Crowd Flow</h3>
          <p className="relative mt-4 max-w-lg text-lg text-fg-muted leading-relaxed">
            {/* PLACEHOLDER: Feature 1 Description */}
            Generative AI predicts congestion points and suggests dynamic rerouting to venue staff. Zero bottlenecks. Total efficiency.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={200} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
            <Cpu className="size-6" />
          </span>
          {/* PLACEHOLDER: Feature 2 Heading */}
          <h3 className="text-xl font-bold text-fg">Real-Time Wayfinding</h3>
          <p className="mt-3 text-fg-muted leading-relaxed">
            {/* PLACEHOLDER: Feature 2 Description */}
            Interactive maps adapt instantly to traffic conditions, guiding fans to their seats flawlessly.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={300} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
            <Target className="size-6" />
          </span>
          {/* PLACEHOLDER: Feature 3 Heading */}
          <h3 className="text-xl font-bold text-fg">Sustainability Tracker</h3>
          <p className="mt-3 text-fg-muted leading-relaxed">
            {/* PLACEHOLDER: Feature 3 Description */}
            Monitor energy usage and transportation metrics to achieve a carbon-neutral tournament.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={400} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] md:col-span-2 transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
              <Lock className="size-6" />
            </span>
            {/* PLACEHOLDER: Feature 4 Heading */}
            <h3 className="text-xl font-bold text-fg">Multilingual Assistance</h3>
            <p className="mt-3 text-fg-muted leading-relaxed">
              {/* PLACEHOLDER: Feature 4 Description */}
              Instant GenAI translation services deployed across all staff devices, seamlessly breaking down language barriers.
            </p>
          </div>
          <div className="hidden sm:flex size-32 shrink-0 items-center justify-center rounded-full bg-surface-3 border border-[var(--border)] shadow-inner">
            <Database className="size-12 text-fg-muted opacity-50" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
