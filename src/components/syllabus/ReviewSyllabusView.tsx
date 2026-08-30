import React, { useState } from 'react';
import {
  Bookmark,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Circle,
  FileCode2,
  Award
} from 'lucide-react';
import {
  ParsedSyllabusResult,
  ParsedSyllabusChapter,
  ParsedSyllabusTopic,
  ParsedSyllabusUnit
} from '../../utils/syllabusParser';

interface ReviewSyllabusViewProps {
  parsedResult: ParsedSyllabusResult;
  onUpdateChapter: (chapter: ParsedSyllabusChapter) => void;
  onDeleteChapter: (chapterId: string) => void;
  onAddChapter: () => void;
  onNavigateToJson: () => void;
  onNavigateToPush: () => void;
}

export const ReviewSyllabusView: React.FC<ReviewSyllabusViewProps> = ({
  parsedResult,
  onUpdateChapter,
  onDeleteChapter,
  onAddChapter,
  onNavigateToJson,
  onNavigateToPush,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    parsedResult.chapters[0]?.id || null
  );

  // Editing Chapter state
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editHindiTitle, setEditHindiTitle] = useState('');
  const [editMarks, setEditMarks] = useState<number | ''>('');

  // Adding Topic state
  const [addingTopicChapterId, setAddingTopicChapterId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicHindi, setNewTopicHindi] = useState('');

  // Editing Topic state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicHindi, setEditTopicHindi] = useState('');

  const filteredChapters = parsedResult.chapters.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesChapter =
      c.title.toLowerCase().includes(q) ||
      (c.hindiTitle && c.hindiTitle.toLowerCase().includes(q)) ||
      c.chapterNumber.toString().includes(q);
    const matchesTopics = c.topics.some(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.hindiTitle && t.hindiTitle.toLowerCase().includes(q))
    );
    return matchesChapter || matchesTopics;
  });

  const handleStartEditChapter = (chapter: ParsedSyllabusChapter) => {
    setEditingChapterId(chapter.id);
    setEditTitle(chapter.title);
    setEditHindiTitle(chapter.hindiTitle || '');
    setEditMarks(chapter.marksWeightage ?? '');
  };

  const handleSaveEditChapter = (chapter: ParsedSyllabusChapter) => {
    onUpdateChapter({
      ...chapter,
      title: editTitle.trim() || chapter.title,
      hindiTitle: editHindiTitle.trim() || undefined,
      marksWeightage: typeof editMarks === 'number' ? editMarks : undefined,
    });
    setEditingChapterId(null);
  };

  const handleAddTopic = (chapter: ParsedSyllabusChapter) => {
    if (!newTopicTitle.trim()) return;
    const nextOrder = chapter.topics.length + 1;
    const newTopic: ParsedSyllabusTopic = {
      id: `topic-${chapter.chapterNumber}-${Date.now()}`,
      topicNumber: `${chapter.chapterNumber}.${nextOrder}`,
      title: newTopicTitle.trim(),
      hindiTitle: newTopicHindi.trim() || undefined,
      completed: false,
      order: nextOrder,
    };
    onUpdateChapter({
      ...chapter,
      topics: [...chapter.topics, newTopic],
    });
    setNewTopicTitle('');
    setNewTopicHindi('');
    setAddingTopicChapterId(null);
  };

  const handleDeleteTopic = (chapter: ParsedSyllabusChapter, topicId: string) => {
    const updatedTopics = chapter.topics
      .filter((t) => t.id !== topicId)
      .map((t, idx) => ({
        ...t,
        order: idx + 1,
        topicNumber: `${chapter.chapterNumber}.${idx + 1}`,
      }));
    onUpdateChapter({
      ...chapter,
      topics: updatedTopics,
    });
  };

  const handleMoveTopic = (chapter: ParsedSyllabusChapter, index: number, direction: 'up' | 'down') => {
    const newTopics = [...chapter.topics];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTopics.length) return;

    const temp = newTopics[index];
    newTopics[index] = newTopics[targetIndex];
    newTopics[targetIndex] = temp;

    // reindex
    const reindexed = newTopics.map((t, idx) => ({
      ...t,
      order: idx + 1,
      topicNumber: `${chapter.chapterNumber}.${idx + 1}`,
    }));

    onUpdateChapter({
      ...chapter,
      topics: reindexed,
    });
  };

  const handleStartEditTopic = (topic: ParsedSyllabusTopic) => {
    setEditingTopicId(topic.id);
    setEditTopicTitle(topic.title);
    setEditTopicHindi(topic.hindiTitle || '');
  };

  const handleSaveEditTopic = (chapter: ParsedSyllabusChapter, topicId: string) => {
    const updatedTopics = chapter.topics.map((t) => {
      if (t.id === topicId) {
        return {
          ...t,
          title: editTopicTitle.trim() || t.title,
          hindiTitle: editTopicHindi.trim() || undefined,
        };
      }
      return t;
    });
    onUpdateChapter({
      ...chapter,
      topics: updatedTopics,
    });
    setEditingTopicId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Step 2: Review & Refine Syllabus Tree
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {parsedResult.stats.totalChapters} Chapters ({parsedResult.stats.totalTopics} Topics)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Edit chapter titles, add/reorder topics, configure marks weightage & Hindi translations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddChapter}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Chapter</span>
            </button>
            <button
              onClick={onNavigateToJson}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Generate JSON</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters or topics in English/Hindi..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredChapters.length}</strong> of {parsedResult.chapters.length} chapters
            </span>
          </div>
        </div>
      </div>

      {/* Chapters Accordion / Tree List */}
      <div className="space-y-3">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapterId === chapter.id;
          const isEditing = editingChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              className={`bg-white rounded-2xl border transition-all shadow-sm ${
                isExpanded ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              {/* Chapter Card Header */}
              <div className="p-3.5 sm:p-4 flex items-start justify-between gap-3">
                <div
                  onClick={() => !isEditing && setExpandedChapterId(isExpanded ? null : chapter.id)}
                  className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                >
                  <button className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 mt-0.5">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    {isEditing ? (
                      <div className="space-y-2 pr-2" onClick={(e) => e.stopPropagation()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                              English Chapter Title
                            </label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                              Hindi Chapter Title (हिंदी शीर्षक)
                            </label>
                            <input
                              type="text"
                              value={editHindiTitle}
                              onChange={(e) => setEditHindiTitle(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Marks Weightage:
                          </label>
                          <input
                            type="number"
                            value={editMarks}
                            onChange={(e) =>
                              setEditMarks(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                            }
                            placeholder="e.g. 5"
                            className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black font-mono">
                            Ch {chapter.chapterNumber}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {chapter.title}
                          </h4>
                          {chapter.marksWeightage && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                              {chapter.marksWeightage} Marks
                            </span>
                          )}
                        </div>

                        {chapter.hindiTitle && (
                          <p className="text-xs text-slate-600 font-medium pl-0.5">
                            {chapter.hindiTitle}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                          <span>{chapter.topics.length} topics</span>
                          {chapter.unitTitle && <span>• Unit: {chapter.unitTitle}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Chapter Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEditChapter(chapter)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingChapterId(null)}
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEditChapter(chapter)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Edit Chapter"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteChapter(chapter.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Topics Breakdown List (When Expanded) */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 sm:p-4 rounded-b-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Sub-Topics & Micro-Concepts ({chapter.topics.length})
                    </span>
                    <button
                      onClick={() => setAddingTopicChapterId(chapter.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" /> + Add Topic
                    </button>
                  </div>

                  {/* Add Topic Inline Form */}
                  {addingTopicChapterId === chapter.id && (
                    <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-sm space-y-2">
                      <span className="text-[11px] font-bold text-emerald-800">Add New Topic:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newTopicTitle}
                          onChange={(e) => setNewTopicTitle(e.target.value)}
                          placeholder="English Title, e.g. Binary fission in Amoeba"
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          value={newTopicHindi}
                          onChange={(e) => setNewTopicHindi(e.target.value)}
                          placeholder="Hindi Title (Optional), e.g. अमीबा में द्विखंडन"
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setAddingTopicChapterId(null)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddTopic(chapter)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          Save Topic
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Topics List */}
                  {chapter.topics.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      No topics added yet for this chapter. Click "+ Add Topic" above.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {chapter.topics.map((topic, tIdx) => {
                        const isEditingTopic = editingTopicId === topic.id;

                        return (
                          <div
                            key={topic.id || tIdx}
                            className="bg-white rounded-xl border border-slate-200/80 p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-slate-300 transition-all"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <span className="font-mono text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">
                                {topic.topicNumber || `${chapter.chapterNumber}.${tIdx + 1}`}
                              </span>

                              {isEditingTopic ? (
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  <input
                                    type="text"
                                    value={editTopicTitle}
                                    onChange={(e) => setEditTopicTitle(e.target.value)}
                                    className="px-2 py-1 text-xs rounded border border-slate-300"
                                  />
                                  <input
                                    type="text"
                                    value={editTopicHindi}
                                    onChange={(e) => setEditTopicHindi(e.target.value)}
                                    className="px-2 py-1 text-xs rounded border border-slate-300"
                                    placeholder="Hindi translation"
                                  />
                                </div>
                              ) : (
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold text-slate-800 truncate">
                                    {topic.title}
                                  </div>
                                  {topic.hindiTitle && (
                                    <div className="text-[11px] text-slate-500 truncate">
                                      {topic.hindiTitle}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Topic Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              {isEditingTopic ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEditTopic(chapter, topic.id)}
                                    className="p-1 rounded bg-emerald-600 text-white"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingTopicId(null)}
                                    className="p-1 rounded bg-slate-200 text-slate-700"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleMoveTopic(chapter, tIdx, 'up')}
                                    disabled={tIdx === 0}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveTopic(chapter, tIdx, 'down')}
                                    disabled={tIdx === chapter.topics.length - 1}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleStartEditTopic(topic)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(chapter, topic.id)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Step Bar */}
      <div className="sticky bottom-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-medium hidden sm:block">
          Syllabus verified • Ready for JSON Export & GitHub Sync
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onNavigateToJson}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Generate JSON</span>
          </button>
          <button
            onClick={onNavigateToPush}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct GitHub Push →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
