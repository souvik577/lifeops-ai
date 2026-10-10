
"use client";

import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState(
    "Let's make today productive!"
  );

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }

    async function loadDashboardInfo() {
      try {
        const [userResponse, tasksResponse] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/tasks"),
        ]);

        const userData = await userResponse.json();
        const tasksData = await tasksResponse.json();

        if (userData.success) {
          setName(userData.user.name);
        }

        if (!tasksResponse.ok) {
          throw new Error("Failed to load tasks");
        }

        // Supports common API response formats.
        const tasks = Array.isArray(tasksData)
          ? tasksData
          : tasksData.tasks || tasksData.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        const pendingTasks = tasks.filter(
          (task) => !task.completed
        );

        const overdueCount = pendingTasks.filter((task) => {
          if (!task.dueDate) return false;

          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          return dueDate < today;
        }).length;

        const dueSoonCount = pendingTasks.filter((task) => {
          if (!task.dueDate) return false;

          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          return dueDate >= today && dueDate <= dayAfterTomorrow;
        }).length;

        if (overdueCount > 0) {
          setMessage(
            `You have ${overdueCount} overdue ${
              overdueCount === 1 ? "task" : "tasks"
            } that need your attention.`
          );
        } else if (dueSoonCount > 0) {
          setMessage(
            `You have ${dueSoonCount} upcoming ${
              dueSoonCount === 1 ? "task" : "tasks"
            }. Let's make today productive!`
          );

        } else {
          setMessage(
            "You're all caught up for the next two days. Enjoy your day!"
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard info:", error);
        setMessage("Your AI Planner preview is ready below.");
      }
    }

    loadDashboardInfo();
  }, []);

  return (
    <div className="rounded-card border border-surface-border bg-ops-700 px-6 py-7 text-white sm:px-8">
      <p className="text-sm text-ops-100">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>

      <h2 className="mt-1 font-display text-2xl font-semibold sm:text-[26px]">
        {greeting}, {name}
      </h2>

      <p className="mt-2 max-w-md text-sm text-ops-100">
        {message}
      </p>
    </div>
  );
}
