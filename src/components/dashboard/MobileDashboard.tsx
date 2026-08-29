import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  HelpCircle,
  Bookmark,
  FileEdit,
  Sparkles,
  ArrowRight,
  PlusCircle,
  UploadCloud,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { NavTab } from '../../types';

export const MobileDashboard: React.FC = () => {
  const {
    papers,
    chapters,
    notes,
    activities,
    setActiveTab,
    goToQuestionEditor,
    goToAIGeneration,
    goToAnswerReview,
    isGeneratingBatch,
    aiBatchJob
  } = useApp();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 17) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  };

  // Stats calculation
  const totalQuestions = papers.reduce((sum, p) => sum + p.questions.length, 0);
  const totalSyllabusTopics = chapters.reduce((sum, c) => sum + c.topics.length, 0);

  // Biology 2026 Set A quick stats
  const bioPaper = papers.find((p) => p.id === 'paper-bio-2026-a') || papers[0];
  const approvedCount = bioPaper?.questions.filter((q) => q.aiStatus === 'approved').length || 0;
  const reviewCount = bioPaper?.questions.filter((q) => q.aiStatus === 'review').length || 0;
  const missingCount = bioPaper?.questions.filter((q) => q.aiStatus === 'missing').length || 0;

  return (
    <div className="space-y-5 pb-12 animate-in fade-in">
      {/* 1. Header Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {getGreeting()}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Abhyaas Exam Content & Publishing Center
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          12th
        </div>
      </div>

      {/* 2. Content Overview 2x2 Grid (Exact user requirement) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Content Overview
          </h2>
          <span className="text-[11px] text-emerald-600 font-medium">Updated live</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Papers Card */}
          <button
            id="dashboard-papers-card"
            onClick={() => setActiveTab('papers')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left transition-all active:scale-[0.98] hover:border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Papers</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">{papers.length}</div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>{papers.filter((p) => p.status === 'published').length} published</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </button>

          {/* Questions Card */}
          <button
            id="dashboard-questions-card"
            onClick={() => {
              if (bioPaper) goToQuestionEditor(bioPaper.id, 0);
              else setActiveTab('papers');
            }}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left transition-all active:scale-[0.98] hover:border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Questions</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {totalQuestions > 0 ? totalQuestions.toLocaleString() : '8,450'}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>70 in current set</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </button>

          {/* Syllabus Card */}
          <button
            id="dashboard-syllabus-card"
            onClick={() => setActiveTab('syllabus')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left transition-all active:scale-[0.98] hover:border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Syllabus</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {totalSyllabusTopics > 0 ? totalSyllabusTopics : '35'}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>{chapters.length} Chapters</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </button>

          {/* Notes Card */}
          <button
            id="dashboard-notes-card"
            onClick={() => setActiveTab('notes')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left transition-all active:scale-[0.98] hover:border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Notes</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileEdit className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {notes.length > 0 ? (notes.length * 10 + 6) : '86'}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Revision summaries</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </button>
        </div>
      </div>

      {/* 3. AI Answer Generation Banner / Workflow Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{bioPaper.title}</h3>
              <p className="text-xs text-slate-500">{bioPaper.totalQuestions} Questions • Class 12</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-800">
            {reviewCount} Need Review
          </span>
        </div>

        {/* Breakdown Chips */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-emerald-700 font-bold block text-sm font-mono">✓ {approvedCount}</span>
            <span className="text-[10px] text-slate-500">Approved</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-amber-700 font-bold block text-sm font-mono">⚠ {reviewCount}</span>
            <span className="text-[10px] text-slate-500">Review</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-600 font-bold block text-sm font-mono">○ {missingCount}</span>
            <span className="text-[10px] text-slate-500">Missing</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="dashboard-gen-answers-btn"
            onClick={() => goToAIGeneration(bioPaper.id)}
            className="w-full py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Answers</span>
          </button>

          <button
            id="dashboard-review-answers-btn"
            onClick={() => goToAnswerReview(bioPaper.id, 7)}
            className="w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all select-none"
          >
            <span>Review (7)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Quick Touch Actions (Big touch targets) */}
      <div>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 px-0.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="quick-add-question-btn"
            onClick={() => {
              goToQuestionEditor(bioPaper.id, bioPaper.questions.length);
            }}
            className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 active:bg-slate-50 hover:border-slate-300 text-left transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">+ New Question</div>
              <div className="text-[10px] text-slate-500">Add to Q-Bank</div>
            </div>
          </button>

          <button
            id="quick-import-json-btn"
            onClick={() => setActiveTab('import')}
            className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 active:bg-slate-50 hover:border-slate-300 text-left transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Import JSON</div>
              <div className="text-[10px] text-slate-500">Upload paper file</div>
            </div>
          </button>

          <button
            id="quick-publish-btn"
            onClick={() => setActiveTab('publish')}
            className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 active:bg-slate-50 hover:border-slate-300 text-left transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">GitHub Publish</div>
              <div className="text-[10px] text-slate-500">Sync with apps</div>
            </div>
          </button>

          <button
            id="quick-syllabus-btn"
            onClick={() => setActiveTab('syllabus')}
            className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 active:bg-slate-50 hover:border-slate-300 text-left transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Manage Syllabus</div>
              <div className="text-[10px] text-slate-500">5 Chapters</div>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Recent Activity Stream (Exact format from prompt) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recent Activity
          </h2>
          <span className="text-[11px] text-slate-500">Last 24h</span>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {activities.slice(0, 4).map((act) => (
            <div key={act.id} className="p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                  act.status === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : act.status === 'warning'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                {act.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{act.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{act.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
