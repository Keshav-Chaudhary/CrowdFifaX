import { cn } from "@/utils/cn";

/** A shimmering placeholder block used while client state hydrates. */
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-[var(--r-md)] bg-surface-2",
        className,
      )}
    />
  );
}

/** Dashboard loading skeleton mirroring the real layout's structure. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard">
      <Shimmer className="mb-6 h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Shimmer key={i} className="h-28" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Shimmer className="h-56 lg:col-span-2" />
        <Shimmer className="h-56" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Shimmer className="h-64" />
        <Shimmer className="h-64" />
      </div>
      <span className="sr-only">Loading your dashboard…</span>
    </div>
  );
}

/** Generic single-column skeleton for simpler pages. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Shimmer className="mb-6 h-8 w-56" />
      <Shimmer className="h-72" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
