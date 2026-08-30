import React from 'react';
import {
  FolderGit2,
  FileCode,
  FileText,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download
} from 'lucide-react';
import { QuestionPaper } from '../../types';

interface SavedBanksViewProps {
  papers: QuestionPaper[];
  onSelectPaperToEdit: (paper: QuestionPaper) => void;
}

export const SavedBanksView: React.FC<SavedBanksViewProps> = ({
  papers,
  onSelectPaperToEdit,
}) => {
  // Only display available papers with questions (filter out not available / 0 Qs)
  const availablePapers = papers.filter((p) => p.questions && p.questions.length > 0);

  return (
    <div className="space-y-4">
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-600" /> Available GitHub Question Banks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing only available verified .JSON question paper banks from GitHub.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-200">
            {availablePapers.length} Available Banks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {availablePapers.map((paper) => {
          const mcqCount = paper.questions.filter((q) => q.type === 'mcq').length;
          const shortCount = paper.questions.filter((q) => q.type === 'short').length;
          const longCount = paper.questions.filter((q) => q.type === 'long').length;

          return (
            <div
              key={paper.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-200 uppercase">
                    {paper.subjectId} • {paper.year}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Available .JSON
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {paper.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                    {paper.questions.length} Questions
                  </span>
                  {mcqCount > 0 && <span>{mcqCount} MCQs</span>}
                  {shortCount > 0 && <span>• {shortCount} Short</span>}
                  {longCount > 0 && <span>• {longCount} Long</span>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[180px]">
                  {paper.githubSourceFile || `data/papers/${paper.id}.json`}
                </span>

                <button
                  onClick={() => onSelectPaperToEdit(paper)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <span>Load in Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
