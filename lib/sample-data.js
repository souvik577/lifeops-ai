// ---------------------------------------------------------------------------
// SAMPLE DATA — for UI development only.
//
// None of this is fetched from a database. Once the MongoDB + API layer
// exists, these arrays should be deleted and the components that import
// them should fetch real data instead (see the "Not implemented yet"
// section of the README).
// ---------------------------------------------------------------------------

export const sampleTasks = [
  {
    id: "t1",
    title: "DBMS exam",
    category: "Academics",
    priority: "high",
    dueLabel: "Friday, 10:00 AM",
    done: false,
  },
  {
    id: "t2",
    title: "Submit OS assignment",
    category: "Academics",
    priority: "medium",
    dueLabel: "Wednesday, 11:59 PM",
    done: false,
  },
  {
    id: "t3",
    title: "Internship application — Atlas Labs",
    category: "Internship",
    priority: "high",
    dueLabel: "Tomorrow, 6:00 PM",
    done: false,
  },
  {
    id: "t4",
    title: "Morning run",
    category: "Health",
    priority: "low",
    dueLabel: "Today, 7:00 AM",
    done: true,
  },
];

export const sampleProgress = {
  completed: 3,
  total: 8,
};
