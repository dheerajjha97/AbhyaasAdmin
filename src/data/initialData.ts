import { ClassItem, SubjectItem, QuestionPaper, Question, QuestionStatus, Chapter, Note, PublishRelease, ActivityItem } from '../types';
import { parseExamContent } from '../utils/questionParser';
import { SAMPLE_BIOLOGY_2026_TEXT, SAMPLE_CLASS10_SCIENCE_2026_TEXT } from './sampleQuestionBank';

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'class-12', name: 'Class 12', stream: 'Science (PCB / PCM)', streams: ['Science', 'PCB', 'PCM'], order: 1, code: '12-SCI' },
  { id: 'class-12-arts', name: 'Class 12', stream: 'Arts & Humanities', streams: ['Arts', 'Humanities'], order: 2, code: '12-ART' },
  { id: 'class-11', name: 'Class 11', stream: 'Senior Secondary', streams: ['Science', 'Arts', 'Commerce'], order: 3, code: '11-SCI' },
  { id: 'class-10', name: 'Class 10', stream: 'Matriculation (Science, Math, SST)', streams: ['Matric', 'General Science'], order: 4, code: '10-MAT' },
  { id: 'class-9', name: 'Class 9', stream: 'Secondary (Science, Math, SST)', streams: ['Secondary', 'General Science'], order: 5, code: '9-SEC' },
  { id: 'class-neet', name: 'NEET UG', stream: 'Medical Entrance Exam', streams: ['Medical', 'NEET'], order: 6, code: 'NEET-UG' },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  // Class 10 (Matriculation)
  { id: 'sub-sci-10', classId: 'class-10', name: 'Science', hindiName: 'विज्ञान', code: 'SCI-10', iconName: 'Microscope', color: 'cyan', paperCount: 1 },
  { id: 'sub-math-10', classId: 'class-10', name: 'Mathematics', hindiName: 'गणित', code: 'MATH-10', iconName: 'Calculator', color: 'blue', paperCount: 0 },
  { id: 'sub-sst-10', classId: 'class-10', name: 'Social Science', hindiName: 'सामाजिक विज्ञान', code: 'SST-10', iconName: 'Globe', color: 'amber', paperCount: 0 },
  { id: 'sub-hin-10', classId: 'class-10', name: 'Hindi', hindiName: 'हिंदी', code: 'HIN-10', iconName: 'BookOpen', color: 'rose', paperCount: 0 },
  { id: 'sub-eng-10', classId: 'class-10', name: 'English', hindiName: 'अंग्रेज़ी', code: 'ENG-10', iconName: 'Languages', color: 'violet', paperCount: 0 },
  { id: 'sub-sans-10', classId: 'class-10', name: 'Sanskrit', hindiName: 'संस्कृत', code: 'SANS-10', iconName: 'Scroll', color: 'amber', paperCount: 0 },

  // Class 9 (Secondary)
  { id: 'sub-sci-9', classId: 'class-9', name: 'Science', hindiName: 'विज्ञान', code: 'SCI-9', iconName: 'Microscope', color: 'teal', paperCount: 0 },
  { id: 'sub-math-9', classId: 'class-9', name: 'Mathematics', hindiName: 'गणित', code: 'MATH-9', iconName: 'Calculator', color: 'blue', paperCount: 0 },
  { id: 'sub-sst-9', classId: 'class-9', name: 'Social Science', hindiName: 'सामाजिक विज्ञान', code: 'SST-9', iconName: 'Globe', color: 'amber', paperCount: 0 },
  { id: 'sub-hin-9', classId: 'class-9', name: 'Hindi', hindiName: 'हिंदी', code: 'HIN-9', iconName: 'BookOpen', color: 'rose', paperCount: 0 },
  { id: 'sub-eng-9', classId: 'class-9', name: 'English', hindiName: 'अंग्रेज़ी', code: 'ENG-9', iconName: 'Languages', color: 'violet', paperCount: 0 },

  // Science - Class 12
  { id: 'sub-bio-12', classId: 'class-12', name: 'Biology', hindiName: 'जीव विज्ञान', code: 'BIO-12', iconName: 'Dna', color: 'emerald', paperCount: 1 },
  { id: 'sub-phy-12', classId: 'class-12', name: 'Physics', hindiName: 'भौतिक विज्ञान', code: 'PHY-12', iconName: 'Atom', color: 'indigo', paperCount: 0 },
  { id: 'sub-chem-12', classId: 'class-12', name: 'Chemistry', hindiName: 'रसायन विज्ञान', code: 'CHEM-12', iconName: 'FlaskConical', color: 'amber', paperCount: 0 },
  { id: 'sub-math-12', classId: 'class-12', name: 'Mathematics', hindiName: 'गणित', code: 'MATH-12', iconName: 'Calculator', color: 'blue', paperCount: 0 },
  { id: 'sub-cs-12', classId: 'class-12', name: 'Computer Science', hindiName: 'कंप्यूटर विज्ञान', code: 'CS-12', iconName: 'Laptop', color: 'sky', paperCount: 0 },
  { id: 'sub-agri-12', classId: 'class-12', name: 'Agriculture', hindiName: 'कृषि विज्ञान', code: 'AGRI-12', iconName: 'Sprout', color: 'emerald', paperCount: 0 },

  // Commerce
  { id: 'sub-acc-12', classId: 'class-12', name: 'Accountancy', hindiName: 'लेखाशास्त्र', code: 'ACC-12', iconName: 'BookKey', color: 'rose', paperCount: 0 },
  { id: 'sub-bst-12', classId: 'class-12', name: 'Business Studies', hindiName: 'व्यवसाय अध्ययन', code: 'BST-12', iconName: 'Briefcase', color: 'blue', paperCount: 0 },
  { id: 'sub-eps-12', classId: 'class-12', name: 'Entrepreneurship', hindiName: 'उद्यमिता', code: 'EPS-12', iconName: 'Lightbulb', color: 'amber', paperCount: 0 },
  { id: 'sub-eco-12', classId: 'class-12', name: 'Economics', hindiName: 'अर्थशास्त्र', code: 'ECO-12', iconName: 'TrendingUp', color: 'emerald', paperCount: 0 },

  // Arts
  { id: 'sub-hist-12', classId: 'class-12-arts', name: 'History', hindiName: 'इतिहास', code: 'HIST-12', iconName: 'Landmark', color: 'amber', paperCount: 0 },
  { id: 'sub-geo-12', classId: 'class-12-arts', name: 'Geography', hindiName: 'भूगोल', code: 'GEO-12', iconName: 'Globe', color: 'cyan', paperCount: 0 },
  { id: 'sub-pol-12', classId: 'class-12-arts', name: 'Political Science', hindiName: 'राजनीति विज्ञान', code: 'POL-12', iconName: 'Scale', color: 'indigo', paperCount: 0 },
  { id: 'sub-soc-12', classId: 'class-12-arts', name: 'Sociology', hindiName: 'समाजशास्त्र', code: 'SOC-12', iconName: 'Users', color: 'purple', paperCount: 0 },
  { id: 'sub-psy-12', classId: 'class-12-arts', name: 'Psychology', hindiName: 'मनोविज्ञान', code: 'PSY-12', iconName: 'Brain', color: 'pink', paperCount: 0 },
  { id: 'sub-hs-12', classId: 'class-12-arts', name: 'Home Science', hindiName: 'गृह विज्ञान', code: 'HS-12', iconName: 'Home', color: 'rose', paperCount: 0 },
  { id: 'sub-phil-12', classId: 'class-12-arts', name: 'Philosophy', hindiName: 'दर्शनशास्त्र', code: 'PHIL-12', iconName: 'Feather', color: 'slate', paperCount: 0 },
  { id: 'sub-mus-12', classId: 'class-12-arts', name: 'Music', hindiName: 'संगीत', code: 'MUS-12', iconName: 'Music', color: 'violet', paperCount: 0 },

  // Languages
  { id: 'sub-hindi-12', classId: 'class-12', name: 'Hindi (100 Marks)', hindiName: 'हिंदी', code: 'HIN-12', iconName: 'BookOpen', color: 'rose', paperCount: 0 },
  { id: 'sub-eng-12', classId: 'class-12', name: 'English (100 Marks)', hindiName: 'अंग्रेज़ी', code: 'ENG-12', iconName: 'Languages', color: 'violet', paperCount: 0 },
  { id: 'sub-sans-12', classId: 'class-12', name: 'Sanskrit', hindiName: 'संस्कृत', code: 'SANS-12', iconName: 'Scroll', color: 'amber', paperCount: 0 },
  { id: 'sub-urdu-12', classId: 'class-12', name: 'Urdu', hindiName: 'उर्दू', code: 'URDU-12', iconName: 'BookText', color: 'emerald', paperCount: 0 },
  { id: 'sub-mai-12', classId: 'class-12', name: 'Maithili', hindiName: 'मैथिली', code: 'MAI-12', iconName: 'BookMarked', color: 'indigo', paperCount: 0 },
];

// Generate 96 real board questions for Class 12 Biology (70 MCQs + 20 Short + 6 Long)
const generateBio96Questions = (): Question[] => {
  const parsedBio = parseExamContent(SAMPLE_BIOLOGY_2026_TEXT, '', {
    classId: 'class-12',
    className: 'Class 12',
    subjectId: 'biology',
    subjectName: 'Biology (जीव विज्ञान)',
    board: 'Bihar Board (BSEB)',
    year: 2026,
    set: 'Set A',
  });

  return parsedBio.questions.map((q, idx) => ({
    id: q.id || `q-bio-${idx + 1}`,
    paperId: 'paper-bio-2026-a',
    questionNumber: q.questionNumber,
    type: q.type === 'mcq' ? 'mcq' : q.type === 'short' ? 'short' : 'long',
    text: q.text,
    textHindi: q.textHindi,
    options: q.options?.map((o) => ({ id: o.id, key: o.key, text: o.text, textHindi: o.textHindi })),
    correctAnswer: q.correctAnswer || (q.type === 'mcq' ? 'A' : 'Subjective'),
    explanation: q.explanation || q.modelAnswer,
    explanationHindi: q.explanationHindi,
    aiAnswer: q.modelAnswer || q.explanation,
    aiStatus: 'approved' as QuestionStatus,
    marks: q.marks,
    negativeMarks: 0,
    chapterId: `chap-bio-${(idx % 5) + 1}`,
    difficulty: q.type === 'long' ? 'hard' : q.type === 'short' ? 'medium' : 'easy',
  }));
};

// Generate real board questions for Class 10 Science
const generateSci10Questions = (): Question[] => {
  const parsedSci = parseExamContent(SAMPLE_CLASS10_SCIENCE_2026_TEXT, '', {
    classId: 'class-10',
    className: 'Class 10',
    subjectId: 'science-10',
    subjectName: 'Science (विज्ञान)',
    board: 'Bihar Board (BSEB Matric)',
    year: 2026,
    set: 'Set A',
  });

  return parsedSci.questions.map((q, idx) => ({
    id: q.id || `q-sci10-${idx + 1}`,
    paperId: 'paper-sci10-2026-a',
    questionNumber: q.questionNumber,
    type: q.type === 'mcq' ? 'mcq' : q.type === 'short' ? 'short' : 'long',
    text: q.text,
    textHindi: q.textHindi,
    options: q.options?.map((o) => ({ id: o.id, key: o.key, text: o.text, textHindi: o.textHindi })),
    correctAnswer: q.correctAnswer || (q.type === 'mcq' ? 'A' : 'Subjective'),
    explanation: q.explanation || q.modelAnswer,
    explanationHindi: q.explanationHindi,
    aiAnswer: q.modelAnswer || q.explanation,
    aiStatus: 'approved' as QuestionStatus,
    marks: q.marks,
    negativeMarks: 0,
    chapterId: `chap-sci10-${(idx % 4) + 1}`,
    difficulty: q.type === 'long' ? 'hard' : q.type === 'short' ? 'medium' : 'easy',
  }));
};

export const INITIAL_PAPERS: QuestionPaper[] = [
  {
    id: 'paper-bio-2026-a',
    classId: 'class-12',
    subjectId: 'biology',
    title: 'Class 12 Biology (जीव विज्ञान) 2026 Set A',
    year: 2026,
    set: 'Set A',
    durationMinutes: 195,
    totalMarks: 70,
    totalQuestions: 96,
    status: 'published',
    version: 2,
    questions: generateBio96Questions(),
    githubSourceFile: 'data/papers/class12_biology_2026_set_a.json',
    isAvailableOnGithub: true,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-28T14:30:00Z',
  },
  {
    id: 'paper-sci10-2026-a',
    classId: 'class-10',
    subjectId: 'science-10',
    title: 'Class 10 Science (विज्ञान) Matric 2026 Model Paper',
    year: 2026,
    set: 'Set A',
    durationMinutes: 195,
    totalMarks: 80,
    totalQuestions: 18,
    status: 'published',
    version: 1,
    questions: generateSci10Questions(),
    githubSourceFile: 'data/papers/class10_science_2026_set_a.json',
    isAvailableOnGithub: true,
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-08-29T11:00:00Z',
  },
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // Class 10 Science Chapters
  {
    id: 'chap-sci10-1',
    classId: 'class-10',
    subjectId: 'sub-sci-10',
    chapterNumber: 1,
    title: 'Chemical Reactions and Equations',
    hindiTitle: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    topics: [
      { id: 'top-c10-1-1', title: 'Types of Chemical Reactions', hindiTitle: 'रासायनिक अभिक्रियाओं के प्रकार', completed: true, order: 1 },
      { id: 'top-c10-1-2', title: 'Corrosion and Rancidity', hindiTitle: 'संक्षारण एवं विकृतगंधिता', completed: true, order: 2 },
    ],
  },
  {
    id: 'chap-sci10-2',
    classId: 'class-10',
    subjectId: 'sub-sci-10',
    chapterNumber: 2,
    title: 'Acids, Bases and Salts',
    hindiTitle: 'अम्ल, क्षारक एवं लवण',
    topics: [
      { id: 'top-c10-2-1', title: 'pH Scale and Everyday Life Applications', hindiTitle: 'pH पैमाना एवं दैनिक जीवन में महत्व', completed: true, order: 1 },
      { id: 'top-c10-2-2', title: 'Bleaching Powder & Plaster of Paris', hindiTitle: 'विरंजक चूर्ण एवं प्लास्टर ऑफ पेरिस', completed: true, order: 2 },
    ],
  },
  {
    id: 'chap-sci10-3',
    classId: 'class-10',
    subjectId: 'sub-sci-10',
    chapterNumber: 3,
    title: 'Life Processes',
    hindiTitle: 'जैव प्रक्रम (पोषण, श्वसन, वहन, उत्सर्जन)',
    topics: [
      { id: 'top-c10-3-1', title: 'Autotrophic & Heterotrophic Nutrition', hindiTitle: 'स्वपोषी एवं विषमपोषी पोषण', completed: true, order: 1 },
      { id: 'top-c10-3-2', title: 'Human Circulatory & Excretory Systems', hindiTitle: 'मानव परिसंचरण एवं उत्सर्जन तंत्र', completed: true, order: 2 },
    ],
  },
  {
    id: 'chap-sci10-4',
    classId: 'class-10',
    subjectId: 'sub-sci-10',
    chapterNumber: 4,
    title: 'Light: Reflection and Refraction & Electricity',
    hindiTitle: 'प्रकाश का परावर्तन/अपवर्तन एवं विद्युत',
    topics: [
      { id: 'top-c10-4-1', title: 'Laws of Reflection & Refraction, Lens Formula', hindiTitle: 'परावर्तन/अपवर्तन नियम व लेंस सूत्र', completed: true, order: 1 },
      { id: 'top-c10-4-2', title: "Ohm's Law, Resistance in Series and Parallel", hindiTitle: "ओम का नियम व प्रतिरोधों का संयोजन", completed: true, order: 2 },
    ],
  },

  // Class 9 Science Chapters
  {
    id: 'chap-sci9-1',
    classId: 'class-9',
    subjectId: 'sub-sci-9',
    chapterNumber: 1,
    title: 'Matter in Our Surroundings & Is Matter Around Us Pure',
    hindiTitle: 'हमारे आस-पास के पदार्थ एवं क्या पदार्थ शुद्ध हैं',
    topics: [
      { id: 'top-c9-1-1', title: 'States of Matter and Phase Changes', hindiTitle: 'पदार्थ की अवस्थाएँ एवं गुप्त ऊष्मा', completed: true, order: 1 },
      { id: 'top-c9-1-2', title: 'Solutions, Colloids and Suspensions', hindiTitle: 'विलयन, कोलाइड एवं निलंबन', completed: true, order: 2 },
    ],
  },
  {
    id: 'chap-sci9-2',
    classId: 'class-9',
    subjectId: 'sub-sci-9',
    chapterNumber: 2,
    title: 'The Fundamental Unit of Life: Cell & Tissues',
    hindiTitle: 'जीवन की मौलिक इकाई: कोशिका एवं ऊतक',
    topics: [
      { id: 'top-c9-2-1', title: 'Cell Organelles (Mitochondria, Plastids, ER)', hindiTitle: 'कोशिकांग संरचना एवं कार्य', completed: true, order: 1 },
      { id: 'top-c9-2-2', title: 'Plant and Animal Tissues (Xylem, Phloem, Muscle)', hindiTitle: 'पादप एवं जन्तु ऊतक', completed: true, order: 2 },
    ],
  },
  {
    id: 'chap-sci9-3',
    classId: 'class-9',
    subjectId: 'sub-sci-9',
    chapterNumber: 3,
    title: 'Motion, Force and Laws of Motion & Gravitation',
    hindiTitle: 'गति, बल तथा गति के नियम एवं गुरुत्वाकर्षण',
    topics: [
      { id: 'top-c9-3-1', title: "Newton's Three Laws of Motion & Momentum", hindiTitle: "न्यूटन के गति के नियम एवं संवेग संरक्षण", completed: true, order: 1 },
      { id: 'top-c9-3-2', title: 'Universal Law of Gravitation & Free Fall', hindiTitle: 'गुरुत्वाकर्षण का सार्वत्रिक नियम एवं मुक्त पतन', completed: true, order: 2 },
    ],
  },

  // Class 12 Chapters
  {
    id: 'chap-bio-1',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterNumber: 1,
    title: 'Reproduction in Organisms & Humans',
    hindiTitle: 'जीवों एवं मानव में जनन',
    topics: [
      { id: 'top-1-1', title: 'Asexual & Sexual Modes of Reproduction', hindiTitle: 'अलैंगिक एवं लैंगिक जनन विधियाँ', completed: true, order: 1 },
      { id: 'top-1-2', title: 'Male and Female Reproductive Systems', hindiTitle: 'नर एवं मादा जनन तंत्र', completed: true, order: 2 },
      { id: 'top-1-3', title: 'Gametogenesis & Menstrual Cycle', hindiTitle: 'युग्मकजनन एवं आर्तव चक्र', completed: true, order: 3 },
      { id: 'top-1-4', title: 'Fertilization, Cleavage & Implantation', hindiTitle: 'निषेचन एवं रोपण', completed: true, order: 4 },
      { id: 'top-1-5', title: 'Reproductive Health & ART (IVF, ZIFT)', hindiTitle: 'जनन स्वास्थ्य एवं सहायक तकनीकें', completed: false, order: 5 },
    ],
  },
  {
    id: 'chap-bio-2',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterNumber: 2,
    title: 'Genetics and Evolution',
    hindiTitle: 'आनुवंशिकी तथा विकास',
    topics: [
      { id: 'top-2-1', title: "Mendel's Laws of Inheritance", hindiTitle: 'मेंडल के वंशागति के नियम', completed: true, order: 1 },
      { id: 'top-2-2', title: 'Incomplete Dominance & Codominance', hindiTitle: 'अपूर्ण प्रभाविता एवं सह-प्रभाविता', completed: true, order: 2 },
      { id: 'top-2-3', title: 'Molecular Basis: DNA as Genetic Material', hindiTitle: 'डीएनए का आण्विक आधार', completed: true, order: 3 },
      { id: 'top-2-4', title: 'Transcription, Translation & Genetic Code', hindiTitle: 'अनुलेखन, अनुवादन एवं आनुवंशिक कूट', completed: true, order: 4 },
      { id: 'top-2-5', title: 'Human Genome Project & DNA Fingerprinting', hindiTitle: 'मानव जीनोम परियोजना एवं डीएनए फिंगरप्रिंटिंग', completed: false, order: 5 },
    ],
  },
  {
    id: 'chap-bio-3',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterNumber: 3,
    title: 'Biology in Human Welfare',
    hindiTitle: 'मानव कल्याण में जीव विज्ञान',
    topics: [
      { id: 'top-3-1', title: 'Common Diseases in Humans (Typhoid, Malaria, AIDS)', hindiTitle: 'मानव रोग (टाइफाइड, मलेरिया, एड्स)', completed: true, order: 1 },
      { id: 'top-3-2', title: 'Immunity: Innate, Acquired & Vaccines', hindiTitle: 'प्रतिरक्षा प्रणाली एवं टीके', completed: true, order: 2 },
      { id: 'top-3-3', title: 'Microbes in Household & Industrial Production', hindiTitle: 'घरेलू व औद्योगिक उत्पादों में सूक्ष्मजीव', completed: true, order: 3 },
      { id: 'top-3-4', title: 'Microbes in Sewage Treatment & Biogas', hindiTitle: 'वाहितमल उपचार एवं बायोगैस निर्माण', completed: false, order: 4 },
    ],
  },
  {
    id: 'chap-bio-4',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterNumber: 4,
    title: 'Biotechnology: Principles & Applications',
    hindiTitle: 'जैव प्रौद्योगिकी: सिद्धांत एवं प्रक्रम',
    topics: [
      { id: 'top-4-1', title: 'Restriction Enzymes & Cloning Vectors', hindiTitle: 'प्रतिबंधन एंजाइम एवं संवाहक', completed: true, order: 1 },
      { id: 'top-4-2', title: 'Polymerase Chain Reaction (PCR) Steps', hindiTitle: 'पीसीआर (PCR) प्रक्रम', completed: true, order: 2 },
      { id: 'top-4-3', title: 'Bt Crops & Transgenic Animals', hindiTitle: 'बीटी फसलें एवं पारजीनी जंतु', completed: false, order: 3 },
      { id: 'top-4-4', title: 'Gene Therapy and Recombinant Insulin', hindiTitle: 'जीन थेरेपी एवं मानव इंसुलिन', completed: false, order: 4 },
    ],
  },
  {
    id: 'chap-bio-5',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterNumber: 5,
    title: 'Ecology and Environment',
    hindiTitle: 'पारिस्थितिकी एवं पर्यावरण',
    topics: [
      { id: 'top-5-1', title: 'Population Interactions (Mutualism, Parasitism)', hindiTitle: 'समष्टि पारस्परिक क्रियाएं', completed: true, order: 1 },
      { id: 'top-5-2', title: 'Ecosystem Energy Flow & Ecological Pyramids', hindiTitle: 'ऊर्जा प्रवाह एवं पारिस्थितिक पिरामिड', completed: true, order: 2 },
      { id: 'top-5-3', title: 'Biodiversity Loss & Conservation Strategies', hindiTitle: 'जैव विविधता संरक्षण', completed: false, order: 3 },
    ],
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-bio-1',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterId: 'chap-bio-1',
    title: 'Human Reproduction Revision Summary',
    content: `# Chapter 1: Human Reproduction Quick Notes

## Key Concepts
- **Spermatogenesis**: Occurs in seminiferous tubules; 1 Primary Spermatocyte gives 4 functional spermatozoa (sperms).
- **Oogenesis**: Initiated during embryonic development; 1 Primary Oocyte produces only 1 functional Ovum and polar bodies.
- **LH Surge**: Triggers ovulation on the 14th day of normal 28-day menstrual cycle.

## Formulas & Board Exam Tips
- Acrosome of sperm is derived from *Golgi apparatus* and contains hyaluronidase enzyme.
- Implantation occurs at **Blastocyst stage** into endometrium lining.`,
    status: 'published',
    updatedAt: '2026-08-28T16:00:00Z',
    tags: ['Reproduction', 'Class 12', 'High Weightage'],
  },
  {
    id: 'note-bio-2',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    chapterId: 'chap-bio-2',
    title: 'Mendelian Genetics & DNA Transcription Rules',
    content: `# Genetics & Molecular Basis of Inheritance

## Monohybrid Cross Ratios
- **Phenotypic Ratio**: 3 : 1
- **Genotypic Ratio**: 1 : 2 : 1

## Dihybrid Cross
- **Phenotypic Ratio**: 9 : 3 : 3 : 1

## DNA vs RNA
1. DNA has deoxyribose sugar; RNA has ribose.
2. Thymine in DNA is replaced by Uracil in RNA.
3. DNA double helix is stabilized by hydrogen bonds between complementary base pairs (A=T, G≡C).`,
    status: 'published',
    updatedAt: '2026-08-27T11:20:00Z',
    tags: ['Genetics', 'Mendel', 'DNA'],
  },
  {
    id: 'note-phy-1',
    classId: 'class-12',
    subjectId: 'sub-phy-12',
    chapterId: 'chap-phy-1',
    title: 'Electrostatics & Gauss Law Formulas',
    content: `# Electrostatics Quick Revision Formulas
- Coulomb's Law: F = (1 / 4πε₀) * (q₁q₂ / r²)
- Electric Field due to Point Charge: E = (1 / 4πε₀) * (q / r²)
- Gauss's Law: ∮ E · dA = q_enclosed / ε₀
- Electric Potential: V = (1 / 4πε₀) * (q / r)`,
    status: 'published',
    updatedAt: '2026-08-26T14:15:00Z',
    tags: ['Physics', 'Formulas', 'Gauss Law'],
  },
  {
    id: 'note-sci-10-1',
    classId: 'class-10',
    subjectId: 'sub-sci-10',
    chapterId: 'chap-sci10-4',
    title: 'Class 10 Light & Optics Important Board Formulas',
    content: `# Class 10 Science: Light Reflection & Refraction Summary

## Mirror Formula & Magnification
- **Mirror Formula**: 1/f = 1/v + 1/u
- **Magnification (m)**: m = -v/u = h'/h
- **Radius of Curvature**: R = 2f

## Lens Formula & Power
- **Lens Formula**: 1/f = 1/v - 1/u
- **Magnification (m)**: m = v/u = h'/h
- **Power of Lens (P)**: P = 1/f (in meters). Unit: Dioptre (D)

## Key Exam Tips
- Concave mirror has negative focal length; convex mirror has positive.
- Convex lens has positive power; concave lens has negative power.`,
    status: 'published',
    updatedAt: '2026-08-29T10:00:00Z',
    tags: ['Science', 'Class 10', 'Optics', 'Formulas'],
  },
];

export const INITIAL_RELEASES: PublishRelease[] = [
  {
    id: 'rel-v2',
    version: 2,
    timestamp: '2026-08-26T18:00:00Z',
    commitSha: '8f2a9c1',
    message: 'Biology 2026 Set A 96-Question Bank verified and published for student app sync',
    paperCount: 1,
    questionCount: 96,
    notesCount: 2,
    status: 'success',
    branch: 'main',
  },
  {
    id: 'rel-v1',
    version: 1,
    timestamp: '2026-08-10T12:00:00Z',
    commitSha: '3e41b7d',
    message: 'Initial release of Class 12 Syllabus and Question Bank',
    paperCount: 1,
    questionCount: 96,
    notesCount: 2,
    status: 'success',
    branch: 'main',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Biology 2026 Set A',
    subtitle: '96 questions verified (70 MCQs, 20 Short, 6 Long)',
    timestamp: '10 mins ago',
    type: 'ai',
    status: 'success',
  },
  {
    id: 'act-2',
    title: 'Class 12 Syllabus',
    subtitle: 'Syllabus chapter structure ready for sync',
    timestamp: '2 hours ago',
    type: 'syllabus',
    status: 'info',
  },
];
