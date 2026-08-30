import React from 'react';
import {
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  FileCode2,
  CheckCircle2
} from 'lucide-react';
import { ThreeDExamIllustration } from '../common/ThreeDIllustrations';
import { SubjectSelect } from '../common/SubjectSelect';

interface ExamMetaHeaderProps {
  classId: string;
  setClassId: (val: string) => void;
  subjectId: string;
  setSubjectId: (val: string) => void;
  board: string;
  setBoard: (val: string) => void;
  year: number;
  setYear: (val: number) => void;
  set: string;
  setSet: (val: string) => void;
  totalQuestionsCount: number;
  targetFilename: string;
}

export const ExamMetaHeader: React.FC<ExamMetaHeaderProps> = ({
  classId,
  setClassId,
  subjectId,
  setSubjectId,
  board,
  setBoard,
  year,
  setYear,
  set,
  setSet,
  totalQuestionsCount,
  targetFilename,
}) => {
  const classOptions = [
    { id: 'class-12', label: 'Class 12th (Senior Sec)' },
    { id: 'class-10', label: 'Class 10th (Matric)' },
    { id: 'class-11', label: 'Class 11th' },
    { id: 'class-9', label: 'Class 9th' },
  ];

  const boardOptions = [
    'Bihar Board (BSEB)',
    'CBSE Board',
    'UP Board',
    'MP Board',
    'ICSE / ISC',
    'State Board (General)',
  ];

  const yearOptions = [2027, 2026, 2025, 2024, 2023, 2022];
  const setOptions = ['Set A', 'Set B', 'Set C', 'Set D', 'Main Paper'];

  return (
    <div className="p-4 sm:p-5 glass-panel space-y-4 relative overflow-hidden">
      {/* Glass Glow Background Ambient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/60 rounded-full blur-3xl -z-0 pointer-events-none" />

      {/* Top Banner with Glass Illustration & Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="shrink-0 p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-mono text-[10px] font-extrabold tracking-wide uppercase shadow-xs">
                Q&A Converter Engine
              </span>
              {totalQuestionsCount > 0 && (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {totalQuestionsCount} Qs Active
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Exam Paper Q&A Converter
            </h1>
            <p className="text-slate-500 text-[11px]">
              Convert question banks & auto-generate structured answers
            </p>
          </div>
        </div>

        {/* GitHub target indicator Glass Pill */}
        <div className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 text-white font-mono text-xs shadow-md border border-slate-700">
          <FileCode2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-indigo-200 truncate max-w-full sm:max-w-xs text-[11px] font-bold">
            {targetFilename}
          </span>
        </div>
      </div>

      {/* Selectors Grid: Class, Subject, Board, Year, Set */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {/* Class */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="block text-[10px] font-black text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Class
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer shadow-2xs"
          >
            {classOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject (Full 30+ Subjects with Stream Categorization & Search Modal) */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <SubjectSelect
            value={subjectId}
            onChange={setSubjectId}
            label="Subject"
            colorTheme="indigo"
          />
        </div>

        {/* Board */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="block text-[10px] font-black text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Board
          </label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer shadow-2xs"
          >
            {boardOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="block text-[10px] font-black text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Exam Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-none cursor-pointer font-mono shadow-2xs"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y} Exam
              </option>
            ))}
          </select>
        </div>

        {/* Set (Manual Typing + Datalist) */}
        <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200">
          <label className="block text-[10px] font-black text-indigo-900 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Paper Set
            </span>
            <span className="text-[9px] text-indigo-500 font-semibold lowercase">Type or select</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={set}
              onChange={(e) => setSet(e.target.value)}
              placeholder="e.g. Set A, Set B, Main..."
              list="paper-set-list"
              className="w-full h-9 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono shadow-2xs"
            />
            <datalist id="paper-set-list">
              <option value="Set A" />
              <option value="Set B" />
              <option value="Set C" />
              <option value="Set D" />
              <option value="Set E" />
              <option value="Main Paper" />
              <option value="Model Paper 1" />
              <option value="Compartment Set" />
            </datalist>
          </div>
        </div>
      </div>
    </div>
  );
};

