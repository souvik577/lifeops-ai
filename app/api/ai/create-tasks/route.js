import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { extractTasks } from "@/lib/gemini";
import { normalizeDueDate } from "@/lib/date-utils";

export async function POST(request) {
  try {
    // 1. Get JWT from cookie
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // 2. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 3. Get request data
    const { text, tasks: editedTasks } =
      await request.json();

    let tasksToCreate;

    // 4. If edited tasks are provided, use them directly
    if (Array.isArray(editedTasks)) {
      if (editedTasks.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "No tasks provided",
          },
          { status: 400 }
        );
      }

      tasksToCreate = editedTasks.map((task) => ({
        title: task.title?.trim(),
        priority: task.priority || "medium",
        category: task.category || "Personal",
        dueDate: normalizeDueDate(task.dueDate),
        description: "",
        completed: false,
        userId: decoded.userId,
      }));
    } else {
      // 5. Otherwise extract tasks using AI
      if (!text || !text.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Text is required",
          },
          { status: 400 }
        );
      }

      const result = await extractTasks(text);

      if (
        !result.tasks ||
        result.tasks.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "No tasks found",
          },
          { status: 400 }
        );
      }

      tasksToCreate = result.tasks.map((task) => ({
        title: task.title,
        priority: task.priority,
        category: task.category,
        dueDate: normalizeDueDate(task.dueDate),
        description: "",
        completed: false,
        userId: decoded.userId,
      }));
    }

    // 6. Validate task titles
    const invalidTask = tasksToCreate.find(
      (task) => !task.title
    );

    if (invalidTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Every task must have a title",
        },
        { status: 400 }
      );
    }

    // 7. Connect to MongoDB
    await connectDB();

    // 8. Create tasks
    const createdTasks = await Task.insertMany(
      tasksToCreate
    );

    // 9. Return created tasks
    return NextResponse.json(
      {
        success: true,
        message: `${createdTasks.length} task(s) created successfully`,
        tasks: createdTasks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "AI create tasks error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create AI tasks",
      },
      { status: 500 }
    );
  }
}