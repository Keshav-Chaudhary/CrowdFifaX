import { cn } from "@/utils/cn";

/**
 * Consistent page title block for in-app pages: an eyebrow, a heading, and an
 * optional description, with room for actions on the right.
 */
export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  className,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-6 md:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)]",
        className,
      )}
    >
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[var(--accent-subtle)] blur-[50px] opacity-40 pointer-events-none" />
      
      <div className="relative z-10 flex-1">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--accent)] drop-shadow-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-fg to-fg-subtle">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm md:text-base text-fg-subtle font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="relative z-10 flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
