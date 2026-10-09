import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function extractTasks(text) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: `
You are LifeOps AI, a personal task extraction assistant.

Extract every actionable task from the user's text.

Rules:
- Return only structured task data.
- Do not invent missing information.
- title must be concise.
- priority must be one of: low, medium, high.
- category must be one of: Academics, Internship, Personal, Health, Finance.
- If no due date is mentioned, use null.
- If no priority is clear, use medium.
- If no category is clear, use Personal.

User text:
${text}
`,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                },
                category: {
                  type: "string",
                  enum: [
                    "Academics",
                    "Internship",
                    "Personal",
                    "Health",
                    "Finance",
                  ],
                },
                dueDate: {
                  type: ["string", "null"],
                },
              },
              required: [
                "title",
                "priority",
                "category",
                "dueDate",
              ],
            },
          },
        },
        required: ["tasks"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generatePlanner(tasks) {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const taskData = tasks.map((task) => ({
    title: task.title,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate,
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: `
You are LifeOps AI, an intelligent daily productivity planner.

Today is ${currentDate}.

Create a realistic daily schedule from the user's incomplete tasks.

Planning rules:
- Prioritize tasks with closer deadlines.
- High priority tasks should generally come before medium and low priority tasks.
- Do not schedule completed tasks.
- Estimate a reasonable duration for each task.
- Use practical time blocks between 9:00 AM and 6:00 PM.
- Avoid unrealistic back-to-back workload.
- Include short breaks when appropriate.
- Do not invent tasks that are not provided.
- If a task has no due date, still schedule it when reasonable.
- Return only structured data.

User's incomplete tasks:
${JSON.stringify(taskData)}
`,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          plan: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                startTime: {
                  type: "string",
                },
                endTime: {
                  type: "string",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                },
                category: {
                  type: "string",
                  enum: [
                    "Academics",
                    "Internship",
                    "Personal",
                    "Health",
                    "Finance",
                  ],
                },
              },
              required: [
                "title",
                "startTime",
                "endTime",
                "priority",
                "category",
              ],
            },
          },
        },
        required: ["plan"],
      },
    },
  });

  return JSON.parse(response.text);
}