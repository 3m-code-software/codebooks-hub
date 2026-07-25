"use client";

import { useState } from "react";
import { Category, CATEGORIES } from "@/lib/types";
import { Idea, IDEAS_BY_CATEGORY, getRandomIdeas } from "@/lib/ideas-data";

interface IdeasGeneratorProps {
  onSelectIdea: (idea: Idea) => void;
}

export default function IdeasGenerator({ onSelectIdea }: IdeasGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("accounting");
  const [displayedIdeas, setDisplayedIdeas] = useState<Idea[]>(
    IDEAS_BY_CATEGORY["accounting"]
  );
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setDisplayedIdeas(IDEAS_BY_CATEGORY[category]);
    setExpandedIdea(null);
  };

  const handleRefresh = () => {
    setDisplayedIdeas(getRandomIdeas(selectedCategory, 8));
    setExpandedIdea(null);
  };

  const toggleExpand = (ideaId: string) => {
    setExpandedIdea(expandedIdea === ideaId ? null : ideaId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">💡 مولّد الأفكار</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors text-sm flex items-center gap-2"
        >
          <span className="animate-spin">🔄</span>
          أفكار جديدة
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedCategory === cat.id
                ? "bg-brand-gold text-brand-black font-bold"
                : "glass text-gray-300 hover:bg-brand-charcoal"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="glass rounded-xl p-5 card-hover cursor-pointer"
            onClick={() => toggleExpand(idea.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: CATEGORIES.find((c) => c.id === idea.category)?.color + "20",
                    color: CATEGORIES.find((c) => c.id === idea.category)?.color,
                  }}
                >
                  {idea.badge}
                </span>
              </div>
              <span className="text-xl">
                {expandedIdea === idea.id ? "▼" : "▶"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-brand-white mb-2">
              {idea.title}
            </h3>

            {expandedIdea === idea.id ? (
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-brand-gold mb-2">
                    📋 السيناريو:
                  </h4>
                  <ul className="space-y-2">
                    {idea.scenario.map((line, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-300 flex items-start gap-2"
                      >
                        <span className="text-brand-gold">•</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-brand-gold mb-2">
                    ❓ الأسئلة:
                  </h4>
                  <ul className="space-y-2">
                    {idea.questions.map((q, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-300 flex items-start gap-2"
                      >
                        <span className="text-brand-gold font-bold">
                          {i + 1}.
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIdea(idea);
                  }}
                  className="w-full py-3 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-gold-light transition-colors"
                >
                  ✨ استخدام هذه الفكرة
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 line-clamp-2">
                {idea.scenario[0]}...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
