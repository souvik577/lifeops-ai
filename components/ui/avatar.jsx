import { cn } from "@/lib/utils";

export function Avatar({ initials, className }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ops-600 text-sm font-semibold text-white",
        className
      )}
    >
      {initials}
    </div>
  );
}
