import React, { useRef } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Sigma,
  Download,
  BookOpen
} from 'lucide-react';
import { ParsedPaperResult } from '../../utils/questionParser';
import { MathSymbolBar } from './MathSymbolBar';
import { SAMPLE_CLASS10_MATHS_2026_PAPER } from '../../utils/mathQuestionParser';

interface MathPasteAndParseViewProps {
  rawMathText: string;
  setRawMathText: (val: string) => void;
  parsedResult: ParsedPaperResult | null;
  onParse: () => void;
  onNavigateToReview: () => void;
  onNavigateToJson: () => void;
}

export const MathPasteAndParseView: React.FC<MathPasteAndParseViewProps> = ({
  rawMathText,
  setRawMathText,
  parsedResult,
  onParse,
  onNavigateToReview,
  onNavigateToJson,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertSymbol = (symbol: string) => {
    if (!textareaRef.current) {
      setRawMathText(rawMathText + symbol);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newText = rawMathText.substring(0, start) + symbol + rawMathText.substring(end);
    setRawMathText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + symbol.length, start + symbol.length);
      }
    }, 10);
  };

  const handleLoadSamplePaper = () => {
    setRawMathText(SAMPLE_CLASS10_MATHS_2026_PAPER.trim());
  };

  const handleClear = () => {
    setRawMathText('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Sample Paper Loader & Actions */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/80 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-xs shrink-0">
              <Sigma className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                1. गणित प्रश्न पत्र पेस्ट करें (Paste Mathematics Exam Paper)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste raw questions for Section A (100 MCQs), Section B (30 Short Qs), and Section C (8 Long Qs) with step-by-step proofs.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleLoadSamplePaper}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>1-Click लोड करें (Class 10 Math 138 Qs Paper)</span>
            </button>

            {rawMathText && (
              <button
                onClick={handleClear}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Math Symbol Palette Bar */}
        <MathSymbolBar onInsertSymbol={handleInsertSymbol} />
      </div>

      {/* Main Textarea Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>गणित प्रश्न पत्र सामग्री (Mathematics Paper Text)</span>
          </label>
          <span className="text-[11px] font-mono font-bold text-slate-400">
            {rawMathText ? `${rawMathText.split('\n').length} पंक्तियाँ (lines)` : '0 lines'}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={rawMathText}
          onChange={(e) => setRawMathText(e.target.value)}
          placeholder="यहाँ गणित का प्रश्न पत्र पेस्ट करें... 

उदाहरण:
==================================================
खण्ड-अ / SECTION-A (वस्तुनिष्ठ प्रश्न)
==================================================
1. निम्नलिखित में किस प्रकार के सभी त्रिभुज समरूप होते हैं ? (A) विषमबाहु (B) समद्विबाहु (C) समबाहु (D) कोई नहीं
सही उत्तर: (C) समबाहु त्रिभुज
व्याख्या: सभी समबाहु त्रिभुज समरूप होते हैं।

==================================================
खण्ड-ब / SECTION-B (लघु उत्तरीय प्रश्न)
==================================================
1. किसी समकोण त्रिभुज की परिमिति 40 सेमी है...
उत्तर: मान लेते हैं दो भुजाएँ x तथा y हैं..."
          rows={16}
          className="w-full p-4 text-xs sm:text-sm font-mono leading-relaxed bg-slate-50/70 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:outline-hidden resize-y transition-all"
        />

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            {parsedResult && parsedResult.stats.totalQuestions > 0 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  सफलतापूर्वक पार्स: <strong>{parsedResult.stats.totalQuestions} प्रश्न</strong> (वस्तुनिष्ठ: {parsedResult.stats.mcqCount}, लघु: {parsedResult.stats.shortCount}, दीर्घ: {parsedResult.stats.longCount})
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                पेस्ट करने के बाद नीचे <strong>'Parse Mathematics Paper'</strong> पर क्लिक करें।
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onParse}
              disabled={!rawMathText.trim()}
              className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                rawMathText.trim()
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Parse Mathematics Paper</span>
            </button>

            {parsedResult && parsedResult.stats.totalQuestions > 0 && (
              <button
                onClick={onNavigateToReview}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Review 138 Questions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Maths Format Guidance Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/50 border border-amber-200/60 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>गणित प्रश्न पत्र पार्सिंग मार्गदर्शिका (Maths Format Guide)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-3 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-1">
            <strong className="text-amber-900 font-bold block">खण्ड-अ (MCQs):</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              प्रश्न के बाद (A), (B), (C), (D) एक ही लाइन में या अलग-अलग लाइन में हो सकते हैं।
              नीचे <code>सही उत्तर: (C) ...</code> और <code>व्याख्या: ...</code> स्वतः कैप्चर हो जाती है।
            </p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-1">
            <strong className="text-amber-900 font-bold block">खण्ड-ब (2 अंक लघु उत्तरीय):</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              1 से 30 तक के प्रश्न। <code>उत्तर:</code> के बाद चरणबद्ध हल (steps), सूत्र (formulas), और मान सुरक्षित रहते हैं। प्रश्न 6, 7, 8 अलग-अलग रहते हैं।
            </p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-1">
            <strong className="text-amber-900 font-bold block">खण्ड-स (5 अंक दीर्घ उत्तरीय):</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              31 से 38 तक के प्रश्न। <code>(I) प्रथम समीकरण</code>, <code>(II) द्वितीय समीकरण</code>, <code>(III) निष्कर्ष</code> जैसे उप-चरण (sub-steps) हल में सुरक्षित रहते हैं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
