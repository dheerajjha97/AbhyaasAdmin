import React from 'react';
import {
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  Zap,
  Menu,
  Settings,
  UploadCloud
} from 'lucide-react';

interface MobileBottomNavProps {
  activeEngine: 'dashboard' | 'questions' | 'syllabus' | 'notes';
  setActiveEngine: (engine: 'dashboard' | 'questions' | 'syllabus' | 'notes') => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onJumpToPush: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeEngine,
  setActiveEngine,
  onOpenDrawer,
  onOpenSettings,
  onJumpToPush,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveEngine('dashboard')}
          className={`flex flex-col items-center justify-center w-14 h-11 rounded-2xl transition-all cursor-pointer ${
            activeEngine === 'dashboard'
              ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/20 scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 leading-none">Home</span>
        </button>

        {/* 2. Q&A Engine */}
        <button
          onClick={() => setActiveEngine('questions')}
          className={`flex flex-col items-center justify-center w-14 h-11 rounded-2xl transition-all cursor-pointer ${
            activeEngine === 'questions'
              ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/20 scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 leading-none">Q&A</span>
        </button>

        {/* 3. Syllabus Engine */}
        <button
          onClick={() => setActiveEngine('syllabus')}
          className={`flex flex-col items-center justify-center w-14 h-11 rounded-2xl transition-all cursor-pointer ${
            activeEngine === 'syllabus'
              ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-500/20 scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 leading-none">Syllabus</span>
        </button>

        {/* 4. Notes Engine */}
        <button
          onClick={() => setActiveEngine('notes')}
          className={`flex flex-col items-center justify-center w-14 h-11 rounded-2xl transition-all cursor-pointer ${
            activeEngine === 'notes'
              ? 'bg-amber-600 text-white font-black shadow-md shadow-amber-500/20 scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 leading-none">Notes</span>
        </button>

        {/* 5. Navigation Drawer Trigger */}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center w-14 h-11 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] mt-0.5 leading-none">Menu</span>
        </button>

      </div>
    </nav>
  );
};
