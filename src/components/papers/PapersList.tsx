import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionPaper, PaperStatus } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  MoreVertical,
  Filter,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const PapersList: React.FC = () => {
  const {
    papers,
    classes,
    subjects,
    goToQuestionEditor,
    goToAIGeneration,
    savePaper,
    deletePaper
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'class-12' | 'class-10' | 'published' | 'review'>('all');
  const [showNewPaperModal, setShowNewPaperModal] = useState(false);

  // New paper form state
  const [newTitle, setNewTitle] = useState('');
  const [newClassId, setNewClassId] = useState('class-12');
  const [newSubjectId, setNewSubjectId] = useState('sub-bio-12');
  const [newYear, setNewYear] = useState(2026);
  const [newSet, setNewSet] = useState('A');
  const [newTotalQ, setNewTotalQ] = useState(70);

  // Filtered papers
  const filteredPapers = papers.filter((p) => {
    const setVal = (p.setNumber || p.set || '').toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setVal.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'class-12') return p.classId === 'class-12';
    if (selectedFilter === 'class-10') return p.classId === 'class-10';
    if (selectedFilter === 'published') return p.status === 'published';
    if (selectedFilter === 'review') return p.status === 'review';
    return true;
  });

  const handleCreatePaper = () => {
    if (!newTitle.trim()) return;

    const newPaper: QuestionPaper = {
      id: `paper-${Date.now()}`,
      title: newTitle.trim(),
      classId: newClassId,
      subjectId: newSubjectId,
      examType: 'board',
      year: newYear,
      setNumber: newSet,
      totalMarks: 70,
      durationMinutes: 180,
      totalQuestions: newTotalQ,
      status: 'draft',
      questions: [],
    };

    savePaper(newPaper);
    setShowNewPaperModal(false);
    goToQuestionEditor(newPaper.id, 0);
  };

  const getStatusBadge = (status: PaperStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">Published</span>;
      case 'ready':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">Ready</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">Review (7)</span>;
      case 'generating':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold animate-pulse">AI Running</span>;
      case 'draft':
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">Draft</span>;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header with Title and + New Paper button */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Question Papers
          </h1>
          <p className="text-xs text-slate-500">Bihar & CBSE Board Exam Sets ({papers.length})</p>
        </div>

        <button
          id="papers-new-paper-btn"
          onClick={() => setShowNewPaperModal(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> + New Paper
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search papers by subject, year, or set..."
          className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All Papers' },
          { id: 'class-12', label: 'Class 12th' },
          { id: 'class-10', label: 'Class 10th' },
          { id: 'review', label: 'Needs Review ⚠' },
          { id: 'published', label: 'Published ✓' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setSelectedFilter(chip.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedFilter === chip.id
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Papers Cards List */}
      <div className="space-y-3">
        {filteredPapers.map((paper) => {
          const approvedQ = paper.questions.filter((q) => q.aiStatus === 'approved').length;
          const reviewQ = paper.questions.filter((q) => q.aiStatus === 'review').length;
          const missingQ = paper.questions.filter((q) => q.aiStatus === 'missing').length;

          return (
            <div
              key={paper.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{paper.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                    <span>{paper.year} Set {paper.setNumber}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-600 font-bold">{paper.questions.length} Questions</span>
                    <span>•</span>
                    <span>{paper.totalMarks} Marks</span>
                  </div>
                </div>

                {getStatusBadge(paper.status)}
              </div>

              {/* Status Breakdown Progress Pills */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <span>✓ {approvedQ} Approved</span>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                  <span>⚠ {reviewQ} Review</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                  <span>○ {missingQ} Missing</span>
                </div>
              </div>

              {/* Action Buttons: [ Edit Questions ] [ AI Answers ] */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => goToQuestionEditor(paper.id, 0)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                  <span>Edit Questions</span>
                </button>

                <button
                  onClick={() => goToAIGeneration(paper.id)}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Answers</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Paper Modal */}
      {showNewPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 max-w-sm w-full space-y-3.5 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Create Question Paper</h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Paper Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Biology 2026 Model Set C"
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Class
                </label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Set
                </label>
                <input
                  type="text"
                  value={newSet}
                  onChange={(e) => setNewSet(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Questions
                </label>
                <input
                  type="number"
                  value={newTotalQ}
                  onChange={(e) => setNewTotalQ(Number(e.target.value))}
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowNewPaperModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePaper}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm"
              >
                Create Paper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
