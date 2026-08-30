/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCheck,
  Code2,
  UploadCloud,
  FolderGit2,
  Sparkles,
  Layers,
  GraduationCap,
  BookOpen,
  Calendar,
  Zap,
  Github,
  CheckCircle2,
  RefreshCw,
  BookmarkCheck,
  ListOrdered,
  Settings,
  ShieldCheck,
  Menu,
  LayoutDashboard
} from 'lucide-react';
import { ExamMetaHeader } from './components/converter/ExamMetaHeader';
import { PasteAndParseView } from './components/converter/PasteAndParseView';
import { ReviewQuestionsView } from './components/converter/ReviewQuestionsView';
import { JsonGeneratorView } from './components/converter/JsonGeneratorView';
import { GitHubPushView } from './components/converter/GitHubPushView';
import { SavedBanksView } from './components/converter/SavedBanksView';
import { parseExamContent, ParsedPaperResult, ParsedQuestion } from './utils/questionParser';
import { SAMPLE_BIOLOGY_2026_TEXT } from './data/sampleQuestionBank';
import { INITIAL_PAPERS } from './data/initialData';
import { QuestionPaper } from './types';
import { ALL_SUBJECTS, getSubjectDisplayName } from './data/subjects';

// Syllabus Engine Components & Parser
import { SyllabusMetaHeader } from './components/syllabus/SyllabusMetaHeader';
import { PasteAndParseSyllabusView } from './components/syllabus/PasteAndParseSyllabusView';
import { ReviewSyllabusView } from './components/syllabus/ReviewSyllabusView';
import { JsonGeneratorSyllabusView } from './components/syllabus/JsonGeneratorSyllabusView';
import { GitHubPushSyllabusView } from './components/syllabus/GitHubPushSyllabusView';
import { SavedSyllabiView, SavedSyllabusItem } from './components/syllabus/SavedSyllabiView';
import {
  parseSyllabusContent,
  SAMPLE_BIOLOGY_SYLLABUS_TEXT,
  ParsedSyllabusResult,
  ParsedSyllabusChapter
} from './utils/syllabusParser';

// Notes Engine Component
import { NotesEngineView } from './components/notes/NotesEngineView';

// Dashboard & Layout Components
import { DashboardView } from './components/dashboard/DashboardView';
import { NavigationDrawer } from './components/layout/NavigationDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileSettingsModal } from './components/layout/MobileSettingsModal';


export default function App() {
  // Top Engine Switcher: 'dashboard' vs 'questions' vs 'syllabus' vs 'notes'
  type EngineType = 'dashboard' | 'questions' | 'syllabus' | 'notes';
  const [activeEngine, setActiveEngine] = useState<EngineType>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Shared GitHub credentials state with localStorage persistence
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('abhyaas_gh_token') || '';
  });
  const [repoOwner, setRepoOwner] = useState<string>(() => {
    return localStorage.getItem('abhyaas_gh_owner') || 'abhyaas-app';
  });
  const [repoName, setRepoName] = useState<string>(() => {
    return localStorage.getItem('abhyaas_gh_repo') || 'AbhyaasData';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('abhyaas_gh_token', githubToken);
  }, [githubToken]);

  useEffect(() => {
    localStorage.setItem('abhyaas_gh_owner', repoOwner);
  }, [repoOwner]);

  useEffect(() => {
    localStorage.setItem('abhyaas_gh_repo', repoName);
  }, [repoName]);

  // ==========================================
  // 1. QUESTION BANK CONVERTER STATE
  // ==========================================
  type QTabType = 'paste' | 'review' | 'json' | 'push' | 'saved';
  const [activeTab, setActiveTab] = useState<QTabType>('paste');

  const [classId, setClassId] = useState<string>('class-12');
  const [subjectId, setSubjectId] = useState<string>('biology');
  const [board, setBoard] = useState<string>('Bihar Board (BSEB)');
  const [year, setYear] = useState<number>(2026);
  const [set, setSet] = useState<string>('Set A');

  const [rawCombinedText, setRawCombinedText] = useState<string>('');
  const [rawAnswersText, setRawAnswersText] = useState<string>('');

  const cleanSubjectCode = subjectId.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cleanClassCode = classId.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cleanSetCode = set.toLowerCase().replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
  const targetFilename = `data/papers/${cleanClassCode}_${cleanSubjectCode}_${year}_${cleanSetCode}.json`;

  const [customTargetFilename, setCustomTargetFilename] = useState<string>(targetFilename);
  const [branch, setBranch] = useState<string>('main');
  const [commitMessage, setCommitMessage] = useState<string>(
    `feat: Add Class 12 ${getSubjectDisplayName(subjectId)} ${year} ${set} Question Bank`
  );

  useEffect(() => {
    setCustomTargetFilename(targetFilename);
    const subjectDisplayName = getSubjectDisplayName(subjectId);
    const className = classId === 'class-12' ? 'Class 12' : classId.toUpperCase();
    setCommitMessage(`feat: Add ${className} ${subjectDisplayName} ${year} ${set} Question Bank`);
  }, [classId, subjectId, year, set, targetFilename]);

  const [parsedResult, setParsedResult] = useState<ParsedPaperResult | null>(null);

  const [savedPapers, setSavedPapers] = useState<QuestionPaper[]>([]);

  const [pushHistory, setPushHistory] = useState<
    Array<{
      id: string;
      filename: string;
      commitSha: string;
      message: string;
      timestamp: string;
      questionsCount: number;
      title: string;
    }>
  >([]);

  const handleParse = () => {
    const className = classId === 'class-12' ? 'Class 12' : classId === 'class-10' ? 'Class 10' : classId;
    const matchedSub = ALL_SUBJECTS.find((s) => s.id === subjectId);
    const subjectName = matchedSub ? matchedSub.name : getSubjectDisplayName(subjectId);

    const result = parseExamContent(rawCombinedText, rawAnswersText, {
      classId,
      className,
      subjectId,
      subjectName,
      board,
      year,
      set,
    });

    if (result.subjectId && result.subjectId !== subjectId) {
      setSubjectId(result.subjectId);
    }

    setParsedResult(result);
  };

  // Auto re-parse on input text or metadata changes so JSON Generator & Review tabs are always fresh
  useEffect(() => {
    if (!rawCombinedText.trim()) {
      setParsedResult(null);
      return;
    }
    const timer = setTimeout(() => {
      handleParse();
    }, 200);
    return () => clearTimeout(timer);
  }, [rawCombinedText, rawAnswersText, classId, subjectId, board, year, set]);

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
      id: `q-${Date.now()}`,
      sectionId,
      sectionName: isMCQ
        ? 'खण्ड–अ : वस्तुनिष्ठ प्रश्न'
        : isShort
        ? 'खण्ड–ब : लघु उत्तरीय प्रश्न'
        : 'खण्ड–स : दीर्घ उत्तरीय प्रश्न',
      questionNumber: nextQNum,
      type: isMCQ ? 'mcq' : isShort ? 'short' : 'long',
      text: `नया प्रश्न ${nextQNum}`,
      textHindi: `नया प्रश्न ${nextQNum}`,
      options: isMCQ
        ? [
            { id: `opt-${nextQNum}-a`, key: 'A', text: 'विकल्प A', textHindi: 'विकल्प A' },
            { id: `opt-${nextQNum}-b`, key: 'B', text: 'विकल्प B', textHindi: 'विकल्प B' },
            { id: `opt-${nextQNum}-c`, key: 'C', text: 'विकल्प C', textHindi: 'विकल्प C' },
            { id: `opt-${nextQNum}-d`, key: 'D', text: 'विकल्प D', textHindi: 'विकल्प D' },
          ]
        : undefined,
      correctAnswer: isMCQ ? 'A' : undefined,
      marks: isMCQ ? 1 : isShort ? 2 : 5,
    };

    const newQuestions = [...parsedResult.questions, newQ];
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

  const handlePushToGitHub = async () => {
    if (!parsedResult) return null;

    const payload = {
      filename: customTargetFilename,
      jsonContent: {
        schemaVersion: '2.0',
        paper: {
          id: parsedResult.paperId,
          title: parsedResult.title,
          classId: parsedResult.classId,
          subjectId: parsedResult.subjectId,
          board: parsedResult.board,
          year: parsedResult.year,
          set: parsedResult.set,
          durationMinutes: parsedResult.durationMinutes,
          totalMarks: parsedResult.totalMarks,
          totalQuestions: parsedResult.stats.totalQuestions,
          status: 'ready',
        },
        sections: parsedResult.sections,
        stats: parsedResult.stats,
        questions: parsedResult.questions,
      },
      commitMessage,
      branch,
      githubToken,
      repoOwner,
      repoName,
    };

    const res = await fetch('/api/publish/github-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      const newHistoryItem = {
        id: `push-${Date.now()}`,
        filename: customTargetFilename,
        commitSha: data.commitSha || 'latest',
        message: commitMessage,
        timestamp: new Date().toISOString(),
        questionsCount: parsedResult.stats.totalQuestions,
        title: parsedResult.title,
      };
      setPushHistory([newHistoryItem, ...pushHistory]);

      const existsIdx = savedPapers.findIndex((p) => p.id === parsedResult.paperId);
      const updatedPaper: QuestionPaper = {
        id: parsedResult.paperId,
        classId: parsedResult.classId,
        subjectId: parsedResult.subjectId,
        title: parsedResult.title,
        year: parsedResult.year,
        set: parsedResult.set,
        durationMinutes: parsedResult.durationMinutes,
        totalMarks: parsedResult.totalMarks,
        totalQuestions: parsedResult.stats.totalQuestions,
        status: 'published',
        questions: parsedResult.questions as any,
        githubSourceFile: customTargetFilename,
        isAvailableOnGithub: true,
        updatedAt: new Date().toISOString(),
      };

      if (existsIdx >= 0) {
        const updatedList = [...savedPapers];
        updatedList[existsIdx] = updatedPaper;
        setSavedPapers(updatedList);
      } else {
        setSavedPapers([updatedPaper, ...savedPapers]);
      }
    }
    return data;
  };

  const handleSelectPaperToEdit = (paper: QuestionPaper) => {
    setClassId(paper.classId);
    setSubjectId(paper.subjectId);
    setYear(paper.year);
    if (paper.set) setSet(paper.set);

    const questions: ParsedQuestion[] = paper.questions.map((q) => ({
      id: q.id,
      sectionId: q.type === 'mcq' ? 'sec-a' : q.type === 'short' ? 'sec-b' : 'sec-c',
      sectionName: q.type === 'mcq' ? 'खण्ड–अ : वस्तुनिष्ठ प्रश्न' : q.type === 'short' ? 'खण्ड–ब : लघु उत्तरीय' : 'खण्ड–स : दीर्घ उत्तरीय',
      questionNumber: q.questionNumber,
      type: q.type === 'mcq' ? 'mcq' : q.type === 'short' ? 'short' : 'long',
      text: q.text,
      textHindi: q.textHindi,
      options: q.options?.map((o) => ({ id: o.id, key: o.key, text: o.text, textHindi: o.textHindi })),
      correctAnswer: q.correctAnswer,
      modelAnswer: q.explanation || q.aiAnswer,
      modelAnswerHindi: q.explanationHindi,
      marks: q.marks,
      chapter: q.chapterId,
    }));

    const mcqCount = questions.filter((q) => q.type === 'mcq').length;
    const shortCount = questions.filter((q) => q.type === 'short').length;
    const longCount = questions.filter((q) => q.type === 'long').length;

    setParsedResult({
      paperId: paper.id,
      title: paper.title,
      classId: paper.classId,
      className: paper.classId === 'class-12' ? 'Class 12' : paper.classId,
      subjectId: paper.subjectId,
      subjectName: paper.subjectId.toUpperCase(),
      board: 'Bihar Board (BSEB)',
      year: paper.year,
      set: paper.set || 'Set A',
      durationMinutes: paper.durationMinutes || 195,
      totalMarks: paper.totalMarks || 70,
      sections: [
        { id: 'sec-a', name: 'खण्ड–अ : वस्तुनिष्ठ प्रश्न (Objective Type)', totalQuestions: mcqCount, marksPerQuestion: 1 },
        { id: 'sec-b', name: 'खण्ड–ब : लघु उत्तरीय प्रश्न (Short Answer)', totalQuestions: shortCount, marksPerQuestion: 2 },
        { id: 'sec-c', name: 'खण्ड–स : दीर्घ उत्तरीय प्रश्न (Long Answer)', totalQuestions: longCount, marksPerQuestion: 5 },
      ],
      questions,
      stats: {
        totalQuestions: questions.length,
        mcqCount,
        shortCount,
        longCount,
        answeredCount: questions.filter((q) => q.correctAnswer || q.modelAnswer).length,
      },
    });

    setActiveTab('review');
  };

  // ==========================================
  // 2. SYLLABUS UPLOAD & GITHUB ENGINE STATE
  // ==========================================
  type STabType = 'paste' | 'review' | 'json' | 'push' | 'saved';
  const [syllabusTab, setSyllabusTab] = useState<STabType>('paste');

  const [sClassId, setSClassId] = useState<string>('class-12');
  const [sSubjectId, setSSubjectId] = useState<string>('biology');
  const [sBoard, setSBoard] = useState<string>('Bihar Board (BSEB)');
  const [sAcademicYear, setSAcademicYear] = useState<string>('2025-2026');
  const [sStream, setSStream] = useState<string>('Science (PCB / PCM)');

  const [rawSyllabusText, setRawSyllabusText] = useState<string>('');

  const cleanSSubject = sSubjectId.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cleanSClass = sClassId.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cleanSYear = sAcademicYear.replace(/[^0-9]/g, '');
  const syllabusTargetFilename = `data/syllabus/${cleanSClass}_${cleanSSubject}_syllabus_${cleanSYear}.json`;

  const [customSyllabusFilename, setCustomSyllabusFilename] = useState<string>(syllabusTargetFilename);
  const [sBranch, setSBranch] = useState<string>('main');
  const [sCommitMessage, setSCommitMessage] = useState<string>(
    `feat: Add Class 12 ${getSubjectDisplayName(sSubjectId)} Complete Syllabus & Chapter Tree (${sAcademicYear})`
  );

  useEffect(() => {
    setCustomSyllabusFilename(syllabusTargetFilename);
    const subName = getSubjectDisplayName(sSubjectId);
    const clsName = sClassId === 'class-12' ? 'Class 12' : sClassId.toUpperCase();
    setSCommitMessage(`feat: Add ${clsName} ${subName} Complete Syllabus (${sAcademicYear})`);
  }, [sClassId, sSubjectId, sAcademicYear, syllabusTargetFilename]);

  // Parsed Syllabus State
  const [parsedSyllabusResult, setParsedSyllabusResult] = useState<ParsedSyllabusResult | null>(null);

  // Saved Syllabi List
  const [savedSyllabi, setSavedSyllabi] = useState<SavedSyllabusItem[]>([]);

  const [syllabusPushHistory, setSyllabusPushHistory] = useState<
    Array<{
      id: string;
      filename: string;
      commitSha: string;
      message: string;
      timestamp: string;
      chaptersCount: number;
      title: string;
    }>
  >([]);

  const handleParseSyllabus = () => {
    const className = sClassId === 'class-12' ? 'Class 12' : sClassId === 'class-10' ? 'Class 10' : sClassId;
    const subjectNames: Record<string, string> = {
      biology: 'Biology (जीव विज्ञान)',
      chemistry: 'Chemistry (रसायन विज्ञान)',
      physics: 'Physics (भौतिक विज्ञान)',
      mathematics: 'Mathematics (गणित)',
      hindi: 'Hindi (हिंदी)',
      english: 'English (अंग्रेज़ी)',
      science: 'Science (विज्ञान)',
    };
    const subjectName = subjectNames[sSubjectId] || sSubjectId;

    const result = parseSyllabusContent(rawSyllabusText, {
      classId: sClassId,
      className,
      subjectId: sSubjectId,
      subjectName,
      board: sBoard,
      academicYear: sAcademicYear,
      stream: sStream,
      totalMarks: 70,
    });
    setParsedSyllabusResult(result);
  };

  const handleUpdateSyllabusChapter = (updatedChapter: ParsedSyllabusChapter) => {
    if (!parsedSyllabusResult) return;
    const newChapters = parsedSyllabusResult.chapters.map((c) =>
      c.id === updatedChapter.id ? updatedChapter : c
    );
    let totalTopics = 0;
    let totalMarks = 0;
    newChapters.forEach((ch) => {
      totalTopics += ch.topics.length;
      if (ch.marksWeightage) totalMarks += ch.marksWeightage;
    });

    setParsedSyllabusResult({
      ...parsedSyllabusResult,
      chapters: newChapters,
      stats: {
        ...parsedSyllabusResult.stats,
        totalChapters: newChapters.length,
        totalTopics,
        totalMarks: totalMarks > 0 ? totalMarks : parsedSyllabusResult.totalMarks,
      },
    });
  };

  const handleDeleteSyllabusChapter = (chapterId: string) => {
    if (!parsedSyllabusResult) return;
    const newChapters = parsedSyllabusResult.chapters
      .filter((c) => c.id !== chapterId)
      .map((c, idx) => ({ ...c, chapterNumber: idx + 1 }));

    let totalTopics = 0;
    newChapters.forEach((ch) => {
      totalTopics += ch.topics.length;
    });

    setParsedSyllabusResult({
      ...parsedSyllabusResult,
      chapters: newChapters,
      stats: {
        ...parsedSyllabusResult.stats,
        totalChapters: newChapters.length,
        totalTopics,
      },
    });
  };

  const handleAddSyllabusChapter = () => {
    if (!parsedSyllabusResult) return;
    const nextChapNum = parsedSyllabusResult.chapters.length + 1;
    const newChapter: ParsedSyllabusChapter = {
      id: `chap-${sSubjectId}-${nextChapNum}-${Date.now()}`,
      chapterNumber: nextChapNum,
      title: `New Chapter ${nextChapNum}`,
      hindiTitle: `नया अध्याय ${nextChapNum}`,
      marksWeightage: 4,
      topics: [
        {
          id: `top-${nextChapNum}-1`,
          topicNumber: `${nextChapNum}.1`,
          title: 'Introduction & Core Concepts',
          hindiTitle: 'परिचय एवं मुख्य अवधारणाएं',
          completed: false,
          order: 1,
        },
      ],
    };

    const newChapters = [...parsedSyllabusResult.chapters, newChapter];
    let totalTopics = 0;
    newChapters.forEach((ch) => {
      totalTopics += ch.topics.length;
    });

    setParsedSyllabusResult({
      ...parsedSyllabusResult,
      chapters: newChapters,
      stats: {
        ...parsedSyllabusResult.stats,
        totalChapters: newChapters.length,
        totalTopics,
      },
    });
  };

  const handlePushSyllabusToGitHub = async () => {
    if (!parsedSyllabusResult) return null;

    const payload = {
      filename: customSyllabusFilename,
      jsonContent: {
        schemaVersion: '2.0',
        contentType: 'syllabus',
        generatedAt: new Date().toISOString(),
        syllabus: {
          id: parsedSyllabusResult.syllabusId,
          title: parsedSyllabusResult.title,
          classId: parsedSyllabusResult.classId,
          className: parsedSyllabusResult.className,
          subjectId: parsedSyllabusResult.subjectId,
          subjectName: parsedSyllabusResult.subjectName,
          board: parsedSyllabusResult.board,
          academicYear: parsedSyllabusResult.academicYear,
          stream: parsedSyllabusResult.stream,
          totalMarks: parsedSyllabusResult.totalMarks,
          totalUnits: parsedSyllabusResult.stats.totalUnits,
          totalChapters: parsedSyllabusResult.stats.totalChapters,
          totalTopics: parsedSyllabusResult.stats.totalTopics,
        },
        units: parsedSyllabusResult.units,
        chapters: parsedSyllabusResult.chapters,
      },
      commitMessage: sCommitMessage,
      branch: sBranch,
      githubToken,
      repoOwner,
      repoName,
    };

    const res = await fetch('/api/publish/github-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      const newHistoryItem = {
        id: `s-push-${Date.now()}`,
        filename: customSyllabusFilename,
        commitSha: data.commitSha || 'latest',
        message: sCommitMessage,
        timestamp: new Date().toISOString(),
        chaptersCount: parsedSyllabusResult.stats.totalChapters,
        title: parsedSyllabusResult.title,
      };
      setSyllabusPushHistory([newHistoryItem, ...syllabusPushHistory]);

      const existsIdx = savedSyllabi.findIndex((s) => s.id === parsedSyllabusResult.syllabusId);
      const updatedSyllabusItem: SavedSyllabusItem = {
        id: parsedSyllabusResult.syllabusId,
        title: parsedSyllabusResult.title,
        classId: parsedSyllabusResult.classId,
        className: parsedSyllabusResult.className,
        subjectId: parsedSyllabusResult.subjectId,
        subjectName: parsedSyllabusResult.subjectName,
        board: parsedSyllabusResult.board,
        academicYear: parsedSyllabusResult.academicYear,
        stream: parsedSyllabusResult.stream,
        totalChapters: parsedSyllabusResult.stats.totalChapters,
        totalTopics: parsedSyllabusResult.stats.totalTopics,
        totalMarks: parsedSyllabusResult.totalMarks,
        githubPath: customSyllabusFilename,
        lastUpdated: new Date().toISOString(),
      };

      if (existsIdx >= 0) {
        const updatedList = [...savedSyllabi];
        updatedList[existsIdx] = updatedSyllabusItem;
        setSavedSyllabi(updatedList);
      } else {
        setSavedSyllabi([updatedSyllabusItem, ...savedSyllabi]);
      }
    }
    return data;
  };

  const handleSelectSavedSyllabus = (item: SavedSyllabusItem) => {
    setSClassId(item.classId);
    setSSubjectId(item.subjectId);
    setSBoard(item.board);
    setSAcademicYear(item.academicYear);
    if (item.stream) setSStream(item.stream);
    setSyllabusTab('review');
  };

  const handleJumpToPush = () => {
    if (activeEngine === 'questions') {
      setActiveTab('push');
    } else if (activeEngine === 'syllabus') {
      setSyllabusTab('push');
    }
  };

  const handleAutoRouteText = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('unit') || lower.includes('chapter') || lower.includes('topics') || lower.includes('syllabus')) {
      setRawSyllabusText(text);
      const meta = {
        classId: sClassId,
        className: 'Class 12',
        subjectId: sSubjectId,
        subjectName: 'Biology',
        board: sBoard,
        academicYear: sAcademicYear
      };
      const res = parseSyllabusContent(text, meta);
      setParsedSyllabusResult(res);
      setActiveEngine('syllabus');
      setSyllabusTab('review');
    } else if (lower.includes('q.') || lower.includes('mcq') || lower.includes('option') || lower.includes('ans:')) {
      setRawCombinedText(text);
      const res = parseExamContent(text, '');
      setParsedResult(res);
      setActiveEngine('questions');
      setActiveTab('review');
    } else {
      setActiveEngine('notes');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-20 md:pb-6">
      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeEngine={activeEngine}
        setActiveEngine={setActiveEngine}
        onOpenSettings={() => setIsSettingsOpen(true)}
        githubToken={githubToken}
        repoOwner={repoOwner}
        repoName={repoName}
        savedBanksCount={savedPapers.length}
        savedSyllabiCount={savedSyllabi.length}
      />

      {/* Glassmorphic Mobile/Desktop Settings Modal */}
      <MobileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        repoOwner={repoOwner}
        setRepoOwner={setRepoOwner}
        repoName={repoName}
        setRepoName={setRepoName}
      />

      {/* Clean Glassmorphic Top Navbar */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Drawer Toggle & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs transition-all cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-indigo-600" />
            </button>

            <div
              onClick={() => setActiveEngine('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4.5 h-4.5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-slate-900">ABHYAAS</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                    Glass Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden sm:block font-medium">Question Banks, Syllabus & Notes Engine</p>
              </div>
            </div>
          </div>

          {/* Center: Clean Engine Navigation Pills */}
          <div className="hidden md:flex items-center p-1 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setActiveEngine('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEngine === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveEngine('questions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEngine === 'questions'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Q&A Bank</span>
            </button>

            <button
              onClick={() => setActiveEngine('syllabus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEngine === 'syllabus'
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Syllabus</span>
            </button>

            <button
              onClick={() => setActiveEngine('notes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEngine === 'notes'
                  ? 'bg-amber-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
          </div>

          {/* Right: GitHub Config Badge & Settings Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono shadow-xs transition-all border border-slate-700 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline text-[11px] truncate max-w-[130px] font-bold">
                {repoOwner}/{repoName}
              </span>
              <Settings className="w-3 h-3 text-slate-300 ml-0.5" />
            </button>
          </div>

        </div>

        {/* Workflow Steps Sub-Navbar */}
        {activeEngine !== 'dashboard' && (
          <div className="bg-white/60 backdrop-blur-md border-t border-slate-200/60 overflow-x-auto no-scrollbar">
            <div className="max-w-6xl mx-auto px-3 sm:px-6">
              {activeEngine === 'questions' ? (
                /* Questions Tab Navigation */
                <nav className="flex items-center gap-1.5 py-2 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('paste')}
                    id="tab-paste"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'paste'
                        ? 'glass-btn-indigo text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>1. Paste & Parse</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('review')}
                    id="tab-review"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'review'
                        ? 'glass-btn-indigo text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>2. Review Qs ({parsedResult?.stats.totalQuestions || 0})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('json')}
                    id="tab-json"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'json'
                        ? 'glass-btn-indigo text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>3. JSON Generator</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('push')}
                    id="tab-push"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'push'
                        ? 'glass-btn-indigo text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>4. Push to GitHub</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('saved')}
                    id="tab-saved"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'saved'
                        ? 'glass-btn-indigo text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Available Banks ({savedPapers.length})</span>
                  </button>
                </nav>
              ) : activeEngine === 'syllabus' ? (
                /* Syllabus Tab Navigation */
                <nav className="flex items-center gap-1.5 py-2 text-xs font-bold">
                  <button
                    onClick={() => setSyllabusTab('paste')}
                    id="tab-s-paste"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      syllabusTab === 'paste'
                        ? 'glass-btn-emerald text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>1. Paste Syllabus</span>
                  </button>

                  <button
                    onClick={() => setSyllabusTab('review')}
                    id="tab-s-review"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      syllabusTab === 'review'
                        ? 'glass-btn-emerald text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>2. Review Chapters ({parsedSyllabusResult?.stats.totalChapters || 0})</span>
                  </button>

                  <button
                    onClick={() => setSyllabusTab('json')}
                    id="tab-s-json"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      syllabusTab === 'json'
                        ? 'glass-btn-emerald text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>3. Syllabus JSON</span>
                  </button>

                  <button
                    onClick={() => setSyllabusTab('push')}
                    id="tab-s-push"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      syllabusTab === 'push'
                        ? 'glass-btn-emerald text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>4. Push to GitHub</span>
                  </button>

                  <button
                    onClick={() => setSyllabusTab('saved')}
                    id="tab-s-saved"
                    className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      syllabusTab === 'saved'
                        ? 'glass-btn-emerald text-white font-black'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Available Syllabi ({savedSyllabi.length})</span>
                  </button>
                </nav>
              ) : null}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {activeEngine === 'dashboard' ? (
          /* =======================================================
             CENTRAL OVERVIEW DASHBOARD
             ======================================================= */
          <DashboardView
            onSelectEngine={setActiveEngine}
            onOpenSettings={() => setIsSettingsOpen(true)}
            savedBanksCount={savedPapers.length}
            savedSyllabiCount={savedSyllabi.length}
            githubToken={githubToken}
            repoOwner={repoOwner}
            repoName={repoName}
            onAutoRouteText={handleAutoRouteText}
            activeSubjectId={subjectId}
            setActiveSubjectId={setSubjectId}
          />
        ) : activeEngine === 'questions' ? (
          /* =======================================================
             QUESTION PAPERS CONVERTER WORKFLOW
             ======================================================= */
          <>
            <ExamMetaHeader
              classId={classId}
              setClassId={setClassId}
              subjectId={subjectId}
              setSubjectId={setSubjectId}
              board={board}
              setBoard={setBoard}
              year={year}
              setYear={setYear}
              set={set}
              setSet={setSet}
              totalQuestionsCount={parsedResult?.stats.totalQuestions || 0}
              targetFilename={customTargetFilename}
            />

            {activeTab === 'paste' && (
              <PasteAndParseView
                rawCombinedText={rawCombinedText}
                setRawCombinedText={setRawCombinedText}
                rawAnswersText={rawAnswersText}
                setRawAnswersText={setRawAnswersText}
                parsedResult={parsedResult}
                onParse={handleParse}
                onNavigateToReview={() => setActiveTab('review')}
                onNavigateToJson={() => setActiveTab('json')}
              />
            )}

            {activeTab === 'review' && parsedResult && (
              <ReviewQuestionsView
                parsedResult={parsedResult}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onAddQuestion={handleAddQuestion}
                onNavigateToJson={() => setActiveTab('json')}
                onNavigateToPush={() => setActiveTab('push')}
              />
            )}

            {activeTab === 'json' && parsedResult && (
              <JsonGeneratorView
                parsedResult={parsedResult}
                targetFilename={customTargetFilename}
                onNavigateToPush={() => setActiveTab('push')}
              />
            )}

            {activeTab === 'push' && parsedResult && (
              <GitHubPushView
                parsedResult={parsedResult}
                targetFilename={customTargetFilename}
                setTargetFilename={setCustomTargetFilename}
                branch={branch}
                setBranch={setBranch}
                commitMessage={commitMessage}
                setCommitMessage={setCommitMessage}
                githubToken={githubToken}
                setGithubToken={setGithubToken}
                repoOwner={repoOwner}
                setRepoOwner={setRepoOwner}
                repoName={repoName}
                setRepoName={setRepoName}
                onPushToGitHub={handlePushToGitHub}
                pushHistory={pushHistory}
                onNavigateBack={() => setActiveTab('json')}
              />
            )}

            {activeTab === 'saved' && (
              <SavedBanksView
                papers={savedPapers}
                onSelectPaperToEdit={handleSelectPaperToEdit}
              />
            )}
          </>
        ) : activeEngine === 'syllabus' ? (
          /* =======================================================
             SYLLABUS UPLOAD & GITHUB ENGINE WORKFLOW
             ======================================================= */
          <>
            <SyllabusMetaHeader
              classId={sClassId}
              setClassId={setSClassId}
              subjectId={sSubjectId}
              setSubjectId={setSSubjectId}
              board={sBoard}
              setBoard={setSBoard}
              academicYear={sAcademicYear}
              setAcademicYear={setSAcademicYear}
              stream={sStream}
              setStream={setSStream}
              totalChaptersCount={parsedSyllabusResult?.stats.totalChapters || 0}
              totalTopicsCount={parsedSyllabusResult?.stats.totalTopics || 0}
              totalUnitsCount={parsedSyllabusResult?.stats.totalUnits || 0}
              targetFilename={customSyllabusFilename}
            />

            {syllabusTab === 'paste' && (
              <PasteAndParseSyllabusView
                rawSyllabusText={rawSyllabusText}
                setRawSyllabusText={setRawSyllabusText}
                parsedResult={parsedSyllabusResult}
                onParse={handleParseSyllabus}
                onNavigateToReview={() => setSyllabusTab('review')}
                onNavigateToJson={() => setSyllabusTab('json')}
              />
            )}

            {syllabusTab === 'review' && parsedSyllabusResult && (
              <ReviewSyllabusView
                parsedResult={parsedSyllabusResult}
                onUpdateChapter={handleUpdateSyllabusChapter}
                onDeleteChapter={handleDeleteSyllabusChapter}
                onAddChapter={handleAddSyllabusChapter}
                onNavigateToJson={() => setSyllabusTab('json')}
                onNavigateToPush={() => setSyllabusTab('push')}
              />
            )}

            {syllabusTab === 'json' && parsedSyllabusResult && (
              <JsonGeneratorSyllabusView
                parsedResult={parsedSyllabusResult}
                targetFilename={customSyllabusFilename}
                onNavigateToPush={() => setSyllabusTab('push')}
              />
            )}

            {syllabusTab === 'push' && parsedSyllabusResult && (
              <GitHubPushSyllabusView
                parsedResult={parsedSyllabusResult}
                targetFilename={customSyllabusFilename}
                setTargetFilename={setCustomSyllabusFilename}
                branch={sBranch}
                setBranch={setBranch}
                commitMessage={sCommitMessage}
                setCommitMessage={setSCommitMessage}
                githubToken={githubToken}
                setGithubToken={setGithubToken}
                repoOwner={repoOwner}
                setRepoOwner={setRepoOwner}
                repoName={repoName}
                setRepoName={setRepoName}
                onPushToGitHub={handlePushSyllabusToGitHub}
                pushHistory={syllabusPushHistory}
                onNavigateBack={() => setSyllabusTab('json')}
              />
            )}

            {syllabusTab === 'saved' && (
              <SavedSyllabiView
                syllabiList={savedSyllabi}
                onSelectSyllabus={handleSelectSavedSyllabus}
              />
            )}
          </>
        ) : (
          /* =======================================================
             NOTES UPLOAD & GITHUB ENGINE WORKFLOW
             ======================================================= */
          <NotesEngineView
            githubToken={githubToken}
            setGithubToken={setGithubToken}
            repoOwner={repoOwner}
            setRepoOwner={setRepoOwner}
            repoName={repoName}
            setRepoName={setRepoName}
            branch={branch}
            setBranch={setBranch}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav
        activeEngine={activeEngine}
        setActiveEngine={setActiveEngine}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onJumpToPush={handleJumpToPush}
      />

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-md text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Abhyaas Question Bank, Syllabus & Notes Pipeline • Class 9–12 State & CBSE Boards</span>
          <span className="font-mono text-[11px] text-slate-400">Standard Schema v2.0 • Real-time GitHub Synchronization</span>
        </div>
      </footer>
    </div>
  );

}
