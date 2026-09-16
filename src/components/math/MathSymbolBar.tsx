import React, { useState } from 'react';
import { Copy, Check, Calculator, Sparkles } from 'lucide-react';

interface MathSymbolBarProps {
  onInsertSymbol?: (symbol: string) => void;
  className?: string;
}

const MATH_SYMBOLS = [
  { char: '²', label: 'Square (²)' },
  { char: '³', label: 'Cube (³)' },
  { char: '⁴', label: 'Power 4 (⁴)' },
  { char: '√', label: 'Square Root (√)' },
  { char: '∛', label: 'Cube Root (∛)' },
  { char: 'θ', label: 'Theta (θ)' },
  { char: 'π', label: 'Pi (π)' },
  { char: 'Δ', label: 'Delta / Triangle (Δ)' },
  { char: '~', label: 'Similar (~)' },
  { char: '±', label: 'Plus Minus (±)' },
  { char: '≠', label: 'Not Equal (≠)' },
  { char: '≤', label: 'Less Than Equal (≤)' },
  { char: '≥', label: 'Greater Than Equal (≥)' },
  { char: '°', label: 'Degree (°)' },
  { char: '∠', label: 'Angle (∠)' },
  { char: '⊥', label: 'Perpendicular (⊥)' },
  { char: 'α', label: 'Alpha (α)' },
  { char: 'β', label: 'Beta (β)' },
  { char: 'λ', label: 'Lambda (λ)' },
  { char: '∞', label: 'Infinity (∞)' },
  { char: '∑', label: 'Summation (∑)' },
  { char: '∫', label: 'Integral (∫)' },
  { char: '×', label: 'Multiply (×)' },
  { char: '÷', label: 'Divide (÷)' },
  { char: '≈', label: 'Approx Equal (≈)' },
  { char: '½', label: 'Half (½)' },
];

export const MathSymbolBar: React.FC<MathSymbolBarProps> = ({ onInsertSymbol, className = '' }) => {
  const [copiedChar, setCopiedChar] = useState<string | null>(null);

  const handleSymbolClick = (char: string) => {
    if (onInsertSymbol) {
      onInsertSymbol(char);
    } else {
      navigator.clipboard.writeText(char);
    }
    setCopiedChar(char);
    setTimeout(() => setCopiedChar(null), 1200);
  };

  return (
    <div className={`p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
          <Calculator className="w-3.5 h-3.5 text-amber-700" />
          <span>गणित प्रतीक पैलेट (Math Symbols Bar)</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800">
            1-Click Insert
          </span>
        </div>
        {copiedChar && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
            <Check className="w-3 h-3" /> Copied: {copiedChar}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {MATH_SYMBOLS.map((s) => (
          <button
            key={s.char}
            type="button"
            onClick={() => handleSymbolClick(s.char)}
            title={s.label}
            className="w-8 h-8 rounded-xl bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-amber-200 shadow-xs flex items-center justify-center font-bold text-sm transition-all hover:scale-110 active:scale-95 cursor-pointer font-mono"
          >
            {s.char}
          </button>
        ))}
      </div>
    </div>
  );
};
