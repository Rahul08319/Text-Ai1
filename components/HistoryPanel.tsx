import React, { useState } from 'react';
import { HistoryIcon, TrashIcon, SearchIcon, DownloadIcon, CloseIcon, SparklesIcon } from './icons';

export interface HistoryEntry {
  id: string;
  prompt: string;
  generatedText: string;
  timestamp?: number;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (prompt: string) => void;
  onClear: () => void;
  onDeleteEntry?: (id: string) => void;
  disabled: boolean;
  isDark: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
  onDeleteEntry,
  disabled,
  isDark
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) =>
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.generatedText && item.generatedText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportHistory = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-ai-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (dateStr?: string | number) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div 
      className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 border flex flex-col h-full max-h-[820px] ${
        isDark
          ? 'bg-[#141622]/75 border-white/10 text-white'
          : 'bg-white/80 border-black/5 text-gray-900 shadow-xl'
      } backdrop-blur-2xl`}
      style={{
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 20px 40px -15px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)'
      }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <HistoryIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">History</h2>
            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {history.length} {history.length === 1 ? 'generation' : 'generations'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {history.length > 0 && (
            <button
              onClick={handleExportHistory}
              disabled={disabled}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Export History JSON"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your generation history?')) {
                onClear();
              }
            }}
            disabled={history.length === 0 || disabled}
            className={`p-2 rounded-xl transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:text-gray-600' 
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:text-gray-300'
            } disabled:cursor-not-allowed`}
            title="Clear All History"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="mb-3 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className={`w-full pl-8 pr-7 py-2 text-xs rounded-xl transition-all outline-none border ${
                isDark
                  ? 'bg-black/20 border-white/10 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
            />
            <SearchIcon className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* History List */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <div className={`p-3 rounded-2xl mb-2 ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
              <SparklesIcon className="w-6 h-6" />
            </div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No history yet</p>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Prompts and AI responses you generate will appear here.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No matching prompts found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl p-3 transition-all duration-200 border cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15 text-gray-200'
                  : 'bg-gray-50/80 hover:bg-white border-gray-200/70 hover:border-blue-500/30 text-gray-800 shadow-sm'
              }`}
              onClick={() => onSelect(item.prompt)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium line-clamp-2 leading-snug flex-grow">
                  {item.prompt}
                </p>
                {onDeleteEntry && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry(item.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity ${
                      isDark ? 'hover:bg-white/10 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-500 hover:text-red-600'
                    }`}
                    title="Delete item"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                )}
              </div>

              {item.generatedText && (
                <p className={`text-[11px] mt-1.5 line-clamp-2 leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.generatedText}
                </p>
              )}

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px] text-gray-500">
                <span>{formatTimestamp(item.timestamp || item.id)}</span>
                <span className="text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Load &rarr;
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
