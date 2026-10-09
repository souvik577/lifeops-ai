"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PRIORITY } from "@/lib/constants";

const CATEGORIES = [
  "Academics",
  "Internship",
  "Personal",
  "Health",
  "Finance",
];

const PRIORITIES = ["low", "medium", "high"];

export function QuickAddTask() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedTasks, setExtractedTasks] =
    useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!value.trim()) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: value.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "AI extraction failed"
        );
        return;
      }

      if (
        !data.tasks ||
        data.tasks.length === 0
      ) {
        setError(
          "No tasks found in your description."
        );
        return;
      }

      setExtractedTasks(data.tasks);
    } catch (error) {
      console.error(
        "AI extraction error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateTask(index, field, value) {
    setExtractedTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index
          ? {
              ...task,
              [field]: value,
            }
          : task
      )
    );
  }

  async function handleCreateTasks() {
    if (
      !extractedTasks ||
      extractedTasks.length === 0
    ) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/ai/create-tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tasks: extractedTasks,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create tasks"
        );
        return;
      }

      setValue("");
      setExtractedTasks(null);
      setOpen(false);

      console.log(
        "AI tasks created:",
        data.tasks
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Create AI tasks error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    if (isLoading) return;

    setOpen(false);
    setError("");
    setValue("");
    setExtractedTasks(null);
  }

  function formatDueDate(date) {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Quick add
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        title={
          extractedTasks
            ? "Review AI tasks"
            : "Quick add task"
        }
      >
        {!extractedTasks ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="quick-add-input">
                Describe it in your own words
              </Label>

              <Textarea
                id="quick-add-input"
                placeholder="e.g. DBMS exam on Friday, assignment due Wednesday, internship application tomorrow..."
                value={value}
                onChange={(e) =>
                  setValue(e.target.value)
                }
                autoFocus
                disabled={isLoading}
              />

              <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
                <Sparkles className="h-3.5 w-3.5" />
                AI will extract tasks, priorities,
                categories and dates.
              </div>
            </div>

            {error && (
              <p
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  !value.trim() ||
                  isLoading
                }
              >
                {isLoading
                  ? "Extracting..."
                  : "Extract with AI"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-ink">
                AI found{" "}
                {extractedTasks.length}{" "}
                {extractedTasks.length === 1
                  ? "task"
                  : "tasks"}
              </p>

              <p className="mt-1 text-xs text-ink-secondary">
                Review and edit the details before
                creating them.
              </p>
            </div>

            <div className="space-y-3">
              {extractedTasks.map(
                (task, index) => {
                  const priority =
                    PRIORITY[
                      task.priority
                    ] ||
                    PRIORITY.medium;

                  return (
                    <div
                      key={`${task.title}-${index}`}
                      className="rounded-control border border-surface-border p-3"
                    >
                      <div>
                        <Label
                          htmlFor={`task-title-${index}`}
                        >
                          Task title
                        </Label>

                        <Input
                          id={`task-title-${index}`}
                          value={task.title}
                          onChange={(e) =>
                            updateTask(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          disabled={isLoading}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Label
                            htmlFor={`task-category-${index}`}
                          >
                            Category
                          </Label>

                          <select
                            id={`task-category-${index}`}
                            value={
                              task.category
                            }
                            onChange={(e) =>
                              updateTask(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            className="mt-1 flex h-10 w-full rounded-control border border-surface-border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ops-500"
                          >
                            {CATEGORIES.map(
                              (category) => (
                                <option
                                  key={category}
                                  value={category}
                                >
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div>
                          <Label
                            htmlFor={`task-priority-${index}`}
                          >
                            Priority
                          </Label>

                          <select
                            id={`task-priority-${index}`}
                            value={
                              task.priority
                            }
                            onChange={(e) =>
                              updateTask(
                                index,
                                "priority",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            className="mt-1 flex h-10 w-full rounded-control border border-surface-border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ops-500"
                          >
                            {PRIORITIES.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase() +
                                    item.slice(
                                      1
                                    )}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label
                          htmlFor={`task-date-${index}`}
                        >
                          Due date
                        </Label>

                        <Input
                          id={`task-date-${index}`}
                          type="date"
                          value={
                            task.dueDate
                              ? new Date(
                                  task.dueDate
                                )
                                  .toISOString()
                                  .split(
                                    "T"
                                  )[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "dueDate",
                              e.target.value ||
                                null
                            )
                          }
                          disabled={isLoading}
                        />

                        <p className="mt-1 text-xs text-ink-faint">
                          {formatDueDate(
                            task.dueDate
                          )}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge>
                          {task.category}
                        </Badge>

                        <Badge
                          className={`${priority.bg} border-none ${priority.text}`}
                        >
                          {priority.label}
                        </Badge>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {error && (
              <p
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setExtractedTasks(null);
                  setError("");
                }}
                disabled={isLoading}
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={handleCreateTasks}
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating..."
                  : `Create ${
                      extractedTasks.length
                    } ${
                      extractedTasks.length ===
                      1
                        ? "task"
                        : "tasks"
                    }`}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}