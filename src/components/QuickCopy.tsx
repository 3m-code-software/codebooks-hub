"use client";

import { Prompt } from "@/lib/types";

interface QuickCopyProps {
  prompt: Prompt;
  onClose: () => void;
}

export default function QuickCopy({ prompt, onClose }: QuickCopyProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-brand-gold/10 flex items-center justify-between">
          <h2 className="text-xl font-bold gradient-text">{prompt.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-brand-black rounded-lg p-4 mb-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{prompt.content}</pre>
          </div>
        </div>

        <div className="p-6 border-t border-brand-gold/10 flex justify-between">
          <button
            onClick={() => copyToClipboard(prompt.content)}
            className="px-6 py-3 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-gold-light transition-colors"
          >
            📋 نسخ الكل
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
