import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Train, ShieldCheck, Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FanJourneySection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-20 lg:mb-32">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm">The Fan Journey</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
            A seamless experience from transit to seat.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            Our platform connects directly to transport networks, turnstiles, and the official FIFA app to provide a unified experience.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-24">
          
          {/* Step 1 */}
          <ScrollReveal delayMs={100} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative h-64 w-full max-w-md rounded-3xl border border-[var(--border-strong)] bg-surface-2 p-8 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(99,102,241,0.05)_25%,transparent_25%,transparent_50%,rgba(99,102,241,0.05)_50%,rgba(99,102,241,0.05)_75%,transparent_75%,transparent)] bg-[size:24px_24px] opacity-50" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <span className="flex size-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-fg-muted uppercase">Transit API Linked</span>
                </div>
                <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)]">
                  <Train className="size-10" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-sm font-black text-[var(--accent)]">1</span>
                <h3 className="text-2xl font-bold text-fg">AI Transit Routing</h3>
              </div>
              <p className="text-lg text-fg-muted leading-relaxed">
                Connect directly to Lisbon Metro and ride-share APIs. Our predictive AI forecasts surges and recommends the fastest routes to Estádio da Luz before fans even reach the precinct.
              </p>
            </div>
          </ScrollReveal>

          {/* Step 2 */}
          <ScrollReveal delayMs={100} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-sm font-black text-[var(--accent)]">2</span>
                <h3 className="text-2xl font-bold text-fg">Digital Smart Tickets</h3>
              </div>
              <p className="text-lg text-fg-muted leading-relaxed">
                A seamless digital wallet holds match tickets and triggers live Wayfinding routing to the exact seat. Telemetry instantly alerts the Organizer dashboard when gate congestion occurs.
              </p>
            </div>
            <div className="order-2 lg:order-2 flex justify-center">
              <div className="relative h-64 w-full max-w-md rounded-3xl border border-[var(--border-strong)] bg-surface-2 p-8 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
                 <div className="absolute top-4 left-4 flex items-center gap-2">
                   <span className="flex size-2 rounded-full bg-yellow-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-fg-muted uppercase">Turnstile Telemetry</span>
                </div>
                <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)]">
                  <ShieldCheck className="size-10" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Step 3 */}
          <ScrollReveal delayMs={100} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative h-64 w-full max-w-md rounded-3xl border border-[var(--border-strong)] bg-surface-2 p-8 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <span className="flex size-2 rounded-full bg-[var(--accent)] animate-pulse" />
                   <span className="text-[10px] font-bold text-fg-muted uppercase">App Connected</span>
                </div>
                <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)]">
                  <Navigation className="size-10" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-sm font-black text-[var(--accent)]">3</span>
                <h3 className="text-2xl font-bold text-fg">AI Wayfinding & App</h3>
              </div>
              <p className="text-lg text-fg-muted leading-relaxed">
                Direct integration with the official FIFA app provides fans with real-time push notifications. An AI copilot navigates users to their seats, restrooms, or concessions based on live crowd congestion data.
              </p>
              <div className="mt-8">
                <Link 
                  href="/developer" 
                  className="group/btn inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors"
                >
                  View API Documentation
                  <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
