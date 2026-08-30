import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Tag,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Atom,
  FlaskConical,
  Calculator
} from 'lucide-react';
import { ParsedNoteResult } from '../../utils/notesParser';

interface SavedNotesViewProps {
  savedNotes: ParsedNoteResult[];
  onLoadNote: (note: ParsedNoteResult) => void;
}

export const SavedNotesView: React.FC<SavedNotesViewProps> = ({
  savedNotes,
  onLoadNote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const filteredNotes = savedNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.titleHindi && note.titleHindi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      note.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject =
      selectedSubjectFilter === 'all' || note.subjectId === selectedSubjectFilter;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by chapter, subject, keyword, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects ({savedNotes.length})
          </button>
          <button
            onClick={() => setSelectedSubjectFilter('biology')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubjectFilter === 'biology'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            Biology
          </button>
          <button
            onClick={() => setSelectedSubjectFilter('physics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubjectFilter === 'physics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/60'
            }`}
          >
            Physics
          </button>
          <button
            onClick={() => setSelectedSubjectFilter('chemistry')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubjectFilter === 'chemistry'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            Chemistry
          </button>
        </div>
      </div>

      {/* Notes Cards Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Notes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No revision notes matched your search query. Try searching with a different term or load a new note in the "Paste & Parse Notes" tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const isBio = note.subjectId === 'biology' || note.subjectName.toLowerCase().includes('bio');
            const isPhy = note.subjectId === 'physics' || note.subjectName.toLowerCase().includes('phy');

            const badgeBg = isBio
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isPhy
              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
              : 'bg-amber-50 text-amber-800 border-amber-200';

            const IconComp = isBio ? BookOpen : isPhy ? Atom : FileText;

            return (
              <div
                key={note.noteId}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeBg}`}
                    >
                      <IconComp className="w-3 h-3" />
                      {note.subjectName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {note.academicYear}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {note.titleHindi && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                      {note.titleHindi}
                    </p>
                  )}

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Sections</div>
                      <div className="text-xs font-bold text-slate-800">
                        {note.stats.totalSections}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Formulas</div>
                      <div className="text-xs font-bold text-indigo-700">
                        {note.stats.totalFormulas}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Read Time</div>
                      <div className="text-xs font-bold text-emerald-700">
                        {note.stats.readingTime}m
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-400">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ready
                  </span>

                  <button
                    onClick={() => onLoadNote(note)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Load in Editor</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
