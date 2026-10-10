import React, { useState } from 'react';
import { SparklesIcon, CodeIcon, BookIcon, BoltIcon, PencilIcon } from './icons';

interface PromptExample {
  title: string;
  category: 'Creative' | 'Code' | 'Analysis' | 'Productivity';
  prompt: string;
}

const EXAMPLES: PromptExample[] = [
  {
    title: 'Autonomous Space Probe Discovery',
    category: 'Creative',
    prompt: 'Write an atmospheric hard sci-fi log from the perspective of an autonomous deep space probe discovering non-baryonic crystalline structures near Saturn’s moon Enceladus.'
  },
  {
    title: 'Explain Quantum Superposition',
    category: 'Analysis',
    prompt: 'Explain quantum superposition and decoherence to a first-year undergraduate physics student using the analogy of a spinning coin and environmental interference.'
  },
  {
    title: 'Apple SwiftUI Liquid Glass Pattern',
    category: 'Code',
    prompt: 'Implement a reusable React 19 / Tailwind component representing Apple macOS Tahoe Liquid Glass material with adaptive specular border and backdrop blur.'
  },
  {
    title: 'Product Strategy Executive Brief',
    category: 'Productivity',
    prompt: 'Synthesize a crisp 3-bullet executive briefing on implementing on-device edge AI inference vs cloud frontier LLMs for battery-constrained mobile applications.'
  },
  {
    title: 'Clean Architecture Refactoring',
    category: 'Code',
    prompt: 'Show how to refactor a monolithic Node.js Express service into hexagonal architecture with clear domain ports and adapters in TypeScript.'
  },
  {
    title: 'Interactive Thought Experiment',
    category: 'Analysis',
    prompt: 'Design a philosophical thought experiment exploring machine consciousness and qualia, accompanied by three counter-arguments and rebuttals.'
  }
];

interface PromptPillsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
  isDark: boolean;
}

export const PromptPills: React.FC<PromptPillsProps> = ({
  onSelectPrompt,
  disabled = false,
  isDark
}) => {
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = ['All', 'Creative', 'Code', 'Analysis', 'Productivity'];

  const filtered = activeTab === 'All' 
    ? EXAMPLES 
    : EXAMPLES.filter((e) => e.category === activeTab);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Creative': return <PencilIcon className="w-3 h-3 text-pink-400" />;
      case 'Code': return <CodeIcon className="w-3 h-3 text-emerald-400" />;
      case 'Analysis': return <BoltIcon className="w-3 h-3 text-amber-400" />;
      case 'Productivity': return <BookIcon className="w-3 h-3 text-blue-400" />;
      default: return <SparklesIcon className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Filter Pills (Apple Segmented Style) */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Inspiration Starters
        </span>
        <div className={`flex items-center p-0.5 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100/90 border-gray-200'
        }`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all duration-200 ${
                activeTab === cat
                  ? (isDark 
                      ? 'bg-white/15 text-white shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm border border-black/5')
                  : (isDark 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pill buttons */}
      <div className="flex flex-wrap gap-2">
        {filtered.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            disabled={disabled}
            className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200 border text-left active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
                : 'bg-white hover:bg-gray-50 border-gray-200/80 hover:border-gray-300 text-gray-700 hover:text-gray-900 shadow-sm'
            }`}
          >
            {getCategoryIcon(item.category)}
            <span className="font-medium truncate max-w-[220px] sm:max-w-[280px]">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
