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
  Trash2,
  Microscope,
  Atom,
  Dna,
  FlaskConical
} from 'lucide-react';
import {
  ParsedSyllabusResult,
  SAMPLE_CLASS10_SCIENCE_SYLLABUS_TEXT,
  SAMPLE_CLASS9_SCIENCE_SYLLABUS_TEXT,
  SAMPLE_BIOLOGY_SYLLABUS_TEXT,
  SAMPLE_PHYSICS_SYLLABUS_TEXT
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
  const [activeSampleName, setActiveSampleName] = useState<string>('');

  const handleClear = () => {
    setRawSyllabusText('');
    setActiveSampleName('');
  };

  const handleLoadSample = (sampleText: string, name: string) => {
    setRawSyllabusText(sampleText.trim());
    setActiveSampleName(name);
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
              Paste your curriculum outline with Units, Chapters, Topics, and Marks weightage. Our AI parser extracts structured trees in bilingual Hindi & English format.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Load Real Syllabi Presets */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 sm:p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Ready-to-Test Sample Syllabus (1-Click Presets):</span>
          </div>
          {activeSampleName && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              Loaded: {activeSampleName}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_CLASS10_SCIENCE_SYLLABUS_TEXT, 'Class 10 Science')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-xs font-bold text-emerald-900 transition-all shadow-2xs hover:shadow-xs text-left cursor-pointer"
          >
            <Microscope className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <div className="truncate">
              <span className="block font-black text-slate-900 truncate">Class 10 Science</span>
              <span className="text-[10px] text-slate-500 font-normal">13 Chaps • 80 M</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_CLASS9_SCIENCE_SYLLABUS_TEXT, 'Class 9 Science')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-xs font-bold text-emerald-900 transition-all shadow-2xs hover:shadow-xs text-left cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <div className="truncate">
              <span className="block font-black text-slate-900 truncate">Class 9 Science</span>
              <span className="text-[10px] text-slate-500 font-normal">11 Chaps • 80 M</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_BIOLOGY_SYLLABUS_TEXT, 'Class 12 Biology')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-xs font-bold text-emerald-900 transition-all shadow-2xs hover:shadow-xs text-left cursor-pointer"
          >
            <Dna className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="block font-black text-slate-900 truncate">Class 12 Biology</span>
              <span className="text-[10px] text-slate-500 font-normal">16 Chaps • 70 M</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample(SAMPLE_PHYSICS_SYLLABUS_TEXT, 'Class 12 Physics')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-xs font-bold text-emerald-900 transition-all shadow-2xs hover:shadow-xs text-left cursor-pointer"
          >
            <Atom className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <div className="truncate">
              <span className="block font-black text-slate-900 truncate">Class 12 Physics</span>
              <span className="text-[10px] text-slate-500 font-normal">14 Chaps • 70 M</span>
            </div>
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
          placeholder={`Paste Syllabus text here in this format:

UNIT I: CHEMICAL SUBSTANCES (रासायनिक पदार्थ) [25 Marks]
Chapter 1: Chemical Reactions and Equations (रासायनिक अभिक्रियाएं एवं समीकरण) [6 Marks]
- Types of chemical reactions: Combination, decomposition, displacement.
- Oxidation and reduction in daily life.
- Corrosion and rancidity.

Chapter 2: Acids, Bases and Salts (अम्ल, क्षारक एवं लवण) [6 Marks]
- Concept of pH scale and everyday importance.
- Bleaching powder, Baking soda, Plaster of Paris.`}
          className="w-full h-80 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all leading-relaxed shadow-inner"
        />

        {/* Formatting Quick Guide */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs space-y-2.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Syllabus Format Guide (पेस्ट करने के नियम व फॉर्मेट):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-[11px] text-slate-600">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5 font-bold">1. Unit / इकाई</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded block text-slate-800 font-mono">UNIT 1: NAME [Marks]</code>
              <p className="text-slate-500 text-[10px] mt-1 leading-snug">उदाहरण: <code className="text-slate-700 font-mono">UNIT I: CHEMICALS [25 Marks]</code> या <code className="text-slate-700 font-mono">इकाई 1: भौतिक विज्ञान [30 अंक]</code></p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5 font-bold">2. Chapter / अध्याय</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded block text-slate-800 font-mono">Chapter 1: Title (हिंदी) [Marks]</code>
              <p className="text-slate-500 text-[10px] mt-1 leading-snug">उदाहरण: <code className="text-slate-700 font-mono">Chapter 1: Life Processes (जैव प्रक्रम) [10 Marks]</code></p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5 font-bold">3. Topics / टॉपिक्स</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded block text-slate-800 font-mono">- Topic 1 / * Topic 2</code>
              <p className="text-slate-500 text-[10px] mt-1 leading-snug">बुलेट पॉइंट (<code className="text-slate-700 font-mono">- </code> या <code className="text-slate-700 font-mono">* </code> या <code className="text-slate-700 font-mono">1. </code>) से शुरू करें।</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <strong className="text-emerald-700 block mb-0.5 font-bold">4. Auto Detection</strong>
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded block text-slate-800 font-mono"># CLASS 10 SCIENCE</code>
              <p className="text-slate-500 text-[10px] mt-1 leading-snug">ऊपर विषय/कक्षा लिखने पर सिस्टम ऑटो-डिटेक्ट कर लेता है।</p>
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

