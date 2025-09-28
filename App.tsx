import React, { useState, useRef, useCallback, useEffect } from 'react';
import { streamGenerateText } from './services/geminiService';
import { Slider } from './components/Slider';
import { IconButton } from './components/IconButton';
import { ModelSelector } from './components/ModelSelector';
import { HistoryPanel } from './components/HistoryPanel';
import { CopyIcon, ResetIcon, SparklesIcon } from './components/icons';

interface HistoryEntry {
  id: string;
  prompt: string;
  generatedText: string;
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<string | false>(false);
  const [error, setError] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [model, setModel] = useState<string>('gemini-2.5-flash');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const outputRef = useRef<HTMLDivElement>(null);
  
  const availableModels = ['gemini-2.5-flash'];

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('gemini-text-gen-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gemini-text-gen-history', JSON.stringify(history));
    } catch (error)
    {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setError(null);
    setGeneratedText('');
    setIsLoading('Connecting to model...');
    let fullResponse = '';

    try {
      const stream = streamGenerateText(prompt, temperature, topP, model);
      let firstChunk = true;
      for await (const chunk of stream) {
        if (firstChunk) {
            setIsLoading('Generating response...');
            firstChunk = false;
        }
        const textChunk = chunk;
        setGeneratedText((prev) => prev + textChunk);
        fullResponse += textChunk;
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }
      if (fullResponse.trim()) {
        setHistory(prevHistory => [
          { id: new Date().toISOString(), prompt, generatedText: fullResponse },
          ...prevHistory
        ].slice(0, 50)); // Keep history to 50 items
      }
    } catch (e) {
      setError(e instanceof Error ? `Error: ${e.message}` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, temperature, topP, model]);

  const handleReset = () => {
    setPrompt('');
    setGeneratedText('');
    setError(null);
    setIsLoading(false);
    setTemperature(0.7);
    setTopP(0.9);
    setModel('gemini-2.5-flash');
  };
  
  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
    }
  };
  
  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };
  
  const handleSelectHistory = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };

  const examplePrompts = [
    "Write a short story about a robot who discovers music.",
    "Explain the concept of black holes to a five-year-old.",
    "Generate a recipe for a futuristic space-themed dessert."
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Panel */}
        <div className="w-full lg:flex-grow bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-700">
          <header className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">my-gemma-model-xyz</h1>
            <p className="text-gray-400 mt-2">A Hugging Face Space powered by Gemini</p>
          </header>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">Your Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-28 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200 resize-none"
              disabled={!!isLoading}
            />
            <div className="text-xs text-gray-500 mt-2">
                Generate a short story, poem, or continuation.
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                  <p className="text-sm font-medium text-gray-400 mb-1">Examples</p>
                  <div className="flex flex-wrap gap-2">
                      {examplePrompts.map((p, i) => (
                          <button key={i} onClick={() => handleExampleClick(p)} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition duration-200 disabled:opacity-50" disabled={!!isLoading}>
                              {p.substring(0,25)}...
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          <div>
              <ModelSelector
                  label="Model"
                  value={model}
                  onChange={setModel}
                  options={availableModels}
                  disabled={!!isLoading}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Slider label="Temperature" value={temperature} min={0.0} max={1.0} step={0.01} onChange={setTemperature} disabled={!!isLoading} />
                  <Slider label="Top P" value={topP} min={0.0} max={1.0} step={0.01} onChange={setTopP} disabled={!!isLoading} />
              </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || !!isLoading}
              className="w-full sm:w-auto flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
            <IconButton onClick={handleReset} disabled={!!isLoading} tooltip="Reset Fields">
              <ResetIcon className="w-5 h-5" />
            </IconButton>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 relative">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-gray-400">Generated Output</h2>
              <IconButton onClick={handleCopy} disabled={!generatedText || !!isLoading} tooltip="Copy to Clipboard">
                  <CopyIcon className="w-5 h-5" />
              </IconButton>
            </div>
            <div
              ref={outputRef}
              className="w-full h-64 bg-gray-900 p-3 rounded-md overflow-y-auto whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed"
            >
              {generatedText}
              {isLoading === 'Generating response...' && (
                <span className="blinking-cursor inline-block w-0.5 h-4 bg-indigo-400 ml-1" style={{ verticalAlign: 'bottom' }} />
              )}
              {isLoading === 'Connecting to model...' && (
                <span className="text-gray-500 animate-pulse">{isLoading}</span>
              )}
              {error && <p className="text-red-400">{error}</p>}
              {!isLoading && !generatedText && !error && (
                <p className="text-gray-500">Output will appear here...</p>
              )}
            </div>
          </div>
        </div>
        {/* History Panel */}
        <div className="w-full lg:w-96 lg:flex-shrink-0">
            <HistoryPanel
                history={history}
                onSelect={handleSelectHistory}
                onClear={handleClearHistory}
                disabled={!!isLoading}
            />
        </div>
      </div>
    </div>
  );
};

export default App;