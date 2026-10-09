"use client";

import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "Academics",
  "Internship",
  "Personal",
  "Health",
  "Finance",
];

export function TaskFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            activeFilter === filter
              ? "border-ops-600 bg-ops-600 text-white"
              : "border-surface-border bg-white text-ink-secondary hover:bg-surface-muted"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}