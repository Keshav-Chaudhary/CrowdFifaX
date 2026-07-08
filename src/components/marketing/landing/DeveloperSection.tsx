import Link from "next/link";
import { ArrowRight, Database, Server, Smartphone } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function DeveloperSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 overflow-hidden border-t border-[var(--border)]">
      <ScrollReveal className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-fg sm:text-5xl">
          Connected Operations
        </h2>
        <p className="mt-6 text-xl text-fg-muted leading-relaxed">
          CrowdFifaX connects directly to ticketing platforms, turnstile telemetry, and public transport APIs to provide a singular source of truth for venue operators.
        </p>
      </ScrollReveal>

      <ScrollReveal 
        delayMs={100} 
        className="grid gap-8 md:grid-cols-3"
      >
        <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
            <Smartphone className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-fg">Fan Application</h3>
          <p className="mt-3 text-fg-muted leading-relaxed">
            Direct integration with the official FIFA app provides fans with real-time push notifications for gate changes and optimal routes.
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
            <Database className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-fg">Live Ticket Scans</h3>
          <p className="mt-3 text-fg-muted leading-relaxed">
            The platform instantly connects with turnstiles at every gate to predict crowding inside the stadium.
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
            <Server className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-fg">City Transit Links</h3>
          <p className="mt-3 text-fg-muted leading-relaxed">
            Connections to local city transport networks (subways, buses) help organizers anticipate when mass arrivals will occur.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delayMs={200} className="mt-12 flex justify-center">
        <Link 
          href="/developer" 
          className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-2 px-6 text-sm font-bold text-fg shadow-sm transition-all hover:bg-surface-3"
        >
          View API Documentation
          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </ScrollReveal>
    </section>
  );
}
