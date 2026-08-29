import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BookOpen,
  Bookmark,
  FileEdit,
  GraduationCap,
  UploadCloud,
  DownloadCloud,
  Send,
  Settings,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { NavTab } from '../../types';

export const SidebarDesktop: React.FC = () => {
  const { activeTab, setActiveTab, papers, isGeneratingBatch, aiBatchJob } = useApp();

  const links = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes' as NavTab, label: 'Classes & Streams', icon: GraduationCap },
    { id: 'subjects' as NavTab, label: 'Subjects', icon: BookOpen },
    { id: 'papers' as NavTab, label: 'Question Papers', icon: FileText, badge: papers.length },
    { id: 'syllabus' as NavTab, label: 'Syllabus Editor', icon: Bookmark },
    { id: 'notes' as NavTab, label: 'Notes Manager', icon: FileEdit },
    { id: 'ai' as NavTab, label: 'AI Answer Gen', icon: Sparkles, isAi: true },
    { id: 'publish' as NavTab, label: 'GitHub Publish', icon: Send },
    { id: 'import' as NavTab, label: 'Import JSON', icon: UploadCloud },
    { id: 'export' as NavTab, label: 'Export JSON', icon: DownloadCloud },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col justify-between hidden lg:flex select-none h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Abhyaas Admin</h1>
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Mobile-First Engine
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              activeTab === link.id ||
              (link.id === 'papers' && (activeTab === 'editor' || activeTab === 'questions')) ||
              (link.id === 'ai' && activeTab === 'review');

            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : link.isAi && isGeneratingBatch
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.isAi ? 'text-amber-500' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </div>

                {link.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {link.badge}
                  </span>
                )}
                {link.isAi && isGeneratingBatch && (
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[10px] text-white animate-pulse">
                    {aiBatchJob?.progress}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Mobile Target: 360-430px</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">v3.0.4</span>
      </div>
    </aside>
  );
};
