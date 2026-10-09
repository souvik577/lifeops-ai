import {
  LayoutDashboard,
  ListChecks,
  Sparkles,
  Settings,
} from "lucide-react";

// Central nav definition so the desktop sidebar and mobile nav
// never fall out of sync with each other.
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "AI Planner", href: "/planner", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

// Priority levels used across tasks + dashboard widgets.
// Kept as data (not hardcoded strings) so the AI extraction layer
// can later output these same keys directly.
export const PRIORITY = {
  high: { label: "High", dot: "bg-signal-600", text: "text-signal-700", bg: "bg-signal-50" },
  medium: { label: "Medium", dot: "bg-ops-500", text: "text-ops-600", bg: "bg-ops-50" },
  low: { label: "Low", dot: "bg-ink-faint", text: "text-ink-secondary", bg: "bg-surface-muted" },
};

export const CATEGORIES = [
  "Academics",
  "Internship",
  "Personal",
  "Health",
  "Finance",
];
