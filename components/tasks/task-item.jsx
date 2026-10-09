"use client";

import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PRIORITY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  disabled,
}) {
  const p = PRIORITY[task.priority] || PRIORITY.medium;

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <li className="flex items-center gap-3 border-b border-surface-border px-4 py-3.5 last:border-none sm:px-5">
      <button
        type="button"
        onClick={() => onToggle?.(task._id, !task.completed)}
        disabled={disabled}
        aria-pressed={task.completed}
        aria-label={
          task.completed
            ? "Mark task as not done"
            : "Mark task as done"
        }
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          task.completed
            ? "border-success bg-success text-white"
            : "border-surface-border text-transparent hover:border-ops-500",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            task.completed
              ? "text-ink-faint line-through"
              : "text-ink"
          )}
        >
          {task.title}
        </p>

        <p className="text-xs text-ink-secondary">
          {dueLabel}
        </p>
      </div>

      <Badge className="hidden shrink-0 sm:inline-flex">
        {task.category}
      </Badge>

      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          p.dot
        )}
      />

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit?.(task)}
          disabled={disabled}
          aria-label={`Edit ${task.title}`}
          className="flex h-8 w-8 items-center justify-center rounded-control text-ink-faint transition-colors hover:bg-ops-50 hover:text-ops-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(task._id)}
          disabled={disabled}
          aria-label={`Delete ${task.title}`}
          className="flex h-8 w-8 items-center justify-center rounded-control text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </li>
  );
}