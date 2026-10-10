import React, { useState, useEffect } from 'react';
import { GitHubIcon } from './icons';

interface FooterProps {
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark }) => {
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  useEffect(() => {
    // Automatically synchronizes year and live maintenance heartbeat
    const updateTime = () => {
      const now = new Date();
      setCurrentYear(now.getFullYear());
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateTime();
    // Update every minute to guarantee real-time synchronization
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className={`w-full mt-16 pt-8 pb-12 border-t transition-colors duration-300 ${
      isDark ? 'border-white/10 bg-[#0b0d14]/60 text-gray-400' : 'border-black/5 bg-white/60 text-gray-500'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          {/* Left info & dynamic copyright */}
          <div className="space-y-1 text-center md:text-left">
            <p className="font-medium flex items-center justify-center md:justify-start gap-1.5">
              <span>Text-Ai Studio</span>
              <span>•</span>
              <span>
                © 2024–{currentYear} Rahul Kumar
              </span>
              <span>•</span>
              <span className="text-blue-500 font-medium">All Rights Reserved</span>
            </p>
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              Engineered with Apple Human Interface Guidelines & Liquid Glass Aesthetics
            </p>
          </div>

          {/* Center dynamic auto-update status */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-[11px] ${
            isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>
              Autonomous Lifecycle: <span className="font-semibold text-blue-500">Active {currentYear}+</span>
            </span>
            {lastSyncTime && (
              <span className="hidden sm:inline text-gray-500">
                (Last sync: {lastSyncTime})
              </span>
            )}
          </div>

          {/* Right Links */}
          <div className="flex items-center space-x-5">
            <a
              href="https://github.com/Rahul08319/Text-Ai1"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline flex items-center gap-1 transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-gray-900'
              }`}
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
            >
              Google Gemini
            </a>
            <a
              href="https://developer.apple.com/design/human-interface-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
            >
              Apple HIG
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
