import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Search,
  Sparkles,
  Zap,
  Tag,
  Clock,
  BookOpen,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Hash,
  Award,
  AlertCircle
} from 'lucide-react';
import { ParsedNoteResult, ParsedNoteSection, ParsedFormulaItem } from '../../utils/notesParser';

interface ReviewNotesViewProps {
  parsedNotes: ParsedNoteResult | null;
  onUpdateNotes: (updated: ParsedNoteResult) => void;
}

export const ReviewNotesView: React.FC<ReviewNotesViewProps> = ({
  parsedNotes,
  onUpdateNotes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTakeaways, setEditingTakeaways] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddFormulaModal, setShowAddFormulaModal] = useState(false);

  // New section form state
  const [newSecHeading, setNewSecHeading] = useState('');
  const [newSecHeadingHindi, setNewSecHeadingHindi] = useState('');
  const [newSecType, setNewSecType] = useState<ParsedNoteSection['type']>('concept');
  const [newSecContent, setNewSecContent] = useState('');

  // New formula form state
  const [newFormulaTitle, setNewFormulaTitle] = useState('');
  const [newFormulaText, setNewFormulaText] = useState('');
  const [newFormulaDesc, setNewFormulaDesc] = useState('');

  if (!parsedNotes) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Parsed Notes Available</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please paste raw notes or load a sample preset in the <strong>"Paste & Parse Notes"</strong> tab first to view and edit the structured note cards.
        </p>
      </div>
    );
  }

  // Toggle accordion expand
  const toggleExpand = (id: string) => {
    setExpandedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedSectionIds(parsedNotes.sections.map((s) => s.id));
  };

  const collapseAll = () => {
    setExpandedSectionIds([]);
  };

  // Add Tag
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    const clean = newTagInput.trim().replace(/^#/, '');
    if (clean && !parsedNotes.tags.includes(clean)) {
      onUpdateNotes({
        ...parsedNotes,
        tags: [...parsedNotes.tags, clean],
      });
      setNewTagInput('');
    }
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateNotes({
      ...parsedNotes,
      tags: parsedNotes.tags.filter((t) => t !== tagToRemove),
    });
  };

  // Delete Section
  const handleDeleteSection = (secId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updated = parsedNotes.sections.filter((s) => s.id !== secId);
      onUpdateNotes({
        ...parsedNotes,
        sections: updated,
        stats: {
          ...parsedNotes.stats,
          totalSections: updated.length,
        },
      });
    }
  };

  // Delete Formula
  const handleDeleteFormula = (formulaId: string) => {
    const updated = parsedNotes.formulas.filter((f) => f.id !== formulaId);
    onUpdateNotes({
      ...parsedNotes,
      formulas: updated,
      stats: {
        ...parsedNotes.stats,
        totalFormulas: updated.length,
      },
    });
  };

  // Add new section
  const handleAddSectionSubmit = () => {
    if (!newSecHeading.trim()) return;
    const newSec: ParsedNoteSection = {
      id: `sec-${Date.now()}`,
      sectionNumber: parsedNotes.sections.length + 1,
      heading: newSecHeading.trim(),
      headingHindi: newSecHeadingHindi.trim() || undefined,
      type: newSecType,
      content: newSecContent.trim(),
      keyPoints: newSecContent.split('\n').filter((l) => l.trim().startsWith('-')).map((l) => l.replace(/^-\s*/, '').trim()),
    };

    const updated = [...parsedNotes.sections, newSec];
    onUpdateNotes({
      ...parsedNotes,
      sections: updated,
      stats: {
        ...parsedNotes.stats,
        totalSections: updated.length,
      },
    });

    setNewSecHeading('');
    setNewSecHeadingHindi('');
    setNewSecContent('');
    setShowAddSectionModal(false);
    setExpandedSectionIds((prev) => [...prev, newSec.id]);
  };

  // Add new formula
  const handleAddFormulaSubmit = () => {
    if (!newFormulaTitle.trim() || !newFormulaText.trim()) return;
    const newFormula: ParsedFormulaItem = {
      id: `f-${Date.now()}`,
      title: newFormulaTitle.trim(),
      formula: newFormulaText.trim(),
      description: newFormulaDesc.trim() || undefined,
    };

    const updated = [...parsedNotes.formulas, newFormula];
    onUpdateNotes({
      ...parsedNotes,
      formulas: updated,
      stats: {
        ...parsedNotes.stats,
        totalFormulas: updated.length,
      },
    });

    setNewFormulaTitle('');
    setNewFormulaText('');
    setNewFormulaDesc('');
    setShowAddFormulaModal(false);
  };

  // Filter sections by search
  const filteredSections = parsedNotes.sections.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.heading.toLowerCase().includes(term) ||
      (s.headingHindi && s.headingHindi.toLowerCase().includes(term)) ||
      s.content.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* 1. Header Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                {parsedNotes.noteType.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {parsedNotes.board} • Session {parsedNotes.academicYear}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              {parsedNotes.title}
            </h1>
            {parsedNotes.titleHindi && (
              <p className="text-sm font-semibold text-slate-600">
                {parsedNotes.titleHindi}
              </p>
            )}
          </div>

          {/* Read Time & Word Metrics */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Read Time
              </div>
              <div className="text-base font-bold text-slate-800">
                {parsedNotes.stats.readingTime} min
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Words
              </div>
              <div className="text-base font-bold text-slate-800">
                {parsedNotes.stats.wordCount}
              </div>
            </div>
          </div>
        </div>

        {/* Tags Container */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {parsedNotes.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors group"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="opacity-60 group-hover:opacity-100 hover:text-rose-600 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <div className="inline-flex items-center gap-1 ml-1">
            <input
              type="text"
              placeholder="+ add tag"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-24 px-2 py-0.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {newTagInput && (
              <button
                onClick={handleAddTag}
                className="p-1 rounded bg-amber-500 text-white hover:bg-amber-600 text-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Takeaways Card */}
      {parsedNotes.keyTakeaways.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Key Takeaways & Board Highlights ({parsedNotes.keyTakeaways.length})
              </h3>
            </div>
            <button
              onClick={() => setEditingTakeaways(!editingTakeaways)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editingTakeaways ? 'Done' : 'Edit Takeaways'}
            </button>
          </div>

          {editingTakeaways ? (
            <textarea
              value={parsedNotes.keyTakeaways.join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                onUpdateNotes({
                  ...parsedNotes,
                  keyTakeaways: lines,
                  stats: {
                    ...parsedNotes.stats,
                    totalKeyTakeaways: lines.length,
                  },
                });
              }}
              rows={5}
              className="w-full p-3 rounded-xl border border-amber-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <ul className="space-y-2 text-xs text-slate-700">
              {parsedNotes.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 3. Formulas and Scientific Ratios Card */}
      {parsedNotes.formulas.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Formulas, Equations & Laws ({parsedNotes.formulas.length})
              </h3>
            </div>
            <button
              onClick={() => setShowAddFormulaModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parsedNotes.formulas.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleDeleteFormula(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                    title="Delete formula"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="font-mono text-sm text-emerald-300 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800/80 break-words">
                  {item.formula}
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-400 italic">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Section by Section Viewer & Editor */}
      <div className="space-y-3">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Collapse All
            </button>
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section
            </button>
          </div>
        </div>

        {/* Section Accordions */}
        {filteredSections.map((sec, idx) => {
          const isExpanded = expandedSectionIds.includes(sec.id);
          const isEditing = editingSectionId === sec.id;

          const typeColors = {
            concept: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            summary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            formula: 'bg-amber-50 text-amber-800 border-amber-200',
            important_q: 'bg-rose-50 text-rose-700 border-rose-200',
            tips: 'bg-violet-50 text-violet-700 border-violet-200',
          };

          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleExpand(sec.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/80 select-none transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {sec.heading}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          typeColors[sec.type] || typeColors.concept
                        }`}
                      >
                        {sec.type}
                      </span>
                    </div>
                    {sec.headingHindi && (
                      <p className="text-xs font-medium text-slate-500">
                        {sec.headingHindi}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSectionId(isEditing ? null : sec.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit section"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(sec.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Accordion Body */}
              {(isExpanded || isEditing) && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase">
                            Section Heading (English)
                          </label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const updated = parsedNotes.sections.map((s) =>
                                s.id === sec.id ? { ...s, heading: e.target.value } : s
                              );
                              onUpdateNotes({ ...parsedNotes, sections: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase">
                            Hindi Heading (Optional)
                          </label>
                          <input
                            type="text"
                            value={sec.headingHindi || ''}
                            onChange={(e) => {
                              const updated = parsedNotes.sections.map((s) =>
                                s.id === sec.id ? { ...s, headingHindi: e.target.value } : s
                              );
                              onUpdateNotes({ ...parsedNotes, sections: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase">
                          Section Content (Markdown / Text)
                        </label>
                        <textarea
                          value={sec.content}
                          onChange={(e) => {
                            const updated = parsedNotes.sections.map((s) =>
                              s.id === sec.id ? { ...s, content: e.target.value } : s
                            );
                            onUpdateNotes({ ...parsedNotes, sections: updated });
                          }}
                          rows={6}
                          className="w-full p-3 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditingSectionId(null)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line space-y-2">
                      {sec.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Section</h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Section Heading</label>
                <input
                  type="text"
                  placeholder="e.g. Structure of Graafian Follicle"
                  value={newSecHeading}
                  onChange={(e) => setNewSecHeading(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Hindi Heading (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ग्राफियन पुटिका की संरचना"
                  value={newSecHeadingHindi}
                  onChange={(e) => setNewSecHeadingHindi(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Section Type</label>
                <select
                  value={newSecType}
                  onChange={(e) => setNewSecType(e.target.value as ParsedNoteSection['type'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none mt-1"
                >
                  <option value="concept">Concept & Theory</option>
                  <option value="summary">Summary & Overview</option>
                  <option value="formula">Formulas & Laws</option>
                  <option value="important_q">Board Important Questions</option>
                  <option value="tips">Exam Tips & Mnemonics</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Content / Explanations</label>
                <textarea
                  placeholder="Write section explanation or bullets..."
                  value={newSecContent}
                  onChange={(e) => setNewSecContent(e.target.value)}
                  rows={5}
                  className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSectionSubmit}
                disabled={!newSecHeading.trim()}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Formula Modal */}
      {showAddFormulaModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Formula / Equation</h3>
              <button
                onClick={() => setShowAddFormulaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Formula Title</label>
                <input
                  type="text"
                  placeholder="e.g. Coulomb's Law in Vector Form"
                  value={newFormulaTitle}
                  onChange={(e) => setNewFormulaTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Formula / Equation String</label>
                <input
                  type="text"
                  placeholder="e.g. F = (1/4πε₀) * (q₁q₂ / r²)"
                  value={newFormulaText}
                  onChange={(e) => setNewFormulaText(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description / Unit (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SI Unit: Newton (N), valid for point charges in vacuum"
                  value={newFormulaDesc}
                  onChange={(e) => setNewFormulaDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFormulaSubmit}
                disabled={!newFormulaTitle.trim() || !newFormulaText.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                Save Formula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
