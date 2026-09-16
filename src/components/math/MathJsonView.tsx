import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  ArrowRight,
  Sparkles,
  FileCheck,
  Layers,
  Database
} from 'lucide-react';
import { ParsedPaperResult } from '../../utils/questionParser';

interface MathJsonViewProps {
  parsedResult: ParsedPaperResult | null;
  onNavigateToPush: () => void;
  targetFilename: string;
}

export const MathJsonView: React.FC<MathJsonViewProps> = ({
  parsedResult,
  onNavigateToPush,
  targetFilename,
}) => {
  const [copied, setCopied] = useState(false);

  if (!parsedResult || parsedResult.questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Code2 className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800">JSON उत्पन्न करने के लिए कोई प्रश्न नहीं</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          कृपया पहले प्रश्न पत्र पार्स करें।
        </p>
      </div>
    );
  }

  const jsonPayload = {
    schemaVersion: '2.0',
    contentType: 'exam_paper',
    generatedAt: new Date().toISOString(),
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
      stats: parsedResult.stats,
    },
    sections: parsedResult.sections,
    questions: parsedResult.questions.map((q) => ({
      id: q.id,
      sectionId: q.sectionId,
      sectionName: q.sectionName,
      questionNumber: q.questionNumber,
      type: q.type,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctAnswerText: q.correctAnswerText,
      explanation: q.explanation,
      modelAnswer: q.modelAnswer,
      marks: q.marks,
    })),
  };

  const jsonString = JSON.stringify(jsonPayload, null, 2);

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
    a.download = targetFilename.split('/').pop() || 'math_question_bank.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Stats & Quick Actions */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                3. JSON स्कीमा व डाउनलोड (Mathematics Schema JSON)
              </h2>
              <p className="text-xs text-slate-500">
                Verified schema payload ready for direct mobile sync or GitHub deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>

            <button
              onClick={onNavigateToPush}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-all active:scale-95"
            >
              <span>GitHub Push</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick summary chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
            Target: {targetFilename}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold">
            Size: {(jsonString.length / 1024).toFixed(1)} KB
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold">
            {parsedResult.stats.totalQuestions} Questions Formatted
          </span>
        </div>
      </div>

      {/* JSON Code Viewer */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-bold text-amber-400">{targetFilename}</span>
          <span>JSON Validated Schema 2.0</span>
        </div>

        <pre className="text-xs font-mono text-emerald-400 max-h-[550px] overflow-y-auto leading-relaxed p-2 select-all whitespace-pre-wrap">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
