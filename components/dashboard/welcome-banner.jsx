"use client";

import { useEffect, useState } from "react";


export function WelcomeBanner() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success) {
          setName(data.user.name);
        }
      } catch (error) {
        console.error("Failed to get user:", error);
      }
    }

    getUser();
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
        You have 3 tasks due in the next two days. Your AI Planner preview is
        ready below.
      </p>
    </div>
  );
}