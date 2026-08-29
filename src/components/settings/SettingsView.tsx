import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Sparkles,
  Database,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { hasGeminiKey, resetToDefaultData, devicePreview, setDevicePreview } = useApp();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="pb-1 border-b border-slate-200">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" /> Admin Settings
        </h1>
        <p className="text-xs text-slate-500">System Preferences & Engine Configuration</p>
      </div>

      {/* AI Status Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gemini AI Model</h3>
              <p className="text-xs text-slate-500">Gemini 3.7 Flash Engine via Server API</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {hasGeminiKey ? 'Active & Ready' : 'Online'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Provides automated Hindi bilingual answers, step-by-step marking schemes, and question explanations without exposing API keys to the browser.
        </p>
      </div>

      {/* Device Viewport Simulation */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Device Viewport Simulator</h3>
            <p className="text-xs text-slate-500">Mobile-First Testing (360px - 430px)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'fluid', label: 'Fluid 100%' },
            { id: 'android-small', label: 'Android 360px' },
            { id: 'iphone-standard', label: 'iPhone 390px' },
            { id: 'android-pixel', label: 'Pixel 412px' },
          ].map((dm) => (
            <button
              key={dm.id}
              onClick={() => setDevicePreview(dm.id as any)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                devicePreview === dm.id
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {dm.label}
            </button>
          ))}
        </div>
      </div>

      {/* Local Storage & Reset */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Database Management</h3>
            <p className="text-xs text-slate-500">Local Browser Cache & Sample Presets</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset to standard Bihar Board & CBSE 2026 Question Sets?')) {
              resetToDefaultData();
              alert('Sample database reset successfully!');
            }
          }}
          className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset Database to 2026 Sample Data
        </button>
      </div>

      {/* Applet Version Info */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-600" />
          <span>Abhyaas Mobile Admin Panel</span>
        </div>
        <span className="font-mono text-slate-500">v3.0.4 (Production)</span>
      </div>
    </div>
  );
};
