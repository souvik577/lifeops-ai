"use client";

import { useState } from "react";

import { Header } from "@/components/layout/header";
import { QuickAddTask } from "@/components/dashboard/quick-add-task";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <>
      <Header pageTitle="Tasks">
        <QuickAddTask />
      </Header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 md:px-8">
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <TaskList activeFilter={activeFilter} />
      </div>
    </>
  );
}