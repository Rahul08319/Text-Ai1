
import React from 'react';

interface ModelSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ label, value, onChange, options, disabled }) => {
  return (
    <div className="w-full">
      <label htmlFor="model-selector" className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <select
          id="model-selector"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-900 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none border"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM5.22 8.22a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l2.25-2.25a.75.75 0 011.06 0zM14.78 8.22a.75.75 0 011.06 0l2.25 2.25a.75.75 0 01-1.06 1.06l-2.25-2.25a.75.75 0 010-1.06z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M5.232 7.232a1 1 0 011.414 0L10 10.586l3.354-3.354a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4.001-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};
