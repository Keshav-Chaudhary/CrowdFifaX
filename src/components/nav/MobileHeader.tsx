"use client";

import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePersona } from "@/contexts/PersonaContext";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getAppNav } from "./nav-config";

export function MobileHeader() {
  const { persona, setPersona } = usePersona();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="w-full sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border)] bg-bg-subtle/95 px-4 backdrop-blur md:hidden">
      <Logo href="/app" />
      <div className="flex items-center gap-2">
        <div className="relative">
          <select 
            value={persona}
            onChange={(e) => {
              const next = e.target.value as typeof persona;
              setPersona(next);
              const nextNav = getAppNav(next);
              const isValidPath = nextNav.some(
                (item) =>
                  item.href === "/app"
                    ? pathname === "/app"
                    : item.href === pathname || pathname.startsWith(item.href + "/")
              );
              if (!isValidPath) router.push("/app");
            }}
            className="appearance-none rounded-lg border border-[var(--border)] bg-surface-3 pl-2 pr-6 py-1 text-[10px] font-semibold text-fg outline-none focus:border-[var(--accent)]"
          >
            <option value="organizer">Organizer</option>
            <option value="fan">Fan</option>
            <option value="volunteer">Volunteer</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-fg-muted pointer-events-none" />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
