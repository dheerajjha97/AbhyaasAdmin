import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  BookmarkCheck,
  Zap,
  Github,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ListOrdered,
  FolderGit2,
  Settings,
  Layers,
  GraduationCap,
  Atom,
  TrendingUp,
  Landmark,
  Languages,
  Code2,
  FileCheck,
  UploadCloud,
  Clock,
  Trash2,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  FileCode,
  Folder,
  AlertCircle
} from 'lucide-react';
import { ALL_SUBJECTS, getSubjectsGroupedByStream } from '../../data/subjects';

interface DashboardViewProps {
  onSelectEngine: (engine: 'questions' | 'syllabus' | 'notes') => void;
  onOpenSettings: () => void;
  savedBanksCount: number;
  savedSyllabiCount: number;
  githubToken: string;
  repoOwner: string;
  repoName: string;
  onAutoRouteText: (text: string) => void;
  activeSubjectId: string;
  setActiveSubjectId: (subId: string) => void;
}

interface GitHubRepoStats {
  papersCount: number;
  syllabusCount: number;
  notesCount: number;
  otherJsonCount: number;
  totalFilesCount: number;
  files: {
    papers: string[];
    syllabus: string[];
    notes: string[];
    other: string[];
  };
  lastFetched?: string;
  branch?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectEngine,
  onOpenSettings,
  savedBanksCount,
  savedSyllabiCount,
  githubToken,
  repoOwner,
  repoName,
  onAutoRouteText,
  activeSubjectId,
  setActiveSubjectId,
}) => {
  const [scratchpadText, setScratchpadText] = useState('');
  const [selectedStreamTab, setSelectedStreamTab] = useState<'all' | 'science' | 'commerce' | 'arts' | 'language'>('all');

  // GitHub Stats State
  const [githubStats, setGithubStats] = useState<GitHubRepoStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [activeExplorerTab, setActiveExplorerTab] = useState<'papers' | 'syllabus' | 'notes'>('papers');

  const grouped = getSubjectsGroupedByStream();

  const fetchGitHubStats = async () => {
    if (!repoOwner || !repoName) return;
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const res = await fetch('/api/github/fetch-repo-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: repoOwner,
          repo: repoName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGithubStats({
          papersCount: data.stats.papersCount,
          syllabusCount: data.stats.syllabusCount,
          notesCount: data.stats.notesCount,
          otherJsonCount: data.stats.otherJsonCount,
          totalFilesCount: data.stats.totalFilesCount,
          files: data.files,
          branch: data.branch,
          lastFetched: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      } else {
        setStatsError(data.error || 'Could not connect to GitHub repository');
      }
    } catch (err: any) {
      setStatsError(err.message || 'Failed to fetch repository data');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchGitHubStats();
  }, [githubToken, repoOwner, repoName]);

  const handleScratchpadSubmit = () => {
    if (!scratchpadText.trim()) return;
    onAutoRouteText(scratchpadText);
  };

  const filteredSubjects = ALL_SUBJECTS.filter(
    (s) => selectedStreamTab === 'all' || s.stream === selectedStreamTab
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Hero Glass Banner */}
      <div className="glass-panel-dark p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Class 9–12 State & CBSE Board Pipeline</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Academic Content Engine & Overview Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-2xl">
            Convert exam question banks, structure unit/chapter curriculum syllabi, and generate markdown revision notes with instant GitHub JSON synchronization.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
              <span>30+ Subjects</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>Bilingual (Hindi/English)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-amber-300" />
              <span>{repoOwner}/{repoName}</span>
            </span>
            <button
              onClick={fetchGitHubStats}
              disabled={isLoadingStats}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              title="Refresh GitHub Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
              <span>{isLoadingStats ? 'Fetching...' : 'Fetch Live Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Analytics & Metrics Cards (Showing Live GitHub Fetched Counts) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Q&A Papers */}
        <div
          onClick={() => onSelectEngine('questions')}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-indigo-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-1">
              <Github className="w-2.5 h-2.5" />
              <span>{githubStats ? `${githubStats.papersCount} in Repo` : 'Q&A Engine'}</span>
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {githubStats ? githubStats.papersCount : savedBanksCount}
            </div>
            <div className="text-xs font-bold text-slate-600">Question Papers</div>
          </div>
          <p className="text-[11px] text-slate-500">
            {githubStats ? `Live synced in ${repoOwner}/${repoName}` : '70-MCQ + Short/Long format papers'}
          </p>
        </div>

        {/* Metric 2: Curriculum Syllabi */}
        <div
          onClick={() => onSelectEngine('syllabus')}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-emerald-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <Github className="w-2.5 h-2.5" />
              <span>{githubStats ? `${githubStats.syllabusCount} in Repo` : 'Syllabus'}</span>
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {githubStats ? githubStats.syllabusCount : savedSyllabiCount}
            </div>
            <div className="text-xs font-bold text-slate-600">Syllabi Available</div>
          </div>
          <p className="text-[11px] text-slate-500">
            {githubStats ? `Live synced in ${repoOwner}/${repoName}` : 'Structured Unit, Chapter & Topic tree'}
          </p>
        </div>

        {/* Metric 3: Revision Notes */}
        <div
          onClick={() => onSelectEngine('notes')}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-amber-300 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
              <Github className="w-2.5 h-2.5" />
              <span>{githubStats ? `${githubStats.notesCount} in Repo` : 'Revision Notes'}</span>
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {githubStats ? githubStats.notesCount : 0}
            </div>
            <div className="text-xs font-bold text-slate-600">Revision Notes</div>
          </div>
          <p className="text-[11px] text-slate-500">
            {githubStats ? `Live synced in ${repoOwner}/${repoName}` : 'Sectional formulas, diagrams & key terms'}
          </p>
        </div>

        {/* Metric 4: GitHub Cloud Sync */}
        <div
          onClick={onOpenSettings}
          className="glass-card p-4 sm:p-5 space-y-2 cursor-pointer hover:border-slate-400 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Github className="w-5 h-5" />
            </div>
            {githubStats ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Synced
              </span>
            ) : githubToken ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Connected
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Set Token
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {githubStats ? githubStats.totalFilesCount : 0} <span className="text-xs font-normal text-slate-500">Files</span>
            </div>
            <div className="text-xs font-bold text-slate-600 font-mono truncate">{repoOwner}/{repoName}</div>
          </div>
          <p className="text-[11px] text-slate-500">
            {githubStats?.lastFetched ? `Updated at ${githubStats.lastFetched}` : 'Click to manage GitHub PAT & Repo'}
          </p>
        </div>

      </div>

      {/* Live GitHub Repository Explorer Banner */}
      <div className="glass-panel p-5 space-y-4 border border-indigo-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  GitHub Live Repository Explorer
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  {repoOwner}/{repoName} ({githubStats?.branch || 'main'})
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time data fetched directly from GitHub API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchGitHubStats}
              disabled={isLoadingStats}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 btn-3d-indigo cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
              <span>{isLoadingStats ? 'Fetching Repository...' : 'Fetch Live Data'}</span>
            </button>

            <a
              href={`https://github.com/${repoOwner}/${repoName}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Open Repository on GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {statsError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{statsError} — Click "Set Token" or update your GitHub Token in Settings.</span>
          </div>
        )}

        {/* Directory Category Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveExplorerTab('papers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeExplorerTab === 'papers'
                ? 'bg-indigo-600 text-white font-black shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Question Papers ({githubStats?.papersCount || 0})</span>
          </button>

          <button
            onClick={() => setActiveExplorerTab('syllabus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeExplorerTab === 'syllabus'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Curriculum Syllabi ({githubStats?.syllabusCount || 0})</span>
          </button>

          <button
            onClick={() => setActiveExplorerTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeExplorerTab === 'notes'
                ? 'bg-amber-600 text-white font-black shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Revision Notes ({githubStats?.notesCount || 0})</span>
          </button>
        </div>

        {/* Files List Display */}
        <div className="space-y-2">
          {isLoadingStats ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Fetching live files from GitHub repository...</p>
            </div>
          ) : (
            <div>
              {activeExplorerTab === 'papers' && (
                githubStats?.files?.papers && githubStats.files.papers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {githubStats.files.papers.map((filePath) => (
                      <div key={filePath} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs hover:border-indigo-300 transition-all shadow-2xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-mono text-slate-800 truncate font-medium">{filePath}</span>
                        </div>
                        <a
                          href={`https://github.com/${repoOwner}/${repoName}/blob/${githubStats.branch || 'main'}/${filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 shrink-0 ml-1"
                          title="View on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-600">No question paper files found in repository tree.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Use the "Q&A Converter" to paste and push papers to GitHub!</p>
                  </div>
                )
              )}

              {activeExplorerTab === 'syllabus' && (
                githubStats?.files?.syllabus && githubStats.files.syllabus.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {githubStats.files.syllabus.map((filePath) => (
                      <div key={filePath} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs hover:border-emerald-300 transition-all shadow-2xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-mono text-slate-800 truncate font-medium">{filePath}</span>
                        </div>
                        <a
                          href={`https://github.com/${repoOwner}/${repoName}/blob/${githubStats.branch || 'main'}/${filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 shrink-0 ml-1"
                          title="View on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <BookmarkCheck className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-600">No syllabus files found in repository tree.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Use the "Syllabus Builder" to structure and push syllabi to GitHub!</p>
                  </div>
                )
              )}

              {activeExplorerTab === 'notes' && (
                githubStats?.files?.notes && githubStats.files.notes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {githubStats.files.notes.map((filePath) => (
                      <div key={filePath} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs hover:border-amber-300 transition-all shadow-2xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-mono text-slate-800 truncate font-medium">{filePath}</span>
                        </div>
                        <a
                          href={`https://github.com/${repoOwner}/${repoName}/blob/${githubStats.branch || 'main'}/${filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 shrink-0 ml-1"
                          title="View on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                    <Zap className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-600">No revision note files found in repository tree.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Use the "Notes Engine" to structure and push notes to GitHub!</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Core Action Engines Hub (3 Primary Tool Cards) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Launch Academic Tool Engine</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Question Bank Converter */}
          <div className="glass-panel p-5 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                1. Exam Q&A Bank Converter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste question papers or model sets. Extracts 70 MCQs, Short & Long questions with bilingual solutions automatically.
              </p>
            </div>

            <button
              onClick={() => onSelectEngine('questions')}
              className="w-full py-2.5 rounded-xl glass-btn-indigo text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Q&A Converter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Syllabus & Curriculum Builder */}
          <div className="glass-panel p-5 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                2. Curriculum & Syllabus Builder
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Convert raw syllabus outlines into structured Unit, Chapter, and Marks trees. Generates schema-ready JSONs.
              </p>
            </div>

            <button
              onClick={() => onSelectEngine('syllabus')}
              className="w-full py-2.5 rounded-xl glass-btn-emerald text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Syllabus Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Quick Revision Notes Engine */}
          <div className="glass-panel p-5 space-y-4 hover:border-amber-300 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                3. Quick Revision Notes Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parse textbook chapters and class notes into structured Markdown notes with key definitions, formulas, and diagrams.
              </p>
            </div>

            <button
              onClick={() => onSelectEngine('notes')}
              className="w-full py-2.5 rounded-xl glass-btn-amber text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Notes Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Smart Auto-Detect Import Scratchpad */}
      <div className="glass-panel-dark p-5 space-y-3 border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Universal Smart Auto-Router & Parser
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {scratchpadText && (
              <button
                onClick={() => setScratchpadText('')}
                className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Text Clear Karein / Clear Textbox"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear / साफ़ करें</span>
              </button>
            )}
            <span className="text-[10px] text-slate-400 hidden sm:inline">Auto-detects Syllabus, Q&A or Notes</span>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Paste any raw text below (syllabus outline, question bank, or chapter notes). Our intelligent router will detect the structure and redirect to the appropriate parser!
        </p>

        <div className="relative">
          <textarea
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder={`Paste anything here...

Example 1 (Syllabus):
UNIT 1: ELECTROSTATICS [8 Marks]
Chapter 1: Electric Charges and Fields

Example 2 (Question Bank):
1. Which organelle is called the powerhouse of the cell?
(A) Nucleus  (B) Mitochondria  (C) Ribosome
Answer: (B) Mitochondria`}
            className="w-full h-36 p-3.5 pr-10 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
          {scratchpadText && (
            <button
              onClick={() => setScratchpadText('')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Clear Textbox"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">
              {scratchpadText ? `${scratchpadText.split('\n').length} lines pasted (${scratchpadText.length} chars)` : 'Ready for text drop'}
            </span>
            {scratchpadText && (
              <button
                onClick={() => setScratchpadText('')}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Textbox</span>
              </button>
            )}
          </div>

          <button
            onClick={handleScratchpadSubmit}
            disabled={!scratchpadText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto-Detect & Process Text</span>
          </button>
        </div>
      </div>

      {/* 5. Stream & Subjects Explorer Grid */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Supported Stream & Subject Directory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any subject to launch with preset parameters
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All (30+)' },
              { id: 'science', label: '🧪 Science' },
              { id: 'commerce', label: '📊 Commerce' },
              { id: 'arts', label: '🏛️ Arts' },
              { id: 'language', label: '📖 Languages' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStreamTab(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  selectedStreamTab === tab.id
                    ? 'bg-indigo-600 text-white font-black shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filteredSubjects.map((sub) => {
            const isSelected = sub.id === activeSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubjectId(sub.id);
                  onSelectEngine('questions');
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-black shadow-sm'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-800 font-bold hover:border-indigo-200'
                }`}
              >
                <div className="space-y-0.5 truncate">
                  <div className="text-xs truncate">{sub.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">{sub.code} • {sub.categoryLabel}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
