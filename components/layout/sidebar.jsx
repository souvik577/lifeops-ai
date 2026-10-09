"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-surface-border bg-white md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-control bg-ops-600 text-white">
          <Compass className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <span className="font-display text-[15px] font-semibold text-ink">
          LifeOps AI
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-ops-50 text-ops-700"
                  : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-border p-4">
        <p className="text-xs text-ink-faint">Build v0.1</p>
      </div>
    </aside>
  );
}
