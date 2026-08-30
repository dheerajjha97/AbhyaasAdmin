export interface ParsedOption {
  id: string;
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  textHindi?: string;
}

export interface ParsedQuestion {
  id: string;
  sectionId: 'sec-a' | 'sec-b' | 'sec-c';
  sectionName: string;
  questionNumber: number;
  type: 'mcq' | 'short' | 'long';
  text: string;
  textHindi?: string;
  options?: ParsedOption[];
  correctAnswer?: string; // 'A' | 'B' | 'C' | 'D' or text
  correctAnswerText?: string; // e.g. "(D) IᴬIᴮ"
  explanation?: string;
  explanationHindi?: string;
  modelAnswer?: string;
  marks: number;
}

export interface ParsedPaperResult {
  paperId: string;
  title: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  board: string;
  year: number;
  set: string;
  durationMinutes: number;
  totalMarks: number;
  stats: {
    totalQuestions: number;
    mcqCount: number;
    shortCount: number;
    longCount: number;
    answeredCount: number;
  };
  sections: {
    id: string;
    name: string;
    type: string;
    questionCount: number;
    marksPerQuestion: number;
  }[];
  questions: ParsedQuestion[];
  rawQuestionsCount: number;
}

/**
 * Intelligent parser for bilingual / Hindi / English board exam question papers.
 * Handles Section A (70 MCQs), Section B (20 Short), Section C (6 Long) and Markdown Answer Tables.
 */
export function parseExamContent(
  combinedText: string,
  answersText?: string,
  meta?: {
    classId?: string;
    className?: string;
    subjectId?: string;
    subjectName?: string;
    board?: string;
    year?: number;
    set?: string;
    title?: string;
  }
): ParsedPaperResult {
  const text = combinedText || '';
  const ansText = answersText || '';

  const classId = meta?.classId || 'class-12';
  const className = meta?.className || 'Class 12';
  const subjectId = meta?.subjectId || 'biology';
  const subjectName = meta?.subjectName || 'Biology (जीव विज्ञान)';
  const board = meta?.board || 'Bihar Board (BSEB)';
  const year = meta?.year || 2026;
  const set = meta?.set || 'Set A';
  const title = meta?.title || `${className} ${subjectName} ${year} ${set} (${board})`;
  const paperId = `${classId}_${subjectId}_${year}_${set.toLowerCase().replace(/[^a-z0-9]/g, '_')}`.replace(/_+/g, '_');

  // Step 1: Detect if answers are in answersText or part of combinedText
  let qBlock = text;
  let aBlock = ansText;

  if (!aBlock && text.includes('Format of answers') || text.includes('उत्तर एवं व्याख्या') || text.includes('| प्रश्न सं.')) {
    const splitMarkers = [
      'Format of answers',
      'खण्ड–अ : वस्तुनिष्ठ प्रश्न (उत्तर एवं व्याख्या)',
      'उत्तर एवं व्याख्या',
      '| प्रश्न सं. | सही उत्तर |'
    ];
    for (const marker of splitMarkers) {
      if (text.includes(marker)) {
        const parts = text.split(marker);
        qBlock = parts[0];
        aBlock = marker + parts.slice(1).join(marker);
        break;
      }
    }
  }

  // Step 2: Parse Answers Table & Answer Sections
  const answersMap: Record<number, { correctKey: string; fullAnswer: string; explanation: string }> = {};
  const subjectiveAnswersMap: Record<number, string> = {};

  if (aBlock) {
    // Parse Markdown Table (| 1 | (D) IᴬIᴮ | व्याख्या |)
    const tableRowRegex = /\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let match;
    while ((match = tableRowRegex.exec(aBlock)) !== null) {
      const qNum = parseInt(match[1].trim(), 10);
      const ansCol = match[2].trim();
      const expCol = match[3].trim();

      if (!isNaN(qNum) && qNum > 0) {
        // Extract option key e.g. "(D)" -> "D"
        const optMatch = ansCol.match(/\(([A-D])\)/i);
        const correctKey = optMatch ? optMatch[1].toUpperCase() : ansCol.trim();
        answersMap[qNum] = {
          correctKey,
          fullAnswer: ansCol,
          explanation: expCol
        };
      }
    }

    // Parse Subjective Answers (खण्ड–ब and खण्ड–स e.g. प्रश्न 1. ... प्रश्न 21. ...)
    const subjAnswerRegex = /(?:प्रश्न\s*|Q\s*)(\d+)[\.:\s]+([\s\S]*?)(?=(?:(?:प्रश्न\s*|Q\s*)\d+[\.:\s]+|खण्ड–|$))/g;
    let sMatch;
    while ((sMatch = subjAnswerRegex.exec(aBlock)) !== null) {
      const qNum = parseInt(sMatch[1].trim(), 10);
      const content = sMatch[2].trim();
      if (!isNaN(qNum)) {
        subjectiveAnswersMap[qNum] = content;
      }
    }
  }

  // Step 3: Identify Sections in Questions Block
  // Find where खण्ड-अ, खण्ड-ब, खण्ड-स or दीर्घ उत्तरीय start
  const lines = qBlock.split('\n');
  let currentSection: 'sec-a' | 'sec-b' | 'sec-c' = 'sec-a';
  
  const secALines: string[] = [];
  const secBLines: string[] = [];
  const secCLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/खण्ड\s*[–-]\s*[अaA]|वस्तुनिष्ठ\s*प्रश्न|Section\s*A/i.test(trimmed)) {
      currentSection = 'sec-a';
      continue;
    } else if (/खण्ड\s*[–-]\s*[बbB]|लघु\s*उत्तरीय\s*प्रश्न|Section\s*B/i.test(trimmed)) {
      currentSection = 'sec-b';
      continue;
    } else if (/खण्ड\s*[–-]\s*[सcC]|दीर्घ\s*उत्तरीय\s*प्रश्न|Section\s*C/i.test(trimmed)) {
      currentSection = 'sec-c';
      continue;
    }

    if (currentSection === 'sec-a') {
      secALines.push(line);
    } else if (currentSection === 'sec-b') {
      secBLines.push(line);
    } else {
      secCLines.push(line);
    }
  }

  const allQuestions: ParsedQuestion[] = [];

  // Parse Section A (MCQs)
  const parsedSecA = parseMCQSection(secALines.join('\n'), answersMap);
  allQuestions.push(...parsedSecA);

  // Parse Section B (Short questions)
  const parsedSecB = parseSubjectiveSection(secBLines.join('\n'), 'sec-b', 'खण्ड–ब : लघु उत्तरीय प्रश्न', 2, subjectiveAnswersMap);
  allQuestions.push(...parsedSecB);

  // Parse Section C (Long questions)
  const parsedSecC = parseSubjectiveSection(secCLines.join('\n'), 'sec-c', 'खण्ड–स : दीर्घ उत्तरीय प्रश्न', 5, subjectiveAnswersMap);
  allQuestions.push(...parsedSecC);

  const mcqCount = parsedSecA.length;
  const shortCount = parsedSecB.length;
  const longCount = parsedSecC.length;
  const totalQuestions = allQuestions.length;
  const answeredCount = allQuestions.filter(q => q.correctAnswer || q.modelAnswer).length;

  return {
    paperId,
    title,
    classId,
    className,
    subjectId,
    subjectName,
    board,
    year,
    set,
    durationMinutes: 195,
    totalMarks: (mcqCount * 1) + (shortCount * 2) + (longCount * 5) || 70,
    stats: {
      totalQuestions,
      mcqCount,
      shortCount,
      longCount,
      answeredCount
    },
    sections: [
      { id: 'sec-a', name: 'खण्ड–अ : वस्तुनिष्ठ प्रश्न (MCQ)', type: 'mcq', questionCount: mcqCount, marksPerQuestion: 1 },
      { id: 'sec-b', name: 'खण्ड–ब : लघु उत्तरीय प्रश्न (Short)', type: 'short', questionCount: shortCount, marksPerQuestion: 2 },
      { id: 'sec-c', name: 'खण्ड–स : दीर्घ उत्तरीय प्रश्न (Long)', type: 'long', questionCount: longCount, marksPerQuestion: 5 }
    ],
    questions: allQuestions,
    rawQuestionsCount: totalQuestions
  };
}

/**
 * Parses MCQs with (A), (B), (C), (D) options
 */
function parseMCQSection(
  text: string,
  answersMap: Record<number, { correctKey: string; fullAnswer: string; explanation: string }>
): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!text.trim()) return questions;

  // Split by numbered question starting with "1.", "2.", "1 )", "Q1."
  const qItemRegex = /(?:^|\n)\s*(\d+)[\.\)]\s+([\s\S]*?)(?=(?:\n\s*\d+[\.\)]\s+|$))/g;
  let match;

  while ((match = qItemRegex.exec(text)) !== null) {
    const qNum = parseInt(match[1].trim(), 10);
    const body = match[2].trim();

    if (isNaN(qNum)) continue;

    // Separate Question Text from Options
    // Options can be on same line "(A) Iᴬi (B) Iᴮi (C) ii (D) IᴬIᴮ" or multi-line
    const optRegex = /\(([A-D])\)\s*([^(\n]+)/g;
    const options: ParsedOption[] = [];
    let optMatch;
    
    // Find index where options begin
    const firstOptIndex = body.search(/\([A-D]\)/);
    let questionText = body;
    let optionsPart = '';

    if (firstOptIndex !== -1) {
      questionText = body.substring(0, firstOptIndex).trim();
      optionsPart = body.substring(firstOptIndex);

      while ((optMatch = optRegex.exec(optionsPart)) !== null) {
        const key = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
        const optText = optMatch[2].trim();
        options.push({
          id: `opt-${qNum}-${key.toLowerCase()}`,
          key,
          text: optText,
          textHindi: optText
        });
      }
    }

    // Lookup Answer & Explanation
    const ansInfo = answersMap[qNum];
    const correctKey = ansInfo ? ansInfo.correctKey : undefined;
    const explanation = ansInfo ? ansInfo.explanation : undefined;
    const fullAnswer = ansInfo ? ansInfo.fullAnswer : undefined;

    questions.push({
      id: `q-mcq-${qNum}`,
      sectionId: 'sec-a',
      sectionName: 'खण्ड–अ : वस्तुनिष्ठ प्रश्न',
      questionNumber: qNum,
      type: 'mcq',
      text: questionText,
      textHindi: questionText,
      options: options.length > 0 ? options : undefined,
      correctAnswer: correctKey,
      correctAnswerText: fullAnswer,
      explanationHindi: explanation,
      marks: 1
    });
  }

  return questions;
}

/**
 * Parses Subjective (Short & Long) questions
 */
function parseSubjectiveSection(
  text: string,
  sectionId: 'sec-b' | 'sec-c',
  sectionName: string,
  marksPerQuestion: number,
  subjectiveAnswersMap: Record<number, string>
): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!text.trim()) return questions;

  // Split by numbered question starting with "1.", "2.", "21.", "प्रश्न 1."
  const qItemRegex = /(?:^|\n)\s*(?:प्रश्न\s*)?(\d+)[\.\)]\s+([\s\S]*?)(?=(?:\n\s*(?:प्रश्न\s*)?\d+[\.\)]\s+|$))/g;
  let match;

  while ((match = qItemRegex.exec(text)) !== null) {
    const qNum = parseInt(match[1].trim(), 10);
    let questionText = match[2].trim();

    // Remove instruction footer note if caught at end (e.g. "इन 20 प्रश्नों में से किन्हीं...")
    if (questionText.includes('इन 20 प्रश्नों में से') || questionText.includes('दीर्घ उत्तरीय प्रश्न')) {
      questionText = questionText.split(/इन \d+ प्रश्नों में से|दीर्घ उत्तरीय प्रश्न/)[0].trim();
    }

    if (isNaN(qNum) || !questionText) continue;

    const modelAns = subjectiveAnswersMap[qNum];

    questions.push({
      id: `q-${sectionId}-${qNum}`,
      sectionId,
      sectionName,
      questionNumber: qNum,
      type: sectionId === 'sec-b' ? 'short' : 'long',
      text: questionText,
      textHindi: questionText,
      modelAnswer: modelAns,
      explanationHindi: modelAns,
      marks: marksPerQuestion
    });
  }

  return questions;
}
