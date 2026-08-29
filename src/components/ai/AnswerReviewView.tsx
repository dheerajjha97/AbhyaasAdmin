import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Edit3,
  Sparkles,
  Maximize2,
  Minimize2,
  Save,
  X,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { QuestionPaletteModal } from '../questions/QuestionPaletteModal';

export const AnswerReviewView: React.FC = () => {
  const {
    papers,
    selectedPaperId,
    selectedReviewQIndex,
    setSelectedReviewQIndex,
    setActiveTab,
    updateQuestionStatus,
    regenerateSingleAnswer,
    saveQuestion
  } = useApp();

  const currentPaper = papers.find((p) => p.id === selectedPaperId) || papers[0];
  const questions = currentPaper?.questions || [];
  const question = questions[selectedReviewQIndex] || questions[0];

  const [isEditing, setIsEditing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(question?.aiAnswer || '');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  if (!question) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No question available for review.</p>
        <button
          onClick={() => setActiveTab('ai')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Back to AI Answers
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    updateQuestionStatus(currentPaper.id, question.id, 'approved', editedAnswer || question.aiAnswer);
    // Auto advance to next review question
    if (selectedReviewQIndex < questions.length - 1) {
      setSelectedReviewQIndex(selectedReviewQIndex + 1);
      const nextQ = questions[selectedReviewQIndex + 1];
      setEditedAnswer(nextQ?.aiAnswer || '');
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const newAnswer = await regenerateSingleAnswer(question, customPrompt);
    setEditedAnswer(newAnswer);
    setIsRegenerating(false);
    setShowPromptDialog(false);
  };

  const handleSaveEdit = () => {
    saveQuestion({
      ...question,
      aiAnswer: editedAnswer,
      aiStatus: 'review',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in">
      {/* 1. Header (← Back to AI Answers, Q# / Total) */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ai')}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 py-1.5 px-2 rounded-lg bg-slate-100 active:bg-slate-200 select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentPaper.title}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPalette(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 active:bg-slate-800 select-none shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Q {selectedReviewQIndex + 1} / {questions.length}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Nav Bar (Previous / Next) */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => {
            if (selectedReviewQIndex > 0) {
              setSelectedReviewQIndex(selectedReviewQIndex - 1);
              setEditedAnswer(questions[selectedReviewQIndex - 1]?.aiAnswer || '');
            }
          }}
          disabled={selectedReviewQIndex === 0}
          className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 bg-slate-100 text-slate-700 disabled:opacity-30 active:bg-slate-200 border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* AI Status Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            question.aiStatus === 'approved'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : question.aiStatus === 'review'
              ? 'bg-amber-50 border border-amber-200 text-amber-700 animate-pulse'
              : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
          }`}
        >
          {question.aiStatus === 'approved' ? '✓ Approved' : '⚠ Needs Review'}
        </span>

        <button
          onClick={() => {
            if (selectedReviewQIndex < questions.length - 1) {
              setSelectedReviewQIndex(selectedReviewQIndex + 1);
              setEditedAnswer(questions[selectedReviewQIndex + 1]?.aiAnswer || '');
            }
          }}
          disabled={selectedReviewQIndex >= questions.length - 1}
          className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 bg-slate-900 text-white active:bg-slate-800 shadow-sm"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Question Focus Card (One question at a time) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-indigo-700 font-mono">
            Question {question.questionNumber} ({question.type.toUpperCase()} • {question.marks} Marks)
          </span>
          {question.correctAnswer && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold">
              Key: {question.correctAnswer}
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          {question.text}
        </h2>
        {question.textHindi && (
          <p className="text-xs text-amber-900 font-medium leading-relaxed">
            {question.textHindi}
          </p>
        )}

        {/* Options Preview if MCQ */}
        {question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {question.options.map((opt) => (
              <div
                key={opt.key}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  opt.key === question.correctAnswer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-[10px] text-slate-800">
                  {opt.key}
                </span>
                <span>{opt.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. AI Generated Answer Section (Exact user requirement #7) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900">AI Generated Answer</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
              title="Full Screen Editor"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-200"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-700" />
              <span>{isEditing ? 'Cancel' : 'Edit Answer'}</span>
            </button>
          </div>
        </div>

        {/* Answer Content Box */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              rows={6}
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save Edits
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-sans">
            {question.aiAnswer || (
              <span className="text-slate-400 italic">No answer generated yet.</span>
            )}
          </div>
        )}

        {/* Action Buttons: [✓ Approve] [↻ Regenerate] */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            id="review-approve-btn"
            onClick={handleApprove}
            className="w-full h-13 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm select-none transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Approve Answer</span>
          </button>

          <button
            id="review-regenerate-btn"
            onClick={() => setShowPromptDialog(true)}
            disabled={isRegenerating}
            className="w-full h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 select-none transition-all"
          >
            <RotateCcw className={`w-4 h-4 text-slate-700 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* 5. Full Screen Editor Modal (User requirement #7) */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Full-Screen Answer Editor</h3>
              <p className="text-xs text-slate-500">Q{question.questionNumber}: {question.text.slice(0, 40)}...</p>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 py-4 flex flex-col">
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              placeholder="Write full structured answer with definitions, equations, bullet points..."
              className="w-full flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm leading-relaxed font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={() => setIsFullScreen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSaveEdit();
                setIsFullScreen(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save & Exit
            </button>
          </div>
        </div>
      )}

      {/* 6. Prompt refinement dialog */}
      {showPromptDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Prompt Refinement
              </span>
              <button onClick={() => setShowPromptDialog(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide special instructions to Gemini (e.g. "Add Hindi translation", "Give step-by-step points", "Explain with diagram labels"):
            </p>

            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Make it simpler for Class 12 Bihar Board students..."
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleRegenerate}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800"
              >
                Regenerate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Palette Modal */}
      {showPalette && (
        <QuestionPaletteModal
          paper={currentPaper}
          currentIndex={selectedReviewQIndex}
          onSelect={(idx) => {
            setSelectedReviewQIndex(idx);
            setEditedAnswer(questions[idx]?.aiAnswer || '');
          }}
          onClose={() => setShowPalette(false)}
        />
      )}
    </div>
  );
};
