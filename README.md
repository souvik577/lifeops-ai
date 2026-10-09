# LifeOps AI

An AI-powered personal action management platform. This repo is the
**foundation only**: professional UI, routing, and component structure.
No database calls and no AI logic are wired up yet — see "Not implemented
yet" below.

## Tech stack

- Next.js (App Router) + JavaScript — no TypeScript
- Tailwind CSS
- shadcn/ui-style components (hand-rolled, no CLI dependency)
- Lucide icons
- MongoDB Atlas + Gemini API (planned, not yet connected)

## Folder structure

```
app/
  layout.js            Root layout — loads fonts, sets metadata
  globals.css           Tailwind entry point + design tokens
  page.js                Public landing page
  (auth)/                Route group: unauthenticated, centered shell
    layout.js
    login/page.js
    signup/page.js
  (app)/                 Route group: authenticated shell (sidebar + mobile nav)
    layout.js
    dashboard/page.js
    tasks/page.js
    planner/page.js
    settings/page.js

components/
  ui/          Reusable primitives (Button, Card, Input, Dialog, Badge...)
  layout/      Sidebar, Header, MobileNav — shared app chrome
  dashboard/   Widgets specific to the dashboard page
  tasks/       Widgets specific to the tasks page
  planner/     Widgets specific to the planner page

lib/
  utils.js         cn() helper for merging Tailwind class names
  constants.js     Nav items, priority levels, categories — shared enums
  sample-data.js   Placeholder UI data (see note below)
```

**Why route groups?** `(auth)` and `(app)` are Next.js route groups —
folders in parentheses that organize routes without adding a URL
segment. `/login` still resolves to `/login`, but it gets a different
layout (centered card) than `/dashboard` (sidebar + header). This keeps
the two shells from fighting each other in a single root layout.

**Why `components/ui` vs the rest?** `ui/` holds generic, page-agnostic
primitives — the kind of thing you'd expect from a shadcn/ui setup.
Everything else is organized by *feature* (`dashboard/`, `tasks/`,
`planner/`), not by component type, so it's obvious where to add the
next task-related component without hunting through a flat folder.

## Running the project

This sandbox has no network access, so dependencies aren't installed
here. On your machine:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## What's intentionally NOT implemented yet

- **No AI extraction.** The Quick Add dialog and the AI Planner page are
  UI shells only. Typing a task and submitting just closes the dialog —
  there's no call to Gemini or any model.
- **No database.** `lib/sample-data.js` holds hardcoded placeholder
  tasks so the dashboard and tasks page have something realistic to
  render. There's no MongoDB connection, no API routes, and no
  persistence — refreshing the page resets any local changes (like
  checking off a task).
- **No auth.** The login and signup forms have no submit handlers. There's
  no session, no protected routes, and no real user (the "SB" avatar and
  settings page are hardcoded placeholders for demo purposes).
- **No re-planning logic.** The "adaptive" part of adaptive daily plans —
  re-running the plan when a task changes — doesn't exist yet; the
  planner preview card shows a static, clearly-labeled example layout.

## Suggested next steps

1. Add API routes under `app/api/` for tasks CRUD, backed by MongoDB Atlas.
2. Wire the Quick Add form to a `/api/tasks/extract` route that calls
   Gemini and returns structured task data.
3. Replace `sample-data.js` imports with real fetches (e.g. via a
   small `lib/api.js` client or React Server Components hitting MongoDB
   directly).
4. Add auth (NextAuth.js or a custom JWT flow) and protect the `(app)`
   route group.
