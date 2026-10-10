import React from 'react';
import { ChevronDownIcon, SparklesIcon } from './icons';

export interface ModelOption {
  id: string;
  name: string;
  badge?: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Recommended',
    description: 'Sub-second response speed, optimal for creative & conversational generation'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    badge: 'Frontier',
    description: 'Deep reasoning, advanced architectural synthesis & code intelligence'
  },
  {
    id: 'gemini-2.5-flash-thinking',
    name: 'Gemini 2.5 Flash Thinking',
    badge: 'Analytical',
    description: 'Autonomous step-by-step reasoning for complex problem solving'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'High-throughput lightweight generation'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Massive context comprehension and broad general knowledge'
  }
];

interface ModelSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  isDark: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  label,
  value,
  onChange,
  disabled,
  isDark
}) => {
  const currentModel = AVAILABLE_MODELS.find(m => m.id === value) || AVAILABLE_MODELS[0];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </label>
        {currentModel.badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            {currentModel.badge}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          id="model-selector"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full pl-4 pr-10 py-3 text-sm rounded-2xl appearance-none font-medium transition-all duration-200 outline-none border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-[#151722]/80 border-white/10 text-white hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-sm'
          }`}
        >
          {AVAILABLE_MODELS.map((opt) => (
            <option 
              key={opt.id} 
              value={opt.id}
              className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
            >
              {opt.name} {opt.badge ? `(${opt.badge})` : ''}
            </option>
          ))}
        </select>
        
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>

      <p className={`mt-1.5 text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {currentModel.description}
      </p>
    </div>
  );
};
