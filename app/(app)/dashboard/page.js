import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

import { Header } from "@/components/layout/header";
import { QuickAddTask } from "@/components/dashboard/quick-add-task";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { PriorityTasks } from "@/components/dashboard/priority-tasks";
import { PlannerPreview } from "@/components/dashboard/planner-preview";

export const metadata = { title: "Dashboard — LifeOps AI" };

export default async function DashboardPage() {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    redirect("/login");
  }

  return (
    <>
      <Header pageTitle="Dashboard">
        <QuickAddTask />
      </Header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24 md:px-8 md:pb-6">
        <WelcomeBanner />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProgressOverview />
          <PlannerPreview />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingTasks />
          <PriorityTasks />
        </div>
      </div>
    </>
  );
}