import React, { useState } from 'react';
import { testConnection } from '../../utils/githubService';
import {
  UploadCloud,
  CheckCircle2,
  GitCommit,
  FileCode2,
  ExternalLink,
  ArrowLeft,
  Loader2,
  History,
  KeyRound,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
  Check,
  PlusCircle,
  FolderGit2,
  Lock,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ParsedPaperResult } from '../../utils/questionParser';
import { FolderPathSelector } from '../common/FolderPathSelector';

interface GitHubPushViewProps {
  parsedResult: ParsedPaperResult;
  targetFilename: string;
  setTargetFilename: (val: string) => void;
  branch: string;
  setBranch: (val: string) => void;
  commitMessage: string;
  setCommitMessage: (val: string) => void;
  githubToken: string;
  setGithubToken: (val: string) => void;
  repoOwner: string;
  setRepoOwner: (val: string) => void;
  repoName: string;
  setRepoName: (val: string) => void;
  onPushToGitHub: () => Promise<any>;
  pushHistory: Array<{
    id: string;
    filename: string;
    commitSha: string;
    message: string;
    timestamp: string;
    questionsCount: number;
    title: string;
  }>;
  onNavigateBack: () => void;
}

export const GitHubPushView: React.FC<GitHubPushViewProps> = ({
  parsedResult,
  targetFilename,
  setTargetFilename,
  branch,
  setBranch,
  commitMessage,
  setCommitMessage,
  githubToken,
  setGithubToken,
  repoOwner,
  setRepoOwner,
  repoName,
  setRepoName,
  onPushToGitHub,
  pushHistory,
  onNavigateBack,
}) => {
  const [isPushing, setIsPushing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [userRepos, setUserRepos] = useState<Array<{
    name: string;
    fullName: string;
    owner: string;
    isPrivate: boolean;
    defaultBranch: string;
  }>>([]);
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    user?: string;
    error?: string;
    isNotFound?: boolean;
    diagnostics?: {
      tokenUser: string;
      oauthScopes?: string;
      isFineGrained?: boolean;
      accessibleReposCount: number;
      accessibleRepos: Array<{ name: string; fullName: string; owner: string; isPrivate: boolean }>;
      matchingRepo?: { name: string; fullName: string; owner: string } | null;
    };
  } | null>(null);

  const [createRepoResult, setCreateRepoResult] = useState<{
    success: boolean;
    message: string;
    repoUrl?: string;
  } | null>(null);

  const [pushError, setPushError] = useState<string | null>(null);
  const [showTroubleshoot, setShowTroubleshoot] = useState(true);

  const [lastPushSuccess, setLastPushSuccess] = useState<{
    commitSha: string;
    filename: string;
    branch: string;
    timestamp: string;
    fileUrl: string;
    questionsCount: number;
    isLiveGitHub?: boolean;
    notice?: string;
  } | null>(null);

  // Test connection to GitHub and check Repo
  const handleTestConnection = async () => {
    if (!githubToken.trim()) {
      setConnectionStatus({
        tested: true,
        success: false,
        error: 'कृपया GitHub Personal Access Token दर्ज करें (Please enter a GitHub Token)',
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus(null);
    setCreateRepoResult(null);
    try {
      const data = await testConnection(githubToken.trim(), repoOwner.trim(), repoName.trim());
      if (data.success) {
        setConnectionStatus({
          tested: true,
          success: true,
          user: data.user?.login || 'User',
        });
        if (data.user?.login && !repoOwner) {
          setRepoOwner(data.user.login);
        }
        if (data.repoStatus?.defaultBranch) {
          setBranch(data.repoStatus.defaultBranch);
        }
      } else {
        const is404 = data.error?.includes('not found') || data.error?.includes('Not Found');
        setConnectionStatus({
          tested: true,
          success: false,
          user: data.user?.login,
          error: data.error || 'Authentication failed',
          isNotFound: is404,
        });
        if (data.user?.login && (!repoOwner || repoOwner === 'abhyaas-app')) {
          setRepoOwner(data.user.login);
        }
      }
    } catch (e: any) {
      setConnectionStatus({
        tested: true,
        success: false,
        error: e.message || 'Connection test failed',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // 1-Click Create Repository on GitHub
  const handleCreateRepo = async (isPrivate: boolean = false) => {
    if (!githubToken.trim()) {
      alert('Please enter your GitHub Personal Access Token first.');
      return;
    }
    const targetName = repoName.trim() || 'AbhyaasData';

    setIsCreatingRepo(true);
    setCreateRepoResult(null);
    try {
      const res = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken.trim(),
          repoName: targetName,
          isPrivate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRepoName(data.repo.name);
        if (data.repo.owner) {
          setRepoOwner(data.repo.owner);
        }
        setBranch(data.repo.defaultBranch || 'main');
        setCreateRepoResult({
          success: true,
          message: `Repository "${data.repo.fullName}" successfully created on GitHub!`,
          repoUrl: data.repo.htmlUrl,
        });
        setConnectionStatus({
          tested: true,
          success: true,
          user: data.repo.owner,
        });
      } else {
        setCreateRepoResult({
          success: false,
          message: data.error || 'Failed to create repository on GitHub.',
        });
      }
    } catch (e: any) {
      setCreateRepoResult({
        success: false,
        message: e.message || 'Network error while creating repository.',
      });
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Fetch all repositories for the token user
  const handleFetchUserRepos = async () => {
    if (!githubToken.trim()) {
      alert('Please enter your GitHub Personal Access Token first.');
      return;
    }
    setIsLoadingRepos(true);
    try {
      const res = await fetch('/api/github/user-repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken.trim() }),
      });
      const data = await res.json();
      if (data.success && data.repositories) {
        setUserRepos(data.repositories);
        setShowRepoDropdown(true);
      } else {
        alert(data.error || 'Could not list repositories.');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to fetch repositories.');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handlePush = async () => {
    setIsPushing(true);
    setPushError(null);
    try {
      const res = await onPushToGitHub();
      if (res && res.success) {
        setLastPushSuccess({
          commitSha: res.commitSha || '8a9f2c1',
          filename: res.filename || targetFilename,
          branch: res.branch || branch,
          timestamp: res.timestamp || new Date().toISOString(),
          fileUrl: res.fileUrl || `https://github.com/${repoOwner || 'abhyaas-app'}/${repoName || 'exam-data'}/blob/${branch}/${targetFilename}`,
          questionsCount: parsedResult.stats.totalQuestions,
          isLiveGitHub: res.isLiveGitHub,
          notice: res.notice,
        });
      } else {
        setPushError(res?.error || 'Commit failed. Check token permissions and repository name.');
      }
    } catch (e: any) {
      console.error('Push failed:', e);
      setPushError(e.message || 'Network error while attempting commit to GitHub');
    } finally {
      setIsPushing(false);
    }
  };

  const safeOwner = repoOwner.trim() || 'jhadheeraj97';
  const safeRepo = repoName.trim() || 'AbhyaasData';

  return (
    <div className="space-y-4">
      {/* Configuration Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" /> 4. Push JSON to GitHub Repository
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish this parsed question bank directly to your GitHub repository or preview the generated commit payload.
            </p>
          </div>

          <button
            onClick={onNavigateBack}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Generator</span>
          </button>
        </div>

        {/* GitHub Credentials & Target Repo Settings */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs text-slate-900">GitHub Target Repository & Authentication</span>
            </div>

            {githubToken ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3" /> Token Set
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                Token Not Configured (Local Mode)
              </span>
            )}
          </div>

          {/* GitHub Token Input Row */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                GitHub Personal Access Token (PAT)
                <span className="text-[10px] text-slate-400 font-normal">(Needs 'repo' or 'contents:write' permission)</span>
              </label>
              <a
                href="https://github.com/settings/tokens/new?description=Abhyaas%20Admin&scopes=repo"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Generate Classic Token (Recommended)</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showToken ? 'text' : 'password'}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx or github_pat_..."
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full h-9 pl-3 pr-9 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection || !githubToken.trim()}
                className="h-9 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
            {/* Repo Owner */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Repository Owner (Username / Org)
              </label>
              <input
                type="text"
                placeholder="e.g. jhadheeraj97"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            {/* Repo Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-600">
                  Repository Name
                </label>
                {githubToken && (
                  <button
                    type="button"
                    onClick={handleFetchUserRepos}
                    disabled={isLoadingRepos}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    {isLoadingRepos ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <FolderGit2 className="w-2.5 h-2.5" />}
                    <span>Select Existing</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. AbhyaasData"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Repo Selection Dropdown if user clicks 'Select Existing' */}
          {showRepoDropdown && userRepos.length > 0 && (
            <div className="p-3 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                  Your GitHub Repositories visible to this token ({userRepos.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setShowRepoDropdown(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {userRepos.map((r) => (
                  <button
                    key={r.fullName}
                    type="button"
                    onClick={() => {
                      setRepoName(r.name);
                      if (r.owner) setRepoOwner(r.owner);
                      if (r.defaultBranch) setBranch(r.defaultBranch);
                      setShowRepoDropdown(false);
                      setConnectionStatus(null);
                    }}
                    className={`p-2 rounded-xl text-left border transition-colors flex items-center justify-between text-xs cursor-pointer group ${
                      r.name.toLowerCase() === repoName.toLowerCase()
                        ? 'bg-indigo-50 border-indigo-300'
                        : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-mono font-bold text-slate-800 group-hover:text-indigo-900 truncate">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {r.fullName}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                      {r.isPrivate ? <Lock className="w-3 h-3 text-amber-500" /> : <Globe className="w-3 h-3 text-slate-400" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Connection Test Results & Exact Diagnostic Banner */}
          {connectionStatus && (
            <div
              className={`p-3.5 rounded-2xl text-xs space-y-2.5 ${
                connectionStatus.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-950 border border-rose-200'
              }`}
            >
              {connectionStatus.success ? (
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Connected as <strong>{connectionStatus.user}</strong>. Target repository{' '}
                    <strong className="font-mono">{safeOwner}/{safeRepo}</strong> is verified and ready for live commits!
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-900 text-sm">
                        {connectionStatus.isNotFound
                          ? `GitHub API ने Repository "${safeOwner}/${safeRepo}" को "Not Found (404)" बताया`
                          : 'Authentication / Permission Error'}
                      </div>
                      <div className="text-[11px] text-rose-700 mt-0.5">
                        {connectionStatus.error}
                      </div>
                    </div>
                  </div>

                  {/* If there's a fuzzy/case match found among accessible repos */}
                  {connectionStatus.diagnostics?.matchingRepo && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between gap-2">
                      <div className="text-[11px]">
                        💡 क्या आपकी रिपॉजिटरी का नाम <strong className="font-mono font-bold">{connectionStatus.diagnostics.matchingRepo.name}</strong> है?
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (connectionStatus.diagnostics?.matchingRepo) {
                            setRepoName(connectionStatus.diagnostics.matchingRepo.name);
                            setRepoOwner(connectionStatus.diagnostics.matchingRepo.owner);
                            setConnectionStatus(null);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span>Apply Name</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Diagnostic Explanation for Why 404 Happens on Existing Repos */}
                  <div className="p-3 rounded-xl bg-white/95 border border-rose-200 text-slate-800 space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-950">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>आपकी रिपॉजिटरी GitHub पर मौजूद होने के बावजूद 404 आने के 2 मुख्य कारण:</span>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-700 leading-relaxed">
                      {/* Reason 1: Fine-grained Token with Selected Repositories */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">1. Fine-Grained Token में Repository Add न होना (Most Common):</strong>
                        जब आप GitHub पर नया <em>Fine-grained Token</em> बनाते हैं, तो GitHub सिर्फ उन्हीं रिपॉजिटरी को एक्सेस देता है जिन्हें आपने <strong>"Only select repositories"</strong> में टिक किया हो। अगर <strong>AbhyaasData</strong> उसमें सेलेक्ट नहीं था, तो GitHub सुरक्षा के कारण 404 बोल देता है।
                        <div className="mt-1 font-semibold text-indigo-700">
                          👉 समाधान: <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer" className="underline font-bold">GitHub Token Settings</a> में जाकर अपने टोकन में <strong>AbhyaasData</strong> रिपॉजिटरी को जोड़ें, या नीचे दिए लिंक से <strong>Classic Token</strong> बनाएं।
                        </div>
                      </div>

                      {/* Reason 2: Classic Token without 'repo' Scope */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">2. Classic Token में 'repo' Scope न होना (Private Repo के लिए):</strong>
                        यदि आपकी रिपॉजिटरी Private है, तो टोकन बनाते वक्त <strong>repo</strong> (Full control of private repositories) का टिक होना अनिवार्य है।
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href="https://github.com/settings/tokens/new?description=Abhyaas%20Admin&scopes=repo"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Generate Classic Token (with 'repo' scope)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={handleFetchUserRepos}
                        disabled={isLoadingRepos}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FolderGit2 className="w-3 h-3" />
                        <span>View All Repos My Token Can See</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateRepo(false)}
                        disabled={isCreatingRepo}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Create / Re-link '{safeRepo}'</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Repo Creation Feedback */}
          {createRepoResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                createRepoResult.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {createRepoResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{createRepoResult.message}</span>
              </div>
              {createRepoResult.repoUrl && (
                <a
                  href={createRepoResult.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Form Inputs: File Path & Commit Message */}
        <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          {/* Target File Path with Folder Selector */}
          <FolderPathSelector
            targetPath={targetFilename}
            onChangeTargetPath={setTargetFilename}
            githubToken={githubToken}
            repoOwner={repoOwner}
            repoName={repoName}
            branch={branch}
            type="paper"
            label="Target JSON File Path in Repo"
          />

          {/* Commit Message */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5 text-indigo-600" /> Git Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-sans focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Paper Summary Pill before Push */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-extrabold text-slate-900">{parsedResult.title}</span>
            <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-2">
              <span>{parsedResult.stats.totalQuestions} Questions</span> •
              <span>{parsedResult.stats.mcqCount} MCQs</span> •
              <span>{parsedResult.stats.shortCount} Short</span> •
              <span>{parsedResult.stats.longCount} Long</span>
            </div>
          </div>

          <button
            onClick={handlePush}
            disabled={isPushing}
            id="github-push-btn"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {isPushing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Publishing to GitHub...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-white" />
                <span>{githubToken ? 'Push Real Commit to GitHub' : 'Commit & Save Locally'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Push Error Alert */}
      {pushError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Commit Failed (कमि़ट नहीं हुआ)</span>
          </div>
          <p className="font-mono bg-white/70 p-2 rounded-lg border border-rose-200">{pushError}</p>
        </div>
      )}

      {/* Push Success Banner */}
      {lastPushSuccess && (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-emerald-950">
                  {lastPushSuccess.isLiveGitHub
                    ? 'Successfully Committed Directly to GitHub Repository!'
                    : 'Question Bank JSON Prepared & Saved!'}
                </h3>
                <p className="text-xs text-emerald-800">
                  Commit <span className="font-mono font-bold">{lastPushSuccess.commitSha}</span> on branch{' '}
                  <span className="font-mono font-bold">{lastPushSuccess.branch}</span>
                </p>
              </div>
            </div>

            <a
              href={lastPushSuccess.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-emerald-100 transition-colors"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 font-mono text-xs text-emerald-900 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">File:</span>
              <span className="font-bold">{lastPushSuccess.filename}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Items Synchronized:</span>
              <span className="font-bold">{lastPushSuccess.questionsCount} Questions</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span>{new Date(lastPushSuccess.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Troubleshooting Guide */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-sm space-y-3">
        <button
          onClick={() => setShowTroubleshoot(!showTroubleshoot)}
          className="w-full flex items-center justify-between font-bold text-sm text-amber-300 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>"Repository Not Found" एरर का समाधान (How to Fix)</span>
          </span>
          {showTroubleshoot ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTroubleshoot && (
          <div className="space-y-3 pt-2 text-xs border-t border-slate-800 text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Point 1 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px]">1</span>
                  Fine-grained टोकन में 'Selected Repositories'
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  GitHub पर जब Fine-grained token बनाते हैं, तो उसमें <strong>Repository Access</strong> में <strong>All repositories</strong> या फिर <strong>AbhyaasData</strong> को सेलेक्ट करना जरूरी होता है, नहीं तो GitHub 404 देता है।
                </p>
              </div>

              {/* Point 2 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px]">2</span>
                  Classic Token का उपयोग करें (100% Reliable)
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  ऊपर दिए <strong>Generate Classic Token</strong> लिंक पर क्लिक करें, उसमें <strong>repo</strong> चेकबॉक्स पहले से सेलेक्टेड रहेगा, टोकन बनाएं और पेस्ट करें।
                </p>
              </div>

              {/* Point 3 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px]">3</span>
                  Case Sensitivity या Dashing
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  अगर नाम <code className="text-amber-300">abhyaas-data</code> या <code className="text-amber-300">Abhyaas_Data</code> है तो <strong>Select Existing</strong> बटन दबाकर असली रिपॉजिटरी पर क्लिक करें।
                </p>
              </div>

              {/* Point 4 */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px]">4</span>
                  Branch Name Check
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  अगर रिपॉजिटरी में मुख्य ब्रांच <code className="text-amber-300">main</code> की बजाय <code className="text-amber-300">master</code> है तो Branch फील्ड में <code className="text-amber-300">master</code> लिखें।
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Push History */}
      {pushHistory.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Recent Pushed Question Banks</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {pushHistory.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.filename}</span> •
                    <span className="text-indigo-600 font-bold">SHA: {item.commitSha}</span> •
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-[11px] border border-emerald-200 shrink-0">
                  {item.questionsCount} Qs
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
