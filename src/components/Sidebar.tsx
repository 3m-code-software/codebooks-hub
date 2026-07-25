"use client";

import { useState } from "react";
import { Category, CATEGORIES } from "@/lib/types";

interface SidebarProps {
  activeCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

export default function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`glass fixed right-0 top-0 h-full z-40 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-brand-gold/10">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-3 w-full"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center text-brand-black font-bold text-xl">
              C
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold gradient-text">CodeBooks</h1>
                <p className="text-xs text-gray-400">Prompt Library</p>
              </div>
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeCategory === "all"
                ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                : "text-gray-400 hover:bg-brand-charcoal hover:text-white"
            }`}
          >
            <span className="text-xl">📋</span>
            {!isCollapsed && <span>الكل</span>}
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeCategory === cat.id
                  ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                  : "text-gray-400 hover:bg-brand-charcoal hover:text-white"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {!isCollapsed && <span>{cat.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-gold/10">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 text-center">
              CodeBooks Hub © 2024
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
