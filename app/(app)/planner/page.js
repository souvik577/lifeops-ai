import { Header } from "@/components/layout/header";
import { PlannerPlaceholder } from "@/components/planner/planner-placeholder";

export const metadata = { title: "AI Planner — LifeOps AI" };

export default function PlannerPage() {
  return (
    <>
      <Header pageTitle="AI Planner" />
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">
        <PlannerPlaceholder />
      </div>
    </>
  );
}
