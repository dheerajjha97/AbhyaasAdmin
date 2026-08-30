import React, { useState } from 'react';
import {
  FileText,
  FileCode2,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
  Zap,
  ListOrdered
} from 'lucide-react';
import { NotesMetaHeader } from './NotesMetaHeader';
import { PasteAndParseNotesView } from './PasteAndParseNotesView';
import { ReviewNotesView } from './ReviewNotesView';
import { JsonGeneratorNotesView } from './JsonGeneratorNotesView';
import { GitHubPushNotesView } from './GitHubPushNotesView';
import { SavedNotesView } from './SavedNotesView';
import {
  NoteType,
  ParsedNoteResult,
  SAMPLE_BIOLOGY_NOTES_TEXT,
  parseNotesContent,
  SAMPLE_PHYSICS_NOTES_TEXT
} from '../../utils/notesParser';

interface NotesEngineViewProps {
  githubToken: string;
  setGithubToken: (token: string) => void;
  repoOwner: string;
  setRepoOwner: (owner: string) => void;
  repoName: string;
  setRepoName: (name: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
}

export const NotesEngineView: React.FC<NotesEngineViewProps> = ({
  githubToken,
  setGithubToken,
  repoOwner,
  setRepoOwner,
  repoName,
  setRepoName,
  branch,
  setBranch,
}) => {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'parse' | 'review' | 'json' | 'github' | 'saved'>('parse');

  // Metadata State
  const [classId, setClassId] = useState('class-12');
  const [subjectId, setSubjectId] = useState('biology');
  const [chapterNumber, setChapterNumber] = useState(3);
  const [chapterTitle, setChapterTitle] = useState('Human Reproduction');
  const [chapterTitleHindi, setChapterTitleHindi] = useState('मानव जनन');
  const [board, setBoard] = useState('Bihar Board (BSEB)');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [noteType, setNoteType] = useState<NoteType>('comprehensive');

  // Raw & Parsed Notes State
  const [rawNotesText, setRawNotesText] = useState(SAMPLE_BIOLOGY_NOTES_TEXT.trim());
  const [isParsing, setIsParsing] = useState(false);

  // Initial Parsed result
  const [parsedNotes, setParsedNotes] = useState<ParsedNoteResult | null>(() => {
    return parseNotesContent(SAMPLE_BIOLOGY_NOTES_TEXT.trim(), {
      classId: 'class-12',
      className: 'Class 12',
      subjectId: 'biology',
      subjectName: 'Biology',
      chapterNumber: 3,
      chapterTitle: 'Human Reproduction',
      chapterTitleHindi: 'मानव जनन',
      board: 'Bihar Board (BSEB)',
      academicYear: '2025-2026',
      noteType: 'comprehensive',
    });
  });

  // Target filename in GitHub
  const targetFilename = `data/notes/${classId.replace('-', '')}_${subjectId}_chap${chapterNumber}_notes.json`;

  // GitHub Push State
  const [commitMessage, setCommitMessage] = useState(
    `feat(notes): add ${classId} ${subjectId} chapter ${chapterNumber} notes`
  );
  const [pushHistory, setPushHistory] = useState<
    Array<{
      id: string;
      filename: string;
      commitSha: string;
      message: string;
      timestamp: string;
      sectionsCount: number;
      title: string;
    }>
  >([]);

  // Preloaded Saved Notes Library
  const [savedNotes, setSavedNotes] = useState<ParsedNoteResult[]>(() => {
    const bioNote = parseNotesContent(SAMPLE_BIOLOGY_NOTES_TEXT.trim(), {
      classId: 'class-12',
      className: 'Class 12',
      subjectId: 'biology',
      subjectName: 'Biology',
      chapterNumber: 3,
      chapterTitle: 'Human Reproduction',
      chapterTitleHindi: 'मानव जनन',
      board: 'Bihar Board (BSEB)',
      academicYear: '2025-2026',
      noteType: 'comprehensive',
    });

    const phyNote = parseNotesContent(SAMPLE_PHYSICS_NOTES_TEXT.trim(), {
      classId: 'class-12',
      className: 'Class 12',
      subjectId: 'physics',
      subjectName: 'Physics',
      chapterNumber: 1,
      chapterTitle: 'Electrostatics & Gauss Law',
      chapterTitleHindi: 'स्थिर वैद्युतिकी एवं गाउस का नियम',
      board: 'Bihar Board (BSEB)',
      academicYear: '2025-2026',
      noteType: 'formula_sheet',
    });

    return [bioNote, phyNote];
  });

  // Handle Parse Trigger
  const handleParseNotes = () => {
    setIsParsing(true);
    setTimeout(() => {
      const subjectNameMap: Record<string, string> = {
        biology: 'Biology',
        physics: 'Physics',
        chemistry: 'Chemistry',
        mathematics: 'Mathematics',
        hindi: 'Hindi',
        english: 'English',
        history: 'History',
        geography: 'Geography',
        'pol-science': 'Political Science',
        economics: 'Economics',
      };

      const classNameMap: Record<string, string> = {
        'class-12': 'Class 12',
        'class-11': 'Class 11',
        'class-10': 'Class 10',
        'class-9': 'Class 9',
        'neet-ug': 'NEET UG',
        'jee-main': 'JEE Main',
      };

      const result = parseNotesContent(rawNotesText, {
        classId,
        className: classNameMap[classId] || classId,
        subjectId,
        subjectName: subjectNameMap[subjectId] || subjectId,
        chapterNumber,
        chapterTitle,
        chapterTitleHindi,
        board,
        academicYear,
        noteType,
      });

      setParsedNotes(result);
      setIsParsing(false);
      setActiveTab('review');
    }, 400);
  };

  // Push to GitHub API
  const handlePushToGitHub = async () => {
    if (!parsedNotes) throw new Error('No parsed notes to push');

    const jsonContent = JSON.stringify(parsedNotes, null, 2);
    const res = await fetch('/api/github/push-syllabus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: githubToken,
        owner: repoOwner,
        repo: repoName,
        branch: branch || 'main',
        path: targetFilename,
        content: jsonContent,
        commitMessage: commitMessage || `Update ${targetFilename}`,
      }),
    });

    const data = await res.json();
    if (data.success) {
      const newEntry = {
        id: `push-${Date.now()}`,
        filename: targetFilename,
        commitSha: data.commitSha || 'latest',
        message: commitMessage,
        timestamp: new Date().toISOString(),
        sectionsCount: parsedNotes.sections.length,
        title: parsedNotes.title,
      };
      setPushHistory((prev) => [newEntry, ...prev]);

      // Also ensure it's in saved notes list
      setSavedNotes((prev) => {
        const exists = prev.some((n) => n.noteId === parsedNotes.noteId);
        return exists ? prev.map((n) => (n.noteId === parsedNotes.noteId ? parsedNotes : n)) : [parsedNotes, ...prev];
      });
    }
    return data;
  };

  // Load Note from Library
  const handleLoadNote = (note: ParsedNoteResult) => {
    setParsedNotes(note);
    setClassId(note.classId);
    setSubjectId(note.subjectId);
    if (note.chapterNumber) setChapterNumber(note.chapterNumber);
    if (note.chapterTitle) setChapterTitle(note.chapterTitle);
    if (note.board) setBoard(note.board);
    if (note.academicYear) setAcademicYear(note.academicYear);
    if (note.noteType) setNoteType(note.noteType);

    setActiveTab('review');
  };

  return (
    <div className="space-y-4">
      {/* 1. Notes Meta Header */}
      <NotesMetaHeader
        classId={classId}
        setClassId={setClassId}
        subjectId={subjectId}
        setSubjectId={setSubjectId}
        chapterNumber={chapterNumber}
        setChapterNumber={setChapterNumber}
        chapterTitle={chapterTitle}
        setChapterTitle={setChapterTitle}
        board={board}
        setBoard={setBoard}
        academicYear={academicYear}
        setAcademicYear={setAcademicYear}
        noteType={noteType}
        setNoteType={setNoteType}
        totalSectionsCount={parsedNotes?.stats.totalSections || 0}
        totalFormulasCount={parsedNotes?.stats.totalFormulas || 0}
        totalTakeawaysCount={parsedNotes?.stats.totalKeyTakeaways || 0}
        readingTimeMinutes={parsedNotes?.stats.readingTime || 0}
        targetFilename={targetFilename}
      />

      {/* 2. Engine Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('parse')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'parse'
                ? 'bg-amber-500 text-white btn-3d-amber shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Paste & Parse</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'review'
                ? 'bg-amber-500 text-white btn-3d-amber shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Review ({parsedNotes?.sections.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'json'
                ? 'bg-amber-500 text-white btn-3d-amber shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>3. JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-amber-500 text-white btn-3d-amber shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>4. Push</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('saved')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-slate-900 text-white btn-3d-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Library ({savedNotes.length})</span>
        </button>
      </div>


      {/* 3. Tab Views */}
      {activeTab === 'parse' && (
        <PasteAndParseNotesView
          rawNotesText={rawNotesText}
          setRawNotesText={setRawNotesText}
          onParse={handleParseNotes}
          isParsing={isParsing}
          totalSectionsParsed={parsedNotes?.sections.length || 0}
        />
      )}

      {activeTab === 'review' && (
        <ReviewNotesView
          parsedNotes={parsedNotes}
          onUpdateNotes={(updated) => setParsedNotes(updated)}
        />
      )}

      {activeTab === 'json' && (
        <JsonGeneratorNotesView
          parsedNotes={parsedNotes}
          targetFilename={targetFilename}
        />
      )}

      {activeTab === 'github' && parsedNotes && (
        <GitHubPushNotesView
          parsedNotes={parsedNotes}
          targetFilename={targetFilename}
          setTargetFilename={() => {}}
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
        <SavedNotesView
          savedNotes={savedNotes}
          onLoadNote={handleLoadNote}
        />
      )}
    </div>
  );
};
