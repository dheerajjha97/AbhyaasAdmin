import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'drawer' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed or running standalone, suppress the install prompt
  if (isInstalled) {
    if (variant === 'drawer') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>App installed & ready offline</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop standard install
  if (isInstallable) {
    if (variant === 'drawer') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm hover:shadow transition-all text-xs font-bold cursor-pointer active:scale-98 ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-indigo-200" />
            <div className="text-left">
              <div className="font-bold">Install Abhyaas App</div>
              <div className="text-[10px] text-indigo-100 font-normal">Works offline like native app</div>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">Install</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Install Abhyaas App on your device"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow (Apple Safari doesn't support beforeinstallprompt)
  if (isIOS) {
    return (
      <>
        {variant === 'drawer' ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all text-xs font-bold cursor-pointer ${className}`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <div className="font-bold">Install on iPhone / iPad</div>
                <div className="text-[10px] text-slate-300 font-normal">Add to Home Screen</div>
              </div>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-200 border border-slate-700">Guide</span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            title="Install on iPhone / iPad"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer ${className}`}
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Install iOS</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Install Abhyaas on iOS</h3>
                    <p className="text-[11px] text-slate-500">Fast home screen access</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Tap the Share button</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">In Safari's bottom toolbar, tap the square icon with an upward arrow (<Share2 className="w-3 h-3 inline text-indigo-600" />).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Select "Add to Home Screen"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Scroll down and select <span className="font-medium text-slate-800">Add to Home Screen</span> (<PlusSquare className="w-3 h-3 inline text-indigo-600" />).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px]">Once added, Abhyaas runs in full-screen standalone mode with offline capabilities!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // If ambient beforeinstallprompt has not fired yet, show a clean helper button in drawer
  if (variant === 'drawer') {
    return (
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200/70 text-slate-600 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>PWA Ready</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Open in Chrome, Edge, or Safari to install as a standalone home-screen app.
        </p>
      </div>
    );
  }

  return null;
};
