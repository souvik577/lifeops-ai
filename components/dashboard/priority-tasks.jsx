"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { PRIORITY } from "@/lib/constants";

export function PriorityTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchTasks();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);

  const attentionTasks = tasks
    .filter((task) => !task.completed)
    .map((task) => {
      const dueDate = task.dueDate
        ? new Date(task.dueDate)
        : null;

      if (dueDate) {
        dueDate.setHours(0, 0, 0, 0);
      }

      const isOverdue =
        dueDate && dueDate < today;

      const isDueSoon =
        dueDate &&
        dueDate >= today &&
        dueDate <= sevenDaysLater;

      const isHighPriority =
        task.priority === "high";

      return {
        ...task,
        isOverdue,
        isDueSoon,
        isHighPriority,
      };
    })
    .filter(
      (task) =>
        task.isOverdue ||
        task.isHighPriority ||
        task.isDueSoon
    )
    .sort((a, b) => {
      // Overdue tasks first
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;

      // High priority tasks next
      if (
        a.isHighPriority &&
        !b.isHighPriority
      ) {
        return -1;
      }

      if (
        !a.isHighPriority &&
        b.isHighPriority
      ) {
        return 1;
      }

      // Then nearest due date
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return (
        new Date(a.dueDate) -
        new Date(b.dueDate)
      );
    })
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs your attention</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-sm text-ink-secondary">
            Loading tasks...
          </p>
        ) : attentionTasks.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="Nothing needs attention"
            description="Overdue, high-priority, and upcoming tasks will show up here."
          />
        ) : (
          <ul className="space-y-2.5">
            {attentionTasks.map((task) => {
              const p =
                PRIORITY[task.priority] ||
                PRIORITY.medium;

              return (
                <li
                  key={task._id}
                  className={`flex items-center justify-between gap-3 rounded-control ${p.bg} px-3 py-2.5`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {task.title}
                    </p>

                    <p
                      className={`text-xs ${
                        task.isOverdue
                          ? "font-medium text-red-600"
                          : "text-ink-secondary"
                      }`}
                    >
                      {task.isOverdue
                        ? `Overdue · ${new Date(
                            task.dueDate
                          ).toLocaleDateString()}`
                        : task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "No due date"}
                    </p>
                  </div>

                  <Badge
                    className={`shrink-0 border-none bg-white ${p.text}`}
                  >
                    {task.isOverdue
                      ? "Overdue"
                      : p.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}