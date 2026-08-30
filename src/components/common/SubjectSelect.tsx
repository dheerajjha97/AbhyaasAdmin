import React, { useState } from 'react';
import { BookOpen, Search, Plus, Sparkles, X, Check } from 'lucide-react';
import { ALL_SUBJECTS, SubjectOption, getSubjectsGroupedByStream } from '../../data/subjects';

interface SubjectSelectProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  colorTheme?: 'indigo' | 'emerald' | 'amber';
  allowCustom?: boolean;
  className?: string;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  value,
  onChange,
  label = 'Subject / विषय',
  colorTheme = 'indigo',
  allowCustom = true,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const grouped = getSubjectsGroupedByStream();
  const currentSubject = ALL_SUBJECTS.find((s) => s.id === value);

  // Filtered list for search modal
  const filteredSubjects = ALL_SUBJECTS.filter((sub) => {
    const matchesStream = selectedStream === 'all' || sub.stream === selectedStream;
    const matchesSearch =
      searchQuery === '' ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesSearch;
  });

  const handleAddCustomSubject = () => {
    if (!customSubjectInput.trim()) return;
    const cleanId = customSubjectInput.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    onChange(cleanId);
    setCustomSubjectInput('');
    setIsAddingCustom(false);
    setIsModalOpen(false);
  };

  const ringColor =
    colorTheme === 'emerald'
      ? 'focus:ring-emerald-500'
      : colorTheme === 'amber'
      ? 'focus:ring-amber-500'
      : 'focus:ring-indigo-600';

  const badgeBg =
    colorTheme === 'emerald'
      ? 'bg-emerald-600 text-white'
      : colorTheme === 'amber'
      ? 'bg-amber-600 text-white'
      : 'bg-indigo-600 text-white';

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-indigo-600" />
          <span>{label}</span>
        </label>
        
        {/* Quick Search / Browse Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
        >
          <Search className="w-2.5 h-2.5" />
          <span>All 30+ Subjects</span>
        </button>
      </div>

      {/* Primary Native Dropdown with Optgroups for Maximum Mobile Native Compatibility */}
      <select
        value={value}
        onChange={(e) => {
          if (e.target.value === '__add_custom__') {
            setIsModalOpen(true);
            setIsAddingCustom(true);
          } else {
            onChange(e.target.value);
          }
        }}
        className={`w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 ${ringColor} focus:outline-none transition-all shadow-2xs cursor-pointer`}
      >
        {/* If current value is custom, show it as selected */}
        {!currentSubject && value && (
          <option value={value}>
            {value.toUpperCase()} (Custom Subject)
          </option>
        )}

        {/* 1. Science */}
        <optgroup label="🧪 Science Stream (विज्ञान संकाय)">
          {grouped.science.subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name} [{sub.code}]
            </option>
          ))}
        </optgroup>

        {/* 2. Commerce */}
        <optgroup label="📊 Commerce Stream (वाणिज्य संकाय)">
          {grouped.commerce.subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name} [{sub.code}]
            </option>
          ))}
        </optgroup>

        {/* 3. Arts / Humanities */}
        <optgroup label="🏛️ Arts & Humanities (कला संकाय)">
          {grouped.arts.subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name} [{sub.code}]
            </option>
          ))}
        </optgroup>

        {/* 4. Languages */}
        <optgroup label="📖 Languages & Literature (भाषा संकाय)">
          {grouped.language.subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name} [{sub.code}]
            </option>
          ))}
        </optgroup>

        {allowCustom && (
          <optgroup label="➕ Custom Subject">
            <option value="__add_custom__">+ Add Other / Custom Subject...</option>
          </optgroup>
        )}
      </select>

      {/* Interactive 3D Subject Browser & Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border-2 border-indigo-100 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[88vh] flex flex-col card-3d-indigo animate-in slide-in-from-bottom-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Select Subject ({ALL_SUBJECTS.length}+ Available)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Class 9–12 Science, Commerce, Arts & Languages
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsAddingCustom(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject by English name, Hindi name, or code..."
                className="w-full h-10 pl-9 pr-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none shadow-inner"
              />
            </div>

            {/* Stream Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Subjects' },
                { id: 'science', label: '🧪 Science' },
                { id: 'commerce', label: '📊 Commerce' },
                { id: 'arts', label: '🏛️ Arts' },
                { id: 'language', label: '📖 Languages' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedStream(pill.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedStream === pill.id
                      ? `${badgeBg} shadow-xs font-black`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Subjects Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[42vh]">
              {filteredSubjects.map((sub) => {
                const isSelected = sub.id === value;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onChange(sub.id);
                      setIsModalOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-black shadow-xs'
                        : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200 text-slate-800 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 text-[10px] font-mono font-black uppercase text-center px-1 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-indigo-700">
                        {sub.code}
                      </span>
                      <div>
                        <div className="text-xs">{sub.name}</div>
                        <div className="text-[10px] text-slate-500">{sub.categoryLabel}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredSubjects.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No predefined subjects match &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>

            {/* Custom Subject Adder */}
            {allowCustom && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {!isAddingCustom ? (
                  <button
                    onClick={() => setIsAddingCustom(true)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Type & Add Custom Subject</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                    <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Custom Subject Name
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        placeholder="e.g. Psychology or Geology..."
                        className="flex-1 h-9 px-3 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                      <button
                        onClick={handleAddCustomSubject}
                        disabled={!customSubjectInput.trim()}
                        className="px-3 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
