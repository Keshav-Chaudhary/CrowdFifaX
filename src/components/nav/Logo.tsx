import Link from "next/link";
import { cn } from "@/utils/cn";
import { Activity } from "lucide-react";

/**
 * The Carbon wordmark: a small leaf glyph drawn in SVG (no emoji) paired with
 * the name. Used in the sidebar, marketing header, and footer.
 */
export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
      aria-label="CrowdFifaX — home"
    >
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-[var(--r-sm)] border border-[var(--accent-line)] bg-[var(--accent-subtle)]"
      >
        <Activity className="size-4 text-[var(--accent)]" />
      </span>
      {showText && <span className="text-fg tracking-tight">{/* PLACEHOLDER: Logo Text */}CrowdFifaX</span>}
    </Link>
  );
}
