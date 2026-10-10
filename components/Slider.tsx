import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled: boolean;
  isDark: boolean;
  hint?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
  isDark,
  hint
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </label>
        <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-lg border ${
          isDark 
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
            : 'bg-blue-50 text-blue-600 border-blue-200'
        }`}>
          {value.toFixed(2)}
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="apple-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed transition-all duration-150 outline-none"
          style={{
            background: isDark
              ? `linear-gradient(to right, #3b82f6 0%, #6366f1 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`
              : `linear-gradient(to right, #0071e3 0%, #4338ca ${percentage}%, rgba(0,0,0,0.08) ${percentage}%, rgba(0,0,0,0.08) 100%)`
          }}
        />
      </div>

      {hint && (
        <p className={`text-[11px] leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};
