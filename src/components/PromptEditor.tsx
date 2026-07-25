"use client";

import { useState, useEffect } from "react";
import { Prompt, Category, CATEGORIES } from "@/lib/types";
import ImageGenerator from "./ImageGenerator";

interface PromptEditorProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
}

type Tab = "edit" | "generate";

export default function PromptEditor({ prompt, isOpen, onClose, onSave }: PromptEditorProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("accounting");
  const [badge, setBadge] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>("edit");

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setCategory(prompt.category);
      setBadge(prompt.badge);
      setContent(prompt.content);
      setVariableValues(
        prompt.variables.reduce((acc, v) => ({ ...acc, [v.name]: v.placeholder }), {} as Record<string, string>)
      );
    }
  }, [prompt]);

  useEffect(() => {
    let result = content;
    Object.entries(variableValues).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    setPreview(result);
  }, [content, variableValues]);

  if (!isOpen || !prompt) return null;

  const handleSave = () => {
    onSave({
      ...prompt,
      title,
      category,
      badge,
      content,
      updatedAt: new Date(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-brand-gold/10 flex items-center justify-between">
          <h2 className="text-xl font-bold gradient-text">تحرير البرومبت</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ✕
          </button>
        </div>

        <div className="flex border-b border-brand-gold/10">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "edit"
                ? "text-brand-gold border-b-2 border-brand-gold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ✏️ تحرير البرومبت
          </button>
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "generate"
                ? "text-brand-gold border-b-2 border-brand-gold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🎨 توليد الصورة
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === "edit" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">الفئة</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white focus:border-brand-gold focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">البادج</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">محتوى البرومبت</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white focus:border-brand-gold focus:outline-none font-mono text-sm"
                  />
                </div>

                {prompt.variables.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">المتغيرات</label>
                    <div className="space-y-3">
                      {prompt.variables.map((v) => (
                        <div key={v.name}>
                          <label className="block text-xs text-gray-400 mb-1">{v.name}</label>
                          {v.type === "textarea" ? (
                            <textarea
                              value={variableValues[v.name] || ""}
                              onChange={(e) =>
                                setVariableValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                              }
                              rows={3}
                              placeholder={v.placeholder}
                              className="w-full px-4 py-3 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white focus:border-brand-gold focus:outline-none text-sm"
                            />
                          ) : (
                            <input
                              type="text"
                              value={variableValues[v.name] || ""}
                              onChange={(e) =>
                                setVariableValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                              }
                              placeholder={v.placeholder}
                              className="w-full px-4 py-3 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white focus:border-brand-gold focus:outline-none text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المعاينة</label>
                <div className="bg-brand-black rounded-lg p-4 h-[500px] overflow-auto border border-brand-gold/10">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{preview}</pre>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(preview)}
                  className="mt-3 w-full py-2 rounded-lg bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 transition-colors text-sm"
                >
                  📋 نسخ المعاينة
                </button>
              </div>
            </div>
          ) : (
            <ImageGenerator prompt={preview} />
          )}
        </div>

        <div className="p-6 border-t border-brand-gold/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-gold-light transition-colors"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
