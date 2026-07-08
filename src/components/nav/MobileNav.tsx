"use client";
import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAppNav } from "./nav-config";
import { cn } from "@/utils/cn";
import { usePersona } from "@/contexts/PersonaContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { getTranslatedLabel } from "./Sidebar";

function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Mobile bottom tab bar. Fixed to the viewport bottom on small screens; hidden
 * on desktop where the sidebar takes over.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { persona } = usePersona();
  const { t } = useTranslation();
  
  // Get nav items dynamically based on persona
  const mobileItems = getAppNav(persona);

  const scrollContainerRef = React.useRef<HTMLUListElement>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  React.useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [mobileItems]);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-bg-subtle/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      {/* Scroll Fade Indicators */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-subtle to-transparent pointer-events-none transition-opacity duration-300",
          showLeft ? "opacity-100" : "opacity-0"
        )} 
      />
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-subtle to-transparent pointer-events-none transition-opacity duration-300",
          showRight ? "opacity-100" : "opacity-0"
        )} 
      />

      <ul 
        ref={scrollContainerRef}
        onScroll={handleScroll} 
        className="flex items-stretch overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mobileItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1 min-w-[72px] snap-start">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                  active ? "text-[var(--accent)]" : "text-fg-muted",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                <span>{getTranslatedLabel(item.href, item.label, t).split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
