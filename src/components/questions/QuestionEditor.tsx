import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, QuestionOption, QuestionType, QuestionStatus } from '../../types';
import { QuestionPaletteModal } from './QuestionPaletteModal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  Trash2,
  Plus,
  Eye,
  Languages,
  RotateCcw,
  HelpCircle,
  Award,
  BookOpen
} from 'lucide-react';

export const QuestionEditor: React.FC = () => {
  const {
    papers,
    selectedPaperId,
    setSelectedPaperId,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    setActiveTab,
    saveQuestion,
    addQuestion,
    deleteQuestion,
    chapters,
    regenerateSingleAnswer,
    goToAIGeneration
  } = useApp();

  const currentPaper = papers.find((p) => p.id === selectedPaperId) || papers[0];
  const questions = currentPaper?.questions || [];
  const activeQuestion: Question | undefined = questions[selectedQuestionIndex];

  // Local form state
  const [formData, setFormData] = useState<Question | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [showHindi, setShowHindi] = useState(true);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when active question changes
  useEffect(() => {
    if (activeQuestion) {
      setFormData({
        ...activeQuestion,
        options: activeQuestion.options || [
          { id: '1', key: 'A', text: '', textHindi: '' },
          { id: '2', key: 'B', text: '', textHindi: '' },
          { id: '3', key: 'C', text: '', textHindi: '' },
          { id: '4', key: 'D', text: '', textHindi: '' },
        ],
      });
    } else if (currentPaper && questions.length === 0) {
      // If paper has no questions, prepare empty question template
      const emptyQ: Question = {
        id: `q-${currentPaper.id}-1`,
        paperId: currentPaper.id,
        questionNumber: 1,
        type: 'mcq',
        text: '',
        textHindi: '',
        options: [
          { id: '1', key: 'A', text: '', textHindi: '' },
          { id: '2', key: 'B', text: '', textHindi: '' },
          { id: '3', key: 'C', text: '', textHindi: '' },
          { id: '4', key: 'D', text: '', textHindi: '' },
        ],
        correctAnswer: 'A',
        explanation: '',
        explanationHindi: '',
        aiAnswer: '',
        aiStatus: 'missing',
        marks: 1,
        negativeMarks: 0,
        difficulty: 'medium',
      };
      setFormData(emptyQ);
    }
  }, [selectedPaperId, selectedQuestionIndex, activeQuestion]);

  if (!currentPaper || !formData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No question paper selected.</p>
        <button
          onClick={() => setActiveTab('papers')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Go to Papers List
        </button>
      </div>
    );
  }

  const handleOptionChange = (key: 'A' | 'B' | 'C' | 'D', text: string, isHindi = false) => {
    if (!formData.options) return;
    const newOptions = formData.options.map((opt) => {
      if (opt.key === key) {
        return isHindi ? { ...opt, textHindi: text } : { ...opt, text };
      }
      return opt;
    });
    setFormData({ ...formData, options: newOptions });
  };

  const handleSave = () => {
    saveQuestion(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleNext = () => {
    handleSave();
    if (selectedQuestionIndex < questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    } else {
      // Add new question if at the end
      addQuestion(currentPaper.id);
    }
  };

  const handlePrev = () => {
    handleSave();
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  };

  const handleAIAssist = async () => {
    setIsAiGenerating(true);
    const answer = await regenerateSingleAnswer(formData);
    setFormData((prev) => (prev ? { ...prev, aiAnswer: answer, aiStatus: 'generated' } : null));
    setIsAiGenerating(false);
  };

  // Math/Equation symbol insertion helper
  const insertSymbol = (sym: string) => {
    setFormData((prev) => (prev ? { ...prev, text: prev.text + ' ' + sym + ' ' } : null));
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in">
      {/* 1. Header Navigation Bar (← Biology 2026 Set A) */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200">
        <button
          id="editor-back-btn"
          onClick={() => setActiveTab('papers')}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 py-1.5 px-2 rounded-lg bg-slate-100 active:bg-slate-200 select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{currentPaper.title}</span>
        </button>

        {/* Question Counter & Palette Trigger */}
        <div className="flex items-center gap-1.5">
          <button
            id="editor-palette-btn"
            onClick={() => setShowPalette(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 active:bg-slate-800 select-none shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              Q {selectedQuestionIndex + 1} / {questions.length}
            </span>
          </button>

          {/* Hindi Toggle */}
          <button
            onClick={() => setShowHindi(!showHindi)}
            className={`p-1.5 rounded-xl border text-xs font-bold transition-colors ${
              showHindi
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Toggle Hindi/Bilingual View"
          >
            <Languages className="w-4 h-4" />
          </button>

          {/* Live Preview Toggle */}
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`p-1.5 rounded-xl border text-xs font-bold transition-colors ${
              showLivePreview
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Preview Student View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Quick Nav (← Previous / Next →) */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <button
          onClick={handlePrev}
          disabled={selectedQuestionIndex === 0}
          className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 bg-slate-100 text-slate-700 disabled:opacity-30 active:bg-slate-200 border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* AI Status Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
              formData.aiStatus === 'approved'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : formData.aiStatus === 'generated'
                ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                : formData.aiStatus === 'review'
                ? 'bg-amber-50 border border-amber-200 text-amber-700 animate-pulse'
                : 'bg-slate-100 border border-slate-200 text-slate-600'
            }`}
          >
            {formData.aiStatus === 'approved' && '✓ Approved'}
            {formData.aiStatus === 'generated' && '● AI Generated'}
            {formData.aiStatus === 'review' && '⚠ Needs Review'}
            {formData.aiStatus === 'missing' && '○ Missing AI Answer'}
          </span>
        </div>

        <button
          onClick={handleNext}
          className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 bg-slate-900 text-white active:bg-slate-800 shadow-sm"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: On Mobile single column, on Desktop side-by-side editor + student preview */}
      <div className={`grid gap-4 ${showLivePreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor Form */}
        <div className="space-y-4">
          {/* Question Type & Marks Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Question Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
              >
                <option value="mcq">MCQ (Single Choice)</option>
                <option value="multi">Multi-Correct MCQ</option>
                <option value="short">Short Answer (2 Marks)</option>
                <option value="long">Long Answer (5 Marks)</option>
                <option value="assertion_reason">Assertion - Reason</option>
                <option value="numerical">Numerical / Problem</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
              >
                <option value="easy">Easy (सीधा प्रश्न)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="hard">Hard (कठिन/विश्लेषणात्मक)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Marks
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) || 1 })}
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold font-mono text-center focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Question Text in English */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Question Text (English)</label>
              <div className="flex items-center gap-1">
                {['√x', '±', '→', 'π', 'H₂O', 'CO₂'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertSymbol(sym)}
                    className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 hover:text-slate-900"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Enter question text in English..."
              className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none placeholder-slate-400 leading-relaxed font-medium shadow-sm"
            />
          </div>

          {/* Question Text in Hindi (Bilingual support) */}
          {showHindi && (
            <div>
              <label className="block text-xs font-bold text-amber-800 mb-1.5">
                प्रश्न पाठ (हिंदी अनुवाद)
              </label>
              <textarea
                rows={2}
                value={formData.textHindi || ''}
                onChange={(e) => setFormData({ ...formData, textHindi: e.target.value })}
                placeholder="यहाँ हिंदी में प्रश्न लिखें..."
                className="w-full p-3 rounded-2xl bg-amber-50/40 border border-amber-200 text-amber-950 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-amber-700/50 leading-relaxed font-medium shadow-sm"
              />
            </div>
          )}

          {/* Options A, B, C, D (For MCQ types) */}
          {formData.type === 'mcq' || formData.type === 'multi' || formData.type === 'assertion_reason' ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Options & Correct Answer
                </label>
                <span className="text-[11px] text-slate-500">Select correct radio</span>
              </div>

              {(formData.options || []).map((opt) => {
                const isCorrect = formData.correctAnswer === opt.key;
                return (
                  <div
                    key={opt.key}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          id={`correct-${opt.key}`}
                          checked={isCorrect}
                          onChange={() => setFormData({ ...formData, correctAnswer: opt.key })}
                          className="w-4 h-4 text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500"
                        />
                        <label
                          htmlFor={`correct-${opt.key}`}
                          className={`text-xs font-extrabold cursor-pointer ${
                            isCorrect ? 'text-emerald-800' : 'text-slate-700'
                          }`}
                        >
                          Option {opt.key} {isCorrect && '(Correct Answer ✓)'}
                        </label>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.key, e.target.value)}
                      placeholder={`Option ${opt.key} text in English...`}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none mb-1.5"
                    />

                    {showHindi && (
                      <input
                        type="text"
                        value={opt.textHindi || ''}
                        onChange={(e) => handleOptionChange(opt.key, e.target.value, true)}
                        placeholder={`विकल्प ${opt.key} (हिंदी)...`}
                        className="w-full h-9 px-3 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-950 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Subjective / Short / Long answer field */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Expected Model Answer & Key Points
                </label>
                <textarea
                  rows={4}
                  value={formData.explanation || ''}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Enter point-by-point marking scheme & model answer..."
                  className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          )}

          {/* AI Answer & Assistance Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900">Gemini AI Answer & Explanation</span>
              </div>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={isAiGenerating}
                className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50 shadow-sm"
              >
                {isAiGenerating ? 'Generating...' : 'Generate with Gemini'}
              </button>
            </div>

            {formData.aiAnswer ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-36 overflow-y-auto">
                <p className="font-mono text-indigo-700 whitespace-pre-wrap">{formData.aiAnswer}</p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                No AI answer generated yet for this question. Tap "Generate with Gemini" or use Batch AI generation.
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">Status: {formData.aiStatus}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    aiStatus: formData.aiStatus === 'approved' ? 'review' : 'approved',
                  })
                }
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  formData.aiStatus === 'approved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                {formData.aiStatus === 'approved' ? '✓ Mark as Approved' : 'Mark as Approved'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Student Card (if toggled or on desktop) */}
        {showLivePreview && (
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 self-start sticky top-16">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Student App Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold">
                {formData.marks} Marks
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                Q{formData.questionNumber}. {formData.text || 'Question text preview...'}
              </div>
              {formData.textHindi && (
                <div className="text-xs text-amber-900 font-medium mb-3">{formData.textHindi}</div>
              )}

              {formData.options && (
                <div className="space-y-2 mt-3">
                  {formData.options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                        opt.key === formData.correctAnswer
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-[10px] text-slate-800">
                        {opt.key}
                      </span>
                      <span>
                        {opt.text} {opt.textHindi ? `(${opt.textHindi})` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {formData.aiAnswer && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-indigo-700 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Explanation & Solution
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.aiAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Sticky Bottom Action Bar (Exact mobile requirement from prompt #13) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={selectedQuestionIndex === 0}
            className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
            title="Previous Question"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="editor-save-btn"
            onClick={handleSave}
            className="flex-1 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all select-none"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Question
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center active:scale-95 transition-all"
            title="Next Question"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question Palette Modal */}
      {showPalette && (
        <QuestionPaletteModal
          paper={currentPaper}
          currentIndex={selectedQuestionIndex}
          onSelect={(idx) => setSelectedQuestionIndex(idx)}
          onClose={() => setShowPalette(false)}
        />
      )}
    </div>
  );
};
