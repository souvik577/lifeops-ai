"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PRIORITY } from "@/lib/constants";

export function UpcomingTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

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

  async function handleToggleTask(taskId, completed) {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          completed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to update task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? { ...task, completed: data.task.completed }
            : task
        )
      );

      window.dispatchEvent(new Event("tasks-updated"));
    } catch (error) {
      console.error("Update task error:", error);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  const upcoming = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming tasks</CardTitle>

        <Link
          href="/tasks"
          className="text-sm font-medium text-ops-600 hover:text-ops-700"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-sm text-ink-secondary">
            Loading tasks...
          </p>
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nothing due soon"
            description="Add a task and LifeOps AI will slot it in automatically."
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {upcoming.map((task) => {
              const p =
                PRIORITY[task.priority] || PRIORITY.medium;

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const dueDate = task.dueDate
                ? new Date(task.dueDate)
                : null;

              if (dueDate) {
                dueDate.setHours(0, 0, 0, 0);
              }

              const isOverdue =
                dueDate && dueDate < today;

              const isDueToday =
                dueDate &&
                dueDate.getTime() === today.getTime();

              return (
                <li
                  key={task._id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled={updatingTaskId === task._id}
                    onChange={(e) =>
                      handleToggleTask(
                        task._id,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 cursor-pointer accent-ops-600"
                    aria-label={`Mark ${task.title} as complete`}
                  />

                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${p.dot}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {task.title}
                    </p>

                    <p
                      className={`text-xs ${
                        isOverdue
                          ? "font-medium text-red-600"
                          : isDueToday
                          ? "font-medium text-ops-600"
                          : "text-ink-secondary"
                      }`}
                    >
                      {task.dueDate
                        ? isOverdue
                          ? `Overdue · ${new Date(
                              task.dueDate
                            ).toLocaleDateString()}`
                          : isDueToday
                          ? "Due today"
                          : new Date(
                              task.dueDate
                            ).toLocaleDateString()
                        : "No due date"}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-ink-faint">
                    {task.category}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}