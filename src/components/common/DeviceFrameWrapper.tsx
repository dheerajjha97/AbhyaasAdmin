import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, RotateCcw } from 'lucide-react';

export const DeviceFrameWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { devicePreview, setDevicePreview } = useApp();

  const getFrameWidth = () => {
    switch (devicePreview) {
      case 'android-small':
        return 'max-w-[360px]';
      case 'iphone-standard':
        return 'max-w-[390px]';
      case 'android-pixel':
        return 'max-w-[412px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'fluid':
      default:
        return 'w-full';
    }
  };

  const isSimulated = devicePreview !== 'fluid';

  if (!isSimulated) {
    return <div className="w-full min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-start p-2 sm:p-4 overflow-x-hidden">
      {/* Device Bezel Simulator Header */}
      <div className="mb-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {devicePreview === 'android-small'
              ? 'Galaxy A / Redmi (360px)'
              : devicePreview === 'iphone-standard'
              ? 'iPhone 14/15 (390px)'
              : devicePreview === 'android-pixel'
              ? 'Google Pixel 8 (412px)'
              : 'Tablet (768px)'}
          </span>
        </div>
        <button
          onClick={() => setDevicePreview('fluid')}
          className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold underline"
        >
          Exit Simulator
        </button>
      </div>

      {/* Mobile Device Frame */}
      <div
        className={`w-full ${getFrameWidth()} min-h-[92vh] bg-slate-50 border-[7px] border-[#1f2937] rounded-[38px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col relative`}
      >
        {/* Dynamic Island / Speaker Notch */}
        <div className="w-full pt-2.5 pb-1 flex justify-center bg-white border-b border-slate-100">
          <div className="w-24 h-4 bg-[#1f2937] rounded-full mb-0.5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-2" />
            <div className="w-8 h-1.5 rounded-full bg-slate-700" />
          </div>
        </div>

        {/* Inner App Container */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">{children}</div>

        {/* Home Indicator Bar */}
        <div className="w-full py-1.5 flex justify-center bg-white border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
