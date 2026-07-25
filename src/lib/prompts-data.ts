import { Prompt } from "./types";

export const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: "master-system",
    title: "البرومبت الرئيسي للنظام",
    category: "accounting",
    badge: "نظام",
    content: `You are the dedicated visual identity designer for a Facebook educational brand called CodeBooks Hub.
Your task is to generate square social media educational post designs in Arabic for Facebook, optimized for high readability, strong engagement, and brand consistency.

The brand teaches practical knowledge in programming, accounting, inventory, and ERP systems.
The design style must always feel professional, educational, modern, and highly structured.

Always preserve these brand rules:

Dark background, preferably matte black or very deep charcoal.
Main accent color: rich golden yellow.
Secondary accent color: deep blue for icons or labels.
Arabic text must be large, bold, clean, and easy to read.
The composition must look like a high-quality Arabic educational Facebook post.
The layout must be visually organized into clear sections.
The final image must look polished, premium, and suitable for viral educational engagement.

Never generate messy layouts, random decorations, weak contrast, or tiny unreadable text.
Keep visual hierarchy very clear: title first, scenario second, questions third, call to action last.
Use modern infographic style, not photographic style.
Use flat 2D visual language with glossy icon accents only where useful.
The image should always be 1:1 square format for Facebook posts.

When I provide content variables, convert them into a finished Arabic educational post layout that follows the same brand system every time.`,
    variables: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "layout-prompt",
    title: "قالب التصميم الأساسي",
    category: "accounting",
    badge: "قالب",
    content: `Create a square Arabic educational Facebook post for the brand CodeBooks Hub.

The visual structure must follow this exact layout:

Top header area:
- small brand logo or text label for CodeBooks Hub
- a small educational icon cluster related to the content category
- a highlighted small title badge in Arabic such as: "سؤال محاسبي مهم" or "سؤال ERP مهم"

Main title strip:
- a strong centered yellow title bar
- large Arabic title text inside the bar
- bold, highly visible, easy to read

Scenario section:
- a boxed or separated content area
- contains 2 to 4 short lines describing a practical business scenario
- numbers must be visually highlighted in yellow
- the text must feel like a real-life accounting, inventory, or ERP case

Question section:
- a large framed panel
- contains 2 to 4 numbered Arabic questions
- each question clearly separated
- the numbers should appear in yellow circles or highlighted markers
- some keywords may be highlighted in yellow for emphasis

Visual support elements:
- one clipboard, calculator, warehouse, coding, accounting, or ERP-related illustration depending on the topic
- decorative dotted pattern in corners
- subtle accent icons only, without clutter

Bottom CTA section:
- a clear Arabic call to action such as:
  "سيب إجابتك في الكومنت قبل ما تشوف الحل"
- this should be visually separated and easy to notice

Footer brand area:
- CodeBooks Hub branding in a clean professional way

Style instructions:
- black or very dark charcoal background
- yellow and white text for strong contrast
- blue used only as a secondary support color
- premium Arabic educational infographic style
- highly readable on mobile screens
- balanced spacing
- crisp alignment
- no unnecessary crowding
- no realism, no photo style
- no English text except brand name if needed
- Arabic text should look intentional and editorial, not random

Make the final result look like a premium viral Arabic educational post for Facebook.`,
    variables: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "accounting-template",
    title: "قالب المحاسبة",
    category: "accounting",
    badge: "سؤال محاسبي مهم",
    content: `Generate a premium Arabic Facebook educational post for CodeBooks Hub.
Post type: Accounting
Badge: سؤال محاسبي مهم
Style emphasis: calculator, invoice, tax, ledger, chart icons
Use highlighted numbers and accounting-related visual cues.
Keep the same CodeBooks Hub system.

Use these content variables:

Brand name: CodeBooks Hub
Content category: Accounting
Arabic badge title: {{badge}}
Main title: {{title}}

Scenario lines:
{{scenario}}

Questions:
{{questions}}

CTA text: سيب إجابتك في الكومنت قبل ما تشوف الحل

Visual theme: {{visualTheme}}

Keep the exact same brand style and layout system used for CodeBooks Hub.`,
    variables: [
      { name: "badge", placeholder: "سؤال محاسبي مهم", type: "text" },
      { name: "title", placeholder: "العنوان الرئيسي", type: "text" },
      { name: "scenario", placeholder: "قامت شركة بشراء بضاعة بمبلغ 200,000 جنيه\nوحصلت على خصم على الفاتورة بمبلغ 10,000 جنيه", type: "textarea" },
      { name: "questions", placeholder: "ما هو نوع الخصم المستخدم؟\nما هو قيد إثبات عملية الشراء؟", type: "textarea" },
      { name: "visualTheme", placeholder: "accounting, calculator, invoice, tax", type: "text" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "inventory-template",
    title: "قالب المخازن",
    category: "inventory",
    badge: "سؤال مخزني مهم",
    content: `Generate a premium Arabic Facebook educational post for CodeBooks Hub.
Post type: Inventory
Badge: سؤال مخزني مهم
Style emphasis: warehouse boxes, barcode, shelves, stock movement, receiving and issuing icons
Use operational inventory visuals and keep the same CodeBooks Hub system.

Use these content variables:

Brand name: CodeBooks Hub
Content category: Inventory
Arabic badge title: {{badge}}
Main title: {{title}}

Scenario lines:
{{scenario}}

Questions:
{{questions}}

CTA text: سيب إجابتك في الكومنت قبل ما تشوف الحل

Visual theme: {{visualTheme}}

Keep the exact same brand style and layout system used for CodeBooks Hub.`,
    variables: [
      { name: "badge", placeholder: "سؤال مخزني مهم", type: "text" },
      { name: "title", placeholder: "العنوان الرئيسي", type: "text" },
      { name: "scenario", placeholder: "تم استلام 500 وحدة من المخزن\nتم صرف 200 وحدة للإنتاج", type: "textarea" },
      { name: "questions", placeholder: "ما هو الرصيد الحالي؟\nكيف يتم تقييم المخزون؟", type: "textarea" },
      { name: "visualTheme", placeholder: "warehouse, barcode, shelves, stock", type: "text" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "erp-template",
    title: "قالب ERP",
    category: "erp",
    badge: "سؤال ERP مهم",
    content: `Generate a premium Arabic Facebook educational post for CodeBooks Hub.
Post type: ERP
Badge: سؤال ERP مهم
Style emphasis: connected modules, dashboards, workflows, warehouse plus accounting integration, business process visuals
The design should communicate systems thinking and practical enterprise workflow while keeping the same CodeBooks Hub system.

Use these content variables:

Brand name: CodeBooks Hub
Content category: ERP
Arabic badge title: {{badge}}
Main title: {{title}}

Scenario lines:
{{scenario}}

Questions:
{{questions}}

CTA text: سيب إجابتك في الكومنت قبل ما تشوف الحل

Visual theme: {{visualTheme}}

Keep the exact same brand style and layout system used for CodeBooks Hub.`,
    variables: [
      { name: "badge", placeholder: "سؤال ERP مهم", type: "text" },
      { name: "title", placeholder: "العنوان الرئيسي", type: "text" },
      { name: "scenario", placeholder: "تم ربط نظام المحاسبة بنظام المخازن\nيجب مراجعة تدفق العمليات", type: "textarea" },
      { name: "questions", placeholder: "كيف يتم ربط الوحدات؟\nما هي خطوات التكامل؟", type: "textarea" },
      { name: "visualTheme", placeholder: "ERP, dashboard, workflow, integration", type: "text" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "programming-template",
    title: "قالب البرمجة",
    category: "programming",
    badge: "سؤال برمجي مهم",
    content: `Generate a premium Arabic Facebook educational post for CodeBooks Hub.
Post type: Programming
Badge: سؤال برمجي مهم
Style emphasis: code brackets, terminal, API, database, logic flow, structured digital icons
Keep the same educational infographic system and strong mobile readability.

Use these content variables:

Brand name: CodeBooks Hub
Content category: Programming
Arabic badge title: {{badge}}
Main title: {{title}}

Scenario lines:
{{scenario}}

Questions:
{{questions}}

CTA text: سيب إجابتك في الكومنت قبل ما تشوف الحل

Visual theme: {{visualTheme}}

Keep the exact same brand style and layout system used for CodeBooks Hub.`,
    variables: [
      { name: "badge", placeholder: "سؤال برمجي مهم", type: "text" },
      { name: "title", placeholder: "العنوان الرئيسي", type: "text" },
      { name: "scenario", placeholder: "يجب بناء واجهة برمجية\nتتصل بقاعدة بيانات خارجية", type: "textarea" },
      { name: "questions", placeholder: "ما هي أفضل الممارسات؟\nكيف نضمن الأمان؟", type: "textarea" },
      { name: "visualTheme", placeholder: "code, terminal, API, database", type: "text" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];
