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
 * Helper to auto-detect subject from raw text content (bilingual Hindi/English)
 */
export function detectSubjectFromText(text: string): { id: string; name: string } | null {
  const lower = text.toLowerCase();

  if (lower.includes('राजनीति') || lower.includes('political science') || lower.includes('pol science') || lower.includes('pol. science') || lower.includes('राज्यशास्त्र')) {
    return { id: 'pol-science', name: 'Political Science (राजनीति विज्ञान)' };
  }
  if (lower.includes('इतिहास') || lower.includes('history')) {
    return { id: 'history', name: 'History (इतिहास)' };
  }
  if (lower.includes('भूगोल') || lower.includes('geography')) {
    return { id: 'geography', name: 'Geography (भूगोल)' };
  }
  if (lower.includes('समाजशास्त्र') || lower.includes('sociology')) {
    return { id: 'sociology', name: 'Sociology (समाजशास्त्र)' };
  }
  if (lower.includes('अर्थशास्त्र') || lower.includes('economics')) {
    return { id: 'economics', name: 'Economics (अर्थशास्त्र)' };
  }
  if (lower.includes('मनोविज्ञान') || lower.includes('psychology')) {
    return { id: 'psychology', name: 'Psychology (मनोविज्ञान)' };
  }
  if (lower.includes('गृह विज्ञान') || lower.includes('home science')) {
    return { id: 'home-science', name: 'Home Science (गृह विज्ञान)' };
  }
  if (lower.includes('दर्शनशास्त्र') || lower.includes('philosophy')) {
    return { id: 'philosophy', name: 'Philosophy (दर्शनशास्त्र)' };
  }
  if (lower.includes('जीव विज्ञान') || lower.includes('biology') || lower.includes('botany') || lower.includes('zoology')) {
    return { id: 'biology', name: 'Biology (जीव विज्ञान)' };
  }
  if (lower.includes('रसायन') || lower.includes('chemistry')) {
    return { id: 'chemistry', name: 'Chemistry (रसायन विज्ञान)' };
  }
  if (lower.includes('भौतिक') || lower.includes('physics')) {
    return { id: 'physics', name: 'Physics (भौतिक विज्ञान)' };
  }
  if (lower.includes('गणित') || lower.includes('math') || lower.includes('mathematics')) {
    return { id: 'mathematics', name: 'Mathematics (गणित)' };
  }
  if (lower.includes('हिंदी') || lower.includes('हिन्दी') || lower.includes('hindi')) {
    return { id: 'hindi', name: 'Hindi (हिंदी)' };
  }
  if (lower.includes('अंग्रेज़ी') || lower.includes('अंग्रेजी') || lower.includes('english')) {
    return { id: 'english', name: 'English (अंग्रेज़ी)' };
  }
  if (lower.includes('लेखाशास्त्र') || lower.includes('accountancy')) {
    return { id: 'accountancy', name: 'Accountancy (लेखाशास्त्र)' };
  }
  if (lower.includes('व्यवसाय अध्ययन') || lower.includes('business studies')) {
    return { id: 'business-studies', name: 'Business Studies (व्यवसाय अध्ययन)' };
  }
  if (lower.includes('उद्यमिता') || lower.includes('entrepreneurship') || lower.includes('eps')) {
    return { id: 'entrepreneurship', name: 'Entrepreneurship (उद्यमिता / EPS)' };
  }
  if (lower.includes('कंप्यूटर') || lower.includes('computer science')) {
    return { id: 'cs', name: 'Computer Science (कंप्यूटर विज्ञान)' };
  }

  return null;
}

/**
 * Intelligent parser for bilingual / Hindi / English board exam question papers.
 * Handles Section A (MCQs), Section B (Short), Section C (Long) and Markdown Answer Tables.
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

  const detectedSubject = detectSubjectFromText(text);

  const classId = meta?.classId || 'class-12';
  const className = meta?.className || 'Class 12';
  const subjectId = detectedSubject ? detectedSubject.id : (meta?.subjectId || 'biology');
  const subjectName = detectedSubject ? detectedSubject.name : (meta?.subjectName || 'Biology (जीव विज्ञान)');
  const board = meta?.board || 'Bihar Board (BSEB)';
  const year = meta?.year || 2026;
  const set = meta?.set || 'Set A';
  const title = meta?.title && !detectedSubject 
    ? meta.title 
    : `${className} ${subjectName} ${year} ${set} (${board})`;
  const paperId = `${classId}_${subjectId}_${year}_${set.toLowerCase().replace(/[^a-z0-9]/g, '_')}`.replace(/_+/g, '_');

  // Step 1: Detect if answers are in answersText or part of combinedText
  let qBlock = text;
  let aBlock = ansText;

  if (!aBlock && (text.includes('Format of answers') || text.includes('उत्तर एवं व्याख्या') || text.includes('| प्रश्न सं.'))) {
    const splitMarkers = [
      'Format of answers',
      'खण्ड–अ : वस्तुनिष्ठ प्रश्न (उत्तर एवं व्याख्या)',
      'खण्ड–अ : वस्तुनिष्ठ प्रश्न (उत्तर',
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
    const subjAnswerRegex = /(?:प्रश्न\s*|Q\s*\.?\s*No\.?|Q\s*\.?|Ans\s*|Q\s*)(\d+)[\.:\s\-–—]+([\s\S]*?)(?=(?:(?:प्रश्न\s*|Q\s*\.?\s*No\.?|Q\s*\.?|Ans\s*|Q\s*)\d+[\.:\s\-–—]+|खण्ड|Section|Part|$))/gi;
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
  // Find where Section A (MCQs), Section B (Short), Section C (Long) headers start
  const lines = qBlock.split('\n');
  let currentSection: 'sec-a' | 'sec-b' | 'sec-c' = 'sec-a';
  
  const secALines: string[] = [];
  const secBLines: string[] = [];
  const secCLines: string[] = [];

  // Patterns for Section Headers
  const secAPattern = /(?:खण्ड|भाग|Section|Part|Group)\s*[–—\-:'"\s]*[अaA]|वस्तुनिष्ठ\s*प्रश्न|Objective\s*Question|MCQ\s*Section/i;
  const secBPattern = /(?:खण्ड|भाग|Section|Part|Group)\s*[–—\-:'"\s]*[बbB]|लघु\s*उत्तरीय\s*प्रश्न|लघुउत्तरीय|Short\s*Answer|Short\s*Question|Subjective\s*Question|गैर[-–—\s]*वस्तुनिष्ठ|विषयनिष्ठ/i;
  const secCPattern = /(?:खण्ड|भाग|Section|Part|Group)\s*[–—\-:'"\s]*[सcC]|दीर्घ\s*उत्तरीय\s*प्रश्न|दीर्घउत्तरीय|Long\s*Answer|Long\s*Question|Essay\s*Type/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (secAPattern.test(trimmed)) {
      currentSection = 'sec-a';
      continue;
    } else if (secBPattern.test(trimmed)) {
      currentSection = 'sec-b';
      continue;
    } else if (secCPattern.test(trimmed)) {
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

  // Step 4: Auto-reclassify & Balance Questions without Options or misclassified questions
  // If Section B and Section C yielded 0 questions OR if Section A contains questions without options,
  // we reclassify non-MCQs into Section B (Short) and Section C (Long)!
  
  let subjectiveCounter = 0;

  for (let idx = 0; idx < allQuestions.length; idx++) {
    const q = allQuestions[idx];

    // Check if an MCQ question actually has NO valid options (less than 2 options found)
    const hasOptions = q.options && q.options.length >= 2;

    if (q.type === 'mcq' && !hasOptions) {
      // This is a subjective question that was placed in Section A because of missing header
      subjectiveCounter++;
      
      const textLower = q.text.toLowerCase();
      const isLongByKeyword = textLower.includes('दीर्घ') || 
                              textLower.includes('सविस्तार') || 
                              textLower.includes('व्याख्या करें') || 
                              textLower.includes('वर्णन करें') || 
                              textLower.includes('सिद्ध करें') || 
                              textLower.includes('5 अंक') || 
                              textLower.includes('5 marks') || 
                              textLower.includes('essay') || 
                              textLower.includes('in detail');

      const isLongByNumber = q.questionNumber >= 91 || subjectiveCounter > 20;

      if (isLongByKeyword || isLongByNumber) {
        q.type = 'long';
        q.sectionId = 'sec-c';
        q.sectionName = 'खण्ड–स : दीर्घ उत्तरीय प्रश्न';
        q.marks = 5;
        q.options = undefined;
        if (subjectiveAnswersMap[q.questionNumber]) {
          q.modelAnswer = subjectiveAnswersMap[q.questionNumber];
          q.explanationHindi = subjectiveAnswersMap[q.questionNumber];
        }
      } else {
        q.type = 'short';
        q.sectionId = 'sec-b';
        q.sectionName = 'खण्ड–ब : लघु उत्तरीय प्रश्न';
        q.marks = 2;
        q.options = undefined;
        if (subjectiveAnswersMap[q.questionNumber]) {
          q.modelAnswer = subjectiveAnswersMap[q.questionNumber];
          q.explanationHindi = subjectiveAnswersMap[q.questionNumber];
        }
      }
    }
  }

  // Recalculate stats
  const mcqQuestions = allQuestions.filter(q => q.type === 'mcq');
  const shortQuestions = allQuestions.filter(q => q.type === 'short');
  const longQuestions = allQuestions.filter(q => q.type === 'long');

  const mcqCount = mcqQuestions.length;
  const shortCount = shortQuestions.length;
  const longCount = longQuestions.length;
  const totalQuestions = allQuestions.length;
  const answeredCount = allQuestions.filter(q => q.correctAnswer || q.modelAnswer).length;

  const totalMarks = (mcqCount * 1) + (shortCount * 2) + (longCount * 5);

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
    totalMarks: totalMarks > 0 ? totalMarks : 100,
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
 * Parses MCQs with (A), (B), (C), (D) or (a),(b),(c),(d) or (क),(ख),(ग),(घ) options
 */
function parseMCQSection(
  text: string,
  answersMap: Record<number, { correctKey: string; fullAnswer: string; explanation: string }>
): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!text.trim()) return questions;

  // Split by numbered question starting with "1.", "2.", "1 )", "Q1.", "Q.1", "1-", "Q.No 1"
  const qItemRegex = /(?:^|\n)\s*(?:Q\s*\.?\s*No\.?|Q\s*\.?|प्रश्न\s*)?\s*(\d+)[\.\)\-:\s]+\s*([\s\S]*?)(?=(?:\n\s*(?:Q\s*\.?\s*No\.?|Q\s*\.?|प्रश्न\s*)?\s*\d+[\.\)\-:\s]+\s*|$))/gi;
  let match;

  const keyMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
    'A': 'A', 'a': 'A', 'क': 'A', 'अ': 'A', '1': 'A',
    'B': 'B', 'b': 'B', 'ख': 'B', 'ब': 'B', '2': 'B',
    'C': 'C', 'c': 'C', 'ग': 'C', 'स': 'C', '3': 'C',
    'D': 'D', 'd': 'D', 'घ': 'D', 'द': 'D', '4': 'D',
  };

  while ((match = qItemRegex.exec(text)) !== null) {
    const qNum = parseInt(match[1].trim(), 10);
    const body = match[2].trim();

    if (isNaN(qNum)) continue;

    // Search where options start: (A), (a), (क), (अ)
    const optMatchStart = body.search(/(?:\(|\[)?(?:[A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s+/);
    let questionText = body;
    let optionsPart = '';
    const options: ParsedOption[] = [];

    if (optMatchStart !== -1) {
      questionText = body.substring(0, optMatchStart).trim();
      optionsPart = body.substring(optMatchStart);

      const optRegex = /(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s*([^\(\[\n]+)/g;
      let optMatch;
      const seenKeys = new Set<string>();

      while ((optMatch = optRegex.exec(optionsPart)) !== null) {
        const rawKey = optMatch[1];
        const key = keyMap[rawKey] || 'A';
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

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
      text: questionText || body,
      textHindi: questionText || body,
      options: options.length >= 2 ? options : undefined,
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

  // Split by numbered question starting with "1.", "2.", "21.", "प्रश्न 1.", "Q.1", "Q1"
  const qItemRegex = /(?:^|\n)\s*(?:Q\s*\.?\s*No\.?|Q\s*\.?|प्रश्न\s*|Prashna\s*)?\s*(\d+)[\.\)\-:\s]+\s*([\s\S]*?)(?=(?:\n\s*(?:Q\s*\.?\s*No\.?|Q\s*\.?|प्रश्न\s*|Prashna\s*)?\s*\d+[\.\)\-:\s]+\s*|$))/gi;
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
