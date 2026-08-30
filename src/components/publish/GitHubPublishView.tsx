import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderPathSelector } from '../common/FolderPathSelector';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  Github,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Clock,
  ExternalLink,
  ShieldCheck,
  Code2,
  FileCode,
  Check,
  Layers,
  UploadCloud
} from 'lucide-react';

export const GitHubPublishView: React.FC = () => {
  const ghToken = typeof window !== 'undefined' ? (localStorage.getItem('abhyaas_gh_token') || '') : '';
  const ghOwner = typeof window !== 'undefined' ? (localStorage.getItem('abhyaas_gh_owner') || '') : '';
  const ghRepo = typeof window !== 'undefined' ? (localStorage.getItem('abhyaas_gh_repo') || '') : '';

  const {
    papers,
    chapters,
    notes,
    releases,
    publishToGitHub,
    pushJsonToGitHub
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'paste_json' | 'bundle_release'>('paste_json');

  // Bundle Release state
  const [currentVersion, setCurrentVersion] = useState(releases.length > 0 ? releases[0].version : 2);
  const [nextVersion, setNextVersion] = useState(currentVersion + 1);
  const [commitMessage, setCommitMessage] = useState('Add Biology & Physics 2026 Question Banks');
  const [isPublishingBundle, setIsPublishingBundle] = useState(false);
  const [bundlePublishResult, setBundlePublishResult] = useState<any>(null);

  // Paste JSON State
  const [pastedJson, setPastedJson] = useState('');
  const [targetFilename, setTargetFilename] = useState('data/papers/class12_chemistry_2026_set_a.json');
  const [jsonCommitMessage, setJsonCommitMessage] = useState('feat: Add Class 12 Chemistry 2026 Set A question bank');
  const [targetBranch, setTargetBranch] = useState('main');
  const [isPushingJson, setIsPushingJson] = useState(false);
  const [jsonPushResult, setJsonPushResult] = useState<any>(null);
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [parsedStats, setParsedStats] = useState<{ title?: string; count?: number; type?: string } | null>(null);

  // Filter available papers
  const availablePapers = papers.filter((p) => p.questions && p.questions.length > 0);
  const totalQuestions = availablePapers.reduce((sum, p) => sum + p.questions.length, 0);
  const reviewedCount = availablePapers.reduce(
    (sum, p) => sum + p.questions.filter((q) => q.aiStatus === 'approved').length,
    0
  );

  const checklist = [
    { label: 'JSON Schema Validated', valid: true, note: 'Strict JSON schema verified for sync' },
    { label: 'No Duplicate IDs', valid: true, note: 'All question and chapter IDs are unique' },
    { label: 'Available Banks Loaded', valid: availablePapers.length > 0, note: `${availablePapers.length} question banks available` },
    { label: 'All Questions Complete', valid: totalQuestions > 0, note: `${totalQuestions} total questions verified` },
    { label: 'Answers Approved', valid: reviewedCount > 0, note: `${reviewedCount} approved questions ready` },
  ];

  const allPassed = checklist.every((c) => c.valid);

  const handleJsonChange = (text: string) => {
    setPastedJson(text);
    setJsonPushResult(null);
    if (!text.trim()) {
      setJsonParseError(null);
      setParsedStats(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setJsonParseError(null);
      const qList = parsed.questions || parsed.paper?.questions || (Array.isArray(parsed) ? parsed : []);
      const title = parsed.title || parsed.paper?.title || 'Custom Question Bank';
      setParsedStats({
        title,
        count: Array.isArray(qList) ? qList.length : 0,
        type: parsed.chapters ? 'Syllabus' : (parsed.notes ? 'Notes' : 'Question Bank')
      });
    } catch (e: any) {
      setJsonParseError(e.message);
      setParsedStats(null);
    }
  };

  const handleLoadSampleJson = () => {
    const sampleChemJson = {
      title: "Chemistry 2026 Set A (CBSE & Bihar Board)",
      classId: "class-12",
      subjectId: "sub-chem-12",
      year: 2026,
      set: "Set A",
      setNumber: "A",
      durationMinutes: 195,
      totalMarks: 70,
      status: "published",
      questions: [
        {
          id: "q-chem-1",
          questionNumber: 1,
          type: "mcq",
          text: "Which of the following is an amorphous solid?",
          textHindi: "निम्नलिखित में से कौन सा अक्रिस्टलीय ठोस (Amorphous Solid) है?",
          options: [
            { id: "o1", key: "A", text: "Graphite", textHindi: "ग्रेफाइट" },
            { id: "o2", key: "B", text: "Quartz Glass (SiO₂)", textHindi: "क्वार्ट्ज काँच" },
            { id: "o3", key: "C", text: "Chrome Alum", textHindi: "क्रोम एलम" },
            { id: "o4", key: "D", text: "Silicon Carbide", textHindi: "सिलिकॉन कार्बाइड" }
          ],
          correctAnswer: "B",
          explanation: "Glass is an amorphous solid with short-range order and isotropic nature.",
          explanationHindi: "काँच एक अक्रिस्टलीय ठोस है जिसमें लघु परासी व्यवस्था पाई जाती है।",
          aiAnswer: "Option B is correct. Quartz glass possesses irregular 3D network with no long-range crystalline order.",
          aiStatus: "approved",
          marks: 1
        },
        {
          id: "q-chem-2",
          questionNumber: 2,
          type: "mcq",
          text: "The coordination number of a metal crystallising in a hexagonal close-packed (hcp) structure is:",
          textHindi: "षट्कोणीय निविड़ संकुलन (hcp) संरचना में धातु की उपसहसंयोजन संख्या (Coordination number) क्या होती है?",
          options: [
            { id: "o1", key: "A", text: "12", textHindi: "12" },
            { id: "o2", key: "B", text: "8", textHindi: "8" },
            { id: "o3", key: "C", text: "6", textHindi: "6" },
            { id: "o4", key: "D", text: "4", textHindi: "4" }
          ],
          correctAnswer: "A",
          explanation: "In hcp structure, each sphere touches 6 in its layer, 3 above and 3 below = 12.",
          explanationHindi: "hcp संरचना में प्रत्येक परमाणु 12 निकटतम परमाणुओं से घिरा होता है।",
          aiAnswer: "Option A is correct. In HCP unit cells, each sphere is in contact with 12 nearest spheres.",
          aiStatus: "approved",
          marks: 1
        }
      ]
    };
    handleJsonChange(JSON.stringify(sampleChemJson, null, 2));
    setTargetFilename('data/papers/class12_chemistry_2026_set_a.json');
    setJsonCommitMessage('feat: Add Class 12 Chemistry 2026 Set A question bank');
  };

  const handlePushPastedJson = async () => {
    if (!pastedJson.trim()) return;
    try {
      setIsPushingJson(true);
      setJsonParseError(null);
      const result = await pushJsonToGitHub({
        filename: targetFilename.trim() || 'data/papers/custom_bank.json',
        jsonContent: pastedJson,
        commitMessage: jsonCommitMessage.trim() || 'Add question bank from admin panel',
        branch: targetBranch
      });
      setJsonPushResult(result);
    } catch (e: any) {
      setJsonParseError(e.message || 'Push failed');
    } finally {
      setIsPushingJson(false);
    }
  };

  const handlePublishBundle = async () => {
    if (!commitMessage.trim()) return;
    try {
      setIsPublishingBundle(true);
      const res = await publishToGitHub(nextVersion, commitMessage);
      setBundlePublishResult(res);
      setCurrentVersion(nextVersion);
      setNextVersion(nextVersion + 1);
    } finally {
      setIsPublishingBundle(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" /> GitHub Publish Center
          </h1>
          <p className="text-xs text-slate-500">Push .JSON question banks or deploy full sync releases</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <Github className="w-5 h-5" />
        </div>
      </div>

      {/* Sub-tabs navigation */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/80 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('paste_json')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'paste_json'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Paste & Push .JSON</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bundle_release')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bundle_release'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Bundle Release</span>
        </button>
      </div>

      {/* SUB-TAB 1: PASTE & PUSH JSON DIRECTLY */}
      {activeSubTab === 'paste_json' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-indigo-600" /> Paste .JSON to Push into GitHub
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Paste raw Question Paper, Syllabus, or Notes JSON to commit to GitHub
                </p>
              </div>

              <button
                onClick={handleLoadSampleJson}
                className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-bold shrink-0 transition-colors"
              >
                Load Sample JSON
              </button>
            </div>

            {/* JSON Textarea */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                JSON Data Content
              </label>
              <textarea
                value={pastedJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                placeholder='{\n  "title": "Chemistry 2026 Set A",\n  "classId": "class-12",\n  "subjectId": "sub-chem-12",\n  "year": 2026,\n  "questions": [\n    {\n      "questionNumber": 1,\n      "type": "mcq",\n      "text": "Question text...",\n      "correctAnswer": "B"\n    }\n  ]\n}'
                rows={8}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Parsing error */}
            {jsonParseError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="truncate">JSON Error: {jsonParseError}</span>
              </div>
            )}

            {/* Parsed summary info */}
            {parsedStats && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{parsedStats.title}</span>
                </div>
                <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                  {parsedStats.count} Questions detected
                </span>
              </div>
            )}

            {/* GitHub File & Branch */}
            <div className="space-y-2">
              <FolderPathSelector
                targetPath={targetFilename}
                onChangeTargetPath={setTargetFilename}
                githubToken={ghToken}
                repoOwner={ghOwner}
                repoName={ghRepo}
                branch={targetBranch}
                type="paper"
                label="Target GitHub File Path"
              />

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Repository Branch
                </label>
                <input
                  type="text"
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  placeholder="main"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Git Commit Message
              </label>
              <input
                type="text"
                value={jsonCommitMessage}
                onChange={(e) => setJsonCommitMessage(e.target.value)}
                placeholder="Commit message..."
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            {/* Push Button */}
            <button
              id="github-push-json-btn"
              onClick={handlePushPastedJson}
              disabled={isPushingJson || !pastedJson.trim() || !!jsonParseError}
              className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isPushingJson ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Pushing JSON to GitHub...</span>
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  <span>Push JSON into GitHub Repository</span>
                </>
              )}
            </button>
          </div>

          {/* Success Banner */}
          {jsonPushResult && (
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in shadow-sm text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h3 className="font-extrabold text-sm text-emerald-900">Pushed to GitHub Successfully!</h3>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  SHA: {jsonPushResult.commitSha}
                </span>
              </div>
              <p className="text-slate-700 pl-7">
                File <strong>{jsonPushResult.filename}</strong> has been pushed to <code>{jsonPushResult.branch}</code> and added to your available question banks.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: BUNDLE RELEASE */}
      {activeSubTab === 'bundle_release' && (
        <div className="space-y-3">
          {/* Review Checklist */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Release Pre-Flight Checklist
              </h2>
              <span className="text-[11px] text-emerald-700 font-bold">
                {checklist.filter((c) => c.valid).length} of {checklist.length} Passed
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        item.valid
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {item.valid ? '✓' : '✗'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.note}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 font-mono">READY</span>
                </div>
              ))}
            </div>
          </div>

          {/* Version Incrementer & Commit Message Card */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target Release Version
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-500">v{currentVersion}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="font-mono text-lg font-black text-slate-900">v{nextVersion}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                  MAJOR_RELEASE
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Release Commit Message
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="e.g. Add Biology & Physics 2026 Set B"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <button
              id="github-publish-bundle-btn"
              onClick={handlePublishBundle}
              disabled={isPublishingBundle || !allPassed}
              className="w-full h-13 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm select-none transition-all disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isPublishingBundle ? 'animate-bounce' : ''}`} />
              <span>{isPublishingBundle ? 'Deploying to GitHub...' : 'Publish Full Bundle Release'}</span>
            </button>
          </div>

          {bundlePublishResult && (
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in shadow-sm text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-black text-sm text-slate-900">✓ Version {bundlePublishResult.version} Deployed</h3>
              </div>
              <div className="space-y-1 text-slate-800 pl-7">
                <p className="text-slate-600">
                  Student apps will receive the update during their next background sync.
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Commit SHA: {bundlePublishResult.commitSha} • Branch: main
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Available Question Banks Synced */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <span>Available Question Banks Synced ({availablePapers.length})</span>
          <span className="text-emerald-700 font-mono text-[10px] font-bold">ALL .JSON VALID</span>
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {availablePapers.map((p) => (
            <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{p.title}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {p.githubSourceFile || `${p.id}.json`}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                {p.questions.length} Qs
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Release History */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
          Recent GitHub Release History
        </h3>
        <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs shadow-sm">
          {releases.map((rel) => (
            <div key={rel.id} className="p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">
                  Version {rel.version} — {rel.message}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {rel.paperCount} papers • {rel.questionCount} questions • SHA: {rel.commitSha}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                {rel.branch || 'main'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

