"use client";

import { useState } from "react";

interface HeaderProps {
  onAddPrompt: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ onAddPrompt, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="glass sticky top-0 z-30 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="بحث في البرومبتات..."
              className="w-full px-4 py-3 pr-12 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white placeholder-gray-500 focus:border-brand-gold focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>
        </div>

        <button
          onClick={onAddPrompt}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-gold-light transition-colors"
        >
          <span>+</span>
          <span>برومبت جديد</span>
        </button>
      </div>
    </header>
  );
}
