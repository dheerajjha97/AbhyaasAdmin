import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionPaper, QuestionStatus } from '../../types';
import { X, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Filter } from 'lucide-react';

interface QuestionPaletteModalProps {
  paper: QuestionPaper;
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export const QuestionPaletteModal: React.FC<QuestionPaletteModalProps> = ({
  paper,
  currentIndex,
  onSelect,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | QuestionStatus>('all');

  const filteredQuestions = paper.questions.filter((q) => {
    if (filter === 'all') return true;
    return q.aiStatus === filter;
  });

  const getStatusColor = (status: QuestionStatus, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-slate-900 text-white font-black ring-4 ring-slate-900/20 shadow-md scale-105';
    }
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100';
      case 'generated':
        return 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100';
      case 'review':
        return 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100';
      case 'missing':
      default:
        return 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200';
    }
  };

  const counts = {
    approved: paper.questions.filter((q) => q.aiStatus === 'approved').length,
    generated: paper.questions.filter((q) => q.aiStatus === 'generated').length,
    review: paper.questions.filter((q) => q.aiStatus === 'review').length,
    missing: paper.questions.filter((q) => q.aiStatus === 'missing').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Question Palette</h3>
            <p className="text-xs text-slate-500">
              {paper.title} • {paper.questions.length} Questions
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Legend & Filter Chips */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-slate-700" /> Filter by Status
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <button
              onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                filter === 'approved'
                  ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                  : 'bg-white border-emerald-200 text-emerald-700'
              }`}
            >
              <span className="font-mono text-sm font-bold">✓ {counts.approved}</span>
              <span className="text-[10px]">Approved</span>
            </button>

            <button
              onClick={() => setFilter(filter === 'generated' ? 'all' : 'generated')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                filter === 'generated'
                  ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-sm'
                  : 'bg-white border-indigo-200 text-indigo-700'
              }`}
            >
              <span className="font-mono text-sm font-bold">● {counts.generated}</span>
              <span className="text-[10px]">Generated</span>
            </button>

            <button
              onClick={() => setFilter(filter === 'review' ? 'all' : 'review')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                filter === 'review'
                  ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-sm'
                  : 'bg-white border-amber-200 text-amber-700'
              }`}
            >
              <span className="font-mono text-sm font-bold">⚠ {counts.review}</span>
              <span className="text-[10px]">Review</span>
            </button>

            <button
              onClick={() => setFilter(filter === 'missing' ? 'all' : 'missing')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                filter === 'missing'
                  ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className="font-mono text-sm font-bold">○ {counts.missing}</span>
              <span className="text-[10px]">Missing</span>
            </button>
          </div>
        </div>

        {/* 5-Column Question Grid as explicitly shown in prompt: [1][2][3][4][5] */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
            {paper.questions.map((q, idx) => {
              const isSelected = idx === currentIndex;
              const matchesFilter = filter === 'all' || q.aiStatus === filter;

              if (!matchesFilter) return null;

              return (
                <button
                  key={q.id}
                  id={`palette-q-${q.questionNumber}`}
                  onClick={() => {
                    onSelect(idx);
                    onClose();
                  }}
                  className={`h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-sm transition-all active:scale-95 shadow-xs ${getStatusColor(
                    q.aiStatus,
                    isSelected
                  )}`}
                >
                  <span>{q.questionNumber}</span>
                  <span className="text-[9px] font-sans font-normal opacity-80 uppercase">
                    {q.type === 'mcq' ? 'MCQ' : q.type.slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No questions found with status <span className="font-bold text-slate-800 capitalize">{filter}</span>.
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tap any number to jump instantly</span>
          <button
            onClick={() => setFilter('all')}
            className="text-slate-900 hover:underline font-semibold"
          >
            Show All ({paper.questions.length})
          </button>
        </div>
      </div>
    </div>
  );
};
