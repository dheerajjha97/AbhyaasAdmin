import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Plus,
  ArrowRight,
  Calculator,
  Code2,
  FileCheck2,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { ParsedPaperResult, ParsedQuestion, ParsedOption } from '../../utils/questionParser';
import { MathSymbolBar } from './MathSymbolBar';

interface MathReviewViewProps {
  parsedResult: ParsedPaperResult | null;
  onUpdateQuestion: (updatedQ: ParsedQuestion) => void;
  onDeleteQuestion: (qId: string) => void;
  onAddQuestion: (sectionId: 'sec-a' | 'sec-b' | 'sec-c') => void;
  onNavigateToJson: () => void;
  onNavigateToPush: () => void;
}

export const MathReviewView: React.FC<MathReviewViewProps> = ({
  parsedResult,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onNavigateToJson,
  onNavigateToPush,
}) => {
  const [activeSectionFilter, setActiveSectionFilter] = useState<'all' | 'sec-a' | 'sec-b' | 'sec-c'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<ParsedQuestion | null>(null);

  if (!parsedResult || parsedResult.questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Calculator className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800">कोई प्रश्न पार्स नहीं हुआ है</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          कृपया पहले <strong>'1. Paste & Parse'</strong> टैब में जाकर गणित प्रश्न पत्र पेस्ट करें या 1-Click सैंपल पेपर लोड करें।
        </p>
      </div>
    );
  }

  const { questions, stats } = parsedResult;

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (activeSectionFilter !== 'all' && q.sectionId !== activeSectionFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const qNumStr = q.questionNumber.toString();
      const query = searchQuery.toLowerCase();
      const matchText = (q.text || '').toLowerCase();
      const matchAns = (q.correctAnswer || '').toLowerCase();
      const matchModelAns = (q.modelAnswer || '').toLowerCase();
      const matchExp = (q.explanation || '').toLowerCase();

      return (
        qNumStr.includes(query) ||
        matchText.includes(query) ||
        matchAns.includes(query) ||
        matchModelAns.includes(query) ||
        matchExp.includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Section Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveSectionFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSectionFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सभी प्रश्न ({stats.totalQuestions})
            </button>

            <button
              onClick={() => setActiveSectionFilter('sec-a')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSectionFilter === 'sec-a'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              खण्ड-अ वस्तुनिष्ठ ({stats.mcqCount})
            </button>

            <button
              onClick={() => setActiveSectionFilter('sec-b')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSectionFilter === 'sec-b'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              खण्ड-ब लघु उत्तरीय ({stats.shortCount})
            </button>

            <button
              onClick={() => setActiveSectionFilter('sec-c')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSectionFilter === 'sec-c'
                  ? 'bg-purple-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              खण्ड-स दीर्घ उत्तरीय ({stats.longCount})
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToJson}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate JSON</span>
            </button>
            <button
              onClick={onNavigateToPush}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <span>GitHub Push</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="प्रश्न संख्या (e.g. 6), सूत्र, या शब्द खोजें (e.g. त्रिभुज, sin, वृत्त, समरूप, बहुपद)..."
            className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            id={q.id}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3"
          >
            {/* Header: Section, Number & Marks */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                  {q.questionNumber}
                </span>

                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    q.sectionId === 'sec-a'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : q.sectionId === 'sec-b'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {q.type === 'mcq'
                    ? 'वस्तुनिष्ठ (MCQ - 1 अंक)'
                    : q.type === 'short'
                    ? 'लघु उत्तरीय (2 अंक)'
                    : 'दीर्घ उत्तरीय (5 अंक)'}
                </span>

                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  {q.sectionName}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingQuestion(q)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Edit Question"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm font-semibold text-slate-900 leading-relaxed font-sans">
              {q.text}
            </div>

            {/* Options for MCQ */}
            {q.type === 'mcq' && q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctAnswer === opt.key;
                  return (
                    <div
                      key={opt.id || `${q.id}-opt-${opt.key}-${optIdx}`}
                      className={`p-2.5 rounded-2xl border text-xs flex items-start gap-2 transition-all ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-black text-[11px] shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="font-sans leading-tight mt-0.5">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Correct Answer & Explanation for MCQ */}
            {q.type === 'mcq' && (
              <div className="space-y-1.5 pt-1">
                {q.correctAnswerText && (
                  <div className="text-xs font-bold text-emerald-800 bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>सही उत्तर: <strong>{q.correctAnswerText}</strong></span>
                  </div>
                )}
                {q.explanation && (
                  <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl space-y-1">
                    <strong className="text-slate-900 font-bold block text-[11px] uppercase tracking-wider">
                      व्याख्या / हल (Solution):
                    </strong>
                    <p className="font-mono text-[11px] leading-relaxed whitespace-pre-line text-slate-800">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Subjective Model Answer & Step-by-Step Proof */}
            {q.type !== 'mcq' && q.modelAnswer && (
              <div className="p-3.5 bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200/90 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                  <Calculator className="w-3.5 h-3.5 text-amber-700" />
                  <span>हल / आदर्श उत्तर (Step-by-Step Model Answer):</span>
                </div>
                <div className="font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap pl-1 border-l-2 border-amber-400">
                  {q.modelAnswer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <span>प्रश्न #{editingQuestion.questionNumber} संपादित करें (Edit Question)</span>
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Math Symbol Bar for editing */}
            <MathSymbolBar
              onInsertSymbol={(sym) => {
                setEditingQuestion({
                  ...editingQuestion,
                  text: editingQuestion.text + sym,
                });
              }}
            />

            {/* Question Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">प्रश्न कथन (Question Text):</label>
              <textarea
                value={editingQuestion.text}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                rows={3}
                className="w-full p-3 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            {/* MCQ Options Edit */}
            {editingQuestion.type === 'mcq' && editingQuestion.options && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">विकल्प (Options):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editingQuestion.options.map((opt, idx) => (
                    <div key={opt.id || `${opt.key}-${idx}`} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-200 font-mono font-black text-xs flex items-center justify-center shrink-0">
                        {opt.key}
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...editingQuestion.options!];
                          newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="w-full p-2 text-xs font-mono border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-700">सही विकल्प (Correct Option):</label>
                  {(['A', 'B', 'C', 'D'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswer: k })}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        editingQuestion.correctAnswer === k
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subjective Model Answer */}
            {editingQuestion.type !== 'mcq' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">हल एवं चरण (Step-by-Step Proof / Solution):</label>
                <textarea
                  value={editingQuestion.modelAnswer || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, modelAnswer: e.target.value })}
                  rows={6}
                  className="w-full p-3 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateQuestion(editingQuestion);
                  setEditingQuestion(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-600/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
