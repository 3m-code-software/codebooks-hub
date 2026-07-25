import { Prompt } from "./types";

const MOMEN_API_URL = process.env.NEXT_PUBLIC_MOMEN_API_URL || "";
const MOMEN_ADMIN_TOKEN = process.env.NEXT_PUBLIC_MOMEN_ADMIN_TOKEN || "";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

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

// Gemini Image Generation

const BRAND_IDENTITY = `You are the dedicated visual identity designer for a Facebook educational brand called CodeBooks Hub.
Your task is to generate square social media educational post designs in Arabic for Facebook, optimized for high readability, strong engagement, and brand consistency.

Always preserve these brand rules:
- Dark background, preferably matte black or very deep charcoal
- Main accent color: rich golden yellow (#D4A843)
- Secondary accent color: deep blue for icons or labels
- Arabic text must be large, bold, clean, and easy to read
- Premium Arabic educational infographic style
- Modern, structured, professional design
- 1:1 square format for Facebook posts
- Visual hierarchy: title first, scenario second, questions third, CTA last`;

export async function generateImage(
  prompt: string,
  onProgress?: (status: string) => void
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.");
  }

  onProgress?.("جاري تجهيز البرومبت...");

  const fullPrompt = `${BRAND_IDENTITY}

Generate a square Arabic educational Facebook post for CodeBooks Hub based on this content:

${prompt}

Important:
- The image must be 1:1 square format
- All Arabic text must be large, bold, and readable
- Use dark background with golden yellow accents
- Professional infographic style, not photographic
- Clean layout with clear sections`;

  onProgress?.("جاري إرسال الطلب إلى Gemini...");

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Gemini API Error:", error);
    throw new Error(error.error?.message || "Failed to generate image");
  }

  onProgress?.("جاري استلام الصورة...");

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData) {
      const mimeType = part.inlineData.mimeType || "image/png";
      const base64 = part.inlineData.data;
      return `data:${mimeType};base64,${base64}`;
    }
  }

  throw new Error("No image was generated in the response");
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
      const image = await generateImage(prompt);
      results.push(image);
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
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key not configured.");
  }

  onProgress?.("جاري تطبيق التعديلات...");

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Keep the exact same layout and brand identity, but ${refinementPrompt}. The design must maintain the CodeBooks Hub visual system with dark background, golden yellow accents, and premium Arabic educational infographic style.`,
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: originalImage.split(",")[1],
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to refine image");
  }

  onProgress?.("جاري استلام الصورة المعدلة...");

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData) {
      const mimeType = part.inlineData.mimeType || "image/png";
      const base64 = part.inlineData.data;
      return `data:${mimeType};base64,${base64}`;
    }
  }

  throw new Error("No image was returned in the response");
}
