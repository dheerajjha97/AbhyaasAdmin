import React, { useState } from 'react';
import {
  Github,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  GitCommit,
  GitBranch,
  FileCode2,
  Sparkles,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { ParsedPaperResult } from '../../utils/questionParser';
import { pushFileToGitHub } from '../../utils/githubService';
import { FolderPathSelector } from '../common/FolderPathSelector';

interface MathGitHubPushViewProps {
  parsedResult: ParsedPaperResult | null;
  targetFilename: string;
  setTargetFilename: (val: string) => void;
  githubToken: string;
  repoOwner: string;
  repoName: string;
  onOpenSettings: () => void;
}

export const MathGitHubPushView: React.FC<MathGitHubPushViewProps> = ({
  parsedResult,
  targetFilename,
  setTargetFilename,
  githubToken,
  repoOwner,
  repoName,
  onOpenSettings,
}) => {
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState(
    parsedResult
      ? `feat: Add ${parsedResult.className} Mathematics ${parsedResult.year} (${parsedResult.set}) Question Bank`
      : 'feat: Add Mathematics Question Bank'
  );
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{
    success: boolean;
    message: string;
    commitSha?: string;
  } | null>(null);

  if (!parsedResult || parsedResult.questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Github className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800">GitHub पर पुश करने के लिए कोई प्रश्न नहीं</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          कृपया पहले प्रश्न पत्र पार्स करें।
        </p>
      </div>
    );
  }

  const handlePush = async () => {
    if (!githubToken) {
      setPushStatus({
        success: false,
        message: 'GitHub Personal Access Token सेट नहीं है। कृपया Settings में जाकर टोकन दर्ज करें।',
      });
      return;
    }

    setIsPushing(true);
    setPushStatus(null);

    const jsonPayload = {
      schemaVersion: '2.0',
      contentType: 'exam_paper',
      generatedAt: new Date().toISOString(),
      paper: {
        id: parsedResult.paperId,
        title: parsedResult.title,
        classId: parsedResult.classId,
        className: parsedResult.className,
        subjectId: parsedResult.subjectId,
        subjectName: parsedResult.subjectName,
        board: parsedResult.board,
        year: parsedResult.year,
        set: parsedResult.set,
        durationMinutes: parsedResult.durationMinutes,
        totalMarks: parsedResult.totalMarks,
        totalQuestions: parsedResult.stats.totalQuestions,
        stats: parsedResult.stats,
      },
      sections: parsedResult.sections,
      questions: parsedResult.questions,
    };

    const res = await pushFileToGitHub({
      token: githubToken,
      owner: repoOwner,
      repo: repoName,
      path: targetFilename,
      content: JSON.stringify(jsonPayload, null, 2),
      commitMessage,
      branch,
    });

    setIsPushing(false);
    setPushStatus({
      success: res.success,
      message: res.error || (res.success ? 'सफलतापूर्वक कमिट और पुश हुआ (Pushed successfully)!' : 'पुश करने में त्रुटि आई'),
      commitSha: res.commitSha,
    });
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Configuration Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                4. GitHub पर डिप्लॉय करें (Push to Repository)
              </h2>
              <p className="text-xs text-slate-500">
                Directly push this 138-question Mathematics bank into your mobile app data repo.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Repo Settings
          </button>
        </div>

        {/* Repository Destination */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-600" />
            <span>टारगेट रिपॉजिटरी:</span>
            <strong className="text-slate-900">{repoOwner}/{repoName}</strong>
          </div>
          <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {githubToken ? 'Token Configured' : 'Token Missing'}
          </span>
        </div>

        {/* Target File Path with Folder Selector */}
        <FolderPathSelector
          targetPath={targetFilename}
          onChangeTargetPath={setTargetFilename}
          githubToken={githubToken}
          repoOwner={repoOwner}
          repoName={repoName}
          branch={branch}
          type="math"
          label="फाइल पथ व फोल्डर चयन (Target Repository Folder & File)"
        />

        {/* Commit Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-indigo-600" />
            <span>कमिट संदेश (Commit Message):</span>
          </label>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-sans font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Branch */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-emerald-600" />
            <span>ब्रांच (Branch):</span>
          </label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Push Status Toast/Alert */}
        {pushStatus && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              pushStatus.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {pushStatus.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <strong className="font-bold block">
                {pushStatus.success ? 'सफलतापूर्वक कमिट हुआ (Pushed to GitHub)!' : 'पुश विफल रहा'}
              </strong>
              <p className="leading-relaxed">{pushStatus.message}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {pushStatus.commitSha && (
                  <span className="inline-block text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    SHA: {pushStatus.commitSha.slice(0, 7)}
                  </span>
                )}
                {pushStatus.success && repoOwner && repoName && (
                  <a
                    href={`https://github.com/${repoOwner}/${repoName}/blob/${branch}/${targetFilename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white/80 border border-emerald-300 px-2 py-0.5 rounded-md hover:bg-white transition-colors"
                  >
                    <span>View file on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Push Trigger Button */}
        <div className="pt-2">
          <button
            onClick={handlePush}
            disabled={isPushing}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isPushing
                ? 'bg-slate-400 text-white cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white shadow-indigo-600/25 active:scale-98'
            }`}
          >
            {isPushing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>GitHub पर पुश हो रहा है...</span>
              </>
            ) : (
              <>
                <Github className="w-4 h-4 text-amber-300" />
                <span>Push {parsedResult.stats.totalQuestions} Questions to GitHub</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
