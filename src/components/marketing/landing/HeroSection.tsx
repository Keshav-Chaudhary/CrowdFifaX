import Link from "next/link";
import { Activity, ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

          <div className="max-w-2xl stagger">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_0_15px_var(--accent-line)]">
                <Activity aria-hidden="true" className="size-4" />
              </span>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm">
                World Cup 2026 Ready
              </span>
            </div>
            <h1 className="mt-6 text-balance text-5xl font-black tracking-tight text-fg lg:text-7xl">
              From transit to <span className="text-[var(--accent)]">turnstile.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-fg-muted lg:text-xl leading-relaxed">
              Your GenAI-enabled solution for stadium operations. Real-time digital tickets, smart transit routing, and AI-powered incident reporting for the ultimate FIFA World Cup experience.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link
                href="/launch"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-8 text-base font-bold text-[var(--accent-fg)] shadow-[var(--shadow-md)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] hover:bg-[var(--accent-strong)]"
              >
                {/* PLACEHOLDER: Primary CTA text */}
                Launch Dashboard
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--border-strong)] bg-surface-2 px-8 text-base font-semibold text-fg transition-colors hover:bg-surface-3"
              >
                {/* PLACEHOLDER: Secondary CTA text */}
                View Features
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block custom-fade-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg)] via-transparent to-transparent z-10 pointer-events-none rounded-xl" />
            <HeroCommandUI />
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroCommandUI() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--accent-line)] bg-surface/80 backdrop-blur-xl p-1 shadow-[0_0_50px_rgba(99,102,241,0.15)] custom-rise">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-strong)] bg-surface-2/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500/80" />
            <div className="size-2.5 rounded-full bg-yellow-500/80" />
            <div className="size-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-[10px] font-bold tracking-widest text-fg-subtle uppercase">GenAI Operations Copilot</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-[var(--accent-line)] bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          Model Active
        </span>
      </div>

      {/* Main UI Area */}
      <div className="relative grid gap-3 p-4 bg-surface text-sm font-mono leading-relaxed">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* User Prompt */}
        <div className="relative z-10 flex gap-3">
          <span className="text-fg-subtle shrink-0">{"❯"}</span>
          <p className="text-fg">
            Analyze crowd density at <span className="text-blue-400">North Transit Hub</span> and suggest an accessible rerouting strategy for incoming fans.
          </p>
        </div>

        {/* GenAI Thinking State */}
        <div className="relative z-10 flex items-center gap-2 mt-2">
          <Zap className="size-4 text-[var(--accent)] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Generating Strategy...</span>
        </div>

        {/* GenAI Output block */}
        <div className="relative z-10 rounded-lg border border-[var(--border-faint)] bg-surface-2/50 p-4 shadow-inner mt-1">
          
          <div className="flex items-start gap-2 mb-3">
            <div className="mt-1 size-1.5 rounded-full bg-red-400 shrink-0" />
            <p className="text-fg-muted">
              <span className="font-bold text-fg">Crowd Management:</span> High density (85% cap) detected arriving from Metro line. ETA to bottleneck: 8 mins.
            </p>
          </div>

          <div className="flex items-start gap-2 mb-3">
            <div className="mt-1 size-1.5 rounded-full bg-[var(--accent)] shrink-0" />
            <p className="text-fg-muted">
              <span className="font-bold text-[var(--accent)]">Decision Support:</span> Auto-redirecting general traffic to East Gate via Push Notifications in the official FIFA app.
            </p>
          </div>

          <div className="flex items-start gap-2 mb-3">
            <div className="mt-1 size-1.5 rounded-full bg-green-400 shrink-0" />
            <p className="text-fg-muted">
              <span className="font-bold text-green-400">Accessibility:</span> Reserving Gate 2 exclusively for wheelchair & accessible entry. Turnstile sensors updated.
            </p>
          </div>

          <div className="flex items-start gap-2 mb-3">
            <div className="mt-1 size-1.5 rounded-full bg-yellow-400 shrink-0" />
            <p className="text-fg-muted">
              <span className="font-bold text-yellow-400">Multilingual Dispatch:</span> Deploying 4 <span className="text-fg bg-yellow-400/20 px-1 rounded">Spanish-speaking</span> volunteers to Sector A.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <div className="mt-1 size-1.5 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-fg-muted">
              <span className="font-bold text-emerald-400">Sustainability Check:</span> Current metro usage offset 450kg CO₂ compared to ride-sharing.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
