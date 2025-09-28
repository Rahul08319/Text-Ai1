import React from 'react';
import { HistoryIcon, TrashIcon } from './icons';

interface HistoryEntry {
  id: string;
  prompt: string;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (prompt: string) => void;
  onClear: () => void;
  disabled: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, disabled }) => {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire history? This action cannot be undone.')) {
      onClear();
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 h-full flex flex-col max-h-[85vh]">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center">
          <HistoryIcon className="w-6 h-6 mr-2" />
          History
        </h2>
        <button
          onClick={handleClear}
          disabled={history.length === 0 || disabled}
          className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Clear history"
          title="Clear history"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto -mr-3 pr-3 space-y-2">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm text-center">Your generation history will appear here.</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.prompt)}
              disabled={disabled}
              className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-700/70 rounded-md transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <p className="text-gray-300 text-sm truncate">{item.prompt}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
