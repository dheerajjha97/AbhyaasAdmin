import React from 'react';
import {
  GraduationCap,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  FileCheck2,
  Sigma,
  BookOpen
} from 'lucide-react';

interface MathMetaHeaderProps {
  classId: string;
  setClassId: (val: string) => void;
  board: string;
  setBoard: (val: string) => void;
  year: number;
  setYear: (val: number) => void;
  set: string;
  setSet: (val: string) => void;
  totalQuestions: number;
  mcqCount: number;
  shortCount: number;
  longCount: number;
  totalMarks: number;
}

export const MathMetaHeader: React.FC<MathMetaHeaderProps> = ({
  classId,
  setClassId,
  board,
  setBoard,
  year,
  setYear,
  set,
  setSet,
  totalQuestions,
  mcqCount,
  shortCount,
  longCount,
  totalMarks,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-md space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Engine Identity */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Sigma className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                गणित विशेष प्रश्न बैंक इंजन (Maths Dedicated Engine)
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Formula & Step-Safe
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specially tuned for Class 10 & 12 Board Mathematics — handles LaTeX, square roots, fractions, MCQs, and step-wise proofs.
            </p>
          </div>
        </div>

        {/* Right: Live Counter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>कुल प्रश्न: <strong className="text-slate-900 font-black">{totalQuestions}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 flex items-center gap-1.5 shadow-xs">
            <span>MCQ: <strong className="text-blue-900 font-black">{mcqCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-1.5 shadow-xs">
            <span>लघु (2M): <strong className="text-emerald-900 font-black">{shortCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 flex items-center gap-1.5 shadow-xs">
            <span>दीर्घ (5M): <strong className="text-purple-900 font-black">{longCount}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>पूर्णांक: <strong className="text-amber-950 font-black">{totalMarks}</strong></span>
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
        {/* Class */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-indigo-600" /> कक्षा (Class)
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="class-10">Class 10 (मैट्रिक / Matric)</option>
            <option value="class-12">Class 12 (इंटर / Intermediate)</option>
            <option value="class-9">Class 9 (नाइंथ)</option>
            <option value="class-11">Class 11 (इलेवंथ)</option>
          </select>
        </div>

        {/* Board */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-emerald-600" /> बोर्ड (Board)
          </label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden cursor-pointer"
          >
            <option value="Bihar Board (BSEB Matric)">Bihar Board (BSEB)</option>
            <option value="CBSE Board">CBSE Board</option>
            <option value="ICSE / State Board">Other State Board</option>
          </select>
        </div>

        {/* Year */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-600" /> परीक्षा वर्ष (Year)
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden cursor-pointer"
          >
            <option value={2026}>2026 (Upcoming Model Paper)</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
        </div>

        {/* Set */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-600" /> सेट (Paper Set)
          </label>
          <select
            value={set}
            onChange={(e) => setSet(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:outline-hidden cursor-pointer"
          >
            <option value="Set A">Set A</option>
            <option value="Set B">Set B</option>
            <option value="Set C">Set C</option>
            <option value="Set D">Set D</option>
            <option value="Model Set 1">Model Set 1</option>
          </select>
        </div>
      </div>
    </div>
  );
};
