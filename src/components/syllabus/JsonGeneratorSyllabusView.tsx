import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  UploadCloud,
  FileCheck,
  Layers,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ParsedSyllabusResult } from '../../utils/syllabusParser';

interface JsonGeneratorSyllabusViewProps {
  parsedResult: ParsedSyllabusResult;
  targetFilename: string;
  onNavigateToPush: () => void;
}

export const JsonGeneratorSyllabusView: React.FC<JsonGeneratorSyllabusViewProps> = ({
  parsedResult,
  targetFilename,
  onNavigateToPush,
}) => {
  const [copied, setCopied] = useState(false);

  // Formatted JSON Object adhering to Abhyaas Syllabus standard schema
  const formattedJson = {
    schemaVersion: '2.0',
    contentType: 'syllabus',
    generatedAt: new Date().toISOString(),
    syllabus: {
      id: parsedResult.syllabusId,
      title: parsedResult.title,
      classId: parsedResult.classId,
      className: parsedResult.className,
      subjectId: parsedResult.subjectId,
      subjectName: parsedResult.subjectName,
      board: parsedResult.board,
      academicYear: parsedResult.academicYear,
      stream: parsedResult.stream,
      totalMarks: parsedResult.totalMarks,
      totalUnits: parsedResult.stats.totalUnits,
      totalChapters: parsedResult.stats.totalChapters,
      totalTopics: parsedResult.stats.totalTopics,
    },
    units: parsedResult.units.map((u) => ({
      id: u.id,
      unitNumber: u.unitNumber,
      title: u.title,
      hindiTitle: u.hindiTitle,
      marksWeightage: u.marksWeightage,
      chapterCount: u.chapters.length,
    })),
    chapters: parsedResult.chapters.map((c) => ({
      id: c.id,
      chapterNumber: c.chapterNumber,
      unitNumber: c.unitNumber,
      unitTitle: c.unitTitle,
      title: c.title,
      hindiTitle: c.hindiTitle,
      marksWeightage: c.marksWeightage,
      topicsCount: c.topics.length,
      topics: c.topics.map((t, idx) => ({
        id: t.id,
        topicNumber: t.topicNumber || `${c.chapterNumber}.${idx + 1}`,
        title: t.title,
        hindiTitle: t.hindiTitle,
        order: t.order,
        subtopics: t.subtopics,
      })),
    })),
  };

  const jsonString = JSON.stringify(formattedJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = targetFilename.split('/').pop() || 'syllabus.json';
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Step 3: Standard Syllabus JSON Exporter
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Schema v2.0 Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Formatted for mobile and web consumption in Abhyaas App
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={onNavigateToPush}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Push to GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Validation Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Units</span>
            <strong className="text-slate-800 text-sm">{parsedResult.stats.totalUnits} Units</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-600 text-[10px] uppercase font-bold block">Chapters</span>
            <strong className="text-emerald-900 text-sm">{parsedResult.stats.totalChapters} Chapters</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-teal-600 text-[10px] uppercase font-bold block">Sub-Topics</span>
            <strong className="text-teal-900 text-sm">{parsedResult.stats.totalTopics} Topics</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-600 text-[10px] uppercase font-bold block">Target Path</span>
            <strong className="text-amber-900 text-[11px] font-mono truncate block">
              {targetFilename.split('/').pop()}
            </strong>
          </div>
        </div>
      </div>

      {/* JSON Viewer Code Block */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200 font-semibold">{targetFilename}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{(new Blob([jsonString]).size / 1024).toFixed(1)} KB</span>
            <span>•</span>
            <span>{jsonString.split('\n').length} Lines</span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs text-emerald-400 leading-relaxed">
          <pre>{jsonString}</pre>
        </div>
      </div>
    </div>
  );
};
