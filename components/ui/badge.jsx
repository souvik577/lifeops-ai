import { cn } from "@/lib/utils";

export function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-secondary",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
