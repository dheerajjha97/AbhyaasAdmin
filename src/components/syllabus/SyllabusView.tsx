import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Chapter, Topic } from '../../types';
import {
  Bookmark,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export const SyllabusView: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    saveChapter,
    addTopicToChapter,
    toggleTopicComplete,
    moveChapter,
    moveTopic
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState('class-12');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-bio-12');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>('chap-bio-1');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicHindi, setNewTopicHindi] = useState('');
  const [showAddTopic, setShowAddTopic] = useState<string | null>(null);

  // New chapter form state
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterHindi, setNewChapterHindi] = useState('');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const filteredChapters = chapters.filter(
    (c) => c.classId === selectedClassId && c.subjectId === selectedSubjectId
  );

  const handleCreateTopic = (chapterId: string) => {
    if (!newTopicTitle.trim()) return;
    addTopicToChapter(chapterId, newTopicTitle.trim(), newTopicHindi.trim() || undefined);
    setNewTopicTitle('');
    setNewTopicHindi('');
    setShowAddTopic(null);
  };

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newChap: Chapter = {
      id: `chap-${Date.now()}`,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      chapterNumber: filteredChapters.length + 1,
      title: newChapterTitle.trim(),
      hindiTitle: newChapterHindi.trim() || undefined,
      topics: [],
    };
    saveChapter(newChap);
    setNewChapterTitle('');
    setNewChapterHindi('');
    setShowAddChapter(false);
    setExpandedChapterId(newChap.id);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* 1. Header with Class and Subject Selector */}
      <div className="space-y-2 pb-2 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600" /> Syllabus Manager
            </h1>
            <p className="text-xs text-slate-500">Chapters & sub-topic tracking</p>
          </div>
          <button
            onClick={() => setShowAddChapter(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> + Chapter
          </button>
        </div>

        {/* Class & Subject Selector Chips */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.hindiName ? `(${s.hindiName})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. New Chapter Modal/Drawer */}
      {showAddChapter && (
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 animate-in fade-in shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Add New Chapter
            </span>
            <button onClick={() => setShowAddChapter(false)} className="text-slate-500 text-xs hover:text-slate-800">
              Cancel
            </button>
          </div>
          <input
            type="text"
            placeholder="Chapter Title in English (e.g. Ecology & Biodiversity)"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
          <input
            type="text"
            placeholder="हिंदी शीर्षक (उदा. पारिस्थितिकी एवं जैव विविधता)"
            value={newChapterHindi}
            onChange={(e) => setNewChapterHindi(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
          <button
            onClick={handleCreateChapter}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800"
          >
            Save Chapter
          </button>
        </div>
      )}

      {/* 3. Chapters Accordion List (Exact user format: 01 Reproduction ›, 02 Genetics ›) */}
      <div className="space-y-2.5">
        {filteredChapters.map((chap, idx) => {
          const isExpanded = expandedChapterId === chap.id;
          const completedTopics = chap.topics.filter((t) => t.completed).length;
          const totalTopics = chap.topics.length;
          const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

          return (
            <div
              key={chap.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white border-slate-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Chapter Row Button */}
              <div className="p-3.5 flex items-center justify-between gap-2 select-none">
                <div
                  onClick={() => setExpandedChapterId(isExpanded ? null : chap.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {String(chap.chapterNumber).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{chap.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {chap.hindiTitle && (
                        <span className="text-[11px] text-amber-800 truncate font-medium">
                          {chap.hindiTitle}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({completedTopics}/{totalTopics} topics)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Up/Down Move controls (User requirement #8) */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveChapter(chap.id, 'up')}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 disabled:opacity-20 flex items-center justify-center"
                    title="Move Chapter Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveChapter(chap.id, 'down')}
                    disabled={idx === filteredChapters.length - 1}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 disabled:opacity-20 flex items-center justify-center"
                    title="Move Chapter Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpandedChapterId(isExpanded ? null : chap.id)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-700" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress bar inside chapter card */}
              <div className="w-full h-1 bg-slate-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* 4. Expanded Chapter Detail (Topics list: ✓ Sexual Reproduction, + Add Topic) */}
              {isExpanded && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Chapter Topics ({chap.topics.length})
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold font-mono">{percent}% Done</span>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-1.5">
                    {chap.topics.map((top, tIdx) => (
                      <div
                        key={top.id}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs transition-all ${
                          top.completed
                            ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        {/* Topic Checkbox & Title */}
                        <div
                          onClick={() => toggleTopicComplete(chap.id, top.id)}
                          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                              top.completed
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'border border-slate-300 bg-slate-100'
                            }`}
                          >
                            {top.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>

                          <div className="min-w-0">
                            <span className={`font-semibold ${top.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {top.title}
                            </span>
                            {top.hindiTitle && (
                              <p className="text-[10px] text-amber-800">{top.hindiTitle}</p>
                            )}
                          </div>
                        </div>

                        {/* Move Up/Down Topic */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => moveTopic(chap.id, top.id, 'up')}
                            disabled={tIdx === 0}
                            className="w-6 h-6 rounded bg-slate-100 text-slate-600 disabled:opacity-20 flex items-center justify-center hover:text-slate-900"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveTopic(chap.id, top.id, 'down')}
                            disabled={tIdx === chap.topics.length - 1}
                            className="w-6 h-6 rounded bg-slate-100 text-slate-600 disabled:opacity-20 flex items-center justify-center hover:text-slate-900"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* + Add Topic Input Box */}
                  {showAddTopic === chap.id ? (
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2 mt-2 shadow-sm">
                      <input
                        type="text"
                        placeholder="Topic title in English..."
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="हिंदी अनुवाद (वैकल्पिक)..."
                        value={newTopicHindi}
                        onChange={(e) => setNewTopicHindi(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCreateTopic(chap.id)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                        >
                          Add Topic
                        </button>
                        <button
                          onClick={() => setShowAddTopic(null)}
                          className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddTopic(chap.id)}
                      className="w-full py-2.5 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Topic
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
