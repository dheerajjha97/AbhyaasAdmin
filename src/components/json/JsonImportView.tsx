import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  RotateCcw,
  Layers,
  FileCheck,
  FileText,
  Github,
  Clock
} from 'lucide-react';
import { QuestionPaper } from '../../types';

export const JsonImportView: React.FC = () => {
  const { importPaperFromJson, pushJsonToGitHub, setActiveTab, goToQuestionEditor } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Select File, 2: Validate, 3: Preview, 4: Success
  const [jsonText, setJsonText] = useState('');
  const [parsedData, setParsedData] = useState<QuestionPaper | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPushingGithub, setIsPushingGithub] = useState(false);
  const [githubSuccessData, setGithubSuccessData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample JSON template generator for quick testing
  const loadSampleTemplate = () => {
    const sample: QuestionPaper = {
      id: `paper-sample-${Date.now()}`,
      title: 'Class 12 Chemistry Model Set 2026',
      classId: 'class-12',
      subjectId: 'sub-chem-12',
      examType: 'board',
      year: 2026,
      setNumber: 'A',
      totalMarks: 70,
      durationMinutes: 180,
      totalQuestions: 70,
      status: 'review',
      questions: [
        {
          id: `q-chem-1`,
          paperId: `paper-sample-${Date.now()}`,
          questionNumber: 1,
          type: 'mcq',
          text: 'Which of the following is a network crystalline solid?',
          textHindi: 'निम्नलिखित में से कौन सा नेटवर्क क्रिस्टलीय ठोस है?',
          options: [
            { id: '1', key: 'A', text: 'SO2 (Solid)', textHindi: 'SO2 (ठोस)' },
            { id: '2', key: 'B', text: 'I2 (Iodine)', textHindi: 'I2 (आयोडीन)' },
            { id: '3', key: 'C', text: 'Diamond (C)', textHindi: 'हीरा (Diamond)' },
            { id: '4', key: 'D', text: 'H2O (Ice)', textHindi: 'H2O (बर्फ)' },
          ],
          correctAnswer: 'C',
          explanation: 'Diamond is a giant covalent network solid formed by tetrahedral sp3 carbon atoms.',
          aiAnswer: 'Diamond is a network covalent solid. In diamond, each carbon atom is covalently bonded to four other carbon atoms in a tetrahedral arrangement.',
          aiStatus: 'approved',
          marks: 1,
          negativeMarks: 0,
          difficulty: 'easy',
        },
      ],
    };
    setJsonText(JSON.stringify(sample, null, 2));
    handleValidate(JSON.stringify(sample));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      handleValidate(content);
    };
    reader.readAsText(file);
  };

  const handleValidate = (rawJson: string) => {
    setErrorMsg(null);
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed.title || !parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid schema: JSON must contain "title" and a "questions" array.');
      }
      setParsedData(parsed);
      setStep(2); // Jump to validation screen
    } catch (err: any) {
      setErrorMsg(err.message || 'Malformed JSON format. Please check syntax.');
    }
  };

  const handleExecuteImport = () => {
    if (!parsedData) return;
    const res = importPaperFromJson(parsedData);
    if (res.success) {
      setStep(4);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleExecutePushToGitHub = async () => {
    if (!parsedData) return;
    try {
      setIsPushingGithub(true);
      setErrorMsg(null);
      const filename = `data/papers/${parsedData.id || 'paper'}.json`;
      const res = await pushJsonToGitHub({
        filename,
        jsonContent: jsonText || JSON.stringify(parsedData, null, 2),
        commitMessage: `feat: Add ${parsedData.title} question bank`,
        branch: 'main'
      });
      setGithubSuccessData(res);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to push to GitHub');
    } finally {
      setIsPushingGithub(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-600" /> JSON Import Workflow
          </h1>
          <p className="text-xs text-slate-500">4-Step Mobile File & Validation Engine</p>
        </div>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold select-none">
        {[
          { num: 1, label: 'Select File' },
          { num: 2, label: 'Validate' },
          { num: 3, label: 'Preview' },
          { num: 4, label: 'Imported' },
        ].map((s) => (
          <div
            key={s.num}
            className={`py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
              step >= s.num
                ? 'bg-slate-900 border-slate-900 text-white font-bold'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <span className="font-mono">{s.num}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select File or Paste JSON */}
      {step === 1 && (
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          {/* File Upload Touch Target */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 border border-indigo-100">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900">Tap to Select JSON File</span>
            <span className="text-xs text-slate-500 mt-1">Supports Abhyaas / Bihar Board / CBSE question JSON</span>
          </div>

          <div className="text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">— OR PASTE RAW JSON —</span>
          </div>

          <textarea
            rows={5}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Paste raw question paper JSON here..."
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder-slate-400"
          />

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={loadSampleTemplate}
              className="py-3 px-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold hover:bg-slate-200"
            >
              Load Sample 2026 JSON
            </button>
            <button
              onClick={() => handleValidate(jsonText)}
              disabled={!jsonText.trim()}
              className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Validate JSON</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Validation Screen (Exact format from prompt #10) */}
      {step === 2 && parsedData && (
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-900">✓ Valid JSON Format</h2>
          </div>

          {/* Validation Breakdown Summary Card (Exact user requirement) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Content Type:</span>
              <span className="text-slate-900 font-bold">Question Paper</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Paper Title:</span>
              <span className="text-slate-900 font-bold">{parsedData.title}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Class:</span>
              <span className="text-emerald-700 font-bold">{parsedData.classId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Subject:</span>
              <span className="text-emerald-700 font-bold">{parsedData.subjectId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Questions Count:</span>
              <span className="text-slate-900 font-mono font-bold text-sm">
                {parsedData.questions.length} Questions
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Total Marks:</span>
              <span className="text-slate-900 font-bold">{parsedData.totalMarks || 70} Marks</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStep(3)}
                className="py-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold hover:bg-slate-200"
              >
                Preview Questions
              </button>
              <button
                id="import-to-db-btn"
                onClick={handleExecuteImport}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1"
              >
                <span>Import to Database</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id="import-push-github-btn"
              onClick={handleExecutePushToGitHub}
              disabled={isPushingGithub}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2"
            >
              {isPushingGithub ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Pushing to GitHub...</span>
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  <span>Push Directly into GitHub Repository</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview Questions List */}
      {step === 3 && parsedData && (
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-900">
              Previewing {parsedData.questions.length} Questions
            </span>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-indigo-600 hover:underline font-bold"
            >
              Back to Validate
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {parsedData.questions.map((q, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-bold text-slate-900 font-mono">Q{q.questionNumber || idx + 1}</span>
                  <span className="uppercase text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    {q.type}
                  </span>
                </div>
                <p className="text-slate-800 font-medium line-clamp-2">{q.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExecuteImport}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm"
            >
              Confirm & Import to Local Database
            </button>
            <button
              onClick={handleExecutePushToGitHub}
              disabled={isPushingGithub}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Confirm & Push into GitHub Repository</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && (
        <div className="p-6 rounded-3xl bg-white border border-emerald-300 text-center space-y-4 shadow-sm animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900">
              {githubSuccessData ? 'Pushed to GitHub Successfully!' : 'Import Completed Successfully!'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {githubSuccessData
                ? `Saved to ${githubSuccessData.filename} on ${githubSuccessData.branch} branch (Commit: ${githubSuccessData.commitSha}).`
                : 'The question paper has been added to your local database and is ready for editing or AI generation.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setStep(1);
                setJsonText('');
                setParsedData(null);
                setGithubSuccessData(null);
              }}
              className="py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-slate-200"
            >
              Import Another
            </button>
            <button
              onClick={() => setActiveTab('papers')}
              className="py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              View Papers List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
