import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Note } from '../../types';
import {
  FileEdit,
  Plus,
  Save,
  Send,
  Eye,
  Edit3,
  BookOpen,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  List,
  Bold,
  Italic,
  Code
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const { notes, chapters, saveNote, deleteNote } = useApp();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Form state
  const currentNote = notes.find((n) => n.id === activeNoteId);
  const [title, setTitle] = useState(currentNote?.title || '');
  const [chapterId, setChapterId] = useState(currentNote?.chapterId || chapters[0]?.id || '');
  const [content, setContent] = useState(currentNote?.content || '');
  const [category, setCategory] = useState<'formula' | 'summary' | 'keypoints' | 'diagram'>(
    currentNote?.category || 'summary'
  );
  const [tags, setTags] = useState(currentNote?.tags.join(', ') || '');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleSelectNote = (n: Note) => {
    setActiveNoteId(n.id);
    setTitle(n.title);
    setChapterId(n.chapterId);
    setContent(n.content);
    setCategory(n.category);
    setTags(n.tags.join(', '));
    setIsCreatingNew(false);
  };

  const handleNewNote = () => {
    setIsCreatingNew(true);
    setActiveNoteId(null);
    setTitle('');
    setContent('');
    setTags('Quick Revision, Exam 2026');
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!title.trim()) return;

    const saved: Note = {
      id: activeNoteId || `note-${Date.now()}`,
      title: title.trim(),
      chapterId: chapterId || chapters[0]?.id || 'chap-bio-1',
      subjectId: 'sub-bio-12',
      classId: 'class-12',
      content: content.trim(),
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      lastUpdated: 'Just now',
      status,
    };

    saveNote(saved);
    setActiveNoteId(saved.id);
    setIsCreatingNew(false);
    setSaveBanner(status === 'published' ? 'Note Published!' : 'Draft Saved!');
    setTimeout(() => setSaveBanner(null), 2500);
  };

  const insertMarkdown = (prefix: string, suffix = '') => {
    setContent((prev) => prev + prefix + suffix);
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in">
      {/* 1. Header with New Note button */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-indigo-600" /> Notes Hub
          </h1>
          <p className="text-xs text-slate-500">Class 12 Biology & Exam Sheets</p>
        </div>

        <button
          onClick={handleNewNote}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + New Note
        </button>
      </div>

      {/* 2. Notes List Horizontal / Compact Scroll Cards (Exact user format) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
          Available Notes ({notes.length})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {notes.map((n) => {
            const isSelected = activeNoteId === n.id;
            return (
              <div
                key={n.id}
                onClick={() => handleSelectNote(n)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 shadow-sm text-white'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{n.title}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        n.status === 'published'
                          ? isSelected
                            ? 'bg-emerald-800 text-emerald-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {n.status}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    <span className="truncate">
                      {chapters.find((c) => c.id === n.chapterId)?.title || 'Chapter Note'}
                    </span>
                    <span>•</span>
                    <span>{n.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Notes Editor (Exact user format: Title, Chapter, Content, Sticky bottom bar) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {isCreatingNew ? 'Create New Note' : 'Edit Note'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
                isPreview
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreview ? 'Editor' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 01 Reproduction Summary"
            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        {/* Chapter & Category Dropdowns */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Chapter
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {String(c.chapterNumber).padStart(2, '0')} {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              <option value="summary">Summary Sheet</option>
              <option value="formula">Formula / Key Reactions</option>
              <option value="keypoints">High-Yield Points</option>
              <option value="diagram">Diagram Notes</option>
            </select>
          </div>
        </div>

        {/* Content Markdown Box or Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Content (Markdown / Rich Text)
            </label>
            {/* Quick Markdown Toolbar */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 italic text-xs flex items-center justify-center hover:bg-slate-200"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n- ')}
                className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center justify-center hover:bg-slate-200"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`')}
                className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px] flex items-center justify-center hover:bg-slate-200"
              >
                {'{}'}
              </button>
            </div>
          </div>

          {isPreview ? (
            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed min-h-[160px] whitespace-pre-wrap font-sans">
              {content || 'No content to preview.'}
            </div>
          ) : (
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write summary points, key terms, definitions in Markdown..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder-slate-400"
            />
          )}
        </div>
      </div>

      {/* 4. Sticky Bottom Action Bar (Exact user requirement: [ Save Draft ] [ Publish Note ]) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-md">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id="notes-save-draft-btn"
            onClick={() => handleSave('draft')}
            className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all select-none"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>

          <button
            type="button"
            id="notes-publish-btn"
            onClick={() => handleSave('published')}
            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all select-none"
          >
            <Send className="w-4 h-4" /> Publish Note
          </button>
        </div>
      </div>
    </div>
  );
};
