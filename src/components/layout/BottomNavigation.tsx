import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  FileText,
  Sparkles,
  MoreHorizontal,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { NavTab } from '../../types';

export const BottomNavigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsMoreMenuOpen,
    papers,
    isGeneratingBatch,
    aiBatchJob
  } = useApp();

  // Calculate review or missing questions count across all papers for notification badge
  const totalReviewOrMissing = papers.reduce((sum, p) => {
    const review = p.questions.filter((q) => q.aiStatus === 'review').length;
    const missing = p.questions.filter((q) => q.aiStatus === 'missing').length;
    return sum + review + missing;
  }, 0);

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'papers' as NavTab,
      label: 'Papers',
      icon: FileText,
      badge: papers.length,
    },
    {
      id: 'ai' as NavTab,
      label: 'AI Answers',
      icon: Sparkles,
      badge: isGeneratingBatch ? `${aiBatchJob?.progress}%` : (totalReviewOrMissing > 0 ? totalReviewOrMissing : null),
      isAI: true,
    },
    {
      id: 'more' as NavTab,
      label: 'More',
      icon: MoreHorizontal,
      badge: null,
      isMore: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-slate-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.isMore
              ? false
              : item.id === activeTab ||
                (item.id === 'papers' && (activeTab === 'questions' || activeTab === 'editor')) ||
                (item.id === 'ai' && (activeTab === 'ai' || activeTab === 'review'));

          return (
            <button
              key={item.label}
              id={`nav-bottom-${item.label.toLowerCase()}`}
              onClick={() => {
                if (item.isMore) {
                  setIsMoreMenuOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 select-none transition-all duration-150 active:scale-95 ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active Indicator Top Glow Pill */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-slate-900 shadow-sm" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-slate-900' : 'text-slate-500'
                  }`}
                />

                {/* Badge if present */}
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-tight ${
                      item.isAI && isGeneratingBatch
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : item.isAI
                        ? 'bg-amber-500 text-white font-black'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
