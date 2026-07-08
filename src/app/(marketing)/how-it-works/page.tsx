import type { Metadata } from "next";
import { 
  Users, 
  Map, 
  Sparkles, 
  Smartphone
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "How it Works",
  description:
    "Learn about the CrowdFifaX tournament logistics platform, core features, and real-time crowd safety workflows.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 text-center custom-fade-in">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm mb-6">
            The Concept
          </p>
          <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-tight text-fg lg:text-7xl">
            Intelligent Logistics.<br />
            <span className="text-[var(--accent)]">Safe Stadium Flow.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-fg-muted lg:text-xl leading-relaxed">
            CrowdFifaX is a local-first web application engineered for World Cup 2026 logistics, turnstile metrics, and spectator safety. By uniting predictive crowd algorithms with a secure AI Intelligence Center, we help tournament staff coordinate real-time operations seamlessly.
          </p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            Core Features of the Platform
          </h2>
          <p className="mt-4 text-lg text-fg-muted">
            Designed to bridge the gap between stadium operations, on-ground volunteers, and incoming fans.
          </p>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Live Density Heatmaps */}
          <ScrollReveal delayMs={100} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[50px] transition-all group-hover:scale-125" />
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] mb-6">
              <Map className="size-6" />
            </span>
            <h3 className="text-2xl font-bold text-fg mb-3">Live Density Heatmaps</h3>
            <p className="text-fg-muted leading-relaxed">
              Visualize gate flows, subway ingress/egress loads, and concourse occupancy. The system consumes local-first telemetry (turnstile clicks, transit ticket sweeps) to flag sector bottlenecks instantly.
            </p>
          </ScrollReveal>

          {/* AI Intelligence Center */}
          <ScrollReveal delayMs={200} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[50px] transition-all group-hover:scale-125" />
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] mb-6">
              <Sparkles className="size-6" />
            </span>
            <h3 className="text-2xl font-bold text-fg mb-3">GenAI Intelligence Center</h3>
            <p className="text-fg-muted leading-relaxed">
              An active operations analyst powered by local or cloud-based LLMs. It interprets live metrics to generate redirection plans, coordinate staff shifts, and answer complex layout queries dynamically.
            </p>
          </ScrollReveal>

          {/* Multilingual Volunteer Dispatch */}
          <ScrollReveal delayMs={300} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[50px] transition-all group-hover:scale-125" />
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] mb-6">
              <Users className="size-6" />
            </span>
            <h3 className="text-2xl font-bold text-fg mb-3">Multilingual Dispatch System</h3>
            <p className="text-fg-muted leading-relaxed">
              Break down language barriers. Deployed on volunteer mobile devices, this feature auto-translates commands, routes ground teams to emergency zones, and reports incident telemetry directly back to the organizer.
            </p>
          </ScrollReveal>

          {/* Unified Fan Wayfinding */}
          <ScrollReveal delayMs={400} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[50px] transition-all group-hover:scale-125" />
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] mb-6">
              <Smartphone className="size-6" />
            </span>
            <h3 className="text-2xl font-bold text-fg mb-3">Unified Fan Wayfinding</h3>
            <p className="text-fg-muted leading-relaxed">
              Pushes real-time transit guidance and queue updates to spectators. Fans receive live alerts warning them of subway delays or turns, complete with interactive routing to the optimal entry gates.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* How it Works Workflow */}
      <section className="border-t border-[var(--border)] bg-surface-2 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm">The Workflow</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
              How the system operates overall.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              We ingest local data feeds, model flow constraints dynamically, run secure AI inference, and orchestrate physical logistics on the ground.
            </p>
          </ScrollReveal>

          <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
            
            {/* Step 1 */}
            <ScrollReveal delayMs={100} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)] font-black text-sm">1</span>
                <h4 className="text-xl font-bold text-fg">Data Ingestion</h4>
              </div>
              <p className="text-fg-muted text-sm leading-relaxed">
                CrowdFifaX imports transit logs, ticket registration limits, turnstile data, and volunteer telemetry into a local-first store. No external telemetry leaks.
              </p>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delayMs={200} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)] font-black text-sm">2</span>
                <h4 className="text-xl font-bold text-fg">Flow Modeling</h4>
              </div>
              <p className="text-fg-muted text-sm leading-relaxed">
                Our mathematical engine calculates congestion quotients against structural benchmarks, predicting localized queue delays 15 minutes before they occur.
              </p>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delayMs={300} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)] font-black text-sm">3</span>
                <h4 className="text-xl font-bold text-fg">AI Interpretation</h4>
              </div>
              <p className="text-fg-muted text-sm leading-relaxed">
                The generative AI pipeline reads the modeled telemetry to provide natural language updates. It helps coordinators build optimal response strategies safely.
              </p>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal delayMs={400} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)] font-black text-sm">4</span>
                <h4 className="text-xl font-bold text-fg">Targeted Dispatch</h4>
              </div>
              <p className="text-fg-muted text-sm leading-relaxed">
                Coordinators push tasks to volunteers and route recommendations to fans. Everyone stays synchronized via real-time alerts and adaptive mapping.
              </p>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </>
  );
}
