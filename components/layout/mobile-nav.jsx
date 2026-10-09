"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-surface-border bg-white/95 backdrop-blur md:hidden">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-ops-700" : "text-ink-faint"
            )}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={active ? 2.2 : 1.8}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
