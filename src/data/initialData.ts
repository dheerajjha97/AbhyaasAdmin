import { ClassItem, SubjectItem, QuestionPaper, Question, QuestionStatus, Chapter, Note, PublishRelease, ActivityItem } from '../types';
import { parseExamContent } from '../utils/questionParser';
import { SAMPLE_BIOLOGY_2026_TEXT } from './sampleQuestionBank';

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'class-12', name: 'Class 12', stream: 'Science (PCB / PCM)', order: 1, code: '12-SCI' },
  { id: 'class-12-arts', name: 'Class 12', stream: 'Arts & Humanities', order: 2, code: '12-ART' },
  { id: 'class-10', name: 'Class 10', stream: 'Matriculation (General)', order: 3, code: '10-GEN' },
  { id: 'class-neet', name: 'NEET UG', stream: 'Medical Entrance Exam', order: 4, code: 'NEET-UG' },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  // Science
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
];

export const INITIAL_CHAPTERS: Chapter[] = [
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
