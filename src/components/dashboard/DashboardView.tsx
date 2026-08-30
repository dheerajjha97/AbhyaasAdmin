import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  BookmarkCheck,
  Zap,
  Github,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ListOrdered,
  FolderGit2,
  Settings,
  Layers,
  GraduationCap,
  Atom,
  TrendingUp,
  Landmark,
  Languages,
  Code2,
  FileCheck,
  UploadCloud,
  Clock,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { ALL_SUBJECTS, getSubjectsGroupedByStream } from '../../data/subjects';

interface DashboardViewProps {
  onSelectEngine: (engine: 'questions' | 'syllabus' | 'notes') => void;
  onOpenSettings: () => void;
  savedBanksCount: number;
  savedSyllabiCount: number;
  githubToken: string;
  repoOwner: string;
  repoName: string;
  onAutoRouteText: (text: string) => void;
  activeSubjectId: string;
  setActiveSubjectId: (subId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectEngine,
  onOpenSettings,
  savedBanksCount,
  savedSyllabiCount,
  githubToken,
  repoOwner,
  repoName,
  onAutoRouteText,
  activeSubjectId,
  setActiveSubjectId,
}) => {
  const [scratchpadText, setScratchpadText] = useState('');
  const [selectedStreamTab, setSelectedStreamTab] = useState<'all' | 'science' | 'commerce' | 'arts' | 'language'>('all');

  const grouped = getSubjectsGroupedByStream();

  const handleScratchpadSubmit = () => {
    if (!scratchpadText.trim()) return;
    onAutoRouteText(scratchpadText);
  };

  const filteredSubjects = ALL_SUBJECTS.filter(
    (s) => selectedStreamTab === 'all' || s.stream === selectedStreamTab
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Hero Glass Banner */}
      <div className="glass-panel-dark p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Class 9–12 State & CBSE Board Pipeline</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Academic Content Engine & Overview Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-2xl">
            Convert exam question banks, structure unit/chapter curriculum syllabi, and generate markdown revision notes with instant GitHub JSON synchronization.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
              <span>30+ Subjects</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>Bilingual (Hindi/English)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-amber-300" />
              <span>{repoOwner}/{repoName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Analytics & Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Q&A Papers */}
        <div
          onClick={() => onSelectEngine('questions')}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-indigo-300"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Q&A Engine
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{savedBanksCount}</div>
            <div className="text-xs font-bold text-slate-600">Question Banks</div>
          </div>
          <p className="text-[11px] text-slate-500">70-MCQ + Short/Long format with solutions</p>
        </div>

        {/* Metric 2: Curriculum Syllabi */}
        <div
          onClick={() => onSelectEngine('syllabus')}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Syllabus
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{savedSyllabiCount}</div>
            <div className="text-xs font-bold text-slate-600">Syllabi Parsed</div>
          </div>
          <p className="text-[11px] text-slate-500">Structured Unit, Chapter & Topic tree</p>
        </div>

        {/* Metric 3: Revision Notes */}
        <div
          onClick={() => onSelectEngine('notes')}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Revision Notes
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">30+</div>
            <div className="text-xs font-bold text-slate-600">Notes Templates</div>
          </div>
          <p className="text-[11px] text-slate-500">Sectional formulas, diagrams & key terms</p>
        </div>

        {/* Metric 4: GitHub Cloud Sync */}
        <div
          onClick={onOpenSettings}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-slate-400"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Github className="w-5 h-5" />
            </div>
            {githubToken ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Set Token
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-900 truncate">{repoOwner}/{repoName}</div>
            <div className="text-xs font-bold text-slate-600">GitHub Repository</div>
          </div>
          <p className="text-[11px] text-slate-500">Direct commit & raw JSON synchronization</p>
        </div>

      </div>

      {/* 3. Core Action Engines Hub (3 Primary Tool Cards) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Launch Academic Tool Engine</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Question Bank Converter */}
          <div className="glass-panel p-5 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                1. Exam Q&A Bank Converter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste question papers or model sets. Extracts 70 MCQs, Short & Long questions with bilingual solutions automatically.
              </p>
            </div>

            <button
              onClick={() => onSelectEngine('questions')}
              className="w-full py-2.5 rounded-xl glass-btn-indigo text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Q&A Converter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Syllabus & Curriculum Builder */}
          <div className="glass-panel p-5 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                2. Curriculum & Syllabus Builder
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convert raw syllabus outlines into structured Unit, Chapter, and Marks trees. Generates schema-ready JSONs.
              </p>
            </div>

            <button
              onClick={() => onSelectEngine('syllabus')}
              className="w-full py-2.5 rounded-xl glass-btn-emerald text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Syllabus Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Quick Revision Notes Engine */}
          <div className="glass-panel p-5 space-y-4 hover:border-amber-300 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                3. Quick Revision Notes Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parse textbook chapters and class notes into structured Markdown notes with key definitions, formulas, and diagrams.
              </p>
            </div>

            <button
              onClick={() => onSelectEngine('notes')}
              className="w-full py-2.5 rounded-xl glass-btn-amber text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Notes Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Smart Auto-Detect Import Scratchpad */}
      <div className="glass-panel-dark p-5 space-y-3 border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Universal Smart Auto-Router & Parser
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {scratchpadText && (
              <button
                onClick={() => setScratchpadText('')}
                className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Text Clear Karein / Clear Textbox"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear / साफ़ करें</span>
              </button>
            )}
            <span className="text-[10px] text-slate-400 hidden sm:inline">Auto-detects Syllabus, Q&A or Notes</span>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Paste any raw text below (syllabus outline, question bank, or chapter notes). Our intelligent router will detect the structure and redirect to the appropriate parser!
        </p>

        <div className="relative">
          <textarea
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder={`Paste anything here...

Example 1 (Syllabus):
UNIT 1: ELECTROSTATICS [8 Marks]
Chapter 1: Electric Charges and Fields

Example 2 (Question Bank):
1. Which organelle is called the powerhouse of the cell?
(A) Nucleus  (B) Mitochondria  (C) Ribosome
Answer: (B) Mitochondria`}
            className="w-full h-36 p-3.5 pr-10 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
          {scratchpadText && (
            <button
              onClick={() => setScratchpadText('')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Clear Textbox"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">
              {scratchpadText ? `${scratchpadText.split('\n').length} lines pasted (${scratchpadText.length} chars)` : 'Ready for text drop'}
            </span>
            {scratchpadText && (
              <button
                onClick={() => setScratchpadText('')}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Textbox</span>
              </button>
            )}
          </div>

          <button
            onClick={handleScratchpadSubmit}
            disabled={!scratchpadText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto-Detect & Process Text</span>
          </button>
        </div>
      </div>

      {/* 5. Stream & Subjects Explorer Grid */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Supported Stream & Subject Directory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any subject to launch with preset parameters
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All (30+)' },
              { id: 'science', label: '🧪 Science' },
              { id: 'commerce', label: '📊 Commerce' },
              { id: 'arts', label: '🏛️ Arts' },
              { id: 'language', label: '📖 Languages' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStreamTab(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  selectedStreamTab === tab.id
                    ? 'bg-indigo-600 text-white font-black shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filteredSubjects.map((sub) => {
            const isSelected = sub.id === activeSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubjectId(sub.id);
                  onSelectEngine('questions');
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-black shadow-sm'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-800 font-bold hover:border-indigo-200'
                }`}
              >
                <div className="space-y-0.5 truncate">
                  <div className="text-xs truncate">{sub.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">{sub.code} • {sub.categoryLabel}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
