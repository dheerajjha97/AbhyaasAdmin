import React from 'react';
import { Github, Key, CheckCircle, X, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { ThreeDCloudPushIllustration } from '../common/ThreeDIllustrations';

interface MobileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubToken: string;
  setGithubToken: (val: string) => void;
  repoOwner: string;
  setRepoOwner: (val: string) => void;
  repoName: string;
  setRepoName: (val: string) => void;
}

export const MobileSettingsModal: React.FC<MobileSettingsModalProps> = ({
  isOpen,
  onClose,
  githubToken,
  setGithubToken,
  repoOwner,
  setRepoOwner,
  repoName,
  setRepoName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border-2 border-indigo-100 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto card-3d-indigo animate-in slide-in-from-bottom-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="shrink-0 p-1 bg-indigo-50 rounded-2xl border border-indigo-200 shadow-xs">
              <ThreeDCloudPushIllustration size={44} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-black uppercase tracking-wider">
                  GitHub Cloud Sync
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {githubToken ? 'Connected' : 'Token Required'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                Repository & Auth Settings
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            Automatic Direct Commits
          </p>
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            Configure your GitHub Personal Access Token (PAT) with <code className="font-bold bg-indigo-100 px-1 py-0.5 rounded text-indigo-950">repo</code> scope to publish Question Banks, Syllabi, and Notes directly into your repository.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          {/* GitHub Token */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                Personal Access Token (PAT)
              </span>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=AbhyaasDataSync"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Generate Token <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Repo Owner & Repo Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-700" /> Repository Owner
              </label>
              <input
                type="text"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
                placeholder="e.g. abhyaas-app"
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-700" /> Repository Name
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="e.g. AbhyaasData"
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-indigo-600 text-white font-bold text-sm btn-3d-indigo flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
