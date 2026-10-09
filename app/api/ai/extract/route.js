import { NextResponse } from "next/server";
import { extractTasks } from "@/lib/gemini";
import { normalizeDueDate } from "@/lib/date-utils";

export async function POST(request) {
  try {
    const { text } = await request.json();

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

    const tasks = result.tasks.map((task) => ({
      ...task,
      dueDate: normalizeDueDate(task.dueDate),
    }));

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("AI extraction error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "AI extraction failed",
      },
      { status: 500 }
    );
  }
}