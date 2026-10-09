"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export function ProgressOverview() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTasks() {
    try {
      const response = await fetch("/api/tasks", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed === true
  ).length;

  const remaining = total - completed;

  const percent =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {isLoading ? (
          <p className="text-sm text-ink-secondary">
            Loading progress...
          </p>
        ) : total === 0 ? (
          <div>
            <p className="text-sm font-medium text-ink">
              No tasks yet
            </p>

            <p className="mt-1 text-sm text-ink-secondary">
              Add your first task using Quick Add.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-control bg-surface-muted p-3">
                <p className="text-xs text-ink-secondary">
                  Total
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">
                  {total}
                </p>
              </div>

              <div className="rounded-control bg-surface-muted p-3">
                <p className="text-xs text-ink-secondary">
                  Completed
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">
                  {completed}
                </p>
              </div>

              <div className="rounded-control bg-surface-muted p-3">
                <p className="text-xs text-ink-secondary">
                  Remaining
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">
                  {remaining}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">
                  Overall progress
                </span>

                <span className="text-sm font-medium text-ink-secondary">
                  {percent}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-ops-600 transition-[width] duration-300"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-sm text-ink-secondary">
              {remaining === 0
                ? "All tasks completed. Great work!"
                : `${remaining} ${
                    remaining === 1 ? "task" : "tasks"
                  } remaining.`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}