import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Atom,
  FlaskConical,
  Flame,
  Trash2
} from 'lucide-react';
import {
  SAMPLE_BIOLOGY_NOTES_TEXT,
  SAMPLE_PHYSICS_NOTES_TEXT
} from '../../utils/notesParser';

interface PasteAndParseNotesViewProps {
  rawNotesText: string;
  setRawNotesText: (val: string) => void;
  onParse: () => void;
  isParsing: boolean;
  totalSectionsParsed: number;
}

export const PasteAndParseNotesView: React.FC<PasteAndParseNotesViewProps> = ({
  rawNotesText,
  setRawNotesText,
  onParse,
  isParsing,
  totalSectionsParsed,
}) => {
  const [showGuide, setShowGuide] = useState(false);

  const wordCount = rawNotesText.trim() ? rawNotesText.trim().split(/\s+/).length : 0;
  const lineCount = rawNotesText ? rawNotesText.split('\n').length : 0;

  const handleLoadSample = (type: 'biology' | 'physics') => {
    if (type === 'biology') {
      setRawNotesText(SAMPLE_BIOLOGY_NOTES_TEXT.trim());
    } else {
      setRawNotesText(SAMPLE_PHYSICS_NOTES_TEXT.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Action and Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Load Presets:</span>
          <button
            onClick={() => handleLoadSample('biology')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all shadow-sm active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Class 12 Biology (Human Reproduction)
          </button>
          <button
            onClick={() => handleLoadSample('physics')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-200/80 transition-all shadow-sm active:scale-95"
          >
            <Atom className="w-3.5 h-3.5 text-indigo-600" />
            Class 12 Physics (Electrostatics & Formulas)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            {showGuide ? 'Hide Format Guide' : 'Notes Format Guide'}
          </button>

          {rawNotesText && (
            <button
              onClick={() => setRawNotesText('')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Guide Drawer */}
      {showGuide && (
        <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 rounded-2xl border border-amber-200 p-4 space-y-3 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Smart Markdown & Notes Structure Guidelines</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
              <span className="font-bold text-amber-900">1. Chapter Title & Metadata</span>
              <p className="text-slate-600">
                Start with <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono"># Chapter X: Title (हिंदी नाम)</code> and tags <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">**Tags:** #Bio #Reproduction</code>.
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
              <span className="font-bold text-amber-900">2. Key Takeaways & Formulas</span>
              <p className="text-slate-600">
                Use <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">### Key Takeaways</code> with bullet points, and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">[Formula: Title]</code> for equations.
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
              <span className="font-bold text-amber-900">3. Section Breaks & Questions</span>
              <p className="text-slate-600">
                Use <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">### Section 1: Concept Name</code> with sub-bullets, and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">### Section X: Board Questions</code> for high-yield tips.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Textarea Container */}
      <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition-all">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Raw Notes Markdown / Text Area</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            {rawNotesText && (
              <button
                onClick={() => setRawNotesText('')}
                className="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-sans font-bold text-[11px] border border-rose-200 flex items-center gap-1 transition-all cursor-pointer"
                title="Clear Textbox / टेक्स्ट साफ़ करें"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Text</span>
              </button>
            )}
            <span>Lines: <strong className="text-slate-800">{lineCount}</strong></span>
            <span>Words: <strong className="text-slate-800">{wordCount}</strong></span>
            {totalSectionsParsed > 0 && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Parsed: {totalSectionsParsed} sections
              </span>
            )}
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={rawNotesText}
          onChange={(e) => setRawNotesText(e.target.value)}
          placeholder={`Paste your Chapter Notes or Markdown summary here...\n\nExample:\n# Chapter 1: Reproduction in Organisms (जीवों में जनन)\n**Tags:** #Biology #Class12 #BoardNotes\n\n### Summary & Core Overview\nAsexual and sexual reproduction modes...\n\n### Key Takeaways\n- Gametogenesis produces haploid gametes.\n- Syngamy leads to diploid zygote formation.\n\n### Key Formulas & Scientific Ratios\n[Formula: Ploidy Relations]\nGamete (n) + Gamete (n) -> Zygote (2n)\n\n### Section 1: Asexual Reproduction\n- Fission: Amoeba (Binary), Plasmodium (Multiple)\n- Budding: Yeast, Hydra\n\n### Section 2: High Yield Board Questions\n- Q1: Differentiate between Menstrual and Oestrus cycle.`}
          rows={18}
          className="w-full p-4 text-sm font-mono leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none resize-y bg-transparent"
        />

        {/* Floating Action Button inside / bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Supports standard Markdown, LaTeX math equations, bullet points, and Hindi Devanagari text</span>
          </div>

          <button
            onClick={onParse}
            disabled={!rawNotesText.trim() || isParsing}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 ${
              !rawNotesText.trim() || isParsing
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                : 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 shadow-amber-500/20'
            }`}
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Structuring Notes & Equations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Parse & Structure Notes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
