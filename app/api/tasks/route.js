import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get task data
    const { title, description, dueDate, priority, category } =
      await request.json();

    // 4. Validate title
    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Task title is required",
        },
        { status: 400 }
      );
    }

    // 5. Connect to MongoDB
    await connectDB();

    // 6. Create task
    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      dueDate: dueDate || null,
      priority: priority || "medium",
      category: category || "General",
      userId: decoded.userId,
    });

    // 7. Return created task
    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Find only this user's tasks
    const tasks = await Task.find({
      userId: decoded.userId,
    }).sort({ createdAt: -1 });

    // 5. Return tasks
    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(request) {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get task data
    const {
      taskId,
      completed,
      title,
      description,
      dueDate,
      priority,
      category,
    } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          message: "Task ID is required",
        },
        { status: 400 }
      );
    }

    // 4. Build only the fields that were provided
    const updateData = {};

    if (typeof completed === "boolean") {
      updateData.completed = completed;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Task title cannot be empty",
          },
          { status: 400 }
        );
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate || null;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    // 5. Connect to MongoDB
    await connectDB();

    // 6. Update only the logged-in user's task
    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        userId: decoded.userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    // 7. Return updated task
    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get task ID
    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          message: "Task ID is required",
        },
        { status: 400 }
      );
    }

    // 4. Connect to MongoDB
    await connectDB();

    // 5. Delete only this user's task
    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: decoded.userId,
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
    } catch (error) {
        console.error("Delete task error:", error);

        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete task",
          },
          { status: 500 }
        );
      }
}