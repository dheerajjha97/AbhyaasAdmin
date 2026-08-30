import React from 'react';
import {
  FolderGit2,
  BookmarkCheck,
  FileCode,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Download
} from 'lucide-react';
import { ParsedSyllabusResult } from '../../utils/syllabusParser';

export interface SavedSyllabusItem {
  id: string;
  title: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  board: string;
  academicYear: string;
  stream?: string;
  totalChapters: number;
  totalTopics: number;
  totalMarks: number;
  githubPath: string;
  lastUpdated: string;
}

interface SavedSyllabiViewProps {
  syllabiList: SavedSyllabusItem[];
  onSelectSyllabus: (syllabus: SavedSyllabusItem) => void;
}

export const SavedSyllabiView: React.FC<SavedSyllabiViewProps> = ({
  syllabiList,
  onSelectSyllabus,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-600" /> Available GitHub Curriculum & Syllabi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curricula and chapter structures available in repository for Bihar Board, CBSE & State Boards.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-mono font-bold text-xs border border-emerald-200">
            {syllabiList.length} Syllabi Available
          </span>
        </div>
      </div>

      {/* Syllabi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {syllabiList.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200 uppercase">
                  {item.className} • {item.subjectName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {item.academicYear}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{item.board}</span>
                  {item.stream && <span>• {item.stream}</span>}
                </div>
              </div>

              {/* Stats Chips */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Chapters</span>
                  <span className="font-bold text-slate-800 text-xs">{item.totalChapters}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Topics</span>
                  <span className="font-bold text-emerald-700 text-xs">{item.totalTopics}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Marks</span>
                  <span className="font-bold text-slate-800 text-xs">{item.totalMarks}M</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.githubPath}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => onSelectSyllabus(item)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Open in Syllabus Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
