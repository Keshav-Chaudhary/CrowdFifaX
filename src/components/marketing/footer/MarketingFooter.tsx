import Link from "next/link";
import { Logo } from "@/components/nav/Logo";
import { INFO_NAV } from "@/components/nav/nav-config";
import { Activity, ArrowRight, Code2, Globe, Mail } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border-strong)] bg-surface-3 pt-12 pb-8 shadow-inner">
      {/* Massive subtle background radial glow */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,_var(--accent-subtle)_0%,_transparent_70%)] opacity-30 mix-blend-screen pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        
        {/* Newsletter Pulse Block */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[var(--border-faint)] bg-surface-2 px-6 py-6 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-fg">{/* PLACEHOLDER: Newsletter Heading */}Stay connected to the core.</h3>
            <p className="mt-2 text-fg-muted leading-relaxed">{/* PLACEHOLDER: Newsletter Description */}Subscribe to our technical changelog and telemetry updates. No marketing spam, strictly shipping updates.</p>
          </div>
          <div className="flex w-full max-w-md flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-12 rounded-xl border border-[var(--border-strong)] bg-surface px-4 text-sm text-fg !outline-none transition-colors focus:border-[var(--accent)]"
            />
            <button className="flex h-12 items-center justify-center rounded-xl bg-fg px-6 text-sm font-bold text-bg transition-transform hover:scale-105 active:scale-95 shadow-[var(--shadow-sm)] shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand & Status Column */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-3 lg:pr-12">
            <Logo href="/" />
            <p className="text-sm text-fg-muted leading-relaxed max-w-sm">
              {/* PLACEHOLDER: Footer Brand Description */}
              CrowdFifaX is an AI-enabled operations hub. It provides real-time crowd insights and predictive analytics for the FIFA World Cup 2026.
            </p>
            {/* System Status Badge */}
            <div className="flex items-center gap-3 rounded-lg bg-surface-3 px-4 py-2.5 border border-[var(--border-strong)] w-fit mt-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--positive)] opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-[var(--positive)]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-fg">{/* PLACEHOLDER: Footer Status */}System Status: Operations Active</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-bold text-fg-muted tracking-widest uppercase">Product</h3>
            <nav aria-label="Footer Product" className="flex flex-col gap-3">
              <Link href="/app" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)] flex items-center gap-1 group">
                Dashboard
                <ArrowRight className="size-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Link>
              <Link href="/app/log" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">
                Crowd Management
              </Link>
              <Link href="/app/goals" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">
                Analytics
              </Link>
              <Link href="/app/insights" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">
                Wayfinding
              </Link>
            </nav>
          </div>

          {/* Developers Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-bold text-fg-muted tracking-widest uppercase">Developers</h3>
            <nav aria-label="Footer Developers" className="flex flex-col gap-3">
              <Link href="#" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">API Documentation</Link>
              <Link href="#" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">Webhooks</Link>
              <Link href="#" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">Integration Specs</Link>
              <Link href="#" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">Open Source</Link>
            </nav>
          </div>

          {/* Resource Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-bold text-fg-muted tracking-widest uppercase">Resources</h3>
            <nav aria-label="Footer Resources" className="flex flex-col gap-3">
              {INFO_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="#" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">Privacy Policy</Link>
              <Link href="#" className="text-sm font-medium text-fg-subtle transition-colors hover:text-[var(--accent)]">Terms of Service</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[var(--border-strong)] pt-8 sm:flex-row">
          <div className="flex gap-4">
            <Link aria-label="Website" href="#" className="text-fg-muted hover:text-[var(--accent)] transition-transform hover:scale-110">
              <Globe className="size-5" />
            </Link>
            <Link aria-label="Source Code" href="#" className="text-fg-muted hover:text-[var(--accent)] transition-transform hover:scale-110">
              <Code2 className="size-5" />
            </Link>
            <Link aria-label="Email Us" href="#" className="text-fg-muted hover:text-[var(--accent)] transition-transform hover:scale-110">
              <Mail className="size-5" />
            </Link>
          </div>
          
          <div className="flex flex-col items-center sm:items-end gap-2 text-center sm:text-right">
            <p className="text-xs font-semibold text-fg flex items-center gap-1.5 uppercase tracking-wide">
              <Activity className="size-3.5 text-[var(--accent)]" />
              &copy; {new Date().getFullYear()} {/* PLACEHOLDER: Copyright Name */}CrowdFifaX. All rights reserved.
            </p>
            <p className="text-[10px] text-fg-muted font-medium">
              {/* PLACEHOLDER: Footer Disclaimer */}
              Predictive AI insights. Designed for secure tournament management.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
