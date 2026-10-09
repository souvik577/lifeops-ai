import Link from "next/link";
import { Compass, ArrowRight, CalendarClock, ListTree, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <Features />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-control bg-ops-600 text-white">
          <Compass className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <span className="font-display text-[15px] font-semibold text-ink">
          LifeOps AI
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-ink-secondary hover:text-ink"
        >
          Log in
        </Link>
        <Link href="/signup">
          <Button size="sm">Get started</Button>
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-20">
      <div>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
          Say what&apos;s on your plate. Get a plan back.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-secondary">
          LifeOps AI reads what you type in plain language and turns it into
          structured tasks, deadlines, priorities, and a daily plan you can
          actually follow.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/signup">
            <Button size="lg">
              Create your first plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              I already have an account
            </Button>
          </Link>
        </div>
      </div>

      <HeroMock />
    </section>
  );
}

function HeroMock() {
  return (
    <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
      <p className="rounded-control bg-surface-muted px-3 py-2.5 text-sm text-ink-secondary">
        &quot;I have a DBMS exam on Friday, an assignment due Wednesday, and
        an internship application deadline tomorrow.&quot;
      </p>

      <div className="mt-4 space-y-2">
        <MockTask title="Internship application" due="Tomorrow, 6:00 PM" priority="High" tone="signal" />
        <MockTask title="DBMS exam" due="Friday, 10:00 AM" priority="High" tone="signal" />
        <MockTask title="Submit assignment" due="Wednesday, 11:59 PM" priority="Medium" tone="ops" />
      </div>
      <p className="mt-4 text-xs text-ink-faint">
        Illustrative example — not a live AI response.
      </p>
    </div>
  );
}

function MockTask({ title, due, priority, tone }) {
  const dot = tone === "signal" ? "bg-signal-600" : "bg-ops-500";
  const text = tone === "signal" ? "text-signal-700" : "text-ops-600";
  return (
    <div className="flex items-center justify-between gap-3 rounded-control border border-surface-border px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
        <div>
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="text-xs text-ink-secondary">{due}</p>
        </div>
      </div>
      <span className={`text-xs font-medium ${text}`}>{priority}</span>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Describe your week",
      description:
        "Type it the way you'd tell a friend — no forms, no dropdowns to fill in first.",
    },
    {
      number: "2",
      title: "Review the structure",
      description:
        "LifeOps AI extracts tasks, deadlines, priority, and category, and lets you adjust anything.",
    },
    {
      number: "3",
      title: "Follow the plan",
      description:
        "Your day gets laid out around what's actually due, and re-plans when things change.",
    },
  ];

  return (
    <section className="border-y border-surface-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="font-display text-2xl font-semibold text-ops-300">
                {step.number}
              </span>
              <h3 className="mt-2 text-[15px] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: ListTree,
      title: "Structured extraction",
      description:
        "Free-form text becomes tagged tasks with a category, priority, and due date.",
    },
    {
      icon: CalendarClock,
      title: "Adaptive scheduling",
      description:
        "Plans shift automatically as deadlines move or new tasks come in.",
    },
    {
      icon: Sparkles,
      title: "AI planning, not just reminders",
      description:
        "LifeOps AI reasons about priority and time available, not just due dates.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-card border border-surface-border bg-surface-card p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-control bg-ops-50 text-ops-600">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>
            <h3 className="mt-3 text-[15px] font-semibold text-ink">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-surface-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-ink-faint">
          Built by Souvik Bhunia. LifeOps AI is a student project, not a
          published product.
        </p>
        <Link
          href="/signup"
          className="text-sm font-medium text-ops-600 hover:text-ops-700"
        >
          Get started
        </Link>
      </div>
    </footer>
  );
}
