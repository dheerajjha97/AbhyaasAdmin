import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Layers
} from 'lucide-react';
import { DevicePreviewMode } from '../../types';

export const MobileHeader: React.FC = () => {
  const {
    activeTab,
    setIsMoreMenuOpen,
    devicePreview,
    setDevicePreview,
    activities,
    hasGeminiKey,
    isGeneratingBatch,
    aiBatchJob
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showDevicePicker, setShowDevicePicker] = useState(false);

  const deviceModes: DevicePreviewMode[] = [
    { id: 'fluid', name: 'Fluid (Fill Screen)', width: '100%', desc: 'Adapts to your actual browser width' },
    { id: 'android-small', name: 'Android Small (360px)', width: '360px', desc: 'Galaxy A / Redmi compact smartphones' },
    { id: 'iphone-standard', name: 'Standard (390px)', width: '390px', desc: 'iPhone 13/14/15 standard viewport' },
    { id: 'android-pixel', name: 'Android Pixel (412px)', width: '412px', desc: 'Pixel 7/8 & Samsung Galaxy S24' },
    { id: 'tablet', name: 'Tablet (768px)', width: '768px', desc: 'iPad / Android tablets viewport' },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Abhyaas Admin';
      case 'papers': return 'Question Papers';
      case 'editor': return 'Question Editor';
      case 'ai': return 'AI Answer Gen';
      case 'review': return 'Answer Review';
      case 'syllabus': return 'Syllabus';
      case 'notes': return 'Notes Hub';
      case 'import': return 'Import JSON';
      case 'export': return 'Export JSON';
      case 'publish': return 'GitHub Publish';
      case 'classes': return 'Classes & Subjects';
      case 'settings': return 'Admin Settings';
      default: return 'Abhyaas Admin';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 select-none shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-3 max-w-7xl mx-auto">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-2.5">
          <button
            id="mobile-header-menu-btn"
            onClick={() => setIsMoreMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {getPageTitle()}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide">
              Bihar / CBSE Exam Board
            </span>
          </div>
        </div>

        {/* Right: Device Switcher & Notifications */}
        <div className="flex items-center gap-1.5">
          {/* Device Simulator Toggle (visible on wide screens for testing) */}
          <div className="relative">
            <button
              id="device-simulator-btn"
              onClick={() => setShowDevicePicker(!showDevicePicker)}
              className={`h-9 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                devicePreview !== 'fluid'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Test Mobile Device Viewports (360px - 430px)"
            >
              <Smartphone className={`w-3.5 h-3.5 ${devicePreview !== 'fluid' ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className="hidden sm:inline">
                {deviceModes.find((d) => d.id === devicePreview)?.name.split(' ')[0] || 'Mobile'}
              </span>
            </button>

            {showDevicePicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Device Simulator (360px-430px)</span>
                  <button onClick={() => setShowDevicePicker(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1 mt-1.5">
                  {deviceModes.map((dm) => (
                    <button
                      key={dm.id}
                      onClick={() => {
                        setDevicePreview(dm.id);
                        setShowDevicePicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                        devicePreview === dm.id
                          ? 'bg-slate-900 text-white font-medium'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-semibold">{dm.name}</span>
                      <span className={`text-[10px] ${devicePreview === dm.id ? 'text-slate-300' : 'text-slate-400'}`}>
                        {dm.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Status Indicator */}
          {isGeneratingBatch ? (
            <div className="h-9 px-2 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center gap-1.5 text-xs text-indigo-700">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span className="font-mono text-[11px] font-bold">{aiBatchJob?.progress || 0}%</span>
            </div>
          ) : (
            <div
              className={`h-9 px-2 rounded-lg border flex items-center gap-1.5 text-xs font-medium ${
                hasGeminiKey
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title={hasGeminiKey ? 'Gemini 3.7 Flash Connected' : 'Gemini AI Ready'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] hidden sm:inline">AI Online</span>
            </div>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-500" /> Recent Updates & Sync
                  </span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{act.title}</span>
                        <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{act.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
