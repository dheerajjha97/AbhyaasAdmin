import React, { useState, useRef } from 'react';
import {
  FileUp,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  BookOpen,
  GraduationCap,
  Layers,
  HelpCircle,
  ArrowRight,
  Settings2,
  ShieldCheck
} from 'lucide-react';
import { parsePdfWithGemini } from '../../utils/pdfPaperService';
import { ParsedPaperResult } from '../../utils/questionParser';

interface PdfUploadDropzoneProps {
  onPaperParsed: (result: ParsedPaperResult, rawText: string) => void;
  defaultClassId?: string;
  defaultSubjectId?: string;
  defaultBoard?: string;
}

export const PdfUploadDropzone: React.FC<PdfUploadDropzoneProps> = ({
  onPaperParsed,
  defaultClassId = '12',
  defaultSubjectId = 'physics',
  defaultBoard = 'CBSE',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Configuration options
  const [board, setBoard] = useState(defaultBoard);
  const [className, setClassName] = useState(`Class ${defaultClassId}`);
  const [subjectName, setSubjectName] = useState('auto');
  const [generateNCERTAnswers, setGenerateNCERTAnswers] = useState(true);
  const [answerLanguage, setAnswerLanguage] = useState<'bilingual' | 'hindi' | 'english'>('bilingual');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isPdf && !isImage) {
      setErrorMessage('Please upload a valid PDF document or Image file (.pdf, .jpg, .png).');
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setErrorMessage('File size exceeds 40MB limit. Please upload a smaller PDF or compressed document.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleStartProcessing = async () => {
    if (!selectedFile) {
      setErrorMessage('Please choose or drop a PDF question paper file first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setProgressPercent(10);
    setProgressText('Preparing question paper document...');

    try {
      const { parsedResult, rawText } = await parsePdfWithGemini({
        file: selectedFile,
        subjectName,
        className,
        board,
        generateNCERTAnswers,
        answerLanguage,
        customInstructions: customInstructions.trim() || undefined,
        onProgress: (status, percent) => {
          setProgressText(status);
          setProgressPercent(percent);
        },
      });

      onPaperParsed(parsedResult, rawText);
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setErrorMessage(err.message || 'Failed to process document with Gemini AI. Please verify your GEMINI_API_KEY.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white border border-indigo-100/90 shadow-md card-3d-indigo space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold shadow-xs shrink-0">
            <FileUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Upload PDF Question Paper</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                NCERT AI Engine
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your school/board question paper PDF. Gemini will digitize all questions & write step-wise NCERT/CBSE solutions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>{showAdvanced ? 'Hide Exam Settings' : 'Exam Settings'}</span>
        </button>
      </div>

      {/* Target Exam Settings (Quick Selectors) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1">
            Target Board Pattern
          </label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            disabled={isLoading}
            className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="CBSE">CBSE (Central Board)</option>
            <option value="BSEB">Bihar Board (BSEB)</option>
            <option value="UPMSP">UP Board (UPMSP)</option>
            <option value="ICSE">ICSE / ISC</option>
            <option value="State Board">General State Board (NCERT)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1">
            Class Level
          </label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            disabled={isLoading}
            className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="Class 12">Class 12th (Senior Secondary)</option>
            <option value="Class 11">Class 11th</option>
            <option value="Class 10">Class 10th (Secondary)</option>
            <option value="Class 9">Class 9th</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Subject</span>
            <span className="text-[10px] text-indigo-600 font-bold">Auto-detected from PDF</span>
          </label>
          <select
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            disabled={isLoading}
            className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
          >
            <option value="auto">✨ Auto-Detect from PDF (स्वचालित पहचान)</option>
            <option value="Physics (भौतिक विज्ञान)">Physics (भौतिक विज्ञान)</option>
            <option value="Chemistry (रसायन विज्ञान)">Chemistry (रसायन विज्ञान)</option>
            <option value="Mathematics (गणित)">Mathematics (गणित)</option>
            <option value="Biology (जीव विज्ञान)">Biology (जीव विज्ञान)</option>
            <option value="Science (विज्ञान)">Science (विज्ञान - 10th)</option>
            <option value="Social Science (सामाजिक विज्ञान)">Social Science (सामाजिक विज्ञान)</option>
            <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
            <option value="English (अंग्रेज़ी)">English (अंग्रेज़ी)</option>
          </select>
        </div>
      </div>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                Solution Language
              </label>
              <select
                value={answerLanguage}
                onChange={(e) => setAnswerLanguage(e.target.value as any)}
                disabled={isLoading}
                className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="bilingual">Bilingual (Hindi + English Key Terminology)</option>
                <option value="hindi">Pure Hindi (शुद्ध हिंदी पारिभाषिक शब्दावली)</option>
                <option value="english">Pure English (CBSE Marking Format)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="generate-ncert-checkbox"
                checked={generateNCERTAnswers}
                onChange={(e) => setGenerateNCERTAnswers(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="generate-ncert-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                Write Complete NCERT / CBSE Step-wise Answers with Explanations
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Custom Teacher Instructions (Optional)
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Include SI units in derivations, highlight key definition keywords"
              className="w-full h-8 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      )}

      {/* Drag & Drop File Zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
          selectedFile
            ? 'border-emerald-300 bg-emerald-50/40'
            : isDragging
            ? 'border-indigo-500 bg-indigo-50/70 scale-[1.01]'
            : 'border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-slate-50 cursor-pointer'
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Change File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <FileUp className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                Drag & drop your Question Paper PDF here, or <span className="text-indigo-600 underline">Browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Multi-page PDF, Scanned Question Papers, and Images (up to 40MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{errorMessage}</p>
            {errorMessage.includes('503') || errorMessage.includes('high demand') ? (
              <p className="text-[11px] text-rose-700">
                Google servers पर अस्थायी रूप से अधिक लोड है। 5-10 सेकंड बाद दोबारा "Process PDF" बटन दबाएं। सर्वर स्वचालित रूप से बैकअप मॉडल का उपयोग करेगा।
              </p>
            ) : (
              <p className="text-[11px] text-rose-700">
                Ensure you have attached a valid Gemini API key in the AI Studio Settings &gt; Secrets panel.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Progress & Processing Status */}
      {isLoading && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-950 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>{progressText}</span>
            </span>
            <span className="font-mono font-black text-indigo-700">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-indigo-200/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Reading questions, equations, intervals, and drafting official NCERT CBSE solutions...
          </p>
        </div>
      )}

      {/* Action CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Produces fully formatted JSON ready for Review and GitHub publish.</span>
        </div>

        <button
          type="button"
          onClick={handleStartProcessing}
          disabled={!selectedFile || isLoading}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 btn-3d-indigo cursor-pointer transition-all shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating NCERT Solutions...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Process PDF & Generate NCERT Answers</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
