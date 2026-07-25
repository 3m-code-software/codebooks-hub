import { Prompt } from "./types";

const MOMEN_API_URL = process.env.NEXT_PUBLIC_MOMEN_API_URL || "";
const MOMEN_API_KEY = process.env.NEXT_PUBLIC_MOMEN_API_KEY || "";

export async function fetchPrompts(): Promise<Prompt[]> {
  if (!MOMEN_API_URL) {
    const { DEFAULT_PROMPTS } = await import("./prompts-data");
    return DEFAULT_PROMPTS;
  }

  try {
    const response = await fetch(`${MOMEN_API_URL}/prompts`, {
      headers: {
        Authorization: `Bearer ${MOMEN_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching prompts:", error);
    const { DEFAULT_PROMPTS } = await import("./prompts-data");
    return DEFAULT_PROMPTS;
  }
}

export async function createPrompt(prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt> {
  if (!MOMEN_API_URL) {
    return {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const response = await fetch(`${MOMEN_API_URL}/prompts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MOMEN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  });
  return response.json();
}

export async function updatePrompt(id: string, prompt: Partial<Prompt>): Promise<Prompt> {
  if (!MOMEN_API_URL) {
    return {
      ...prompt,
      id,
      updatedAt: new Date(),
    } as Prompt;
  }

  const response = await fetch(`${MOMEN_API_URL}/prompts/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${MOMEN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  });
  return response.json();
}

export async function deletePrompt(id: string): Promise<void> {
  if (!MOMEN_API_URL) {
    return;
  }

  await fetch(`${MOMEN_API_URL}/prompts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${MOMEN_API_KEY}`,
    },
  });
}
