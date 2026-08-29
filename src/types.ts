export type NavTab = 
  | 'dashboard'
  | 'papers'
  | 'ai'
  | 'questions'
  | 'editor'
  | 'review'
  | 'syllabus'
  | 'notes'
  | 'import'
  | 'export'
  | 'publish'
  | 'classes'
  | 'subjects'
  | 'settings';

export type QuestionStatus = 'approved' | 'generated' | 'review' | 'missing';

export type QuestionType = 
  | 'mcq'
  | 'multi'
  | 'short'
  | 'long'
  | 'assertion_reason'
  | 'numerical';

export interface QuestionOption {
  id: string;
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  textHindi?: string;
}

export interface Question {
  id: string;
  paperId: string;
  questionNumber: number;
  type: QuestionType;
  text: string;
  textHindi?: string;
  options?: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  explanationHindi?: string;
  aiAnswer?: string;
  aiStatus: QuestionStatus;
  marks: number;
  negativeMarks?: number;
  chapterId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type PaperStatus = 'draft' | 'ready' | 'generating' | 'review' | 'published';

export interface QuestionPaper {
  id: string;
  classId: string;
  subjectId: string;
  title: string;
  year: number;
  set?: string;
  setNumber?: string;
  examType?: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  status: PaperStatus;
  version?: number;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  stream?: string;
  streams?: string[];
  order: number;
  code: string;
}

export interface SubjectItem {
  id: string;
  classId: string;
  name: string;
  hindiName?: string;
  code: string;
  iconName: string;
  color: string;
  paperCount: number;
}

export interface Topic {
  id: string;
  title: string;
  hindiTitle?: string;
  completed: boolean;
  order: number;
}

export interface Chapter {
  id: string;
  classId: string;
  subjectId: string;
  chapterNumber: number;
  title: string;
  hindiTitle?: string;
  topics: Topic[];
}

export interface Note {
  id: string;
  classId: string;
  subjectId: string;
  chapterId: string;
  title: string;
  content: string;
  category?: 'formula' | 'summary' | 'keypoints' | 'diagram';
  status: 'draft' | 'published';
  lastUpdated?: string;
  updatedAt?: string;
  tags: string[];
}

export interface PublishRelease {
  id: string;
  version: number;
  timestamp: string;
  commitSha: string;
  message: string;
  paperCount: number;
  questionCount: number;
  notesCount: number;
  status: 'success' | 'pending' | 'failed';
  branch: string;
}

export interface AIBatchJob {
  paperId: string;
  paperTitle: string;
  totalQuestions: number;
  totalBatches: number;
  currentBatch: number;
  startQ: number;
  endQ: number;
  progress: number;
  isGenerating: boolean;
  log: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'ai' | 'publish' | 'paper' | 'syllabus' | 'note';
  status?: 'success' | 'warning' | 'info';
}

export interface DevicePreviewMode {
  id: 'fluid' | 'android-small' | 'android-pixel' | 'iphone-standard' | 'tablet' | 'desktop';
  name: string;
  width: string;
  desc: string;
}
