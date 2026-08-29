import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  Bookmark,
  FileEdit,
  Sparkles,
  UploadCloud,
  DownloadCloud,
  Send,
  Settings,
  X,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { NavTab } from '../../types';

export const MoreMenuSheet: React.FC = () => {
  const {
    isMoreMenuOpen,
    setIsMoreMenuOpen,
    activeTab,
    setActiveTab,
    papers,
    notes,
    chapters,
    resetToDefaultData
  } = useApp();

  if (!isMoreMenuOpen) return null;

  const menuSections = [
    {
      category: 'Core Content',
      items: [
        { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & Recent stats', count: null },
        { id: 'classes' as NavTab, label: 'Classes & Streams', icon: GraduationCap, desc: 'Class 9–12 & NEET/JEE', count: '4 Classes' },
        { id: 'subjects' as NavTab, label: 'Subjects', icon: BookOpen, desc: 'Biology, Physics, Chemistry', count: '6 Subjects' },
        { id: 'papers' as NavTab, label: 'Question Papers', icon: FileText, desc: 'Model Sets & Past Papers', count: `${papers.length} Sets` },
        { id: 'syllabus' as NavTab, label: 'Syllabus & Chapters', icon: Bookmark, desc: 'Chapters & Topic tracking', count: `${chapters.length} Chaps` },
        { id: 'notes' as NavTab, label: 'Notes Hub', icon: FileEdit, desc: 'Short revision notes', count: `${notes.length} Notes` },
      ],
    },
    {
      category: 'AI Engine & Publish',
      items: [
        { id: 'ai' as NavTab, label: 'AI Answers Generation', icon: Sparkles, desc: 'Gemini 3.7 batch solver', isSpecial: true },
        { id: 'publish' as NavTab, label: 'GitHub Publish', icon: Send, desc: 'Sync with student apps', count: 'v3 Ready' },
      ],
    },
    {
      category: 'Data Management & Tools',
      items: [
        { id: 'import' as NavTab, label: 'Import JSON', icon: UploadCloud, desc: 'Upload question paper JSON' },
        { id: 'export' as NavTab, label: 'Export JSON', icon: DownloadCloud, desc: 'Download JSON bundles' },
        { id: 'settings' as NavTab, label: 'Admin Settings', icon: Settings, desc: 'API Keys & Preferences' },
      ],
    },
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMoreMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={() => setIsMoreMenuOpen(false)} />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-white border-t border-slate-200 rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col z-10 animate-in slide-in-from-bottom-5">
        {/* Drag Handle & Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Abhyaas Admin Menu</h2>
              <p className="text-xs text-slate-500">All management sections & tools</p>
            </div>
          </div>
          <button
            onClick={() => setIsMoreMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1 pb-safe">
          {menuSections.map((sec) => (
            <div key={sec.category} className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                {sec.category}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all select-none active:scale-[0.99] text-left border ${
                        isCurrent
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : item.isSpecial
                          ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isCurrent
                              ? 'bg-white text-slate-900 font-bold'
                              : item.isSpecial
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={`font-semibold text-sm flex items-center gap-2 ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                            {item.label}
                            {item.count && (
                              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${isCurrent ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>
                                {item.count}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>{item.desc}</p>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Reset Option */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (confirm('Reset sample data to initial Bihar & CBSE Board 2026 sets?')) {
                  resetToDefaultData();
                  setIsMoreMenuOpen(false);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Sample Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
