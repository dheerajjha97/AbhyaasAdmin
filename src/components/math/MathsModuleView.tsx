import React, { useState, useEffect, useRef } from 'react';
import {
  Sigma,
  FileText,
  FileCheck,
  Code2,
  Github,
  Sparkles,
  ArrowRight,
  Calculator,
  RefreshCw,
  FolderDown,
  CheckCircle2
} from 'lucide-react';
import { MathMetaHeader } from './MathMetaHeader';
import { MathPasteAndParseView } from './MathPasteAndParseView';
import { MathReviewView } from './MathReviewView';
import { MathJsonView } from './MathJsonView';
import { MathGitHubPushView } from './MathGitHubPushView';
import { parseMathExamContent, SAMPLE_CLASS10_MATHS_2026_PAPER } from '../../utils/mathQuestionParser';
import { ParsedPaperResult, ParsedQuestion } from '../../utils/questionParser';

interface MathsModuleViewProps {
  githubToken: string;
  repoOwner: string;
  repoName: string;
  onOpenSettings: () => void;
}

export type MathTabType = 'paste' | 'review' | 'json' | 'push';

export const MathsModuleView: React.FC<MathsModuleViewProps> = ({
  githubToken,
  repoOwner,
  repoName,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<MathTabType>('paste');

  // Metadata states
  const [classId, setClassId] = useState<string>(() => {
    return localStorage.getItem('abhyaas_math_classId') || 'class-10';
  });
  const [board, setBoard] = useState<string>(() => {
    return localStorage.getItem('abhyaas_math_board') || 'Bihar Board (BSEB Matric)';
  });
  const [year, setYear] = useState<number>(() => {
    return Number(localStorage.getItem('abhyaas_math_year')) || 2026;
  });
  const [set, setSet] = useState<string>(() => {
    return localStorage.getItem('abhyaas_math_set') || 'Set A';
  });

  // Raw math text state
  const [rawMathText, setRawMathText] = useState<string>(() => {
    const saved = localStorage.getItem('abhyaas_math_raw');
    return saved !== null ? saved : SAMPLE_CLASS10_MATHS_2026_PAPER.trim();
  });

  // Parsed result
  const [parsedResult, setParsedResult] = useState<ParsedPaperResult | null>(() => {
    // Initial parse of default/saved text
    const initialText = localStorage.getItem('abhyaas_math_raw') || SAMPLE_CLASS10_MATHS_2026_PAPER.trim();
    return parseMathExamContent(initialText, {
      classId: 'class-10',
      className: 'Class 10',
      subjectId: 'mathematics',
      subjectName: 'Mathematics (गणित)',
      board: 'Bihar Board (BSEB Matric)',
      year: 2026,
      set: 'Set A',
    });
  });

  // Target filename
  const cleanSubjectCode = 'mathematics';
  const cleanClassCode = classId.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cleanSetCode = set.toLowerCase().replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
  const defaultFilename = `data/papers/${cleanClassCode}_${cleanSubjectCode}_${year}_${cleanSetCode}.json`;
  const [targetFilename, setTargetFilename] = useState<string>(defaultFilename);

  useEffect(() => {
    setTargetFilename(defaultFilename);
  }, [defaultFilename]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('abhyaas_math_classId', classId);
  }, [classId]);

  useEffect(() => {
    localStorage.setItem('abhyaas_math_board', board);
  }, [board]);

  useEffect(() => {
    localStorage.setItem('abhyaas_math_year', year.toString());
  }, [year]);

  useEffect(() => {
    localStorage.setItem('abhyaas_math_set', set);
  }, [set]);

  useEffect(() => {
    localStorage.setItem('abhyaas_math_raw', rawMathText);
  }, [rawMathText]);

  // Parse handler
  const handleParse = () => {
    const className = classId === 'class-10' ? 'Class 10' : classId === 'class-12' ? 'Class 12' : classId;
    const res = parseMathExamContent(rawMathText, {
      classId,
      className,
      subjectId: 'mathematics',
      subjectName: 'Mathematics (गणित)',
      board,
      year,
      set,
    });
    setParsedResult(res);
  };

  // Question manipulation
  const handleUpdateQuestion = (updatedQ: ParsedQuestion) => {
    if (!parsedResult) return;
    const newQuestions = parsedResult.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    setParsedResult({
      ...parsedResult,
      questions: newQuestions,
    });
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!parsedResult) return;
    const newQuestions = parsedResult.questions.filter((q) => q.id !== qId);
    const mcqCount = newQuestions.filter((q) => q.type === 'mcq').length;
    const shortCount = newQuestions.filter((q) => q.type === 'short').length;
    const longCount = newQuestions.filter((q) => q.type === 'long').length;

    setParsedResult({
      ...parsedResult,
      questions: newQuestions,
      stats: {
        totalQuestions: newQuestions.length,
        mcqCount,
        shortCount,
        longCount,
        answeredCount: newQuestions.filter((q) => q.correctAnswer || q.modelAnswer).length,
      },
    });
  };

  const handleAddQuestion = (sectionId: 'sec-a' | 'sec-b' | 'sec-c') => {
    if (!parsedResult) return;
    const nextQNum = parsedResult.questions.length + 1;
    const isMCQ = sectionId === 'sec-a';
    const isShort = sectionId === 'sec-b';

    const newQ: ParsedQuestion = {
      id: `math-q-${Date.now()}`,
      sectionId,
      sectionName: isMCQ
        ? 'खण्ड-अ : वस्तुनिष्ठ प्रश्न'
        : isShort
        ? 'खण्ड-ब : लघु उत्तरीय प्रश्न'
        : 'खण्ड-स : दीर्घ उत्तरीय प्रश्न',
      questionNumber: nextQNum,
      type: isMCQ ? 'mcq' : isShort ? 'short' : 'long',
      text: `नया गणित प्रश्न ${nextQNum}`,
      marks: isMCQ ? 1 : isShort ? 2 : 5,
    };

    setParsedResult({
      ...parsedResult,
      questions: [...parsedResult.questions, newQ],
      stats: {
        ...parsedResult.stats,
        totalQuestions: parsedResult.questions.length + 1,
        mcqCount: isMCQ ? parsedResult.stats.mcqCount + 1 : parsedResult.stats.mcqCount,
        shortCount: isShort ? parsedResult.stats.shortCount + 1 : parsedResult.stats.shortCount,
        longCount: !isMCQ && !isShort ? parsedResult.stats.longCount + 1 : parsedResult.stats.longCount,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
      {/* 1. Exam Meta Header */}
      <MathMetaHeader
        classId={classId}
        setClassId={setClassId}
        board={board}
        setBoard={setBoard}
        year={year}
        setYear={setYear}
        set={set}
        setSet={setSet}
        totalQuestions={parsedResult?.stats.totalQuestions || 0}
        mcqCount={parsedResult?.stats.mcqCount || 0}
        shortCount={parsedResult?.stats.shortCount || 0}
        longCount={parsedResult?.stats.longCount || 0}
        totalMarks={parsedResult?.totalMarks || 0}
      />

      {/* 2. Math Subtabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'paste'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Paste & Parse</span>
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'review'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>2. Review Qs ({parsedResult?.stats.totalQuestions || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'json'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>3. JSON Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('push')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'push'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          <span>4. Push to GitHub</span>
        </button>
      </div>

      {/* 3. Subtab Content Views */}
      {activeTab === 'paste' && (
        <MathPasteAndParseView
          rawMathText={rawMathText}
          setRawMathText={setRawMathText}
          parsedResult={parsedResult}
          onParse={handleParse}
          onNavigateToReview={() => setActiveTab('review')}
          onNavigateToJson={() => setActiveTab('json')}
        />
      )}

      {activeTab === 'review' && (
        <MathReviewView
          parsedResult={parsedResult}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onAddQuestion={handleAddQuestion}
          onNavigateToJson={() => setActiveTab('json')}
          onNavigateToPush={() => setActiveTab('push')}
        />
      )}

      {activeTab === 'json' && (
        <MathJsonView
          parsedResult={parsedResult}
          onNavigateToPush={() => setActiveTab('push')}
          targetFilename={targetFilename}
        />
      )}

      {activeTab === 'push' && (
        <MathGitHubPushView
          parsedResult={parsedResult}
          targetFilename={targetFilename}
          setTargetFilename={setTargetFilename}
          githubToken={githubToken}
          repoOwner={repoOwner}
          repoName={repoName}
          onOpenSettings={onOpenSettings}
        />
      )}
    </div>
  );
};
