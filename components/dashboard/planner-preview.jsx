"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

import { CardTitle } from "@/components/ui/card";
import { PRIORITY } from "@/lib/constants";

export function PlannerPreview() {
  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch("/api/ai/planner", {
          cache: "no-store",
        });
        const data = await response.json();

        if (data.success) {
          setPlan(data.plan || []);
        }
      } catch (error) {
        console.error("Failed to fetch planner:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, []);

  const previewPlan = plan.slice(0, 3);

  return (
    <div className="rounded-card border border-dashed border-ops-300 bg-ops-50/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles
            className="h-4 w-4 text-ops-600"
            strokeWidth={1.9}
          />
          <CardTitle>AI Planner preview</CardTitle>
        </div>

        <Link
          href="/planner"
          className="flex items-center gap-1 text-sm font-medium text-ops-600 hover:text-ops-700"
        >
          Open planner
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="mt-3 text-sm text-ink-secondary">
        LifeOps AI creates a realistic schedule from your incomplete
        tasks, balancing deadlines and priorities.
      </p>

      {isLoading ? (
        <div className="mt-4 rounded-control bg-white px-3 py-4 text-sm text-ink-secondary">
          Creating your AI plan...
        </div>
      ) : previewPlan.length === 0 ? (
        <div className="mt-4 rounded-control bg-white px-3 py-4 text-sm text-ink-secondary">
          No incomplete tasks available for planning.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {previewPlan.map((item, index) => {
            const priority =
              PRIORITY[item.priority] || PRIORITY.medium;

            return (
              <div
                key={`${item.title}-${index}`}
                className="flex items-center gap-3 rounded-control bg-white px-3 py-2.5"
              >
                <div className="w-[76px] shrink-0">
                  <p className="text-xs font-semibold text-ink">
                    {item.startTime}
                  </p>
                  <p className="text-[11px] text-ink-faint">
                    {item.endTime}
                  </p>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-xs text-ink-secondary">
                    {item.category} · {priority.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && previewPlan.length > 0 && (
        <p className="mt-3 text-xs text-ink-faint">
          Showing the first {previewPlan.length} items from today&apos;s
          AI-generated plan.
        </p>
      )}
    </div>
  );
}