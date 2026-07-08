import Link from "next/link";
import { Logo } from "@/components/nav/Logo";
import { INFO_NAV } from "@/components/nav/nav-config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowRight } from "lucide-react";

/**
 * Marketing site header: A premium, floating pill-shaped navigation bar
 * with intense glassmorphism, brand logo, info links, theme toggle, and a CTA.
 */
export function MarketingHeader() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-[var(--border)] bg-surface/70 px-2 py-1.5 sm:px-4 sm:py-2 shadow-[var(--shadow-md)] backdrop-blur-md transition-all hover:border-[var(--accent-line)] hover:bg-surface/80">
        
        <div className="flex items-center gap-2 sm:gap-6">
          <Logo href="/" />
          <nav aria-label="Site" className="hidden items-center gap-2 md:flex">
            {INFO_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/launch"
            className="group flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[var(--accent)] px-3 sm:px-5 text-xs sm:text-sm font-bold text-[var(--accent-fg)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_16px_var(--accent-line)] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Launch App</span>
            <span className="sm:hidden">Launch</span>
            <ArrowRight aria-hidden="true" className="size-3 sm:size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </header>
    </div>
  );
}
