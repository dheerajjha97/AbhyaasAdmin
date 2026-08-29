import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DownloadCloud,
  FileCode,
  Copy,
  Check,
  FileText,
  Bookmark,
  FileEdit,
  Database
} from 'lucide-react';

export const JsonExportView: React.FC = () => {
  const { papers, chapters, notes, classes, subjects } = useApp();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const exportOptions = [
    {
      id: 'papers',
      title: 'Question Papers JSON',
      desc: `All ${papers.length} question papers with answers & options`,
      icon: FileText,
      data: papers,
      filename: 'abhyaas_question_papers_2026.json',
    },
    {
      id: 'syllabus',
      title: 'Syllabus & Chapters JSON',
      desc: `${chapters.length} chapters with topic tracking`,
      icon: Bookmark,
      data: { classes, subjects, chapters },
      filename: 'abhyaas_syllabus_2026.json',
    },
    {
      id: 'notes',
      title: 'Notes & Formula Sheets JSON',
      desc: `${notes.length} revision notes and key points`,
      icon: FileEdit,
      data: notes,
      filename: 'abhyaas_notes_2026.json',
    },
    {
      id: 'full',
      title: 'Full Database Backup JSON',
      desc: 'Complete database bundle for student apps',
      icon: Database,
      data: { classes, subjects, papers, chapters, notes, exportDate: new Date().toISOString() },
      filename: 'abhyaas_full_database_v3.json',
    },
  ];

  const handleDownload = (data: any, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (data: any, id: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedType(id);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="pb-1 border-b border-slate-200">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <DownloadCloud className="w-5 h-5 text-indigo-600" /> Export JSON Hub
        </h1>
        <p className="text-xs text-slate-500">Download formatted JSON for mobile apps & web clients</p>
      </div>

      <div className="space-y-3">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleCopy(opt.data, opt.id)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedType === opt.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy JSON
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(opt.data, opt.filename)}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <DownloadCloud className="w-3.5 h-3.5" /> Download .json
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
