"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskItem } from "@/components/tasks/task-item";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "Academics",
  "Internship",
  "Personal",
  "Health",
  "Finance",
];

const PRIORITIES = ["low", "medium", "high"];

export function TaskList({ activeFilter }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    dueDate: "",
    priority: "medium",
    category: "Personal",
  });
  const [editError, setEditError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  async function toggleTask(taskId, completed) {
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
        console.error(
          data.message || "Failed to update task"
        );
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                completed: data.task.completed,
              }
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

  async function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setUpdatingTaskId(taskId);

    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message || "Failed to delete task"
        );
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );

      window.dispatchEvent(new Event("tasks-updated"));
    } catch (error) {
      console.error("Delete task error:", error);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  function openEditDialog(task) {
    setEditingTask(task);
    setEditError("");

    const category =
      task.category === "General"
        ? "Personal"
        : task.category === "College"
        ? "Academics"
        : task.category || "Personal";

    setEditForm({
      title: task.title || "",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      priority: task.priority || "medium",
      category,
    });
  }

  function closeEditDialog() {
    if (isSaving) return;

    setEditingTask(null);
    setEditError("");
  }

  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveTaskChanges(e) {
    e.preventDefault();

    if (!editingTask) return;

    if (!editForm.title.trim()) {
      setEditError("Task title is required.");
      return;
    }

    setEditError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: editingTask._id,
          title: editForm.title.trim(),
          dueDate: editForm.dueDate || null,
          priority: editForm.priority,
          category: editForm.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEditError(
          data.message || "Failed to update task."
        );
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingTask._id
            ? data.task
            : task
        )
      );

      setEditingTask(null);

      window.dispatchEvent(new Event("tasks-updated"));
    } catch (error) {
      console.error("Edit task error:", error);
      setEditError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-ink-secondary">
          Loading tasks...
        </p>
      </Card>
    );
  }

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((task) => {
          if (activeFilter === "Academics") {
            return (
              task.category.toLowerCase() === "academics" ||
              task.category.toLowerCase() === "college"
            );
          }

          return (
            task.category.toLowerCase() ===
            activeFilter.toLowerCase()
          );
        });

  if (filteredTasks.length === 0) {
    return (
      <>
        <Card className="p-2">
          <EmptyState
            icon={ClipboardList}
            title="No tasks yet"
            description="Use Quick Add to describe what's on your plate — LifeOps AI will turn it into structured tasks."
          />
        </Card>

        <Dialog
          open={Boolean(editingTask)}
          onClose={closeEditDialog}
          title="Edit task"
        >
          <EditTaskForm
            editForm={editForm}
            editError={editError}
            isSaving={isSaving}
            onChange={handleEditChange}
            onCancel={closeEditDialog}
            onSubmit={saveTaskChanges}
          />
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Card className="overflow-hidden p-0">
        <ul>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={openEditDialog}
              disabled={updatingTaskId === task._id}
            />
          ))}
        </ul>
      </Card>

      <Dialog
        open={Boolean(editingTask)}
        onClose={closeEditDialog}
        title="Edit task"
      >
        <EditTaskForm
          editForm={editForm}
          editError={editError}
          isSaving={isSaving}
          onChange={handleEditChange}
          onCancel={closeEditDialog}
          onSubmit={saveTaskChanges}
        />
      </Dialog>
    </>
  );
}

function EditTaskForm({
  editForm,
  editError,
  isSaving,
  onChange,
  onCancel,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Task title</Label>

        <Input
          id="edit-title"
          name="title"
          value={editForm.title}
          onChange={onChange}
          disabled={isSaving}
          autoFocus
        />
      </div>

      <div>
        <Label htmlFor="edit-dueDate">Due date</Label>

        <Input
          id="edit-dueDate"
          name="dueDate"
          type="date"
          value={editForm.dueDate}
          onChange={onChange}
          disabled={isSaving}
        />
      </div>

      <div>
        <Label htmlFor="edit-priority">Priority</Label>

        <select
          id="edit-priority"
          name="priority"
          value={editForm.priority}
          onChange={onChange}
          disabled={isSaving}
          className="mt-1 flex h-10 w-full rounded-control border border-surface-border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ops-500"
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() +
                priority.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="edit-category">Category</Label>

        <select
          id="edit-category"
          name="category"
          value={editForm.category}
          onChange={onChange}
          disabled={isSaving}
          className="mt-1 flex h-10 w-full rounded-control border border-surface-border bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ops-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {editError && (
        <p className="text-sm text-red-600" role="alert">
          {editError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}