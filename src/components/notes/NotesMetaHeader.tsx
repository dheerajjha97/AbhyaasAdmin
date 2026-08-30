import React from 'react';
import {
  FileText,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Award,
  FileCode2,
  Clock,
  Zap,
  Hash
} from 'lucide-react';
import { NoteType } from '../../utils/notesParser';
import { ThreeDNotesIllustration } from '../common/ThreeDIllustrations';
import { SubjectSelect } from '../common/SubjectSelect';

interface NotesMetaHeaderProps {
  classId: string;
  setClassId: (val: string) => void;
  subjectId: string;
  setSubjectId: (val: string) => void;
  chapterNumber: number;
  setChapterNumber: (val: number) => void;
  chapterTitle: string;
  setChapterTitle: (val: string) => void;
  board: string;
  setBoard: (val: string) => void;
  academicYear: string;
  setAcademicYear: (val: string) => void;
  noteType: NoteType;
  setNoteType: (val: NoteType) => void;
  totalSectionsCount: number;
  totalFormulasCount: number;
  totalTakeawaysCount: number;
  readingTimeMinutes: number;
  targetFilename: string;
}

export const NotesMetaHeader: React.FC<NotesMetaHeaderProps> = ({
  classId,
  setClassId,
  subjectId,
  setSubjectId,
  chapterNumber,
  setChapterNumber,
  chapterTitle,
  setChapterTitle,
  board,
  setBoard,
  academicYear,
  setAcademicYear,
  noteType,
  setNoteType,
  totalSectionsCount,
  totalFormulasCount,
  totalTakeawaysCount,
  readingTimeMinutes,
  targetFilename,
}) => {
  return (
    <div className="p-4 sm:p-5 glass-panel space-y-4 relative overflow-hidden">
      {/* Glass Glow Background Ambient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/60 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 p-1.5 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-2xl shadow-md shadow-amber-500/20">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-600 text-white font-mono text-[10px] font-extrabold tracking-wide uppercase shadow-xs">
                Notes Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-600" /> Notes Schema 2.0
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
              Notes & Revision Sheet Generator
            </h2>
            <p className="text-slate-500 text-[11px]">
              Parse text/markdown notes, extract formulas, and generate mobile-ready JSON
            </p>
          </div>
        </div>

        {/* Live 3D Notes Statistics Counters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sections: <strong className="text-indigo-700">{totalSectionsCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Formulas: <strong className="text-amber-700">{totalFormulasCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Read: <strong className="text-emerald-700">{readingTimeMinutes} min</strong></span>
          </div>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* 1. Class Selector */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1 mb-1">
            <GraduationCap className="w-3 h-3 text-amber-600" /> Class
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="class-12">Class 12 (12th)</option>
            <option value="class-11">Class 11 (11th)</option>
            <option value="class-10">Class 10 (Matric)</option>
            <option value="class-9">Class 9</option>
            <option value="neet-ug">NEET UG</option>
            <option value="jee-main">JEE Main</option>
          </select>
        </div>

        {/* 2. Subject Selector */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <SubjectSelect
            value={subjectId}
            onChange={setSubjectId}
            label="Subject"
            colorTheme="amber"
          />
        </div>

        {/* 3. Chapter Number */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Hash className="w-3 h-3 text-amber-600" /> Chapter No.
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={chapterNumber}
            onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
          />
        </div>

        {/* 4. Note Type */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Note Type
          </label>
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as NoteType)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="comprehensive">Full Chapter Notes</option>
            <option value="revision">Quick Summary</option>
            <option value="formula_sheet">Formulas & Equations</option>
            <option value="board_special">Board Super Imp</option>
            <option value="mindmap">Mindmap & Outline</option>
          </select>
        </div>

        {/* 5. Board Selector */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Award className="w-3 h-3 text-amber-600" /> Board
          </label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="Bihar Board (BSEB)">Bihar Board (BSEB)</option>
            <option value="CBSE / NCERT">CBSE / NCERT</option>
            <option value="UP Board">UP Board (UPMSP)</option>
            <option value="MP Board">MP Board (MPBSE)</option>
            <option value="Rajasthan Board">Rajasthan Board</option>
            <option value="ICSE / ISC">ICSE / ISC</option>
          </select>
        </div>

        {/* 6. Academic Session */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-amber-600" /> Session
          </label>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="2025-2026">2025 - 2026</option>
            <option value="2024-2025">2024 - 2025</option>
            <option value="2026-2027">2026 - 2027</option>
          </select>
        </div>
      </div>

      {/* Target GitHub Path Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-mono border-b-2 border-amber-500 shadow-md">
        <div className="flex items-center gap-2 truncate">
          <FileCode2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400 text-[11px]">GitHub Path:</span>
          <span className="text-amber-300 font-bold truncate text-[11px]">{targetFilename}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-950 text-amber-300 font-semibold border border-amber-800">
          Live Auto-Sync
        </span>
      </div>
    </div>
  );
};

