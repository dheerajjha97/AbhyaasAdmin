import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Layers,
  Award,
  RefreshCw,
  Copy,
  Info,
  Trash2
} from 'lucide-react';
import {
  SAMPLE_BIOLOGY_SYLLABUS_TEXT,
  SAMPLE_PHYSICS_SYLLABUS_TEXT,
  ParsedSyllabusResult
} from '../../utils/syllabusParser';
import { ThreeDSyllabusIllustration } from '../common/ThreeDIllustrations';

interface PasteAndParseSyllabusViewProps {
  rawSyllabusText: string;
  setRawSyllabusText: (text: string) => void;
  parsedResult: ParsedSyllabusResult | null;
  onParse: () => void;
  onNavigateToReview: () => void;
  onNavigateToJson: () => void;
}

export const PasteAndParseSyllabusView: React.FC<PasteAndParseSyllabusViewProps> = ({
  rawSyllabusText,
  setRawSyllabusText,
  parsedResult,
  onParse,
  onNavigateToReview,
  onNavigateToJson,
}) => {
  const [copiedSample, setCopiedSample] = useState(false);

  const handleLoadSample = (type: 'biology' | 'physics') => {
    if (type === 'biology') {
      setRawSyllabusText(SAMPLE_BIOLOGY_SYLLABUS_TEXT);
    } else {
      setRawSyllabusText(SAMPLE_PHYSICS_SYLLABUS_TEXT);
    }
  };

  const handleClear = () => {
    setRawSyllabusText('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Quick Sample Loaders */}
      <div className="bg-white rounded-3xl border border-emerald-200/80 p-4 sm:p-5 shadow-md card-3d-emerald flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 p-1 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs hidden sm:block">
            <ThreeDSyllabusIllustration size={44} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 sm:hidden" />
              <h3 className="text-sm font-black text-emerald-950">
                1. Paste Syllabus & Smart Curriculum Parser
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Paste your curriculum outline with Units, Chapters, Topics, and Marks weightage. Our AI parser extracts structured trees in bilingual format.
            </p>
          </div>
        </div>

        {/* Quick Sample Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => handleLoadSample('biology')}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs btn-3d-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bio (16 Ch)</span>
          </button>
          <button
            onClick={() => handleLoadSample('physics')}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs btn-3d-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Physics (9 Ch)</span>
          </button>
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-md card-3d-emerald space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-emerald-600" />
            Raw Syllabus Text (Units, Chapters, Marks & Topics)
          </label>
          <div className="flex items-center gap-2">
            {rawSyllabusText && (
              <button
                onClick={handleClear}
                className="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear Textbox / टेक्स्ट साफ़ करें"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Text</span>
              </button>
            )}
            <span className="text-xs font-mono text-slate-400">
              {rawSyllabusText.split('\n').filter((l) => l.trim()).length} lines
            </span>
          </div>
        </div>

        <textarea
          value={rawSyllabusText}
          onChange={(e) => setRawSyllabusText(e.target.value)}
          placeholder={`Paste Syllabus text here, e.g.:

UNIT 1: REPRODUCTION (जनन) [14 Marks]
Chapter 1: Reproduction in Organisms (जीवों में जनन) [4 Marks]
- Asexual reproduction: Binary fission, budding, vegetative propagation.
- Sexual reproduction: Gametogenesis, Fertilization, Embryogenesis.

Chapter 2: Sexual Reproduction in Flowering Plants [5 Marks]
- Flower structure and development of male and female gametophytes.
- Pollination: Types, agencies and examples.`}
          className="w-full h-80 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all leading-relaxed shadow-inner"
        />

        {/* Formatting Quick Guide */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            Smart Parser Formatting Guidelines:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5">1. Units & Marks</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">UNIT 1: ELECTROSTATICS [8 Marks]</code>
              <p className="text-slate-500 text-[10px] mt-1">Auto-extracts unit number and unit weightage.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5">2. Chapters & Bilingual</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">Chapter 1: Electric Charges (वैद्युत आवेश)</code>
              <p className="text-slate-500 text-[10px] mt-1">Separates English and Hindi titles automatically.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5">3. Topics & Subtopics</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">- Coulomb's law: statement; formula</code>
              <p className="text-slate-500 text-[10px] mt-1">Lines starting with "-" or "•" become structured topics.</p>
            </div>
          </div>
        </div>

        {/* Parse Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onParse}
            disabled={!rawSyllabusText.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs btn-3d-emerald flex items-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Parse & Build Syllabus Structure</span>
          </button>

          {parsedResult && (
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToReview}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Review Chapters ({parsedResult.stats.totalChapters})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onNavigateToJson}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View JSON</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Parsed Preview Cards if parsed */}
      {parsedResult && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-4 sm:p-5 shadow-md card-3d-emerald space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Parsed Curriculum Snapshot ({parsedResult.title})
            </h4>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {parsedResult.stats.totalUnits} Units • {parsedResult.stats.totalChapters} Chapters • {parsedResult.stats.totalTopics} Topics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {parsedResult.chapters.slice(0, 6).map((ch, idx) => (
              <div
                key={ch.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700">
                    Ch {ch.chapterNumber}: {ch.title}
                  </span>
                  {ch.marksWeightage && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {ch.marksWeightage} Marks
                    </span>
                  )}
                </div>
                {ch.hindiTitle && (
                  <p className="text-[11px] text-slate-600 font-medium">
                    {ch.hindiTitle}
                  </p>
                )}
                <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <span>{ch.topics.length} Sub-topics</span>
                  {ch.unitTitle && <span>• Unit: {ch.unitTitle.slice(0, 20)}...</span>}
                </div>
              </div>
            ))}
          </div>

          {parsedResult.chapters.length > 6 && (
            <div className="text-center pt-1">
              <button
                onClick={onNavigateToReview}
                className="text-xs font-black text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                + View and edit all {parsedResult.chapters.length} chapters in Review Step →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

