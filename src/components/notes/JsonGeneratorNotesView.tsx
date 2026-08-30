import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Download,
  Check,
  CheckCircle2,
  Sparkles,
  FileText,
  Layers,
  ArrowRight,
  Code
} from 'lucide-react';
import { ParsedNoteResult } from '../../utils/notesParser';

interface JsonGeneratorNotesViewProps {
  parsedNotes: ParsedNoteResult | null;
  targetFilename: string;
}

export const JsonGeneratorNotesView: React.FC<JsonGeneratorNotesViewProps> = ({
  parsedNotes,
  targetFilename,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewFormat, setViewFormat] = useState<'json' | 'markdown'>('json');

  if (!parsedNotes) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FileCode2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No JSON Data Ready</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please paste or load notes in the <strong>"Paste & Parse Notes"</strong> tab to generate the production-ready JSON schema for the student app.
        </p>
      </div>
    );
  }

  const jsonString = JSON.stringify(parsedNotes, null, 2);

  // Generate Markdown representation
  const generateMarkdownString = () => {
    let md = `# ${parsedNotes.title}\n`;
    if (parsedNotes.titleHindi) md += `## ${parsedNotes.titleHindi}\n\n`;
    md += `**Class:** ${parsedNotes.className} | **Subject:** ${parsedNotes.subjectName} | **Board:** ${parsedNotes.board}\n`;
    md += `**Academic Year:** ${parsedNotes.academicYear} | **Read Time:** ${parsedNotes.stats.readingTime} mins\n`;
    md += `**Tags:** ${parsedNotes.tags.map((t) => `#${t}`).join(' ')}\n\n`;

    if (parsedNotes.keyTakeaways.length > 0) {
      md += `### Key Takeaways\n`;
      parsedNotes.keyTakeaways.forEach((k) => (md += `- ${k}\n`));
      md += `\n`;
    }

    if (parsedNotes.formulas.length > 0) {
      md += `### Key Formulas & Scientific Ratios\n`;
      parsedNotes.formulas.forEach((f) => {
        md += `[Formula: ${f.title}]\n${f.formula}\n`;
        if (f.description) md += `*${f.description}*\n`;
        md += `\n`;
      });
    }

    parsedNotes.sections.forEach((sec, idx) => {
      md += `### Section ${idx + 1}: ${sec.heading}\n`;
      if (sec.headingHindi) md += `*${sec.headingHindi}*\n\n`;
      md += `${sec.content}\n\n`;
    });

    return md;
  };

  const markdownString = generateMarkdownString();
  const currentContent = viewFormat === 'json' ? jsonString : markdownString;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = viewFormat === 'json' ? 'json' : 'md';
    const mimeType = viewFormat === 'json' ? 'application/json' : 'text/markdown';
    const blob = new Blob([currentContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetFilename.replace(/\.json$/, `.${ext}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Production Notes Schema v2.0
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Validated
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Target: {targetFilename}
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewFormat('json')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewFormat === 'json'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JSON View
            </button>
            <button
              onClick={() => setViewFormat('markdown')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewFormat === 'markdown'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Markdown View
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy {viewFormat.toUpperCase()}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .{viewFormat === 'json' ? 'json' : 'md'}</span>
          </button>
        </div>
      </div>

      {/* Code Display Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-slate-300">{targetFilename}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {parsedNotes.stats.totalSections} sections • {parsedNotes.stats.totalFormulas} formulas • {parsedNotes.stats.readingTime} min read
          </span>
        </div>

        <pre className="p-5 text-xs text-emerald-400 overflow-x-auto max-h-[550px] leading-relaxed select-text scrollbar-thin scrollbar-thumb-slate-800">
          <code>{currentContent}</code>
        </pre>
      </div>
    </div>
  );
};
