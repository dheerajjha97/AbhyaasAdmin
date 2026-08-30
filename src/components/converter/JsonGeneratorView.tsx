import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  ArrowRight,
  Sparkles,
  FileCheck2,
  FileJson,
  UploadCloud
} from 'lucide-react';
import { ParsedPaperResult } from '../../utils/questionParser';

interface JsonGeneratorViewProps {
  parsedResult: ParsedPaperResult;
  targetFilename: string;
  onNavigateToPush: () => void;
}

export const JsonGeneratorView: React.FC<JsonGeneratorViewProps> = ({
  parsedResult,
  targetFilename,
  onNavigateToPush,
}) => {
  const [copied, setCopied] = useState(false);

  // Convert parsedResult into the exact clean JSON structure for exams
  const finalJsonPayload = {
    schemaVersion: '2.0',
    paper: {
      id: parsedResult.paperId,
      title: parsedResult.title,
      classId: parsedResult.classId,
      className: parsedResult.className,
      subjectId: parsedResult.subjectId,
      subjectName: parsedResult.subjectName,
      board: parsedResult.board,
      year: parsedResult.year,
      set: parsedResult.set,
      durationMinutes: parsedResult.durationMinutes,
      totalMarks: parsedResult.totalMarks,
      totalQuestions: parsedResult.stats.totalQuestions,
      status: 'ready',
      createdAt: new Date().toISOString(),
    },
    sections: parsedResult.sections,
    stats: parsedResult.stats,
    questions: parsedResult.questions.map((q) => ({
      id: q.id,
      sectionId: q.sectionId,
      questionNumber: q.questionNumber,
      type: q.type,
      text: q.text,
      textHindi: q.textHindi,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctAnswerText: q.correctAnswerText,
      explanationHindi: q.explanationHindi,
      modelAnswer: q.modelAnswer,
      marks: q.marks,
    })),
  };

  const jsonString = JSON.stringify(finalJsonPayload, null, 2);
  const fileSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetFilename.split('/').pop() || 'question_bank.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" /> 3. Generated JSON File
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Production-ready JSON schema formatted for mobile app consumption, offline caching, and testing engines.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download .json</span>
            </button>

            <button
              onClick={onNavigateToPush}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Push to GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* JSON Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Path</span>
            <span className="font-mono font-bold text-slate-900 truncate block">{targetFilename}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">File Size</span>
            <span className="font-mono font-bold text-slate-900">{fileSizeKb} KB</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Questions</span>
            <span className="font-mono font-bold text-slate-900">{parsedResult.stats.totalQuestions} Questions</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Schema Validity</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" /> Validated JSON
            </span>
          </div>
        </div>
      </div>

      {/* JSON Code Viewer */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-slate-400 font-mono text-xs pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-amber-400" />
            <span className="text-slate-200">{targetFilename}</span>
          </div>
          <span>{jsonString.split('\n').length} lines</span>
        </div>

        <pre className="text-[11px] sm:text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto max-h-[550px] p-3 rounded-2xl bg-slate-950/80 border border-slate-800 select-all">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
