import React, { useState, useRef, useCallback, useEffect } from 'react';
import { streamGenerateText, getEffectiveApiKey } from './services/geminiService';
import { Header } from './components/Header';
import { Slider } from './components/Slider';
import { ModelSelector } from './components/ModelSelector';
import { HistoryPanel, HistoryEntry } from './components/HistoryPanel';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PromptPills } from './components/PromptPills';
import { MetricsBar } from './components/MetricsBar';
import { Footer } from './components/Footer';
import { 
  CopyIcon, 
  CheckIcon, 
  ResetIcon, 
  SparklesIcon, 
  DownloadIcon, 
  TrashIcon,
  SlidersIcon,
  CodeIcon,
  BookIcon,
  PencilIcon,
  BoltIcon
} from './components/icons';

interface PersonaOption {
  id: string;
  name: string;
  instruction: string;
  icon: 'default' | 'creative' | 'code' | 'executive' | 'academic';
}

const PERSONAS: PersonaOption[] = [
  {
    id: 'default',
    name: 'General Assistant',
    instruction: 'You are an intelligent, clear, and helpful AI assistant adhering to Apple craftsmanship: clear, deferent, and contextually precise.',
    icon: 'default'
  },
  {
    id: 'creative',
    name: 'Creative Storyteller',
    instruction: 'You are an evocative creative writer. Use sensory detail, immersive prose, rhythmic sentence structure, and vivid characterization.',
    icon: 'creative'
  },
  {
    id: 'code',
    name: 'Software Architect',
    instruction: 'You are a Senior Principal Engineer and Software Architect. Write robust, typed, clean, well-commented code following modern standards and idiomatic best practices.',
    icon: 'code'
  },
  {
    id: 'executive',
    name: 'Executive Briefing',
    instruction: 'You are an executive strategist. Deliver high-signal, concise bullet points, executive summaries, bottom-line upfront (BLUF), and actionable recommendations.',
    icon: 'executive'
  },
  {
    id: 'academic',
    name: 'Research Scientist',
    instruction: 'You are a research scientist. Provide rigorous, objective, deeply analytical explanations grounded in first principles, empirical citations, and mathematical precision.',
    icon: 'academic'
  }
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<string | false>(false);
  const [error, setError] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [model, setModel] = useState<string>('gemini-2.5-flash');
  const [selectedPersona, setSelectedPersona] = useState<string>('default');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('text-ai-theme');
      if (saved) return saved === 'dark';
    } catch {
      // fallback
    }
    return true; // Default sleek Apple dark mode
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [isMonoFont, setIsMonoFont] = useState<boolean>(false);
  const [generationStartTime, setGenerationStartTime] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const outputRef = useRef<HTMLDivElement>(null);

  // Sync theme class to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('text-ai-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  // Load API Key and History from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) setCustomApiKey(savedKey);

      const savedHistory = localStorage.getItem('gemini-text-gen-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn("Could not read from localStorage", e);
    }
  }, []);

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem('gemini-text-gen-history', JSON.stringify(history));
    } catch (e) {
      console.warn("Could not write history to localStorage", e);
    }
  }, [history]);

  const hasApiKey = !!getEffectiveApiKey(customApiKey);

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key) {
        localStorage.setItem('gemini_api_key', key);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch (e) {
      console.warn("Error saving key to localStorage", e);
    }
  };

  const activePersonaObj = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    if (!hasApiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setError(null);
    setGeneratedText('');
    setIsLoading('Initializing Gemini pipeline...');
    const startTime = Date.now();
    setGenerationStartTime(startTime);
    setElapsedMs(0);
    let fullResponse = '';

    try {
      const stream = streamGenerateText(
        prompt,
        temperature,
        topP,
        model,
        customApiKey,
        activePersonaObj.instruction
      );
      
      let firstChunk = true;
      for await (const chunk of stream) {
        if (firstChunk) {
          setIsLoading('Synthesizing output...');
          firstChunk = false;
        }
        const textChunk = chunk;
        setGeneratedText((prev) => prev + textChunk);
        fullResponse += textChunk;
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }

      const totalElapsed = Date.now() - startTime;
      setElapsedMs(totalElapsed);

      if (fullResponse.trim()) {
        const newEntry: HistoryEntry = {
          id: new Date().toISOString(),
          prompt,
          generatedText: fullResponse,
          timestamp: Date.now()
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 50));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, temperature, topP, model, customApiKey, activePersonaObj, hasApiKey, isLoading]);

  const handleReset = () => {
    setPrompt('');
    setGeneratedText('');
    setError(null);
    setIsLoading(false);
    setTemperature(0.7);
    setTopP(0.95);
    setModel('gemini-2.5-flash');
    setSelectedPersona('default');
    setElapsedMs(0);
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!generatedText) return;
    const content = `# Generated Prompt\n${prompt}\n\n---\n\n## Model Output (${model})\n\n${generatedText}\n\n---\n*Generated with Text-Ai Studio on ${new Date().toLocaleString()}*`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-output-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Dynamic Liquid Mesh Backdrop */}
      <div className={`glass-backdrop ${isDark ? 'dark-mode' : 'light-mode'}`} />

      {/* Navigation Header */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main Studio Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Banner if no API key is provided */}
        {!hasApiKey && (
          <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
            isDark 
              ? 'bg-blue-950/40 border-blue-500/30 text-blue-200' 
              : 'bg-blue-50 border-blue-200 text-blue-900'
          } backdrop-blur-xl`}>
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <SparklesIcon className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Gemini API Key Required</p>
                <p className="text-xs opacity-80">
                  Connect your Google Gemini key to activate lightning-fast generative AI streaming.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
            >
              Configure API Key &rarr;
            </button>
          </div>
        )}

        {/* Two-Column Apple Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input, Controls & Output (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Generation Studio Card */}
            <section 
              className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 border ${
                isDark 
                  ? 'bg-[#12141f]/80 border-white/10' 
                  : 'bg-white/85 border-black/5 shadow-xl'
              } backdrop-blur-2xl`}
              style={{
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                backdropFilter: 'blur(28px) saturate(190%)',
                boxShadow: isDark
                  ? '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : '0 25px 60px -15px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              {/* Persona Selector (Apple Segmented Bar) */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    AI Persona & Style
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {activePersonaObj.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border" style={{
                  background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(243, 244, 246, 0.8)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
                }}>
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPersona(p.id)}
                      disabled={!!isLoading}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
                        selectedPersona === p.id
                          ? (isDark 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                              : 'bg-white text-gray-900 shadow-sm border border-black/5 font-semibold')
                          : (isDark 
                              ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50')
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Starter Inspiration Prompts */}
              <div className="mb-6">
                <PromptPills
                  onSelectPrompt={(p) => setPrompt(p)}
                  disabled={!!isLoading}
                  isDark={isDark}
                />
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="prompt-input" className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Input Prompt
                  </label>
                  {prompt.trim() && (
                    <button
                      onClick={() => setPrompt('')}
                      disabled={!!isLoading}
                      className={`text-xs ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="relative group">
                  <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a prompt, question, code challenge, or creative story prompt..."
                    rows={4}
                    disabled={!!isLoading}
                    className={`w-full p-4 rounded-2xl text-sm leading-relaxed transition-all duration-200 outline-none resize-y border ${
                      isDark
                        ? 'bg-[#0c0e17]/80 border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-gray-50/90 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                    }`}
                  />
                  <div className={`absolute bottom-3 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {prompt.length} chars
                  </div>
                </div>
              </div>

              {/* Advanced Parameters: Model, Temp, TopP */}
              <div className={`p-5 rounded-2xl border mb-6 space-y-5 ${
                isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50/60 border-gray-200/80'
              }`}>
                <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                  <SlidersIcon className="w-4 h-4 text-blue-500" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Synthesis Configuration
                  </span>
                </div>

                <ModelSelector
                  label="Model Engine"
                  value={model}
                  onChange={setModel}
                  disabled={!!isLoading}
                  isDark={isDark}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Slider
                    label="Temperature"
                    value={temperature}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onChange={setTemperature}
                    disabled={!!isLoading}
                    isDark={isDark}
                    hint="Higher = imaginative & poetic. Lower = factual & focused."
                  />
                  <Slider
                    label="Top P (Nucleus)"
                    value={topP}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onChange={setTopP}
                    disabled={!!isLoading}
                    isDark={isDark}
                    hint="Probability mass considered for token sampling."
                  />
                </div>
              </div>

              {/* Action Buttons: Generate & Reset */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || !!isLoading}
                  className="w-full sm:flex-grow inline-flex items-center justify-center px-6 py-3.5 rounded-2xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isLoading}
                    </span>
                  ) : (
                    'Generate with Gemini'
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={!!isLoading}
                  title="Reset all settings to default"
                  className={`px-4 py-3.5 rounded-2xl text-sm font-medium border flex items-center justify-center space-x-2 transition-all duration-200 ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  } active:scale-95 disabled:opacity-50`}
                >
                  <ResetIcon className="w-4 h-4" />
                  <span className="sm:hidden">Reset</span>
                </button>
              </div>
            </section>

            {/* Generated Output Card */}
            <section
              className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 border relative ${
                isDark 
                  ? 'bg-[#10121d]/85 border-white/10' 
                  : 'bg-white/90 border-black/5 shadow-xl'
              } backdrop-blur-2xl`}
              style={{
                WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                backdropFilter: 'blur(28px) saturate(190%)',
                boxShadow: isDark
                  ? '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : '0 25px 60px -15px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              {/* Output Header with Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h2 className="text-base font-semibold tracking-tight">Generated Output</h2>
                  {model && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
                    }`}>
                      {model}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Font toggle (Mono vs Sans) */}
                  <button
                    onClick={() => setIsMonoFont(!isMonoFont)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors border ${
                      isMonoFont
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : (isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900')
                    }`}
                    title="Toggle Monospace / Sans font"
                  >
                    {isMonoFont ? 'Mono' : 'Sans'}
                  </button>

                  {/* Export Markdown */}
                  <button
                    onClick={handleExportMarkdown}
                    disabled={!generatedText || !!isLoading}
                    className={`p-2 rounded-xl text-xs font-medium transition-colors border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title="Download as Markdown file"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    disabled={!generatedText || !!isLoading}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                      copied
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : (isDark
                            ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200')
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title="Copy generated output to clipboard"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  {/* Clear output */}
                  {generatedText && (
                    <button
                      onClick={() => setGeneratedText('')}
                      disabled={!!isLoading}
                      className={`p-2 rounded-xl text-xs transition-colors ${
                        isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Clear output text"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Output Content Area */}
              <div
                ref={outputRef}
                className={`w-full min-h-[280px] max-h-[500px] p-5 rounded-2xl overflow-y-auto whitespace-pre-wrap leading-relaxed text-sm transition-all duration-200 border ${
                  isMonoFont ? 'font-mono text-[13px]' : 'font-sans text-[14px]'
                } ${
                  isDark
                    ? 'bg-[#0a0c14]/90 border-white/5 text-gray-200 selection:bg-blue-600 selection:text-white'
                    : 'bg-gray-50/80 border-gray-200/60 text-gray-800 selection:bg-blue-500 selection:text-white'
                } custom-scrollbar`}
              >
                {generatedText && (
                  <div>{generatedText}</div>
                )}

                {isLoading && (
                  <div className="flex items-center space-x-2 py-2">
                    <span className="blinking-cursor inline-block w-1.5 h-4 bg-blue-500 rounded-sm" />
                    <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {isLoading}
                    </span>
                  </div>
                )}

                {error && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isDark ? 'bg-red-950/40 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <p className="font-semibold mb-1">Generation Interrupted</p>
                    <p>{error}</p>
                  </div>
                )}

                {!isLoading && !generatedText && !error && (
                  <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                    <div className={`p-3 rounded-2xl mb-3 ${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                      <SparklesIcon className="w-6 h-6" />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Output will appear here
                    </p>
                    <p className={`text-xs mt-1 max-w-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Type a prompt above or click an inspiration starter, then click &quot;Generate with Gemini&quot;.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Metrics Bar */}
              <div className="mt-4">
                <MetricsBar
                  text={generatedText}
                  isStreaming={!!isLoading}
                  elapsedMs={elapsedMs}
                  isDark={isDark}
                />
              </div>
            </section>
          </div>

          {/* Right Column: History Drawer (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <HistoryPanel
              history={history}
              onSelect={(selectedPrompt) => setPrompt(selectedPrompt)}
              onClear={handleClearHistory}
              onDeleteEntry={handleDeleteHistoryEntry}
              disabled={!!isLoading}
              isDark={isDark}
            />
          </div>
        </div>
      </main>

      {/* Global API Key Sheet Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={customApiKey}
        onSave={handleSaveApiKey}
        isDark={isDark}
      />

      {/* Dynamic Multi-Year Footer */}
      <Footer isDark={isDark} />
    </div>
  );
};

export default App;