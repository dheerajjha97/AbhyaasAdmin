import React from 'react';
import {
  X,
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  Zap,
  Github,
  Settings,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ALL_SUBJECTS, getSubjectsGroupedByStream } from '../../data/subjects';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeEngine: 'dashboard' | 'questions' | 'syllabus' | 'notes';
  setActiveEngine: (engine: 'dashboard' | 'questions' | 'syllabus' | 'notes') => void;
  onOpenSettings: () => void;
  githubToken: string;
  repoOwner: string;
  repoName: string;
  savedBanksCount: number;
  savedSyllabiCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeEngine,
  setActiveEngine,
  onOpenSettings,
  githubToken,
  repoOwner,
  repoName,
  savedBanksCount,
  savedSyllabiCount,
}) => {
  if (!isOpen) return null;

  const grouped = getSubjectsGroupedByStream();

  const handleSelectEngine = (engine: 'dashboard' | 'questions' | 'syllabus' | 'notes') => {
    setActiveEngine(engine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop with frosted glass blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm bg-white/90 backdrop-blur-2xl border-r border-slate-200/80 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-250">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/60 bg-gradient-to-r from-indigo-50/80 via-white/80 to-emerald-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-slate-900 tracking-tight">ABHYAAS</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Glass v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Smart Exam & Curriculum Portal</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Primary Engines */}
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Core Engines & Hub
              </div>

              {/* 1. Dashboard */}
              <button
                onClick={() => handleSelectEngine('dashboard')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  activeEngine === 'dashboard'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-5 h-5 ${activeEngine === 'dashboard' ? 'text-amber-300' : 'text-indigo-600'}`} />
                  <div className="text-left">
                    <div className="text-xs">Dashboard Overview</div>
                    <div className={`text-[10px] font-normal ${activeEngine === 'dashboard' ? 'text-indigo-100' : 'text-slate-500'}`}>
                      Central Stats & Auto-Router
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${activeEngine === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 2. Q&A Bank Converter */}
              <button
                onClick={() => handleSelectEngine('questions')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  activeEngine === 'questions'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${activeEngine === 'questions' ? 'text-amber-300' : 'text-indigo-600'}`} />
                  <div className="text-left">
                    <div className="text-xs">Exam Paper Q&A Converter</div>
                    <div className={`text-[10px] font-normal ${activeEngine === 'questions' ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {savedBanksCount} Papers Active
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${activeEngine === 'questions' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 3. Syllabus Builder */}
              <button
                onClick={() => handleSelectEngine('syllabus')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  activeEngine === 'syllabus'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookmarkCheck className={`w-5 h-5 ${activeEngine === 'syllabus' ? 'text-amber-300' : 'text-emerald-600'}`} />
                  <div className="text-left">
                    <div className="text-xs">Syllabus & Curriculum Builder</div>
                    <div className={`text-[10px] font-normal ${activeEngine === 'syllabus' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {savedSyllabiCount} Syllabi Saved
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${activeEngine === 'syllabus' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 4. Revision Notes */}
              <button
                onClick={() => handleSelectEngine('notes')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  activeEngine === 'notes'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${activeEngine === 'notes' ? 'text-amber-200' : 'text-amber-600'}`} />
                  <div className="text-left">
                    <div className="text-xs">Quick Revision Notes</div>
                    <div className={`text-[10px] font-normal ${activeEngine === 'notes' ? 'text-amber-100' : 'text-slate-500'}`}>
                      Sectional Markdown Generator
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${activeEngine === 'notes' ? 'text-white' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Stream & Subjects Summary */}
            <div className="space-y-2">
              <div className="px-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Supported Streams ({ALL_SUBJECTS.length}+ Subjects)
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 font-bold flex items-center justify-between">
                  <span>🧪 Science</span>
                  <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-1.5 py-0.5 rounded-md">
                    {grouped.science.subjects.length}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-rose-900 font-bold flex items-center justify-between">
                  <span>📊 Commerce</span>
                  <span className="text-[10px] bg-rose-200/80 text-rose-900 px-1.5 py-0.5 rounded-md">
                    {grouped.commerce.subjects.length}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-900 font-bold flex items-center justify-between">
                  <span>🏛️ Arts</span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-md">
                    {grouped.arts.subjects.length}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 font-bold flex items-center justify-between">
                  <span>📖 Languages</span>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded-md">
                    {grouped.language.subjects.length}
                  </span>
                </div>
              </div>
            </div>

            {/* GitHub Sync Status Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2.5 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Github className="w-4 h-4 text-indigo-400" />
                  <span>GitHub Sync Engine</span>
                </div>
                {githubToken ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    Token Needed
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-slate-300 truncate bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
                {repoOwner}/{repoName}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure Repo Credentials</span>
              </button>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200/60 bg-slate-50/60 text-center text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700">Class 9–12 State Boards & CBSE</div>
            <p>Bilingual (Hindi/English) Auto-Parser</p>
          </div>

        </div>
      </div>
    </div>
  );
};
