import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { generatePlanner } from "@/lib/gemini";

export async function GET() {
  try {
    // 1. Get JWT token
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

    // 2. Verify user
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Get this user's incomplete tasks
    const tasks = await Task.find({
      userId: decoded.userId,
      completed: false,
    }).sort({
      dueDate: 1,
      priority: -1,
    });

    // 5. Handle no tasks
    if (tasks.length === 0) {
      return NextResponse.json({
        success: true,
        plan: [],
        message: "No incomplete tasks available for planning",
      });
    }

    // 6. Generate AI plan
    const result = await generatePlanner(tasks);

    // 7. Return plan
    return NextResponse.json({
      success: true,
      plan: result.plan,
    });
  } catch (error) {
    console.error("AI planner error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate AI planner",
      },
      { status: 500 }
    );
  }
}