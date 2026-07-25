import { Prompt } from "./types";

const MOMEN_API_URL = process.env.NEXT_PUBLIC_MOMEN_API_URL || "";
const MOMEN_ADMIN_TOKEN = process.env.NEXT_PUBLIC_MOMEN_ADMIN_TOKEN || "";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
// Pollinations.ai - Free, no API key needed
const POLLINATIONS_URL = "https://image.pollinations.ai/prompt";

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

// Image Generation - Using Pollinations.ai (Free, no API key)

const BRAND_IDENTITY = `CodeBooks Hub educational post style: dark matte black background, rich golden yellow (#D4A843) accents, white Arabic bold text, premium infographic design, 1:1 square format, modern professional layout, high mobile readability`;

export async function generateImage(
  prompt: string,
  onProgress?: (status: string) => void
): Promise<string> {
  onProgress?.("جاري تجهيز البرومبت...");

  const fullPrompt = `${BRAND_IDENTITY}. ${prompt}. Arabic educational infographic, clean layout, dark background with golden accents, professional design`;

  onProgress?.("جاري توليد الصورة (مجاني)...");

  // Pollinations.ai - free image generation
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const imageUrl = `${POLLINATIONS_URL}/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true`;

  onProgress?.("جاري تحميل الصورة...");

  // Return the URL directly - Pollinations generates on-the-fly
  return imageUrl;
}

export async function generateImageVariations(
  prompt: string,
  count: number = 2,
  onProgress?: (status: string) => void
): Promise<string[]> {
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    onProgress?.(`جاري توليد الصورة ${i + 1} من ${count}...`);
    try {
      // Use different seed for each variation
      const encodedPrompt = encodeURIComponent(`${BRAND_IDENTITY}. ${prompt}. Arabic educational infographic`);
      const imageUrl = `${POLLINATIONS_URL}/${encodedPrompt}?width=1024&height=1024&seed=${Date.now() + i * 1000}&nologo=true`;
      results.push(imageUrl);
    } catch (error) {
      console.error(`Error generating variation ${i + 1}:`, error);
    }
  }
  
  return results;
}

export async function refineImage(
  originalImage: string,
  refinementPrompt: string,
  onProgress?: (status: string) => void
): Promise<string> {
  onProgress?.("جاري تطبيق التعديلات...");

  // For Pollinations, we generate a new image with refined prompt
  const refinedFullPrompt = `${BRAND_IDENTITY}. ${refinementPrompt}. Keep same dark background and golden accents style`;
  const encodedPrompt = encodeURIComponent(refinedFullPrompt);
  const imageUrl = `${POLLINATIONS_URL}/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true`;

  onProgress?.("جاري تحميل الصورة المعدلة...");
  return imageUrl;
}
