import React from 'react';
import {
  BookmarkCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Award,
  FileCode2
} from 'lucide-react';
import { ThreeDSyllabusIllustration } from '../common/ThreeDIllustrations';
import { SubjectSelect } from '../common/SubjectSelect';

interface SyllabusMetaHeaderProps {
  classId: string;
  setClassId: (val: string) => void;
  subjectId: string;
  setSubjectId: (val: string) => void;
  board: string;
  setBoard: (val: string) => void;
  academicYear: string;
  setAcademicYear: (val: string) => void;
  stream: string;
  setStream: (val: string) => void;
  totalChaptersCount: number;
  totalTopicsCount: number;
  totalUnitsCount: number;
  targetFilename: string;
}

export const SyllabusMetaHeader: React.FC<SyllabusMetaHeaderProps> = ({
  classId,
  setClassId,
  subjectId,
  setSubjectId,
  board,
  setBoard,
  academicYear,
  setAcademicYear,
  stream,
  setStream,
  totalChaptersCount,
  totalTopicsCount,
  totalUnitsCount,
  targetFilename,
}) => {
  return (
    <div className="p-4 sm:p-5 glass-panel space-y-4 relative overflow-hidden">
      {/* Glass Glow Background Ambient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/60 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono text-[10px] font-extrabold tracking-wide uppercase shadow-xs">
                Syllabus Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Syllabus Schema 2.0
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
              Syllabus & Curriculum Manager
            </h2>
            <p className="text-slate-500 text-[11px]">
              Parse chapter & topic trees, weightage distributions, and auto-sync
            </p>
          </div>
        </div>

        {/* Live 3D Statistics Counters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Units: <strong className="text-indigo-700">{totalUnitsCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chapters: <strong className="text-emerald-700">{totalChaptersCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Topics: <strong className="text-amber-700">{totalTopicsCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* 1. Class Selector */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1 mb-1">
            <GraduationCap className="w-3 h-3 text-emerald-600" /> Class / Grade
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
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
            colorTheme="emerald"
          />
        </div>

        {/* 3. Board Selector */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Award className="w-3 h-3 text-emerald-600" /> Exam Board
          </label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="Bihar Board (BSEB)">Bihar Board (BSEB)</option>
            <option value="CBSE / NCERT">CBSE / NCERT</option>
            <option value="UP Board">UP Board (UPMSP)</option>
            <option value="MP Board">MP Board (MPBSE)</option>
            <option value="Rajasthan Board">Rajasthan Board (RBSE)</option>
            <option value="ICSE / ISC">ICSE / ISC</option>
          </select>
        </div>

        {/* 4. Academic Session */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-emerald-600" /> Session
          </label>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="2025-2026">2025 - 2026 (Current)</option>
            <option value="2024-2025">2024 - 2025</option>
            <option value="2026-2027">2026 - 2027</option>
          </select>
        </div>

        {/* 5. Stream */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="text-[10px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-emerald-600" /> Stream / Track
          </label>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
          >
            <option value="Science (PCB / PCM)">Science (PCB / PCM)</option>
            <option value="Arts & Humanities">Arts & Humanities</option>
            <option value="Commerce">Commerce</option>
            <option value="General">General / Common</option>
          </select>
        </div>
      </div>

      {/* Target GitHub Path Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-mono border-b-2 border-emerald-500 shadow-md">
        <div className="flex items-center gap-2 truncate">
          <FileCode2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400 text-[11px]">GitHub Path:</span>
          <span className="text-emerald-300 font-bold truncate text-[11px]">{targetFilename}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
          Live Auto-Sync
        </span>
      </div>
    </div>
  );
};

