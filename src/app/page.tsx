"use client";

import { useState, useEffect } from "react";
import { Prompt, Category } from "@/lib/types";
import { fetchPrompts, createPrompt, updatePrompt, deletePrompt } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Stats from "@/components/Stats";
import PromptCard from "@/components/PromptCard";
import PromptEditor from "@/components/PromptEditor";
import QuickCopy from "@/components/QuickCopy";

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isQuickCopyOpen, setIsQuickCopyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    let result = prompts;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.badge.toLowerCase().includes(query)
      );
    }

    setFilteredPrompts(result);
  }, [prompts, activeCategory, searchQuery]);

  const loadPrompts = async () => {
    setIsLoading(true);
    const data = await fetchPrompts();
    setPrompts(data);
    setFilteredPrompts(data);
    setIsLoading(false);
  };

  const handleSave = async (prompt: Prompt) => {
    if (prompt.id && prompts.find((p) => p.id === prompt.id)) {
      await updatePrompt(prompt.id, prompt);
    } else {
      const newPrompt = await createPrompt({
        title: prompt.title,
        category: prompt.category,
        badge: prompt.badge,
        content: prompt.content,
        variables: prompt.variables,
      });
      setPrompts((prev) => [...prev, newPrompt]);
    }
    await loadPrompts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا البرومبت؟")) {
      await deletePrompt(id);
      await loadPrompts();
    }
  };

  const handleAddPrompt = () => {
    setSelectedPrompt({
      id: "",
      title: "برومبت جديد",
      category: "accounting",
      badge: "جديد",
      content: "",
      variables: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsEditorOpen(true);
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsQuickCopyOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <main className="mr-64 p-8">
        <Header onAddPrompt={handleAddPrompt} onSearch={setSearchQuery} />

        <div className="mt-8">
          <Stats prompts={prompts} />

          {isLoading ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-400">جاري تحميل البرومبتات...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-400">لا توجد برومبتات</p>
              <button
                onClick={handleAddPrompt}
                className="mt-4 px-6 py-3 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-gold-light transition-colors"
              >
                أضف برومبت جديد
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onSelect={handleSelectPrompt}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PromptEditor
        prompt={selectedPrompt}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
      />

      {isQuickCopyOpen && selectedPrompt && (
        <QuickCopy
          prompt={selectedPrompt}
          onClose={() => setIsQuickCopyOpen(false)}
        />
      )}
    </div>
  );
}
