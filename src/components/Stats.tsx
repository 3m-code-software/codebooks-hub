"use client";

import { Prompt, CATEGORIES } from "@/lib/types";

interface StatsProps {
  prompts: Prompt[];
}

export default function Stats({ prompts }: StatsProps) {
  const stats = CATEGORIES.map((cat) => ({
    ...cat,
    count: prompts.filter((p) => p.category === cat.id).length,
  }));

  const totalPrompts = prompts.length;
  const promptsWithVariables = prompts.filter((p) => p.variables.length > 0).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div className="glass rounded-xl p-4 text-center">
        <div className="text-3xl font-bold gradient-text">{totalPrompts}</div>
        <div className="text-xs text-gray-400 mt-1">إجمالي البرومبتات</div>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-brand-teal">{promptsWithVariables}</div>
        <div className="text-xs text-gray-400 mt-1">برومبتات مع متغيرات</div>
      </div>

      {stats.map((stat) => (
        <div key={stat.id} className="glass rounded-xl p-4 text-center">
          <div className="text-3xl font-bold" style={{ color: stat.color }}>
            {stat.count}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {stat.icon} {stat.name}
          </div>
        </div>
      ))}
    </div>
  );
}
