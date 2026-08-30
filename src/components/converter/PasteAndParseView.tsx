import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code2,
  Layers,
  FileCheck
} from 'lucide-react';
import { SAMPLE_BIOLOGY_2026_TEXT } from '../../data/sampleQuestionBank';
import { ParsedPaperResult } from '../../utils/questionParser';
import { ThreeDExamIllustration } from '../common/ThreeDIllustrations';

interface PasteAndParseViewProps {
  rawCombinedText: string;
  setRawCombinedText: (val: string) => void;
  rawAnswersText: string;
  setRawAnswersText: (val: string) => void;
  parsedResult: ParsedPaperResult | null;
  onParse: () => void;
  onNavigateToReview: () => void;
  onNavigateToJson: () => void;
}

export const PasteAndParseView: React.FC<PasteAndParseViewProps> = ({
  rawCombinedText,
  setRawCombinedText,
  rawAnswersText,
  setRawAnswersText,
  parsedResult,
  onParse,
  onNavigateToReview,
  onNavigateToJson,
}) => {
  const [inputMode, setInputMode] = useState<'combined' | 'split'>('combined');

  const handleLoadSample = () => {
    setRawCombinedText(SAMPLE_BIOLOGY_2026_TEXT);
    setRawAnswersText('');
    setInputMode('combined');
    // Trigger parse
    setTimeout(() => {
      onParse();
    }, 50);
  };

  const handleClear = () => {
    setRawCombinedText('');
    setRawAnswersText('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Actions */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-indigo-100/80 shadow-md card-3d-indigo space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 p-1 bg-indigo-50 rounded-2xl border border-indigo-200 shadow-xs hidden sm:block">
              <ThreeDExamIllustration size={44} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 sm:hidden" /> 1. Paste Question Paper & Answers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste your raw Hindi/English questions, MCQs with (A)(B)(C)(D), and answer tables. The engine converts them into standard JSON.
              </p>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLoadSample}
              id="load-sample-btn"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 btn-3d-indigo cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Load 70-MCQ Sample</span>
            </button>

            {(rawCombinedText || rawAnswersText) && (
              <button
                onClick={handleClear}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 btn-3d-white cursor-pointer transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Paste Mode:</span>
          <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-bold shadow-inner">
            <button
              onClick={() => setInputMode('combined')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                inputMode === 'combined'
                  ? 'bg-white text-indigo-900 font-black shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Combined Questions & Answers (Single Box)
            </button>
            <button
              onClick={() => setInputMode('split')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                inputMode === 'split'
                  ? 'bg-white text-indigo-900 font-black shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Separate Boxes (Questions + Answers)
            </button>
          </div>
        </div>
      </div>

      {/* Main Textarea Area */}
      {inputMode === 'combined' ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md card-3d-indigo space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Paste Combined Exam Content (Questions + Answers Table)</span>
            </label>
            <div className="flex items-center gap-2">
              {rawCombinedText && (
                <button
                  onClick={() => setRawCombinedText('')}
                  className="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1 transition-all cursor-pointer"
                  title="Clear Textbox"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Text</span>
                </button>
              )}
              <span className="text-[11px] font-mono text-slate-400">
                {rawCombinedText ? `${rawCombinedText.length.toLocaleString()} characters` : 'Empty'}
              </span>
            </div>
          </div>

          <textarea
            id="combined-question-textarea"
            value={rawCombinedText}
            onChange={(e) => {
              setRawCombinedText(e.target.value);
            }}
            placeholder={`Paste raw question paper with sections and answers here...\n\nExample:\nखण्ड–अ : वस्तुनिष्ठ प्रश्न — 70 MCQ\n\n1. यदि किसी व्यक्ति का रुधिर वर्ग AB है तो उसका जीनोटाइप क्या होगा?\n(A) Iᴬi (B) Iᴮi (C) ii (D) IᴬIᴮ\n...\nFormat of answers\n| प्रश्न सं. | सही उत्तर | संक्षिप्त व्याख्या |\n| 1 | (D) IᴬIᴮ | AB रक्त समूह सह-प्रभाविता दर्शाता है |`}
            rows={14}
            className="w-full p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:outline-none leading-relaxed transition-all resize-y shadow-inner"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Supports Section A (MCQs), Section B (Short), Section C (Long) & Markdown tables</span>
            </div>

            <button
              onClick={onParse}
              disabled={!rawCombinedText.trim()}
              id="parse-btn"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 btn-3d-indigo transition-all cursor-pointer"
            >
              <span>Convert to JSON</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box 1: Questions */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md card-3d-indigo space-y-2.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              1. Questions Text (खण्ड–अ, खण्ड–ब, खण्ड–स)
            </label>
            <textarea
              value={rawCombinedText}
              onChange={(e) => setRawCombinedText(e.target.value)}
              placeholder="Paste Question 1..70 and subjective questions here..."
              rows={12}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:outline-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Box 2: Answers */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md card-3d-indigo space-y-2.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              2. Answers & Explanations (Table / Text)
            </label>
            <textarea
              value={rawAnswersText}
              onChange={(e) => setRawAnswersText(e.target.value)}
              placeholder="Paste answer table (| प्रश्न सं. | सही उत्तर | संक्षिप्त व्याख्या |) and model answers here..."
              rows={12}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:outline-none leading-relaxed shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Parsing Summary & Next Steps Card */}
      {parsedResult && parsedResult.questions.length > 0 && (
        <div className="p-5 rounded-3xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 space-y-4 shadow-lg card-3d-emerald animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm text-emerald-950">
                  Successfully Parsed {parsedResult.stats.totalQuestions} Questions!
                </h3>
                <p className="text-xs text-emerald-800">
                  {parsedResult.stats.answeredCount} of {parsedResult.stats.totalQuestions} answers & explanations matched
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-300 shadow-xs">
              Total Marks: {parsedResult.totalMarks}
            </span>
          </div>

          {/* Section Breakdown Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Section A (MCQs)</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-bold text-[11px]">
                  {parsedResult.stats.mcqCount} Qs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">1 Mark each • Options (A)(B)(C)(D)</p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Section B (Short)</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono font-bold text-[11px]">
                  {parsedResult.stats.shortCount} Qs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">2 Marks each • 2-3 line answers</p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Section C (Long)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-[11px]">
                  {parsedResult.stats.longCount} Qs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">5 Marks each • Comprehensive answers</p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={onNavigateToReview}
              className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-xs flex items-center justify-center gap-2 btn-3d-white cursor-pointer transition-all"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Review & Edit {parsedResult.stats.totalQuestions} Questions</span>
            </button>

            <button
              onClick={onNavigateToJson}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 btn-3d-emerald cursor-pointer transition-all"
            >
              <Code2 className="w-4 h-4 text-emerald-200" />
              <span>View JSON & Push to GitHub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

