import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderPathSelector } from '../common/FolderPathSelector';
import { QuestionPaper, PaperStatus } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  MoreVertical,
  Filter,
  Layers,
  ChevronRight,
  BookOpen,
  Github,
  UploadCloud,
  Check,
  Code2,
  FileCode,
  ExternalLink
} from 'lucide-react';

export const PapersList: React.FC = () => {
  const ghToken = typeof window !== 'undefined' ? (localStorage.getItem('abhyaas_gh_token') || '') : '';
  const ghOwner = typeof window !== 'undefined' ? (localStorage.getItem('abhyaas_gh_owner') || '') : '';
  const ghRepo = typeof window !== 'undefined' ? (localStorage.getItem('abhyaas_gh_repo') || '') : '';

  const {
    papers,
    classes,
    subjects,
    goToQuestionEditor,
    goToAIGeneration,
    savePaper,
    deletePaper,
    pushJsonToGitHub
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'class-12' | 'class-10' | 'published' | 'review'>('all');
  const [showNewPaperModal, setShowNewPaperModal] = useState(false);
  const [showPastePushModal, setShowPastePushModal] = useState(false);

  // Paste & Push Modal State
  const [pastedJson, setPastedJson] = useState('');
  const [targetFilename, setTargetFilename] = useState('data/papers/class12_chemistry_2026_set_a.json');
  const [commitMessage, setCommitMessage] = useState('feat: Add Class 12 Chemistry 2026 Set A question bank');
  const [targetBranch, setTargetBranch] = useState('main');
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccessResult, setPushSuccessResult] = useState<any>(null);
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [parsedStats, setParsedStats] = useState<{ title?: string; count?: number; type?: string } | null>(null);

  // New paper form state
  const [newTitle, setNewTitle] = useState('');
  const [newClassId, setNewClassId] = useState('class-12');
  const [newSubjectId, setNewSubjectId] = useState('sub-bio-12');
  const [newYear, setNewYear] = useState(2026);
  const [newSet, setNewSet] = useState('A');
  const [newTotalQ, setNewTotalQ] = useState(70);

  // Only display available question banks that have real question content (> 0 questions)
  const availablePapers = papers.filter((p) => p.questions && p.questions.length > 0);

  // Filtered papers
  const filteredPapers = availablePapers.filter((p) => {
    const setVal = (p.setNumber || p.set || '').toLowerCase();
    const sourceFile = (p.githubSourceFile || '').toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sourceFile.includes(searchQuery.toLowerCase()) ||
      setVal.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'class-12') return p.classId === 'class-12';
    if (selectedFilter === 'class-10') return p.classId === 'class-10';
    if (selectedFilter === 'published') return p.status === 'published';
    if (selectedFilter === 'review') return p.status === 'review';
    return true;
  });

  const handleJsonChange = (text: string) => {
    setPastedJson(text);
    setPushSuccessResult(null);
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
        },
        {
          id: "q-chem-3",
          questionNumber: 3,
          type: "short",
          text: "State Henry's law regarding the solubility of a gas in a liquid. Mention one biological application.",
          textHindi: "गैसों की द्रवों में विलेयता सम्बन्धी हेनरी का नियम लिखिए। इसका एक जैविक अनुप्रयोग बताइए।",
          correctAnswer: "Subjective",
          explanation: "p = K_H · x. In deep-sea diving, helium is mixed with oxygen to prevent bends.",
          explanationHindi: "गैस का आंशिक दाब उसके मोल अंश के समानुपाती होता है (p = K_H · x)। गोताखोरी में बेंड्स से बचाव हेतु इसका उपयोग होता है।",
          aiAnswer: "Henry's Law states that at constant temperature, the solubility of a gas in a liquid is directly proportional to the partial pressure of the gas over the solution (p = K_H · x). Biological Application: To prevent decompression sickness ('bends') in deep-sea divers, oxygen cylinders are diluted with helium gas due to its low solubility in human blood.",
          aiStatus: "approved",
          marks: 2
        }
      ]
    };
    handleJsonChange(JSON.stringify(sampleChemJson, null, 2));
    setTargetFilename('data/papers/class12_chemistry_2026_set_a.json');
    setCommitMessage('feat: Add Class 12 Chemistry 2026 Set A question bank');
  };

  const handlePushPastedJson = async () => {
    if (!pastedJson.trim()) return;
    try {
      setIsPushing(true);
      setJsonParseError(null);
      const result = await pushJsonToGitHub({
        filename: targetFilename.trim() || 'data/papers/custom_bank.json',
        jsonContent: pastedJson,
        commitMessage: commitMessage.trim() || 'Add question bank from admin panel',
        branch: targetBranch
      });
      setPushSuccessResult(result);
    } catch (e: any) {
      setJsonParseError(e.message || 'Push failed');
    } finally {
      setIsPushing(false);
    }
  };

  const handleCreatePaper = () => {
    if (!newTitle.trim()) return;

    const newPaper: QuestionPaper = {
      id: `paper-${Date.now()}`,
      title: newTitle.trim(),
      classId: newClassId,
      subjectId: newSubjectId,
      examType: 'board',
      year: newYear,
      setNumber: newSet,
      totalMarks: 70,
      durationMinutes: 180,
      totalQuestions: newTotalQ,
      status: 'published',
      githubSourceFile: `${newTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`,
      isAvailableOnGithub: true,
      questions: [
        {
          id: `q-${Date.now()}-1`,
          paperId: `paper-${Date.now()}`,
          questionNumber: 1,
          type: 'mcq',
          text: `Sample question 1 for ${newTitle}`,
          options: [
            { id: '1', key: 'A', text: 'Option A' },
            { id: '2', key: 'B', text: 'Option B' },
            { id: '3', key: 'C', text: 'Option C' },
            { id: '4', key: 'D', text: 'Option D' }
          ],
          correctAnswer: 'A',
          aiAnswer: 'Option A is verified for this newly created question paper.',
          aiStatus: 'approved',
          marks: 1,
          difficulty: 'easy'
        }
      ],
    };

    savePaper(newPaper);
    setShowNewPaperModal(false);
    goToQuestionEditor(newPaper.id, 0);
  };

  const getStatusBadge = (status: PaperStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">Published</span>;
      case 'ready':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">Ready</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">Review</span>;
      case 'generating':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold animate-pulse">AI Running</span>;
      case 'draft':
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">Active</span>;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in">
      {/* Header with Title and Action buttons */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Question Papers & Banks
          </h1>
          <p className="text-xs text-slate-500">Available .JSON files synced from GitHub ({availablePapers.length})</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="papers-paste-push-json-btn"
            onClick={() => {
              setShowPastePushModal(true);
              setPushSuccessResult(null);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Paste & Push JSON</span>
          </button>

          <button
            id="papers-new-paper-btn"
            onClick={() => setShowNewPaperModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ New Paper</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {/* GitHub Sync Status Banner */}
      <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
            <Github className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">GitHub Live Repository</span>
            <span className="text-[11px] text-slate-600">
              Only showing available .JSON question banks with valid questions
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowPastePushModal(true);
            handleLoadSampleJson();
          }}
          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] shrink-0 transition-colors shadow-xs"
        >
          + Push JSON
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search available papers by name, subject, or .json file..."
          className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: `All Available (${availablePapers.length})` },
          { id: 'class-12', label: 'Class 12th' },
          { id: 'class-10', label: 'Class 10th' },
          { id: 'review', label: 'Needs Review ⚠' },
          { id: 'published', label: 'Published ✓' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setSelectedFilter(chip.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedFilter === chip.id
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredPapers.length === 0 && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">No Question Banks Found</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste a question bank .JSON file to push it directly into GitHub.
            </p>
          </div>
          <button
            onClick={() => {
              setShowPastePushModal(true);
              handleLoadSampleJson();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
          >
            <Github className="w-4 h-4" />
            <span>Paste & Push JSON Now</span>
          </button>
        </div>
      )}

      {/* Available Papers Cards List */}
      <div className="space-y-3">
        {filteredPapers.map((paper) => {
          const approvedQ = paper.questions.filter((q) => q.aiStatus === 'approved').length;
          const reviewQ = paper.questions.filter((q) => q.aiStatus === 'review').length;
          const missingQ = paper.questions.filter((q) => q.aiStatus === 'missing').length;
          const fileName = paper.githubSourceFile || `${paper.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;

          return (
            <div
              key={paper.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{paper.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                    <span>{paper.year} Set {paper.setNumber || paper.set || 'A'}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-600 font-bold">{paper.questions.length} Questions</span>
                    <span>•</span>
                    <span>{paper.totalMarks} Marks</span>
                  </div>

                  {/* GitHub Source File Badge */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono flex items-center gap-1">
                      <FileCode className="w-3 h-3 text-indigo-600" />
                      <span>{fileName}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Available .JSON
                    </span>
                  </div>
                </div>

                {getStatusBadge(paper.status)}
              </div>

              {/* Status Breakdown Progress Pills */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <span>✓ {approvedQ} Approved</span>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                  <span>⚠ {reviewQ} Review</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                  <span>○ {missingQ} Missing</span>
                </div>
              </div>

              {/* Action Buttons: [ Edit Questions ] [ AI Answers ] */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => goToQuestionEditor(paper.id, 0)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                  <span>Edit Questions</span>
                </button>

                <button
                  onClick={() => goToAIGeneration(paper.id)}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Answers</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paste & Push JSON to GitHub Modal */}
      {showPastePushModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 max-w-lg w-full space-y-3 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Paste JSON to Push into GitHub</h3>
                  <p className="text-[10px] text-slate-500">Commits directly to repository & syncs available questions</p>
                </div>
              </div>

              <button
                onClick={() => setShowPastePushModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick helper buttons */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-700">Paste Raw JSON Content:</span>
              <button
                onClick={handleLoadSampleJson}
                className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Code2 className="w-3 h-3" /> Load Sample Chemistry 2026 Set A
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={pastedJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                placeholder='{\n  "title": "Chemistry 2026 Set A",\n  "classId": "class-12",\n  "subjectId": "sub-chem-12",\n  "questions": [\n    {\n      "questionNumber": 1,\n      "type": "mcq",\n      "text": "Question text here...",\n      "options": [{ "key": "A", "text": "Option A" }],\n      "correctAnswer": "A"\n    }\n  ]\n}'
                rows={7}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Validation & Stats Info */}
            {jsonParseError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="truncate">JSON Error: {jsonParseError}</span>
              </div>
            )}

            {parsedStats && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{parsedStats.title}</span>
                </div>
                <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                  {parsedStats.count} Questions detected
                </span>
              </div>
            )}

            {/* Target File & Commit details */}
            <div className="space-y-2 pt-1">
              <FolderPathSelector
                targetPath={targetFilename}
                onChangeTargetPath={setTargetFilename}
                githubToken={ghToken}
                repoOwner={ghOwner}
                repoName={ghRepo}
                branch="main"
                type="paper"
                label="GitHub File Path"
              />

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Target Branch
                </label>
                <input
                  type="text"
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  placeholder="main"
                  className="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Commit Message
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Commit message..."
                className="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            {/* Success Message Banner */}
            {pushSuccessResult && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 animate-in fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Pushed into GitHub Successfully!
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    SHA: {pushSuccessResult.commitSha}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  {pushSuccessResult.filename} is now available in your active question bank list.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowPastePushModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                {pushSuccessResult ? 'Close' : 'Cancel'}
              </button>

              <button
                onClick={handlePushPastedJson}
                disabled={isPushing || !pastedJson.trim() || !!jsonParseError}
                className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                {isPushing ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Pushing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-3.5 h-3.5" />
                    <span>Push JSON to GitHub</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Paper Modal */}
      {showNewPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 max-w-sm w-full space-y-3.5 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Create Question Paper</h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Paper Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Biology 2026 Model Set C"
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Class
                </label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Set
                </label>
                <input
                  type="text"
                  value={newSet}
                  onChange={(e) => setNewSet(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Questions
                </label>
                <input
                  type="number"
                  value={newTotalQ}
                  onChange={(e) => setNewTotalQ(Number(e.target.value))}
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono text-center focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowNewPaperModal(false)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePaper}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm"
              >
                Create Paper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
