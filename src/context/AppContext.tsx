import React, { createContext, useContext, useState, useEffect } from 'react';
import { pushFileToGitHub } from '../utils/githubService';
import {
  NavTab,
  ClassItem,
  SubjectItem,
  QuestionPaper,
  Question,
  Chapter,
  Note,
  PublishRelease,
  ActivityItem,
  AIBatchJob,
  QuestionStatus,
  DevicePreviewMode
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_PAPERS,
  INITIAL_CHAPTERS,
  INITIAL_NOTES,
  INITIAL_RELEASES,
  INITIAL_ACTIVITIES,
} from '../data/initialData';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  classes: ClassItem[];
  subjects: SubjectItem[];
  papers: QuestionPaper[];
  chapters: Chapter[];
  notes: Note[];
  releases: PublishRelease[];
  activities: ActivityItem[];
  selectedPaperId: string;
  setSelectedPaperId: (id: string) => void;
  selectedQuestionIndex: number;
  setSelectedQuestionIndex: (idx: number) => void;
  selectedReviewQIndex: number;
  setSelectedReviewQIndex: (idx: number) => void;
  isMoreMenuOpen: boolean;
  setIsMoreMenuOpen: (open: boolean) => void;
  isPaletteOpen: boolean;
  setIsPaletteOpen: (open: boolean) => void;
  devicePreview: DevicePreviewMode['id'];
  setDevicePreview: (mode: DevicePreviewMode['id']) => void;
  aiBatchJob: AIBatchJob | null;
  isGeneratingBatch: boolean;
  hasGeminiKey: boolean;
  
  // Navigation helpers
  goToQuestionEditor: (paperId: string, questionIndex?: number) => void;
  goToAnswerReview: (paperId: string, questionIndex?: number) => void;
  goToAIGeneration: (paperId: string) => void;
  
  // CRUD actions
  saveQuestion: (question: Question) => void;
  addQuestion: (paperId: string) => void;
  deleteQuestion: (paperId: string, questionId: string) => void;
  updateQuestionStatus: (paperId: string, questionId: string, status: QuestionStatus, aiAnswer?: string) => void;
  savePaper: (paper: Partial<QuestionPaper>) => void;
  deletePaper: (paperId: string) => void;
  saveChapter: (chapter: Chapter) => void;
  addTopicToChapter: (chapterId: string, title: string, hindiTitle?: string) => void;
  toggleTopicComplete: (chapterId: string, topicId: string) => void;
  moveChapter: (chapterId: string, direction: 'up' | 'down') => void;
  moveTopic: (chapterId: string, topicId: string, direction: 'up' | 'down') => void;
  saveNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  
  // AI & Publish
  startAIGeneration: (paperId: string) => Promise<void>;
  cancelAIGeneration: () => void;
  regenerateSingleAnswer: (question: Question, customPrompt?: string) => Promise<string>;
  publishToGitHub: (version: number, message: string) => Promise<PublishRelease | null>;
  pushJsonToGitHub: (params: {
    filename: string;
    jsonContent: string | object;
    commitMessage: string;
    branch?: string;
  }) => Promise<any>;
  importJSONData: (importedData: any, contentType: string) => { success: boolean; message: string; count: number };
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'abhyaas_admin_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or initial
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [papers, setPapers] = useState<QuestionPaper[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'papers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter to only available question banks (questions.length > 0)
          const availableOnly = parsed.filter((p: QuestionPaper) => p.questions && p.questions.length > 0);
          if (availableOnly.length > 0) return availableOnly;
        }
      } catch (e) {
        console.error('Failed to parse cached papers:', e);
      }
    }
    return INITIAL_PAPERS;
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'chapters');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [releases, setReleases] = useState<PublishRelease[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'releases');
    return saved ? JSON.parse(saved) : INITIAL_RELEASES;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('paper-bio-2026-a');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedReviewQIndex, setSelectedReviewQIndex] = useState<number>(7); // Q8 (index 7) which is pending review
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [devicePreview, setDevicePreview] = useState<DevicePreviewMode['id']>('fluid');
  const [aiBatchJob, setAiBatchJob] = useState<AIBatchJob | null>(null);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState<boolean>(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'papers', JSON.stringify(papers));
  }, [papers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'chapters', JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'releases', JSON.stringify(releases));
  }, [releases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'activities', JSON.stringify(activities));
  }, [activities]);

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch((err) => console.log('Backend check:', err));
  }, []);

  const addActivity = (title: string, subtitle: string, type: ActivityItem['type'], status?: ActivityItem['status']) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      subtitle,
      timestamp: 'Just now',
      type,
      status: status || 'info',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 15)]);
  };

  const goToQuestionEditor = (paperId: string, questionIndex = 0) => {
    setSelectedPaperId(paperId);
    setSelectedQuestionIndex(questionIndex);
    setActiveTab('editor');
    setIsMoreMenuOpen(false);
  };

  const goToAnswerReview = (paperId: string, questionIndex = 0) => {
    setSelectedPaperId(paperId);
    setSelectedReviewQIndex(questionIndex);
    setActiveTab('review');
    setIsMoreMenuOpen(false);
  };

  const goToAIGeneration = (paperId: string) => {
    setSelectedPaperId(paperId);
    setActiveTab('ai');
    setIsMoreMenuOpen(false);
  };

  const saveQuestion = (updatedQ: Question) => {
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id !== updatedQ.paperId) return p;
        const exists = p.questions.some((q) => q.id === updatedQ.id);
        const newQuestions = exists
          ? p.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q))
          : [...p.questions, updatedQ];
        return {
          ...p,
          questions: newQuestions,
          totalQuestions: newQuestions.length,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addActivity('Question Saved', `Q${updatedQ.questionNumber} (${updatedQ.type.toUpperCase()}) updated`, 'paper', 'success');
  };

  const addQuestion = (paperId: string) => {
    const targetPaper = papers.find((p) => p.id === paperId);
    const nextNumber = targetPaper ? targetPaper.questions.length + 1 : 1;
    const newQ: Question = {
      id: `q-${paperId}-${Date.now()}`,
      paperId,
      questionNumber: nextNumber,
      type: 'mcq',
      text: '',
      textHindi: '',
      options: [
        { id: `opt-1-${Date.now()}`, key: 'A', text: '', textHindi: '' },
        { id: `opt-2-${Date.now()}`, key: 'B', text: '', textHindi: '' },
        { id: `opt-3-${Date.now()}`, key: 'C', text: '', textHindi: '' },
        { id: `opt-4-${Date.now()}`, key: 'D', text: '', textHindi: '' },
      ],
      correctAnswer: 'A',
      explanation: '',
      explanationHindi: '',
      aiAnswer: '',
      aiStatus: 'missing',
      marks: 1,
      negativeMarks: 0,
      difficulty: 'medium',
    };

    setPapers((prev) =>
      prev.map((p) => {
        if (p.id !== paperId) return p;
        return {
          ...p,
          questions: [...p.questions, newQ],
          totalQuestions: p.questions.length + 1,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    setSelectedQuestionIndex(nextNumber - 1);
    addActivity('New Question Added', `Question ${nextNumber} created in ${targetPaper?.title || 'Paper'}`, 'paper');
  };

  const deleteQuestion = (paperId: string, questionId: string) => {
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id !== paperId) return p;
        const filtered = p.questions
          .filter((q) => q.id !== questionId)
          .map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
        return {
          ...p,
          questions: filtered,
          totalQuestions: filtered.length,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateQuestionStatus = (paperId: string, questionId: string, status: QuestionStatus, aiAnswer?: string) => {
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id !== paperId) return p;
        const updatedQuestions = p.questions.map((q) => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            aiStatus: status,
            ...(aiAnswer !== undefined ? { aiAnswer } : {}),
          };
        });
        return {
          ...p,
          questions: updatedQuestions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const savePaper = (paperData: Partial<QuestionPaper>) => {
    if (paperData.id) {
      setPapers((prev) =>
        prev.map((p) => (p.id === paperData.id ? { ...p, ...paperData, updatedAt: new Date().toISOString() } : p))
      );
      addActivity('Paper Updated', `${paperData.title || 'Paper'} updated`, 'paper');
    } else {
      const newId = `paper-${Date.now()}`;
      const newPaper: QuestionPaper = {
        id: newId,
        classId: paperData.classId || 'class-12',
        subjectId: paperData.subjectId || 'sub-bio-12',
        title: paperData.title || 'New Question Paper',
        year: paperData.year || 2026,
        set: paperData.set || 'Set A',
        durationMinutes: paperData.durationMinutes || 195,
        totalMarks: paperData.totalMarks || 70,
        totalQuestions: 0,
        status: 'draft',
        version: 1,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPapers((prev) => [newPaper, ...prev]);
      addActivity('New Paper Created', newPaper.title, 'paper', 'success');
      setSelectedPaperId(newId);
    }
  };

  const deletePaper = (paperId: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== paperId));
    addActivity('Paper Deleted', `Paper removed from database`, 'paper', 'warning');
  };

  const saveChapter = (chapter: Chapter) => {
    setChapters((prev) => {
      const exists = prev.some((c) => c.id === chapter.id);
      if (exists) {
        return prev.map((c) => (c.id === chapter.id ? chapter : c));
      }
      return [...prev, chapter];
    });
    addActivity('Chapter Updated', chapter.title, 'syllabus');
  };

  const addTopicToChapter = (chapterId: string, title: string, hindiTitle?: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id !== chapterId) return c;
        const newTopic = {
          id: `top-${Date.now()}`,
          title,
          hindiTitle,
          completed: false,
          order: c.topics.length + 1,
        };
        return {
          ...c,
          topics: [...c.topics, newTopic],
        };
      })
    );
  };

  const toggleTopicComplete = (chapterId: string, topicId: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id !== chapterId) return c;
        return {
          ...c,
          topics: c.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t)),
        };
      })
    );
  };

  const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
    setChapters((prev) => {
      const idx = prev.findIndex((c) => c.id === chapterId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy.map((c, i) => ({ ...c, chapterNumber: i + 1 }));
    });
  };

  const moveTopic = (chapterId: string, topicId: string, direction: 'up' | 'down') => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id !== chapterId) return c;
        const idx = c.topics.findIndex((t) => t.id === topicId);
        if (idx === -1) return c;
        if (direction === 'up' && idx === 0) return c;
        if (direction === 'down' && idx === c.topics.length - 1) return c;

        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        const topicsCopy = [...c.topics];
        const temp = topicsCopy[idx];
        topicsCopy[idx] = topicsCopy[targetIdx];
        topicsCopy[targetIdx] = temp;
        return {
          ...c,
          topics: topicsCopy.map((t, i) => ({ ...t, order: i + 1 })),
        };
      })
    );
  };

  const saveNote = (note: Note) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n));
      }
      return [{ ...note, updatedAt: new Date().toISOString() }, ...prev];
    });
    addActivity('Note Saved', note.title, 'note', 'success');
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    addActivity('Note Deleted', 'Note removed', 'note', 'warning');
  };

  // AI Generation with Batch processing
  const startAIGeneration = async (paperId: string) => {
    const targetPaper = papers.find((p) => p.id === paperId);
    if (!targetPaper) return;

    const ungeneratedOrReview = targetPaper.questions.filter(
      (q) => q.aiStatus === 'missing' || q.aiStatus === 'review'
    );
    const questionsToProcess = ungeneratedOrReview.length > 0 ? ungeneratedOrReview : targetPaper.questions;

    if (questionsToProcess.length === 0) return;

    setIsGeneratingBatch(true);
    const batchSize = 10;
    const totalBatches = Math.ceil(questionsToProcess.length / batchSize);

    const initialJob: AIBatchJob = {
      paperId,
      paperTitle: targetPaper.title,
      totalQuestions: questionsToProcess.length,
      totalBatches,
      currentBatch: 1,
      startQ: 1,
      endQ: Math.min(batchSize, questionsToProcess.length),
      progress: 5,
      isGenerating: true,
      log: [`Starting AI answer generation for ${questionsToProcess.length} questions...`],
    };

    setAiBatchJob(initialJob);

    // Process batches sequentially
    for (let b = 0; b < totalBatches; b++) {
      const start = b * batchSize;
      const end = Math.min(start + batchSize, questionsToProcess.length);
      const batchQuestions = questionsToProcess.slice(start, end);

      setAiBatchJob((prev) =>
        prev
          ? {
              ...prev,
              currentBatch: b + 1,
              startQ: start + 1,
              endQ: end,
              progress: Math.round(((b + 0.3) / totalBatches) * 100),
              log: [...prev.log, `Batch ${b + 1} of ${totalBatches}: Processing questions ${start + 1} to ${end}...`],
            }
          : null
      );

      try {
        const response = await fetch('/api/gemini/generate-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questions: batchQuestions,
            batchIndex: b + 1,
            totalBatches,
            startQ: start + 1,
            endQ: end,
          }),
        });

        const data = await response.json();
        if (data && data.results) {
          // Update questions in paper
          setPapers((prevPapers) =>
            prevPapers.map((p) => {
              if (p.id !== paperId) return p;
              const updated = p.questions.map((q) => {
                const match = data.results.find((r: any) => r.id === q.id);
                if (match) {
                  return {
                    ...q,
                    aiAnswer: match.aiAnswer,
                    aiStatus: 'generated' as QuestionStatus,
                  };
                }
                return q;
              });
              return { ...p, questions: updated, updatedAt: new Date().toISOString() };
            })
          );
        }
      } catch (err: any) {
        console.error('Batch error:', err);
      }

      setAiBatchJob((prev) =>
        prev
          ? {
              ...prev,
              progress: Math.round(((b + 1) / totalBatches) * 100),
              log: [...prev.log, `Batch ${b + 1} completed. ${end} / ${questionsToProcess.length} answers ready.`],
            }
          : null
      );

      // Brief delay between batches
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsGeneratingBatch(false);
    setAiBatchJob((prev) =>
      prev
        ? {
            ...prev,
            isGenerating: false,
            progress: 100,
            log: [...prev.log, `All ${questionsToProcess.length} questions processed successfully! Ready for review.`],
          }
        : null
    );

    addActivity('AI Generation Completed', `${targetPaper.title} (${questionsToProcess.length} questions)`, 'ai', 'success');
  };

  const cancelAIGeneration = () => {
    setIsGeneratingBatch(false);
    setAiBatchJob((prev) => (prev ? { ...prev, isGenerating: false, log: [...prev.log, 'Batch generation paused by user.'] } : null));
  };

  const regenerateSingleAnswer = async (question: Question, customPrompt?: string): Promise<string> => {
    try {
      const targetChapter = chapters.find((c) => c.id === question.chapterId);
      const res = await fetch('/api/gemini/generate-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.text,
          questionTextHindi: question.textHindi,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          chapterName: targetChapter?.title,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (data && data.answer) {
        updateQuestionStatus(question.paperId, question.id, 'generated', data.answer);
        return data.answer;
      }
      return 'Failed to regenerate answer';
    } catch (err) {
      console.error('Regenerate error:', err);
      return 'Network error regenerating answer';
    }
  };

  const publishToGitHub = async (version: number, message: string): Promise<PublishRelease | null> => {
    try {
      const totalQuestionsCount = papers.reduce((sum, p) => sum + p.questions.length, 0);
      const res = await fetch('/api/publish/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version,
          message,
          papersCount: papers.length,
          questionsCount: totalQuestionsCount,
          notesCount: notes.length,
        }),
      });

      const data = await res.json();
      if (data && data.release) {
        setReleases((prev) => [data.release, ...prev]);
        addActivity(`Published Version ${version}`, `Sync update ready for student apps`, 'publish', 'success');
        return data.release;
      }
      return null;
    } catch (err) {
      console.error('Publish error:', err);
      return null;
    }
  };

  const pushJsonToGitHub = async (params: {
    filename: string;
    jsonContent: string | object;
    commitMessage: string;
    branch?: string;
  }): Promise<any> => {
    try {
      const contentString = typeof params.jsonContent === 'string'
        ? params.jsonContent
        : JSON.stringify(params.jsonContent, null, 2);

      const data = await pushFileToGitHub({
        path: params.filename,
        content: contentString,
        commitMessage: params.commitMessage,
        branch: params.branch || 'main',
      });

      if (!data.success) {
        throw new Error(data.error || 'Failed to push JSON to GitHub');
      }

      // Try to parse json content for paper auto-add
      let parsed: any = null;
      try {
        parsed = typeof params.jsonContent === 'string' ? JSON.parse(params.jsonContent) : params.jsonContent;
      } catch (e) {
        // ignore parse error
      }
      if (parsed) {
        if (parsed.questions || parsed.paper || (parsed.title && Array.isArray(parsed.questions))) {
          const paperObj = parsed.paper || parsed;
          const questionsList = (paperObj.questions || []).map((q: any, i: number) => ({
            id: q.id || `q-gh-${Date.now()}-${i}`,
            paperId: paperObj.id || `paper-gh-${Date.now()}`,
            questionNumber: q.questionNumber || i + 1,
            type: q.type || 'mcq',
            text: q.text || `Question ${i + 1}`,
            textHindi: q.textHindi || '',
            options: q.options,
            correctAnswer: q.correctAnswer || 'A',
            explanation: q.explanation || '',
            explanationHindi: q.explanationHindi || '',
            aiAnswer: q.aiAnswer || '',
            aiStatus: q.aiStatus || 'approved',
            marks: q.marks || 1,
            negativeMarks: q.negativeMarks || 0,
            chapterId: q.chapterId,
            difficulty: q.difficulty || 'medium',
          }));

          const newPaper: QuestionPaper = {
            id: paperObj.id || `paper-gh-${Date.now()}`,
            classId: paperObj.classId || 'class-12',
            subjectId: paperObj.subjectId || 'sub-phy-12',
            title: paperObj.title || params.filename,
            year: paperObj.year || 2026,
            set: paperObj.set || 'Set A',
            setNumber: paperObj.setNumber || 'A',
            durationMinutes: paperObj.durationMinutes || 195,
            totalMarks: paperObj.totalMarks || 70,
            totalQuestions: questionsList.length,
            status: paperObj.status || 'published',
            version: paperObj.version || 1,
            questions: questionsList,
            githubSourceFile: params.filename,
            isAvailableOnGithub: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setPapers((prev) => [newPaper, ...prev.filter((p) => p.id !== newPaper.id)]);
          setSelectedPaperId(newPaper.id);
        } else if (parsed.chapters || Array.isArray(parsed)) {
          const chapList = parsed.chapters || parsed;
          if (Array.isArray(chapList)) {
            setChapters(chapList);
          }
        } else if (parsed.notes) {
          setNotes(parsed.notes);
        }
      }

      // Add a release history item for this push
      const newRelease: PublishRelease = {
        id: `rel-${data.commitSha || 'latest'}-${Date.now()}`,
        version: releases.length + 3,
        timestamp: new Date().toISOString(),
        commitSha: data.commitSha || 'latest',
        message: params.commitMessage,
        paperCount: papers.length + 1,
        questionCount: papers.reduce((s, p) => s + p.questions.length, 0),
        notesCount: notes.length,
        status: 'success',
        branch: params.branch || 'main',
      };
      setReleases((prev) => [newRelease, ...prev]);

      addActivity(
        `JSON Pushed to GitHub (${data.commitSha || 'latest'})`,
        `${params.filename} committed to ${params.branch || 'main'}`,
        'publish',
        'success'
      );

      return data;
    } catch (err: any) {
      console.error('pushJsonToGitHub error:', err);
      throw err;
    }
  };

  const importJSONData = (importedData: any, contentType: string): { success: boolean; message: string; count: number } => {
    try {
      if (contentType === 'paper' || importedData.questions || importedData.paper) {
        const paperObj = importedData.paper || importedData;
        const newPaper: QuestionPaper = {
          id: `paper-imp-${Date.now()}`,
          classId: paperObj.classId || 'class-12',
          subjectId: paperObj.subjectId || 'sub-bio-12',
          title: paperObj.title || `Imported Paper (${new Date().toLocaleDateString()})`,
          year: paperObj.year || 2026,
          set: paperObj.set || 'Set A',
          durationMinutes: paperObj.durationMinutes || 195,
          totalMarks: paperObj.totalMarks || 70,
          totalQuestions: paperObj.questions?.length || 0,
          status: 'ready',
          version: 1,
          questions: (paperObj.questions || []).map((q: any, i: number) => ({
            id: `q-imp-${Date.now()}-${i}`,
            paperId: `paper-imp-${Date.now()}`,
            questionNumber: q.questionNumber || i + 1,
            type: q.type || 'mcq',
            text: q.text || `Question ${i + 1}`,
            textHindi: q.textHindi || '',
            options: q.options || [
              { id: '1', key: 'A', text: 'Option A' },
              { id: '2', key: 'B', text: 'Option B' },
              { id: '3', key: 'C', text: 'Option C' },
              { id: '4', key: 'D', text: 'Option D' },
            ],
            correctAnswer: q.correctAnswer || 'A',
            explanation: q.explanation || '',
            explanationHindi: q.explanationHindi || '',
            aiAnswer: q.aiAnswer || '',
            aiStatus: q.aiStatus || 'missing',
            marks: q.marks || 1,
            difficulty: q.difficulty || 'medium',
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPapers((prev) => [newPaper, ...prev]);
        setSelectedPaperId(newPaper.id);
        addActivity('JSON Imported', `${newPaper.title} with ${newPaper.questions.length} questions`, 'paper', 'success');
        return { success: true, message: 'Question paper JSON imported successfully!', count: newPaper.questions.length };
      }

      if (contentType === 'syllabus' || importedData.chapters) {
        const chaptersList = importedData.chapters || importedData;
        if (Array.isArray(chaptersList)) {
          setChapters(chaptersList);
          addActivity('Syllabus JSON Imported', `${chaptersList.length} chapters loaded`, 'syllabus', 'success');
          return { success: true, message: 'Syllabus JSON imported successfully!', count: chaptersList.length };
        }
      }

      if (contentType === 'notes' || Array.isArray(importedData)) {
        setNotes(importedData);
        addActivity('Notes JSON Imported', `${importedData.length} notes loaded`, 'note', 'success');
        return { success: true, message: 'Notes JSON imported successfully!', count: importedData.length };
      }

      return { success: false, message: 'Unrecognized JSON structure.', count: 0 };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid JSON format', count: 0 };
    }
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'classes');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'subjects');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'papers');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'chapters');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notes');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'releases');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'activities');

    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setPapers(INITIAL_PAPERS);
    setChapters(INITIAL_CHAPTERS);
    setNotes(INITIAL_NOTES);
    setReleases(INITIAL_RELEASES);
    setActivities(INITIAL_ACTIVITIES);
    setSelectedPaperId('paper-bio-2026-a');
    setSelectedQuestionIndex(0);
    setSelectedReviewQIndex(7);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        classes,
        subjects,
        papers,
        chapters,
        notes,
        releases,
        activities,
        selectedPaperId,
        setSelectedPaperId,
        selectedQuestionIndex,
        setSelectedQuestionIndex,
        selectedReviewQIndex,
        setSelectedReviewQIndex,
        isMoreMenuOpen,
        setIsMoreMenuOpen,
        isPaletteOpen,
        setIsPaletteOpen,
        devicePreview,
        setDevicePreview,
        aiBatchJob,
        isGeneratingBatch,
        hasGeminiKey,
        goToQuestionEditor,
        goToAnswerReview,
        goToAIGeneration,
        saveQuestion,
        addQuestion,
        deleteQuestion,
        updateQuestionStatus,
        savePaper,
        deletePaper,
        saveChapter,
        addTopicToChapter,
        toggleTopicComplete,
        moveChapter,
        moveTopic,
        saveNote,
        deleteNote,
        startAIGeneration,
        cancelAIGeneration,
        regenerateSingleAnswer,
        publishToGitHub,
        pushJsonToGitHub,
        importJSONData,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
