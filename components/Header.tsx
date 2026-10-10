import React from 'react';
import { SparklesIcon, SunIcon, MoonIcon, KeyIcon, GitHubIcon } from './icons';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenApiKeyModal,
  hasApiKey
}) => {
  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      <div 
        className={`w-full border-b transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0e1019]/75 border-white/10' 
            : 'bg-white/75 border-black/5'
        } backdrop-blur-2xl`}
        style={{
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          backdropFilter: 'blur(24px) saturate(180%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 -z-10" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`text-lg sm:text-xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Text-Ai<span className="text-blue-500 font-normal">.studio</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  v2.5 Pro
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Next-Gen Generative Intelligence • Apple Cupertino HIG
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Status indicator */}
            <div className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100/80 border-gray-200 text-gray-700'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gemini Engine Active</span>
            </div>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              title={hasApiKey ? "API Key Configured" : "Add your Gemini API Key"}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                hasApiKey 
                  ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100')
                  : (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 animate-pulse' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse')
              }`}
            >
              <KeyIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{hasApiKey ? "Key Set" : "Add Key"}</span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 border ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 hover:text-yellow-300' 
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
              aria-label="Toggle color theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>

            {/* GitHub Repo Button */}
            <a
              href="https://github.com/Rahul08319/Text-Ai1"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-xl transition-all duration-200 border ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
              aria-label="GitHub Repository"
              title="View on GitHub"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
