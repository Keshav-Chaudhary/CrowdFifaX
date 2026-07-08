"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/nav/Sidebar";
import { MobileNav } from "@/components/nav/MobileNav";
import { MobileHeader } from "@/components/nav/MobileHeader";
import { SimulationControlPanel } from "@/components/ui/SimulationControlPanel";
import { AccessibilityWidget } from "@/components/ui/AccessibilityWidget";
import { usePersona } from "@/contexts/PersonaContext";
import { getAppNav } from "@/components/nav/nav-config";
import { TournamentHeader } from "@/components/app/TournamentHeader";

/**
 * Application shell shared by every /app route.
 *
 * Desktop: a fixed sidebar on the left, scrollable content on the right.
 * Mobile: a compact top header and a bottom tab bar, with the content between.
 * The main region is the page's primary landmark and the skip-link target.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isHydrated, persona } = usePersona();
  const pathname = usePathname();
  const router = useRouter();

  // Route guard: after hydration, redirect if the current path is not
  // in the active persona's nav. Prevents e.g. a Fan from accessing /app/heatmaps.
  useEffect(() => {
    if (!isHydrated) return;
    const allowedNav = getAppNav(persona);
    const isAllowed = allowedNav.some((item) =>
      item.href === "/app"
        ? pathname === "/app"                          // root: exact only
        : pathname === item.href || pathname.startsWith(item.href + "/")
    );
    if (!isAllowed) {
      router.replace("/app");
    }
  }, [isHydrated, persona, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile header */}
      <MobileHeader />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <TournamentHeader />
        <main
          id="main"
          className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-12 md:pt-8 overflow-y-auto custom-scrollbar"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      <SimulationControlPanel />
      <AccessibilityWidget />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
