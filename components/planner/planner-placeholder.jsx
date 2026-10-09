"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRIORITY } from "@/lib/constants";

export function PlannerPlaceholder() {
  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function generatePlan() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/planner", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to generate plan");
        return;
      }

      setPlan(data.plan || []);
    } catch (error) {
      console.error("Planner error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    generatePlan();

    function handleTasksUpdated() {
      generatePlan();
    }

    window.addEventListener("tasks-updated", handleTasksUpdated);

    return () => {
      window.removeEventListener("tasks-updated", handleTasksUpdated);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-card border border-dashed border-ops-300 bg-ops-50/60 px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ops-600">
          <Sparkles
            className="h-5 w-5 animate-pulse"
            strokeWidth={1.8}
          />
        </div>

        <h2 className="mt-4 font-display text-lg font-semibold text-ink">
          Creating your AI plan...
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-secondary">
          LifeOps AI is analyzing your incomplete tasks and organizing
          them into a realistic schedule.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card border border-surface-border bg-white px-6 py-10 text-center">
        <h2 className="font-display text-lg font-semibold text-ink">
          Unable to generate plan
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <Button
          size="sm"
          className="mt-5"
          onClick={generatePlan}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (plan.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ops-300 bg-ops-50/60 px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ops-600">
          <Sparkles className="h-5 w-5" strokeWidth={1.8} />
        </div>

        <h2 className="mt-4 font-display text-lg font-semibold text-ink">
          No tasks to plan
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-secondary">
          Add some incomplete tasks and LifeOps AI will create a
          schedule for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              className="h-4 w-4 text-ops-600"
              strokeWidth={1.9}
            />

            <h2 className="font-display text-lg font-semibold text-ink">
              Today&apos;s AI Plan
            </h2>
          </div>

          <p className="mt-1 text-sm text-ink-secondary">
            A schedule generated from your incomplete tasks.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={generatePlan}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      <div className="space-y-3">
        {plan.map((item, index) => {
          const priority =
            PRIORITY[item.priority] || PRIORITY.medium;

          return (
            <div
              key={`${item.title}-${index}`}
              className="flex gap-4 rounded-card border border-surface-border bg-white p-4"
            >
              <div className="w-28 shrink-0">
                <p className="text-sm font-semibold text-ink">
                  {item.startTime}
                </p>

                <p className="mt-0.5 text-xs text-ink-faint">
                  {item.endTime}
                </p>
              </div>

              <div className="min-w-0 flex-1 border-l border-surface-border pl-5">
                <p className="text-sm font-medium text-ink">
                  {item.title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge>{item.category}</Badge>

                  <Badge
                    className={`${priority.bg} border-none ${priority.text}`}
                  >
                    {priority.label}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}