import React from 'react';

interface MetricsBarProps {
  text: string;
  isStreaming: boolean;
  elapsedMs?: number;
  isDark: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  text,
  isStreaming,
  elapsedMs,
  isDark
}) => {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Approximation: ~4 chars per token for typical English text
  const estimatedTokens = Math.round(charCount / 3.8);
  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 200) * 60));

  if (!text && !isStreaming) return null;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-xl text-[11px] font-mono border transition-all duration-300 ${
      isDark 
        ? 'bg-black/20 border-white/5 text-gray-400' 
        : 'bg-gray-50 border-gray-200 text-gray-600'
    }`}>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <span>
          <strong className={isDark ? 'text-gray-200' : 'text-gray-800'}>{wordCount.toLocaleString()}</strong> words
        </span>
        <span className="text-gray-500">•</span>
        <span>
          <strong className={isDark ? 'text-gray-200' : 'text-gray-800'}>{charCount.toLocaleString()}</strong> chars
        </span>
        <span className="text-gray-500">•</span>
        <span>
          ~<strong className={isDark ? 'text-gray-200' : 'text-gray-800'}>{estimatedTokens.toLocaleString()}</strong> tokens
        </span>
        <span className="text-gray-500 hidden sm:inline">•</span>
        <span className="hidden sm:inline">
          ~{readingTimeSeconds < 60 ? `${readingTimeSeconds}s` : `${Math.ceil(readingTimeSeconds / 60)}m`} read
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {isStreaming && (
          <span className="flex items-center space-x-1.5 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span className="font-sans font-medium text-xs">Streaming response...</span>
          </span>
        )}
        {elapsedMs !== undefined && !isStreaming && elapsedMs > 0 && (
          <span className="text-emerald-500 font-sans font-medium text-xs">
            Completed in {(elapsedMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>
    </div>
  );
};
