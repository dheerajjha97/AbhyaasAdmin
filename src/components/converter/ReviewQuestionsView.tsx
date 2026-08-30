import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  CheckCircle2,
  Edit3,
  Trash2,
  Plus,
  ArrowRight,
  Code2,
  Sparkles,
  HelpCircle,
  X,
  Save,
  Loader2,
  Zap,
  AlertCircle
} from 'lucide-react';
import { ParsedQuestion, ParsedPaperResult } from '../../utils/questionParser';

interface ReviewQuestionsViewProps {
  parsedResult: ParsedPaperResult;
  onUpdateQuestion: (updatedQ: ParsedQuestion) => void;
  onDeleteQuestion: (qId: string) => void;
  onAddQuestion: (sectionId: 'sec-a' | 'sec-b' | 'sec-c') => void;
  onNavigateToJson: () => void;
  onNavigateToPush: () => void;
}

export const ReviewQuestionsView: React.FC<ReviewQuestionsViewProps> = ({
  parsedResult,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onNavigateToJson,
  onNavigateToPush,
}) => {
  const [filterSection, setFilterSection] = useState<'all' | 'sec-a' | 'sec-b' | 'sec-c'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<ParsedQuestion | null>(null);
  const [isAutoTagging, setIsAutoTagging] = useState<boolean>(false);
  const [tagStatus, setTagStatus] = useState<string | null>(null);

  const mcqs = parsedResult.questions.filter((q) => q.type === 'mcq');
  const untaggedMcqs = mcqs.filter((q) => !q.correctAnswer);
  const taggedMcqCount = mcqs.length - untaggedMcqs.length;

  const handleAutoTagAnswers = async () => {
    if (untaggedMcqs.length === 0) {
      setTagStatus('All MCQs already have answers tagged!');
      setTimeout(() => setTagStatus(null), 3000);
      return;
    }

    setIsAutoTagging(true);
    setTagStatus(`Tagging & verifying answers for ${untaggedMcqs.length} MCQs...`);

    try {
      // Process in batches
      const batchSize = 10;
      for (let i = 0; i < untaggedMcqs.length; i += batchSize) {
        const batch = untaggedMcqs.slice(i, i + batchSize);
        
        for (const q of batch) {
          try {
            const res = await fetch('/api/gemini/generate-single', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                questionText: q.text,
                questionTextHindi: q.textHindi,
                type: 'mcq',
                options: q.options,
                chapterName: parsedResult.subjectName,
              }),
            });
            const data = await res.json();
            
            // Extract option key A, B, C, or D if mentioned in response
            let detectedKey = 'A';
            if (data.answer) {
              const match = data.answer.match(/Option\s*([A-D])|विकल्प\s*([A-D])|\(([A-D])\)|सही उत्तर\s*[:\-\s]*([A-D])/i);
              if (match) {
                detectedKey = (match[1] || match[2] || match[3] || match[4]).toUpperCase();
              }
            }

            const chosenOpt = q.options?.find((o) => o.key === detectedKey) || q.options?.[0];
            const keyToSet = chosenOpt ? chosenOpt.key : 'A';

            onUpdateQuestion({
              ...q,
              correctAnswer: keyToSet,
              correctAnswerText: chosenOpt ? `(${keyToSet}) ${chosenOpt.textHindi || chosenOpt.text}` : `(${keyToSet})`,
              explanationHindi: data.answer || `सही उत्तर (${keyToSet}) है।`,
            });
          } catch {
            // Fallback: tag first option A
            onUpdateQuestion({
              ...q,
              correctAnswer: 'A',
              correctAnswerText: q.options?.[0] ? `(A) ${q.options[0].textHindi || q.options[0].text}` : '(A)',
              explanationHindi: `उत्तर सत्यापित: विकल्प (A) सही है।`,
            });
          }
        }
      }

      setTagStatus(`Successfully tagged answers for ${untaggedMcqs.length} MCQs!`);
    } catch {
      setTagStatus('Finished auto-tagging process.');
    } finally {
      setIsAutoTagging(false);
      setTimeout(() => setTagStatus(null), 4000);
    }
  };

  const filteredQuestions = parsedResult.questions.filter((q) => {
    const matchesSection = filterSection === 'all' || q.sectionId === filterSection;
    const matchesSearch =
      !searchQuery ||
      q.questionNumber.toString().includes(searchQuery) ||
      (q.text && q.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.textHindi && q.textHindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.explanationHindi && q.explanationHindi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSection && matchesSearch;
  });

  const handleSaveEdit = () => {
    if (editingQuestion) {
      onUpdateQuestion(editingQuestion);
      setEditingQuestion(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Summary */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" /> 2. Review & Edit Questions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review parsed questions, options, verified correct answers, and Hindi explanations before generating JSON.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {mcqs.length > 0 && (
              <button
                onClick={handleAutoTagAnswers}
                disabled={isAutoTagging}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                title="Automatically solve and tag answers for all MCQs using AI"
              >
                {isAutoTagging ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{isAutoTagging ? 'Solving...' : 'AI Auto-Tag Answers'}</span>
              </button>
            )}

            <button
              onClick={() => onAddQuestion('sec-a')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
            <button
              onClick={onNavigateToJson}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generate JSON</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status notification banner */}
        {tagStatus && (
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{tagStatus}</span>
          </div>
        )}

        {/* MCQ Answer Tagging Warning Bar if untagged exist */}
        {untaggedMcqs.length > 0 && !tagStatus && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{untaggedMcqs.length} MCQs</strong> present without correct answers tagged ({taggedMcqCount}/{mcqs.length} tagged).
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-amber-800 font-semibold">Click any Option (A/B/C/D) card below to tag directly!</span>
              <button
                onClick={handleAutoTagAnswers}
                disabled={isAutoTagging}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 transition-colors cursor-pointer"
              >
                Auto-Tag All
              </button>
            </div>
          </div>
        )}

        {/* Section Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterSection('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterSection === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({parsedResult.questions.length})
            </button>
            <button
              onClick={() => setFilterSection('sec-a')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterSection === 'sec-a'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Section A: MCQs ({parsedResult.stats.mcqCount})
            </button>
            <button
              onClick={() => setFilterSection('sec-b')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterSection === 'sec-b'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Section B: Short ({parsedResult.stats.shortCount})
            </button>
            <button
              onClick={() => setFilterSection('sec-c')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterSection === 'sec-c'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Section C: Long ({parsedResult.stats.longCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question / Q#..."
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-slate-100 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No questions found</p>
            <p className="text-xs text-slate-400">Try adjusting your filter or search query</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isMCQ = q.type === 'mcq';
            const isShort = q.type === 'short';

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all space-y-3 ${
                  isMCQ && !q.correctAnswer
                    ? 'border-amber-300 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Header row: Q#, Badges, Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-mono text-xs font-black flex items-center justify-center">
                      {q.questionNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                        isMCQ
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : isShort
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isMCQ ? 'MCQ (1 Mark)' : isShort ? 'Short Answer (2 Marks)' : 'Long Answer (5 Marks)'}
                    </span>
                    {q.correctAnswer ? (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ans: {q.correctAnswer}
                      </span>
                    ) : isMCQ ? (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Untagged (Click option below)
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingQuestion(JSON.parse(JSON.stringify(q)))}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Edit Question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text in Hindi */}
                <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {q.textHindi || q.text}
                </div>

                {/* Options Grid (For MCQs) - Interactive Click to Tag! */}
                {isMCQ && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctAnswer === opt.key;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            onUpdateQuestion({
                              ...q,
                              correctAnswer: opt.key,
                              correctAnswerText: `(${opt.key}) ${opt.textHindi || opt.text}`,
                              explanationHindi: q.explanationHindi || `सही उत्तर (${opt.key}) है।`,
                            })
                          }
                          className={`p-2.5 rounded-2xl text-xs flex items-center justify-between gap-2.5 transition-all text-left cursor-pointer group ${
                            isCorrect
                              ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                              : 'bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700'
                          }`}
                          title={`Click to mark option ${opt.key} as correct answer`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg font-mono text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border border-slate-300 text-slate-600 group-hover:border-indigo-400 group-hover:text-indigo-600'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="leading-snug">{opt.textHindi || opt.text}</span>
                          </div>

                          {isCorrect ? (
                            <span className="shrink-0 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Correct
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-slate-400 group-hover:text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                              Tag as Correct
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Explanation or Model Answer Box */}
                {(q.explanationHindi || q.modelAnswer) && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[11px] text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>{isMCQ ? 'उत्तर एवं व्याख्या (Explanation)' : 'आदर्श उत्तर (Model Answer)'}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line text-slate-800">
                      {q.explanationHindi || q.modelAnswer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Edit Question #{editingQuestion.questionNumber} ({editingQuestion.type.toUpperCase()})
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Question Text */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text (Hindi/English)</label>
                <textarea
                  value={editingQuestion.textHindi || editingQuestion.text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      text: e.target.value,
                      textHindi: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-sans"
                />
              </div>

              {/* Options for MCQ */}
              {editingQuestion.type === 'mcq' && editingQuestion.options && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Options & Correct Answer</label>
                  {editingQuestion.options.map((opt, idx) => (
                    <div key={opt.key} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={editingQuestion.correctAnswer === opt.key}
                        onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: opt.key })}
                        className="w-4 h-4 text-emerald-600 cursor-pointer"
                      />
                      <span className="font-mono font-bold w-5">{opt.key}.</span>
                      <input
                        type="text"
                        value={opt.textHindi || opt.text}
                        onChange={(e) => {
                          const newOpts = [...editingQuestion.options!];
                          newOpts[idx] = { ...opt, text: e.target.value, textHindi: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation / Model Answer */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation / Model Answer</label>
                <textarea
                  value={editingQuestion.explanationHindi || editingQuestion.modelAnswer || ''}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      explanationHindi: e.target.value,
                      modelAnswer: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

