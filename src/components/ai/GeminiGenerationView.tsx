import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Pause,
  Layers,
  ChevronRight,
  BookOpen,
  Terminal
} from 'lucide-react';

export const GeminiGenerationView: React.FC = () => {
  const {
    papers,
    selectedPaperId,
    setSelectedPaperId,
    startAIGeneration,
    cancelAIGeneration,
    isGeneratingBatch,
    aiBatchJob,
    goToAnswerReview,
    goToQuestionEditor,
    hasGeminiKey
  } = useApp();

  const currentPaper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  const approvedCount = currentPaper?.questions.filter((q) => q.aiStatus === 'approved').length || 0;
  const reviewCount = currentPaper?.questions.filter((q) => q.aiStatus === 'review').length || 0;
  const missingCount = currentPaper?.questions.filter((q) => q.aiStatus === 'missing').length || 0;
  const generatedCount = currentPaper?.questions.filter((q) => q.aiStatus === 'generated').length || 0;

  const total = currentPaper?.questions.length || 0;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Paper Selector Dropdown / Pill */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> AI Answer Generator
          </h1>
          <p className="text-xs text-slate-500">Powered by Gemini 3.7 Flash</p>
        </div>

        <select
          value={selectedPaperId}
          onChange={(e) => setSelectedPaperId(e.target.value)}
          className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
        >
          {papers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.questions.length} Qs)
            </option>
          ))}
        </select>
      </div>

      {/* 2. Paper Summary Header (Biology 2026 Set A - 70 Questions) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{currentPaper.title}</h2>
            <span className="text-xs font-medium text-slate-500 font-mono">
              {total} Questions Total
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Ready</span>
          </div>
        </div>

        {/* 3. Answer Status Breakdown Card (Exact user requirement #6) */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 px-1">
            Answer Status Breakdown
          </span>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-emerald-700 font-mono">✓ {approvedCount}</span>
              <span className="text-xs font-bold text-emerald-800 mt-0.5">Approved</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-amber-700 font-mono">⚠ {reviewCount}</span>
              <span className="text-xs font-bold text-amber-800 mt-0.5">Need Review</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-slate-700 font-mono">○ {missingCount}</span>
              <span className="text-xs font-bold text-slate-600 mt-0.5">Not Generated</span>
            </div>
          </div>
        </div>

        {/* 4. Generation in Progress UI (Exact prompt requirement) */}
        {isGeneratingBatch && aiBatchJob ? (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                Generating Answers...
              </span>
              <span className="text-xs font-bold text-indigo-950 font-mono">
                Batch {aiBatchJob.currentBatch} of {aiBatchJob.totalBatches}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>
                Processing Questions: <strong className="text-slate-900 font-mono">{aiBatchJob.startQ} – {aiBatchJob.endQ}</strong>
              </span>
              <span className="font-mono font-black text-indigo-700 text-sm">{aiBatchJob.progress}%</span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-300 shadow-sm"
                style={{ width: `${aiBatchJob.progress}%` }}
              />
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Please don't close this page. (Backend saves state continuously)</span>
              <button
                onClick={cancelAIGeneration}
                className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg hover:bg-rose-100"
              >
                Pause
              </button>
            </div>
          </div>
        ) : (
          /* Normal Action Buttons */
          <div className="space-y-2.5 pt-1">
            <button
              id="ai-generate-missing-btn"
              onClick={() => startAIGeneration(currentPaper.id)}
              disabled={missingCount === 0 && reviewCount === 0}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all select-none"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Generate Missing Answers ({missingCount + reviewCount})</span>
            </button>

            <button
              id="ai-review-answers-btn"
              onClick={() => goToAnswerReview(currentPaper.id, 7)}
              className="w-full h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all select-none"
            >
              <span>Review Answers ({reviewCount + generatedCount})</span>
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        )}
      </div>

      {/* 5. Live Processing Logs Stream */}
      {aiBatchJob && aiBatchJob.log.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Generation Log</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-300">
            {aiBatchJob.log.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 shrink-0">›</span>
                <span>{entry}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Quick Jump to Questions needing Review */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Questions Flagged For Review
          </h3>
          <span className="text-[11px] text-amber-700 font-medium">{reviewCount} Pending</span>
        </div>

        <div className="space-y-2">
          {currentPaper.questions
            .filter((q) => q.aiStatus === 'review')
            .slice(0, 4)
            .map((q) => (
              <div
                key={q.id}
                onClick={() => goToAnswerReview(currentPaper.id, q.questionNumber - 1)}
                className="p-3 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition-all shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    Q{q.questionNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{q.text}</p>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      ⚠ Needs verification • {q.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
