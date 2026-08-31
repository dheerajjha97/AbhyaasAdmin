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
 * Helper to auto-detect subject from raw text content (bilingual Hindi/English).
 * Only checks header lines / explicit subject tags to avoid false positives from question body text.
 */
export function detectSubjectFromText(text: string): { id: string; name: string } | null {
  if (!text) return null;

  // Only scan first 600 characters or lines that explicitly look like subject headers
  const headerSample = text.slice(0, 600).toLowerCase();

  const explicitSubjectPattern = /(?:subject|विषय|paper|प्रश्न\s*पत्र|sub)\s*[:\-\=–—\s]+([^\n\r]+)/i;
  const headerMatch = text.slice(0, 1000).match(explicitSubjectPattern);
  const targetToMatch = (headerMatch ? headerMatch[1].toLowerCase() + ' ' : '') + headerSample;

  if (targetToMatch.includes('राजनीति') || targetToMatch.includes('political science') || targetToMatch.includes('pol science') || targetToMatch.includes('राज्यशास्त्र')) {
    return { id: 'pol-science', name: 'Political Science (राजनीति विज्ञान)' };
  }
  if (targetToMatch.includes('इतिहास') || targetToMatch.includes('history')) {
    return { id: 'history', name: 'History (इतिहास)' };
  }
  if (targetToMatch.includes('भूगोल') || targetToMatch.includes('geography')) {
    return { id: 'geography', name: 'Geography (भूगोल)' };
  }
  if (targetToMatch.includes('समाजशास्त्र') || targetToMatch.includes('sociology')) {
    return { id: 'sociology', name: 'Sociology (समाजशास्त्र)' };
  }
  if (targetToMatch.includes('अर्थशास्त्र') || targetToMatch.includes('economics')) {
    return { id: 'economics', name: 'Economics (अर्थशास्त्र)' };
  }
  if (targetToMatch.includes('मनोविज्ञान') || targetToMatch.includes('psychology')) {
    return { id: 'psychology', name: 'Psychology (मनोविज्ञान)' };
  }
  if (targetToMatch.includes('गृह विज्ञान') || targetToMatch.includes('home science')) {
    return { id: 'home-science', name: 'Home Science (गृह विज्ञान)' };
  }
  if (targetToMatch.includes('दर्शनशास्त्र') || targetToMatch.includes('philosophy')) {
    return { id: 'philosophy', name: 'Philosophy (दर्शनशास्त्र)' };
  }
  if (targetToMatch.includes('जीव विज्ञान') || targetToMatch.includes('biology') || targetToMatch.includes('botany') || targetToMatch.includes('zoology')) {
    return { id: 'biology', name: 'Biology (जीव विज्ञान)' };
  }
  if (targetToMatch.includes('रसायन') || targetToMatch.includes('chemistry')) {
    return { id: 'chemistry', name: 'Chemistry (रसायन विज्ञान)' };
  }
  if (targetToMatch.includes('भौतिक') || targetToMatch.includes('physics')) {
    return { id: 'physics', name: 'Physics (भौतिक विज्ञान)' };
  }
  if (targetToMatch.includes('गणित') || targetToMatch.includes('math') || targetToMatch.includes('mathematics')) {
    return { id: 'mathematics', name: 'Mathematics (गणित)' };
  }
  if (targetToMatch.includes('हिंदी') || targetToMatch.includes('हिन्दी') || targetToMatch.includes('hindi')) {
    return { id: 'hindi', name: 'Hindi (हिंदी)' };
  }
  if (targetToMatch.includes('अंग्रेज़ी') || targetToMatch.includes('अंग्रेजी') || targetToMatch.includes('english')) {
    return { id: 'english', name: 'English (अंग्रेज़ी)' };
  }
  if (targetToMatch.includes('लेखाशास्त्र') || targetToMatch.includes('accountancy')) {
    return { id: 'accountancy', name: 'Accountancy (लेखाशास्त्र)' };
  }
  if (targetToMatch.includes('व्यवसाय अध्ययन') || targetToMatch.includes('business studies')) {
    return { id: 'business-studies', name: 'Business Studies (व्यवसाय अध्ययन)' };
  }
  if (targetToMatch.includes('उद्यमिता') || targetToMatch.includes('entrepreneurship') || targetToMatch.includes('eps')) {
    return { id: 'entrepreneurship', name: 'Entrepreneurship (उद्यमिता / EPS)' };
  }
  if (targetToMatch.includes('कंप्यूटर') || targetToMatch.includes('computer science')) {
    return { id: 'cs', name: 'Computer Science (कंप्यूटर विज्ञान)' };
  }

  return null;
}

// Section headers patterns (handles खण्ड, खंड, भाग, Section, Part, Group)
const secAPattern = /^(?:[#\*\-\s]*)(?:(?:खण्ड|खंड|भाग|Section|Part|Group)\s*[–—\-:'"\s]*[अaA]|वस्तुनिष्ठ\s*प्रश्न|Objective\s*Question|MCQ\b)/i;
const secBPattern = /^(?:[#\*\-\s]*)(?:(?:खण्ड|खंड|भाग|Section|Part|Group)\s*[–—\-:'"\s]*[बbB]|लघु\s*उत्तरीय\s*प्रश्न|लघुउत्तरीय|Short\s*Answer|Short\s*Question)/i;
const secCPattern = /^(?:[#\*\-\s]*)(?:(?:खण्ड|खंड|भाग|Section|Part|Group)\s*[–—\-:'"\s]*[सcC]|दीर्घ\s*उत्तरीय\s*प्रश्न|दीर्घउत्तरीय|Long\s*Answer|Long\s*Question)/i;

/**
 * Helper to determine if a line starts a new question.
 * Strictly prevents years (1790, 1813, 1857, 1947) or quantities from being matched as question numbers.
 */
function checkQuestionHeader(line: string): { isQuestion: boolean; qNum: number; restText: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. Explicit Prefix: "Q1.", "Q.1", "Q. 1", "Q1:", "Q.No. 1", "Question 1:", "प्रश्न 1.", "प्रश्न सं. 1:", "प्रश्न 1-"
  const explicitMatch = trimmed.match(/^(?:Q\s*\.?\s*No\.?|Q\s*[\.\:\-\#]?|Question\s*[\.\:\-\#]?|प्रश्न\s*(?:सं\.?|क्रमांक|सं०)?\s*[\.\:\-\#]?)\s*(\d{1,3})\s*[\.\)\:\-\–—\]\s]*(.*)$/i);
  if (explicitMatch) {
    const qNum = parseInt(explicitMatch[1], 10);
    if (qNum > 0 && qNum <= 200) {
      return { isQuestion: true, qNum, restText: explicitMatch[2].trim() };
    }
  }

  // 2. Number with delimiter at start of line: "1.", "1)", "(1)", "1 -", "1:"
  const numDelimMatch = trimmed.match(/^(?:\(?(\d{1,3})\)?[\.\)\:\-\–—\]]|\((\d{1,3})\))\s+(.*)$/);
  if (numDelimMatch) {
    const numStr = numDelimMatch[1] || numDelimMatch[2];
    const rest = numDelimMatch[3] || '';
    const qNum = parseInt(numStr, 10);

    // Reject if rest starts with historical date markers or quantity markers
    if (/^(?:ई\.|ई०|AD|BC|BCE|में|के|का|की|रुपये|रु|रू०|%|km|cm|kg|मीटर|ग्राम)\b/i.test(rest)) {
      return null;
    }

    if (qNum > 0 && qNum <= 200) {
      return { isQuestion: true, qNum, restText: rest.trim() };
    }
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
  // User's explicitly selected subject ALWAYS takes precedence over auto-detection
  const subjectId = meta?.subjectId || (detectedSubject ? detectedSubject.id : 'biology');
  const subjectName = meta?.subjectName || (detectedSubject ? detectedSubject.name : 'Biology (जीव विज्ञान)');
  const board = meta?.board || 'Bihar Board (BSEB)';
  const year = meta?.year || 2026;
  const set = meta?.set || 'Set A';
  const title = meta?.title
    ? meta.title 
    : `${className} ${subjectName} ${year} ${set} (${board})`;
  const paperId = `${classId}_${subjectId}_${year}_${set.toLowerCase().replace(/[^a-z0-9]/g, '_')}`.replace(/_+/g, '_');

  // Step 1: Detect if answers are in answersText or part of combinedText
  let qBlock = text;
  let aBlock = ansText;

  if (!aBlock) {
    const splitMarkers = [
      'Answer Key:',
      'ANSWER KEY:',
      'Answer Key',
      'ANSWER KEY',
      'उत्तर कुंजी:',
      'उत्तर कुंजी',
      'उत्तर तालिका:',
      'उत्तर तालिका',
      'Format of answers',
      'खण्ड–अ : वस्तुनिष्ठ प्रश्न (उत्तर एवं व्याख्या)',
      'खण्ड–अ : वस्तुनिष्ठ प्रश्न (उत्तर',
      'उत्तर एवं व्याख्या',
      '| प्रश्न सं. | सही उत्तर |',
      '| Q.No | Answer |',
      '| Q. No. |'
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
  const subjectiveShortAnswersMap: Record<number, string> = {};
  const subjectiveLongAnswersMap: Record<number, string> = {};
  const genericSubjectiveAnswersMap: Record<number, string> = {};

  const keyMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
    'A': 'A', 'a': 'A', 'क': 'A', 'अ': 'A', '1': 'A',
    'B': 'B', 'b': 'B', 'ख': 'B', 'ब': 'B', '2': 'B',
    'C': 'C', 'c': 'C', 'ग': 'C', 'स': 'C', '3': 'C',
    'D': 'D', 'd': 'D', 'घ': 'D', 'द': 'D', '4': 'D',
  };

  const parseAnswersTextToMap = (strToParse: string) => {
    if (!strToParse || !strToParse.trim()) return;

    // First, check if the answers block is divided by sections (Section A / Section B / Section C)
    const lines = strToParse.split('\n');
    let currentAnsSec: 'sec-a' | 'sec-b' | 'sec-c' | 'generic' = 'generic';
    let secAAnsText = '';
    let secBAnsText = '';
    let secCAnsText = '';
    let genericAnsText = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (secAPattern.test(trimmed)) {
        currentAnsSec = 'sec-a';
        continue;
      } else if (secBPattern.test(trimmed)) {
        currentAnsSec = 'sec-b';
        continue;
      } else if (secCPattern.test(trimmed)) {
        currentAnsSec = 'sec-c';
        continue;
      }

      if (currentAnsSec === 'sec-a') {
        secAAnsText += line + '\n';
      } else if (currentAnsSec === 'sec-b') {
        secBAnsText += line + '\n';
      } else if (currentAnsSec === 'sec-c') {
        secCAnsText += line + '\n';
      } else {
        genericAnsText += line + '\n';
      }
    }

    // MCQ Answers parser
    const parseMCQAnswers = (textChunk: string) => {
      if (!textChunk.trim()) return;

      // 1. Markdown Table (| 1 | (a) कार्ल मार्क्स | व्याख्या |)
      const tableRowRegex = /\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
      let match;
      while ((match = tableRowRegex.exec(textChunk)) !== null) {
        const qNum = parseInt(match[1].trim(), 10);
        const ansCol = match[2].trim();
        const expCol = match[3].trim();

        if (!isNaN(qNum) && qNum > 0 && qNum <= 200 && !answersMap[qNum]) {
          const optMatch = ansCol.match(/\(?([A-Da-dक-घअ-द1-4])\)?/i);
          const rawKey = optMatch ? optMatch[1] : ansCol.trim();
          const correctKey = keyMap[rawKey] || 'A';
          answersMap[qNum] = {
            correctKey,
            fullAnswer: ansCol,
            explanation: expCol || `सही उत्तर (${correctKey}) है।`,
          };
        }
      }

      // 2. Line by line / Structured format
      const lines = textChunk.split('\n');
      let currentQNum: number | null = null;
      let currentKey: 'A' | 'B' | 'C' | 'D' = 'A';
      let currentOptText = '';
      let currentExpLines: string[] = [];

      const saveCurrentMCQAns = () => {
        if (currentQNum !== null && !answersMap[currentQNum]) {
          let exp = currentExpLines.join('\n').trim();
          if (!exp && currentOptText) {
            exp = `सही उत्तर (${currentKey}) ${currentOptText} है।`;
          } else if (!exp) {
            exp = `सही उत्तर (${currentKey}) है।`;
          }
          answersMap[currentQNum] = {
            correctKey: currentKey,
            fullAnswer: currentOptText ? `(${currentKey}) ${currentOptText}` : `(${currentKey})`,
            explanation: exp,
          };
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const trimmed = rawLine.trim();
        if (!trimmed) continue;

        const qHeader = checkQuestionHeader(trimmed);
        if (qHeader) {
          saveCurrentMCQAns();
          currentQNum = qHeader.qNum;
          currentKey = 'A';
          currentOptText = '';
          currentExpLines = [];

          // Check if option key is on the same header line e.g. "1. (D) 1793" or "Q1. (a) कार्ल मार्क्स"
          const optKeyMatch = qHeader.restText.match(/(?:(?:Ans|Answer|उत्तर)\s*[:\-\.]?\s*)?(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s*(.*)/i);
          if (optKeyMatch) {
            const rawKey = optKeyMatch[1];
            currentKey = keyMap[rawKey] || 'A';
            let optText = optKeyMatch[2] ? optKeyMatch[2].trim() : '';

            if (/(?:व्याख्या|Explanation|कारण|विवरण|Explain)/i.test(optText)) {
              const spl = optText.split(/(?:व्याख्या|Explanation|कारण|विवरण|Explain)\s*[:\-\=–—\.\s]*/i);
              optText = spl[0].trim();
              if (spl[1]) currentExpLines.push(spl[1].trim());
            }
            currentOptText = optText;
          }
          continue;
        }

        if (currentQNum !== null) {
          // Check if this line is an option key (e.g. if option key was on the next line)
          if (!currentOptText) {
            const optKeyMatch = trimmed.match(/^(?:(?:Ans|Answer|उत्तर)\s*[:\-\.]?\s*)?(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s*(.*)/i);
            if (optKeyMatch) {
              const rawKey = optKeyMatch[1];
              currentKey = keyMap[rawKey] || 'A';
              let optText = optKeyMatch[2] ? optKeyMatch[2].trim() : '';
              if (/(?:व्याख्या|Explanation|कारण|विवरण|Explain)/i.test(optText)) {
                const spl = optText.split(/(?:व्याख्या|Explanation|कारण|विवरण|Explain)\s*[:\-\=–—\.\s]*/i);
                optText = spl[0].trim();
                if (spl[1]) currentExpLines.push(spl[1].trim());
              }
              currentOptText = optText;
              continue;
            }
          }

          // Check if this line starts with व्याख्या / Explanation
          const expStartMatch = trimmed.match(/^(?:व्याख्या|Explanation|कारण|विवरण|Explain)\s*[:\-\=–—\.\s]*(.*)/i);
          if (expStartMatch) {
            if (expStartMatch[1].trim()) {
              currentExpLines.push(expStartMatch[1].trim());
            }
          } else {
            currentExpLines.push(trimmed);
          }
        }
      }
      saveCurrentMCQAns();

      // 3. Compact List format fallback e.g. "1. (D), 2. (A), 3. (B)"
      const listAnswerRegex = /(?:Q\s*\.?\s*No\.?|Q\s*\.?|प्रश्न\s*)?\s*(\d{1,3})[\.\)\-:\s]+\s*(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\s|,|$)/g;
      let listMatch;
      while ((listMatch = listAnswerRegex.exec(textChunk)) !== null) {
        const qNum = parseInt(listMatch[1].trim(), 10);
        const rawKey = listMatch[2];
        const correctKey = keyMap[rawKey];
        if (!isNaN(qNum) && qNum > 0 && qNum <= 200 && correctKey && !answersMap[qNum]) {
          answersMap[qNum] = {
            correctKey,
            fullAnswer: `(${correctKey})`,
            explanation: `सही उत्तर (${correctKey}) है।`,
          };
        }
      }
    };

    // Subjective Answers parser
    const parseSubjectiveAnswers = (textChunk: string, targetMap: Record<number, string>) => {
      if (!textChunk.trim()) return;
      const lines = textChunk.split('\n');
      let currentQNum: number | null = null;
      let currentLines: string[] = [];

      const saveCurrentSubj = () => {
        if (currentQNum !== null && currentLines.length > 0 && !targetMap[currentQNum]) {
          targetMap[currentQNum] = currentLines.join('\n').trim();
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed) continue;

        const qHeader = checkQuestionHeader(trimmed);
        if (qHeader) {
          saveCurrentSubj();
          currentQNum = qHeader.qNum;
          currentLines = qHeader.restText ? [qHeader.restText] : [];
        } else if (currentQNum !== null) {
          currentLines.push(trimmed);
        }
      }
      saveCurrentSubj();
    };

    // Run section-specific parsers
    if (secAAnsText) {
      parseMCQAnswers(secAAnsText);
    }
    if (secBAnsText) {
      parseSubjectiveAnswers(secBAnsText, subjectiveShortAnswersMap);
    }
    if (secCAnsText) {
      parseSubjectiveAnswers(secCAnsText, subjectiveLongAnswersMap);
    }
    if (genericAnsText) {
      parseMCQAnswers(genericAnsText);
      parseSubjectiveAnswers(genericAnsText, genericSubjectiveAnswersMap);
    }
  };

  if (aBlock && aBlock.trim()) {
    parseAnswersTextToMap(aBlock);
  } else {
    // Only search qBlock if aBlock was not provided
    parseAnswersTextToMap(qBlock);
  }

  // Step 3: Identify Sections in Questions Block
  // Find where Section A (MCQs), Section B (Short), Section C (Long) headers start
  const lines = qBlock.split('\n');
  let currentSection: 'sec-a' | 'sec-b' | 'sec-c' = 'sec-a';
  
  const secALines: string[] = [];
  const secBLines: string[] = [];
  const secCLines: string[] = [];

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
  const parsedSecB = parseSubjectiveSection(secBLines.join('\n'), 'sec-b', 'खण्ड–ब : लघु उत्तरीय प्रश्न', 2, subjectiveShortAnswersMap, genericSubjectiveAnswersMap);
  allQuestions.push(...parsedSecB);

  // Parse Section C (Long questions)
  const parsedSecC = parseSubjectiveSection(secCLines.join('\n'), 'sec-c', 'खण्ड–स : दीर्घ उत्तरीय प्रश्न', 5, subjectiveLongAnswersMap, genericSubjectiveAnswersMap);
  allQuestions.push(...parsedSecC);

  // Step 4: Fallback auto-reclassify ONLY IF Section B and C were completely empty
  if (parsedSecB.length === 0 && parsedSecC.length === 0) {
    let subjectiveCounter = 0;
    for (let idx = 0; idx < allQuestions.length; idx++) {
      const q = allQuestions[idx];
      const hasOptions = q.options && q.options.length >= 2;

      if (q.type === 'mcq' && !hasOptions) {
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
          const ans = subjectiveLongAnswersMap[q.questionNumber] || genericSubjectiveAnswersMap[q.questionNumber];
          if (ans) {
            q.modelAnswer = ans;
            q.explanationHindi = ans;
          }
        } else {
          q.type = 'short';
          q.sectionId = 'sec-b';
          q.sectionName = 'खण्ड–ब : लघु उत्तरीय प्रश्न';
          q.marks = 2;
          q.options = undefined;
          const ans = subjectiveShortAnswersMap[q.questionNumber] || genericSubjectiveAnswersMap[q.questionNumber];
          if (ans) {
            q.modelAnswer = ans;
            q.explanationHindi = ans;
          }
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
 * Parses MCQs with (A), (B), (C), (D) or (a),(b),(c),(d) or (क),(ख),(ग),(घ) options.
 * Accurately parses pure Hindi, pure English, and Bilingual question blocks.
 */
function parseMCQSection(
  text: string,
  answersMap: Record<number, { correctKey: string; fullAnswer: string; explanation: string }>
): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!text.trim()) return questions;

  const keyMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
    'A': 'A', 'a': 'A', 'क': 'A', 'अ': 'A', '1': 'A',
    'B': 'B', 'b': 'B', 'ख': 'B', 'ब': 'B', '2': 'B',
    'C': 'C', 'c': 'C', 'ग': 'C', 'स': 'C', '3': 'C',
    'D': 'D', 'd': 'D', 'घ': 'D', 'द': 'D', '4': 'D',
  };

  const lines = text.split('\n');
  let currentQNum: number | null = null;
  let currentBodyLines: string[] = [];

  const processMCQChunk = (qNum: number, bodyLines: string[]) => {
    if (bodyLines.length === 0) return;

    // Detect options lines vs question text lines
    const optPattern = /(?:^|\s+)(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s+/;
    const qTextLines: string[] = [];
    const optLines: string[] = [];
    let foundFirstOption = false;

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i].trim();
      if (!line) continue;

      if (optPattern.test(line)) {
        foundFirstOption = true;
        optLines.push(line);
      } else if (!foundFirstOption) {
        qTextLines.push(line);
      } else {
        // Line after options - check if it's an English bilingual question prompt
        if (/^[A-Za-z\s\?,.'"–—\-\(\)]+$/.test(line) && line.length > 15 && !optPattern.test(line)) {
          qTextLines.push(line);
        } else {
          optLines.push(line);
        }
      }
    }

    // Extract options
    const options: ParsedOption[] = [];
    const seenKeys = new Set<string>();
    const allOptText = optLines.join(' ');

    const optMatcher = /(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s*([^\(\[\n\r]+?)(?=(?:\s*(?:\(|\[)?[A-Da-dक-घअ-द1-4](?:\)|\]|\.|\-)\s*)|$)/gi;
    let match;
    const textToScan = optLines.length > 0 ? allOptText : bodyLines.join('\n');

    while ((match = optMatcher.exec(textToScan)) !== null) {
      const rawKey = match[1];
      const key = keyMap[rawKey] || 'A';
      let optText = match[2].trim();

      // Clean inline answer from option text
      optText = optText.replace(/(?:Ans|Answer|उत्तर)\s*[:\-\.]?.*$/i, '').trim();

      if (!seenKeys.has(key) && optText) {
        seenKeys.add(key);
        options.push({
          id: `opt-${qNum}-${key.toLowerCase()}`,
          key,
          text: optText,
          textHindi: optText,
        });
      }
    }

    let questionText = qTextLines.join('\n').trim();
    if (!questionText) {
      // Fallback: take body before first option
      const fullBody = bodyLines.join('\n');
      const firstOptIdx = fullBody.search(/(?:\(|\[)?(?:[A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\-)\s+/);
      if (firstOptIdx !== -1) {
        questionText = fullBody.substring(0, firstOptIdx).trim();
      } else {
        questionText = fullBody.trim();
      }
    }

    // Lookup Answer & Explanation
    const ansInfo = answersMap[qNum];
    let correctKey = ansInfo ? ansInfo.correctKey : undefined;
    let explanation = ansInfo ? ansInfo.explanation : undefined;
    let fullAnswer = ansInfo ? ansInfo.fullAnswer : undefined;

    // Check inline answer inside body if still not found
    if (!correctKey) {
      const fullBody = bodyLines.join('\n');
      const inlineMatch = fullBody.match(/(?:\(|\[|\s)(?:Ans|Answer|उत्तर|सही उत्तर|Ans\.)\s*[:\-\=–—\.\s]*\s*(?:\(|\[)?([A-Da-dक-घअ-द1-4])(?:\)|\]|\.|\s|$)/i);
      if (inlineMatch) {
        const rawKey = inlineMatch[1];
        correctKey = keyMap[rawKey];
        if (correctKey) {
          fullAnswer = `(${correctKey})`;
          explanation = `सही उत्तर (${correctKey}) है।`;
          questionText = questionText.replace(/(?:\(|\[|\s)(?:Ans|Answer|उत्तर|सही उत्तर|Ans\.)\s*[:\-\=–—\.\s]*\s*(?:\(|\[)?[A-Da-dक-घअ-द1-4](?:\)|\]|\.|\s|$)/gi, '').trim();
        }
      }
    }

    questions.push({
      id: `q-mcq-${qNum}`,
      sectionId: 'sec-a',
      sectionName: 'खण्ड–अ : वस्तुनिष्ठ प्रश्न',
      questionNumber: qNum,
      type: 'mcq',
      text: questionText,
      textHindi: questionText,
      options: options.length >= 2 ? options : undefined,
      correctAnswer: correctKey,
      correctAnswerText: fullAnswer,
      explanationHindi: explanation,
      marks: 1
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const qHeader = checkQuestionHeader(trimmed);
    if (qHeader) {
      if (currentQNum !== null) {
        processMCQChunk(currentQNum, currentBodyLines);
      }
      currentQNum = qHeader.qNum;
      currentBodyLines = qHeader.restText ? [qHeader.restText] : [];
    } else if (currentQNum !== null) {
      currentBodyLines.push(trimmed);
    }
  }

  if (currentQNum !== null) {
    processMCQChunk(currentQNum, currentBodyLines);
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
  specificAnswersMap: Record<number, string>,
  fallbackAnswersMap?: Record<number, string>
): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  if (!text.trim()) return questions;

  const lines = text.split('\n');
  let currentQNum: number | null = null;
  let currentLines: string[] = [];

  const processSubjectiveChunk = (qNum: number, qLines: string[], seqIndex: number) => {
    let questionText = qLines.join('\n').trim();
    if (!questionText) return;

    // Remove instruction note if caught at end
    if (questionText.includes('इन 20 प्रश्नों में से') || questionText.includes('दीर्घ उत्तरीय प्रश्न')) {
      questionText = questionText.split(/इन \d+ प्रश्नों में से|दीर्घ उत्तरीय प्रश्न/)[0].trim();
    }

    // Lookup model answer: check by questionNumber, or offset (e.g. 101 -> 1), or seqIndex + 1
    const modelAns = specificAnswersMap[qNum] || 
                     (qNum > 100 ? specificAnswersMap[qNum - 100] : undefined) ||
                     specificAnswersMap[seqIndex + 1] ||
                     (fallbackAnswersMap ? fallbackAnswersMap[qNum] : undefined) ||
                     (fallbackAnswersMap && qNum > 100 ? fallbackAnswersMap[qNum - 100] : undefined) ||
                     (fallbackAnswersMap ? fallbackAnswersMap[seqIndex + 1] : undefined);

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
  };

  let seqCounter = 0;
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const qHeader = checkQuestionHeader(trimmed);
    if (qHeader) {
      if (currentQNum !== null) {
        processSubjectiveChunk(currentQNum, currentLines, seqCounter++);
      }
      currentQNum = qHeader.qNum;
      currentLines = qHeader.restText ? [qHeader.restText] : [];
    } else if (currentQNum !== null) {
      currentLines.push(trimmed);
    }
  }

  if (currentQNum !== null) {
    processSubjectiveChunk(currentQNum, currentLines, seqCounter++);
  }

  return questions;
}
