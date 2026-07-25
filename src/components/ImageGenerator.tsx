"use client";

import { useState } from "react";
import { generateImage, refineImage } from "@/lib/api";

interface ImageGeneratorProps {
  prompt: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function ImageGenerator({ prompt, onImageGenerated }: ImageGeneratorProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("الرجاء إدخال محتوى البرومبت أولاً");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, setStatus);
      setGeneratedImage(imageUrl);
      onImageGenerated?.(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء توليد الصورة");
    } finally {
      setIsGenerating(false);
      setStatus("");
    }
  };

  const handleRefine = async () => {
    if (!generatedImage || !refinementPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await refineImage(generatedImage, refinementPrompt, setStatus);
      setGeneratedImage(imageUrl);
      onImageGenerated?.(imageUrl);
      setRefinementPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تعديل الصورة");
    } finally {
      setIsGenerating(false);
      setStatus("");
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `codebooks-hub-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold gradient-text">توليد الصورة</h3>
        <button
          onClick={handleCopyPrompt}
          className="px-3 py-1 rounded-lg bg-brand-gold/10 text-brand-gold text-sm hover:bg-brand-gold/20 transition-colors"
        >
          📋 نسخ البرومبت
        </button>
      </div>

      <div className="bg-brand-black rounded-lg p-4 border border-brand-gold/10">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono max-h-40 overflow-auto">
          {prompt}
        </pre>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          isGenerating
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-brand-gold text-brand-black hover:bg-brand-gold-light"
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            {status || "جاري التوليد..."}
          </span>
        ) : (
          "🎨 توليد الصورة"
        )}
      </button>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {generatedImage && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-brand-gold/20">
            <img
              src={generatedImage}
              alt="Generated post"
              className="w-full h-auto"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 rounded-lg bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30 transition-colors text-sm"
            >
              ⬇️ تحميل الصورة
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 py-2 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors text-sm"
            >
              🔄 توليد مرة أخرى
            </button>
          </div>

          <div className="border-t border-brand-gold/10 pt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              تعديل الصورة
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                placeholder="مثال: make the text larger, change background color..."
                className="flex-1 px-4 py-2 rounded-lg bg-brand-charcoal border border-brand-gold/20 text-white text-sm focus:border-brand-gold focus:outline-none"
                disabled={isGenerating}
              />
              <button
                onClick={handleRefine}
                disabled={isGenerating || !refinementPrompt.trim()}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  isGenerating || !refinementPrompt.trim()
                    ? "bg-gray-600 text-gray-400"
                    : "bg-brand-gold text-brand-black hover:bg-brand-gold-light"
                }`}
              >
                ✨ تعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
