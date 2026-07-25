export type Category = "accounting" | "inventory" | "erp" | "programming";

export interface Prompt {
  id: string;
  title: string;
  category: Category;
  badge: string;
  content: string;
  variables: PromptVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptVariable {
  name: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

export interface CategoryInfo {
  id: Category;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "accounting",
    name: "محاسبة",
    nameEn: "Accounting",
    icon: "📊",
    color: "#D4A843",
  },
  {
    id: "inventory",
    name: "مخازن",
    nameEn: "Inventory",
    icon: "📦",
    color: "#1a6b6b",
  },
  {
    id: "erp",
    name: "ERP",
    nameEn: "ERP",
    icon: "🔄",
    color: "#1e3a5f",
  },
  {
    id: "programming",
    name: "برمجة",
    nameEn: "Programming",
    icon: "💻",
    color: "#8b5cf6",
  },
];
