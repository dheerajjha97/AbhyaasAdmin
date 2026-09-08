import { ParsedPaperResult, ParsedQuestion, ParsedOption } from './questionParser';

export interface PdfUploadOptions {
  file: File;
  subjectName: string;
  className: string;
  board: string;
  generateNCERTAnswers: boolean;
  answerLanguage: 'bilingual' | 'hindi' | 'english';
  customInstructions?: string;
  onProgress?: (statusText: string, percent: number) => void;
}

export async function parsePdfWithGemini(options: PdfUploadOptions): Promise<{
  parsedResult: ParsedPaperResult;
  rawText: string;
}> {
  const {
    file,
    subjectName,
    className,
    board,
    generateNCERTAnswers,
    answerLanguage,
    customInstructions,
    onProgress,
  } = options;

  onProgress?.(`Reading ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`, 15);

  // Convert File to Base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  onProgress?.('Uploading to Gemini AI & Analyzing Document Layout...', 40);

  const payload = {
    fileBase64: base64Data,
    mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
    subjectName,
    className,
    board,
    generateNCERTAnswers,
    answerLanguage,
    customInstructions,
  };

  onProgress?.('Gemini is generating step-wise NCERT / CBSE model answers...', 65);

  const response = await fetch('/api/gemini/parse-pdf-paper', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Gemini returned an invalid response structure.');
  }

  onProgress?.('Finalizing and validating questions structure...', 90);

  const geminiData = result.data;
  const rawQuestions: any[] = geminiData.questions || [];

  // Map to ParsedQuestion[]
  const parsedQuestions: ParsedQuestion[] = rawQuestions.map((q: any, idx: number) => {
    const qNum = Number(q.questionNumber) || idx + 1;
    const qType: 'mcq' | 'short' | 'long' =
      q.type === 'mcq' || (q.options && q.options.length >= 2) ? 'mcq' :
      q.type === 'long' || Number(q.marks) >= 4 ? 'long' : 'short';

    const sectionId = qType === 'mcq' ? 'sec-a' : qType === 'short' ? 'sec-b' : 'sec-c';
    const sectionName = qType === 'mcq' ? 'खण्ड–अ (Section A : MCQs)' : qType === 'short' ? 'खण्ड–ब (Section B : Short Answer)' : 'खण्ड–स (Section C : Long Answer)';

    const options: ParsedOption[] | undefined = q.options && Array.isArray(q.options)
      ? q.options.map((opt: any, oIdx: number) => {
          const keyLetter = (opt.key || ['A', 'B', 'C', 'D'][oIdx] || 'A').toUpperCase() as 'A' | 'B' | 'C' | 'D';
          return {
            id: `opt-${qNum}-${keyLetter.toLowerCase()}`,
            key: keyLetter,
            text: opt.text || '',
            textHindi: opt.textHindi || opt.text || '',
          };
        })
      : undefined;

    return {
      id: `q-${qType}-${qNum}`,
      sectionId,
      sectionName,
      questionNumber: qNum,
      type: qType,
      marks: Number(q.marks) || (qType === 'mcq' ? 1 : qType === 'short' ? 2 : 5),
      text: q.text || q.textHindi || `Question ${qNum}`,
      textHindi: q.textHindi || q.text || undefined,
      options,
      correctAnswer: q.correctAnswer || (options && options[0]?.key),
      correctAnswerText: q.fullAnswer || (q.correctAnswer ? `(${q.correctAnswer})` : undefined),
      explanation: q.explanation || undefined,
      explanationHindi: q.explanationHindi || q.explanation || undefined,
      modelAnswer: q.fullAnswer || q.explanation || undefined,
    };
  });

  const mcqCount = parsedQuestions.filter((q) => q.type === 'mcq').length;
  const shortCount = parsedQuestions.filter((q) => q.type === 'short').length;
  const longCount = parsedQuestions.filter((q) => q.type === 'long').length;
  const answeredCount = parsedQuestions.filter((q) => !!(q.correctAnswer || q.modelAnswer || q.explanation)).length;
  const totalMarks = parsedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0) || geminiData.totalMarks || 70;

  const finalSubjectName = geminiData.subject || (subjectName !== 'auto' ? subjectName : 'Science & Mathematics');
  const finalClassName = geminiData.classId ? `Class ${geminiData.classId}` : className;
  const finalBoard = geminiData.board || board;

  const parsedPaperResult: ParsedPaperResult = {
    paperId: `paper-${Date.now()}`,
    title: geminiData.paperTitle || `${finalSubjectName} ${finalClassName} ${finalBoard} Examination Paper`,
    classId: geminiData.classId || className.replace(/[^0-9]/g, '') || '12',
    className: finalClassName,
    subjectId: finalSubjectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    subjectName: finalSubjectName,
    board: finalBoard,
    year: new Date().getFullYear(),
    set: 'Set 1',
    durationMinutes: 195,
    totalMarks,
    stats: {
      totalQuestions: parsedQuestions.length,
      mcqCount,
      shortCount,
      longCount,
      answeredCount,
    },
    sections: [
      {
        id: 'sec-a',
        name: 'खण्ड–अ : वस्तुनिष्ठ प्रश्न (Section A : MCQs)',
        type: 'mcq',
        questionCount: mcqCount,
        marksPerQuestion: 1,
      },
      {
        id: 'sec-b',
        name: 'खण्ड–ब : गैर-वस्तुनिष्ठ प्रश्न (Section B : Short Answer)',
        type: 'short',
        questionCount: shortCount,
        marksPerQuestion: 2,
      },
      {
        id: 'sec-c',
        name: 'खण्ड–स : दीर्घ उत्तरीय प्रश्न (Section C : Long Answer)',
        type: 'long',
        questionCount: longCount,
        marksPerQuestion: 5,
      },
    ].filter((s) => s.questionCount > 0),
    questions: parsedQuestions,
    rawQuestionsCount: parsedQuestions.length,
  };

  const generatedTextRepresentation = parsedQuestions.map((q) => {
    const qHeader = `${q.questionNumber}. ${q.text}${q.textHindi && q.textHindi !== q.text ? `\n   ${q.textHindi}` : ''}`;
    const optionsText = q.options ? q.options.map((o) => `(${o.key}) ${o.text}${o.textHindi && o.textHindi !== o.text ? ` / ${o.textHindi}` : ''}`).join('  ') : '';
    const ansText = q.correctAnswer ? `\nAnswer: ${q.correctAnswerText || q.correctAnswer}` : '';
    const expText = q.explanation ? `\nExplanation: ${q.explanation}` : '';
    return `${qHeader}${optionsText ? `\n${optionsText}` : ''}${ansText}${expText}`;
  }).join('\n\n');

  onProgress?.('Complete! Questions and NCERT answers loaded.', 100);

  return {
    parsedResult: parsedPaperResult,
    rawText: geminiData.rawTextRepresentation || generatedTextRepresentation || JSON.stringify(geminiData, null, 2),
  };
}
