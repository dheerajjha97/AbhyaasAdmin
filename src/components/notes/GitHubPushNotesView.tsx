import React, { useState } from 'react';
import { testConnection } from '../../utils/githubService';
import {
  UploadCloud,
  Github,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  GitCommit,
  GitBranch,
  Lock,
  ExternalLink,
  RefreshCw,
  Clock,
  ArrowLeft,
  FileCode2,
  Eye,
  EyeOff,
  Plus,
  List,
  FileText
} from 'lucide-react';
import { ParsedNoteResult } from '../../utils/notesParser';
import { FolderPathSelector } from '../common/FolderPathSelector';

interface GitHubPushNotesViewProps {
  parsedNotes: ParsedNoteResult;
  targetFilename: string;
  setTargetFilename: (name: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  commitMessage: string;
  setCommitMessage: (msg: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  repoOwner: string;
  setRepoOwner: (owner: string) => void;
  repoName: string;
  setRepoName: (name: string) => void;
  onPushToGitHub: () => Promise<any>;
  pushHistory: Array<{
    id: string;
    filename: string;
    commitSha: string;
    message: string;
    timestamp: string;
    sectionsCount: number;
    title: string;
  }>;
  onNavigateBack: () => void;
}

export const GitHubPushNotesView: React.FC<GitHubPushNotesViewProps> = ({
  parsedNotes,
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
  const [pushStatus, setPushStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastCommitSha, setLastCommitSha] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Test connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    user?: string;
    repos?: string[];
  } | null>(null);

  // Repository Picker State
  const [showRepoPicker, setShowRepoPicker] = useState(false);
  const [availableRepos, setAvailableRepos] = useState<Array<{ name: string; fullName: string; isPrivate: boolean }>>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  // Create Repo Modal State
  const [showCreateRepoModal, setShowCreateRepoModal] = useState(false);
  const [newRepoNameInput, setNewRepoNameInput] = useState('AbhyaasData');
  const [newRepoPrivate, setNewRepoPrivate] = useState(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [createRepoError, setCreateRepoError] = useState('');

  // Test Connection
  const handleTestConnection = async () => {
    if (!githubToken.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide a GitHub Personal Access Token first.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const data = await testConnection(githubToken, repoOwner, repoName);
      if (data.success) {
        setTestResult({
          success: true,
          message: data.message || `Connected successfully! Authenticated as @${data.user?.login || 'User'}.`,
          user: data.user?.login,
        });
        if (data.user?.login && !repoOwner) {
          setRepoOwner(data.user.login);
        }
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Connection failed. Please verify your token and repo permissions.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Network error: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Fetch Available Repositories
  const handleFetchRepos = async () => {
    if (!githubToken.trim()) {
      alert('Please enter a GitHub Token first.');
      return;
    }
    setIsLoadingRepos(true);
    setShowRepoPicker(true);

    try {
      const res = await fetch('/api/github/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken }),
      });
      const data = await res.json();
      if (data.success && data.repositories) {
        setAvailableRepos(data.repositories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  // Create Repository
  const handleCreateNewRepo = async () => {
    if (!newRepoNameInput.trim()) return;
    setIsCreatingRepo(true);
    setCreateRepoError('');

    try {
      const res = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          repoName: newRepoNameInput.trim(),
          isPrivate: newRepoPrivate,
        }),
      });
      const data = await res.json();

      if (data.success && data.repo) {
        setRepoName(data.repo.name);
        if (data.repo.owner) {
          setRepoOwner(data.repo.owner);
        }
        setShowCreateRepoModal(false);
        setTestResult({
          success: true,
          message: `Created repository '${data.repo.fullName}' on GitHub with initialized main branch!`,
          user: data.repo.owner,
        });
      } else {
        setCreateRepoError(data.error || 'Failed to create repository');
      }
    } catch (err: any) {
      setCreateRepoError(err.message || 'Network error');
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Push Notes
  const handleExecutePush = async () => {
    if (!githubToken.trim()) {
      setPushStatus('error');
      setStatusMessage('Please enter a GitHub Personal Access Token.');
      return;
    }

    setIsPushing(true);
    setPushStatus('idle');
    setStatusMessage('');

    try {
      const result = await onPushToGitHub();
      if (result && result.success) {
        setPushStatus('success');
        setLastCommitSha(result.commitSha || 'latest');
        setStatusMessage(
          `Successfully committed notes "${targetFilename}" to ${repoOwner}/${repoName}@${branch} (Commit: ${result.commitSha})`
        );
      } else {
        setPushStatus('error');
        setStatusMessage(result?.error || 'Failed to push to GitHub repository.');
      }
    } catch (err: any) {
      setPushStatus('error');
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Step 4: Push Notes to GitHub Repository
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                Direct REST API Commit
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Commit structured revision notes directly to your data repository for mobile app synchronization
            </p>
          </div>

          <button
            onClick={onNavigateBack}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to JSON</span>
          </button>
        </div>

        {/* Status Notification Alerts */}
        {pushStatus === 'success' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="font-bold">Notes Committed Successfully!</div>
              <p className="text-emerald-800">{statusMessage}</p>
              <div className="pt-1 flex items-center gap-3 font-mono text-[11px]">
                <span>Commit SHA: <strong>{lastCommitSha}</strong></span>
                <span>•</span>
                <a
                  href={`https://github.com/${repoOwner}/${repoName}/blob/${branch}/${targetFilename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-sans font-semibold"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {pushStatus === 'error' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="font-bold">Push Failed</div>
              <p className="text-rose-800">{statusMessage}</p>
            </div>
          </div>
        )}

        {/* GitHub Config Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {/* GitHub Token Field */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                GitHub Personal Access Token (PAT)
              </label>
              <a
                href="https://github.com/settings/tokens/new?description=Abhyaas%20Admin&scopes=repo"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                Generate Token with 'repo' scope <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full h-10 pl-3 pr-20 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 font-sans"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Repo Owner */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-500" /> Repository Owner / Username
            </label>
            <input
              type="text"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              placeholder="e.g. your-github-username"
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Repo Name with Helpers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <FolderGit2 className="w-3.5 h-3.5 text-slate-500" /> Repository Name
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFetchRepos}
                  className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  <List className="w-3 h-3" /> Select Existing
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setShowCreateRepoModal(true)}
                  className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Create New
                </button>
              </div>
            </div>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. AbhyaasData"
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Target File Path in Repo */}
          <div className="space-y-1 md:col-span-2">
            <FolderPathSelector
              targetPath={targetFilename}
              onChangeTargetPath={setTargetFilename}
              githubToken={githubToken}
              repoOwner={repoOwner}
              repoName={repoName}
              branch={branch}
              type="notes"
              label="Target File Path in Repo"
            />
          </div>

          {/* Branch Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-slate-500" /> Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Commit Message */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5 text-slate-500" /> Git Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Test Connection Results */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in ${
              testResult.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{testResult.message}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !githubToken}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs disabled:opacity-50 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            type="button"
            onClick={handleExecutePush}
            disabled={isPushing || !githubToken}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isPushing ? 'Committing Notes to GitHub...' : 'Push Notes to GitHub Now'}</span>
          </button>
        </div>
      </div>

      {/* Push History Log */}
      {pushHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-bold text-slate-800">Notes Synchronization Log</h4>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {pushHistory.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{item.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 truncate">
                    <span>{item.filename}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-bold">SHA: {item.commitSha}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Select Existing Repository Modal */}
      {showRepoPicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-amber-600" />
                Select GitHub Repository
              </h4>
              <button
                onClick={() => setShowRepoPicker(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {isLoadingRepos ? (
              <div className="py-6 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-5 h-5 text-amber-600 animate-spin mx-auto" />
                <p>Loading repositories from GitHub API...</p>
              </div>
            ) : availableRepos.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 space-y-3">
                <p>No repositories found or token lacks access.</p>
                <button
                  onClick={() => {
                    setShowRepoPicker(false);
                    setShowCreateRepoModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs"
                >
                  + Create Repository Now
                </button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                {availableRepos.map((repo) => (
                  <button
                    key={repo.fullName}
                    onClick={() => {
                      setRepoName(repo.name);
                      const ownerPart = repo.fullName.split('/')[0];
                      if (ownerPart) setRepoOwner(ownerPart);
                      setShowRepoPicker(false);
                    }}
                    className="w-full text-left py-2 px-2 hover:bg-slate-50 rounded-lg flex items-center justify-between group transition-colors"
                  >
                    <span className="font-mono text-slate-800 font-semibold group-hover:text-amber-700">
                      {repo.fullName}
                    </span>
                    {repo.isPrivate && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                        Private
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1-Click Create Repository Modal */}
      {showCreateRepoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3.5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Create New Repository on GitHub
              </h4>
              <button
                onClick={() => setShowCreateRepoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Repository Name</label>
                <input
                  type="text"
                  value={newRepoNameInput}
                  onChange={(e) => setNewRepoNameInput(e.target.value)}
                  placeholder="AbhyaasData"
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRepoPrivate}
                  onChange={(e) => setNewRepoPrivate(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>Make repository Private</span>
              </label>

              {createRepoError && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
                  {createRepoError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCreateRepoModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewRepo}
                disabled={isCreatingRepo || !newRepoNameInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isCreatingRepo ? 'Creating on GitHub...' : 'Create & Select Repo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
