import { cn } from "@/lib/utils";

/**
 * A consistent "nothing here yet" treatment. Written as a direction
 * for what to do next, not just a statement that content is missing.
 */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-control border border-dashed border-surface-border px-6 py-10 text-center",
        className
      )}
    >
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink-faint">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && (
          <p className="max-w-xs text-sm text-ink-secondary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
