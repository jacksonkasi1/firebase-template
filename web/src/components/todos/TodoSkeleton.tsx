// TodoSkeleton — IBM Carbon style loading placeholders
// ──────────────────────────────────────────────────────────

export function TodoSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-4 border-b border-border px-4 py-[18px]"
        >
          {/* Checkbox Skeleton */}
          <div className="h-4 w-4 shrink-0 bg-muted-foreground/15" />

          {/* Title Skeleton */}
          <div
            className="h-4 bg-muted-foreground/15"
            style={{ width: i === 1 ? "50%" : i === 2 ? "35%" : "65%" }}
          />

          {/* Actions / Badge Skeleton */}
          <div className="ml-auto h-4 w-12 bg-muted-foreground/15" />
        </div>
      ))}
    </div>
  )
}
