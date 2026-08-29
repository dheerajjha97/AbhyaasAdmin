import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Layers,
  CheckCircle2,
  FileText,
  Bookmark
} from 'lucide-react';

export const ClassesSubjectsView: React.FC = () => {
  const { classes, subjects, papers, chapters, setActiveTab } = useApp();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="pb-1 border-b border-slate-200">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" /> Classes & Subjects
        </h1>
        <p className="text-xs text-slate-500">Bihar Board & CBSE Curriculum Setup</p>
      </div>

      {/* 1. Classes Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Target Classes ({classes.length})
          </h2>
          <span className="text-[11px] text-emerald-700 font-medium">Standard 9 to 12</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {classes.map((cls) => {
            const classPapers = papers.filter((p) => p.classId === cls.id);
            return (
              <div
                key={cls.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                      {cls.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{cls.name}</h3>
                      <p className="text-[11px] text-slate-500">
                        {cls.streams?.join(', ') || 'General Science'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>{classPapers.length} Question Papers</span>
                  <button
                    onClick={() => setActiveTab('papers')}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    View Papers →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Subjects Section */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Configured Subjects ({subjects.length})
          </h2>
          <span className="text-[11px] text-slate-500">Science Stream</span>
        </div>

        <div className="space-y-2">
          {subjects.map((sub) => {
            const subChapters = chapters.filter((c) => c.subjectId === sub.id);
            const subPapers = papers.filter((p) => p.subjectId === sub.id);

            return (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{sub.name}</h3>
                      {sub.hindiName && (
                        <span className="text-xs text-amber-700 font-medium">({sub.hindiName})</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {subChapters.length} Chapters • {subPapers.length} Papers
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('syllabus')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
                >
                  Syllabus
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
