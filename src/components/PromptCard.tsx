"use client";

import { Prompt, CATEGORIES } from "@/lib/types";

interface PromptCardProps {
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export default function PromptCard({ prompt, onSelect, onDelete }: PromptCardProps) {
  const category = CATEGORIES.find((c) => c.id === prompt.category);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="glass rounded-xl p-6 card-hover cursor-pointer" onClick={() => onSelect(prompt)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: category?.color + "20", color: category?.color }}
          >
            {category?.icon} {category?.name}
          </span>
          <span className="px-2 py-1 rounded bg-brand-gold/10 text-brand-gold text-xs">
            {prompt.badge}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(prompt.id);
          }}
          className="text-gray-500 hover:text-red-400 transition-colors"
        >
          🗑️
        </button>
      </div>

      <h3 className="text-lg font-bold text-brand-white mb-3">{prompt.title}</h3>

      <p className="text-sm text-gray-400 line-clamp-3 mb-4 font-mono leading-relaxed">
        {prompt.content.substring(0, 150)}...
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {prompt.variables.length > 0
            ? `${prompt.variables.length} متغيرات`
            : "برومبت ثابت"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(prompt.content);
            }}
            className="px-3 py-1 rounded-lg bg-brand-gold/10 text-brand-gold text-xs hover:bg-brand-gold/20 transition-colors"
          >
            نسخ
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(prompt);
            }}
            className="px-3 py-1 rounded-lg bg-brand-teal/20 text-brand-teal text-xs hover:bg-brand-teal/30 transition-colors"
          >
            تحرير
          </button>
        </div>
      </div>
    </div>
  );
}
