import React, { useState, useEffect } from 'react';
import { KeyIcon, CloseIcon, CheckIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
  isDark: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSave,
  isDark
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputKey('');
    onSave('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 transform scale-100 ${
          isDark 
            ? 'bg-[#181a26]/90 border border-white/10 text-white shadow-black/60' 
            : 'bg-white/90 border border-black/5 text-gray-900 shadow-xl'
        } backdrop-blur-2xl`}
        style={{
          boxShadow: isDark
            ? '0 24px 60px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 24px 60px -12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <KeyIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Gemini API Key</h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Stored securely in your local browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className={`w-full px-4 py-3 rounded-2xl text-sm font-mono tracking-wide transition-all outline-none border ${
                  isDark
                    ? 'bg-black/30 border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-2xl text-xs space-y-2 ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
            <p className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
              Don&apos;t have an API key? Get one free from Google AI Studio.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-500 hover:text-blue-400 font-medium underline underline-offset-2"
            >
              Get Gemini API Key on Google AI Studio &rarr;
            </a>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handleClear}
            className={`text-xs px-3 py-2 rounded-xl transition-colors ${
              isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            Clear Key
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/15 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
