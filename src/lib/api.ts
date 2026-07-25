import { Prompt } from "./types";

const MOMEN_API_URL = process.env.NEXT_PUBLIC_MOMEN_API_URL || "";
const MOMEN_ADMIN_TOKEN = process.env.NEXT_PUBLIC_MOMEN_ADMIN_TOKEN || "";

async function momenGraphQL(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(MOMEN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${MOMEN_ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await response.json();
  if (data.errors) {
    console.error("Momen GraphQL Error:", data.errors);
    throw new Error(data.errors[0]?.message || "GraphQL Error");
  }
  return data.data;
}

export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    const result = await momenGraphQL(`
      query GetPrompts {
        prompt(order_by: { created_at: desc }) {
          id
          title
          category
          badge
          content
          variables
          created_at
          updated_at
        }
      }
    `);

    return (result.prompt || []).map((p: Record<string, unknown>) => ({
      id: String(p.id),
      title: p.title as string,
      category: p.category as Prompt["category"],
      badge: p.badge as string,
      content: p.content as string,
      variables: (p.variables as Prompt["variables"]) || [],
      createdAt: new Date(p.created_at as string),
      updatedAt: new Date(p.updated_at as string),
    }));
  } catch (error) {
    console.error("Error fetching prompts:", error);
    const { DEFAULT_PROMPTS } = await import("./prompts-data");
    return DEFAULT_PROMPTS;
  }
}

export async function createPrompt(
  prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">
): Promise<Prompt> {
  const result = await momenGraphQL(
    `
    mutation CreatePrompt($object: prompt_insert_input!) {
      insert_prompt_one(object: $object) {
        id
        title
        category
        badge
        content
        variables
        created_at
        updated_at
      }
    }
  `,
    {
      object: {
        title: prompt.title,
        category: prompt.category,
        badge: prompt.badge,
        content: prompt.content,
        variables: JSON.stringify(prompt.variables),
      },
    }
  );

  const p = result.insert_prompt_one;
  return {
    id: String(p.id),
    title: p.title,
    category: p.category,
    badge: p.badge,
    content: p.content,
    variables: p.variables ? JSON.parse(p.variables) : [],
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at),
  };
}

export async function updatePrompt(
  id: string,
  prompt: Partial<Prompt>
): Promise<Prompt> {
  const result = await momenGraphQL(
    `
    mutation UpdatePrompt($id: bigint!, $set: prompt_set_input!) {
      update_prompt_by_pk(pk_columns: { id: $id }, _set: $set) {
        id
        title
        category
        badge
        content
        variables
        created_at
        updated_at
      }
    }
  `,
    {
      id: Number(id),
      set: {
        ...(prompt.title && { title: prompt.title }),
        ...(prompt.category && { category: prompt.category }),
        ...(prompt.badge && { badge: prompt.badge }),
        ...(prompt.content && { content: prompt.content }),
        ...(prompt.variables && {
          variables: JSON.stringify(prompt.variables),
        }),
      },
    }
  );

  const p = result.update_prompt_by_pk;
  return {
    id: String(p.id),
    title: p.title,
    category: p.category,
    badge: p.badge,
    content: p.content,
    variables: p.variables ? JSON.parse(p.variables) : [],
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at),
  };
}

export async function deletePrompt(id: string): Promise<void> {
  await momenGraphQL(
    `
    mutation DeletePrompt($id: bigint!) {
      delete_prompt_by_pk(id: $id) {
        id
      }
    }
  `,
    { id: Number(id) }
  );
}
