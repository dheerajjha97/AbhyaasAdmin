import { ClassItem, SubjectItem, QuestionPaper, Question, QuestionStatus, Chapter, Note, PublishRelease, ActivityItem } from '../types';

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'class-12', name: 'Class 12', stream: 'Science (PCB / PCM)', order: 1, code: '12-SCI' },
  { id: 'class-12-arts', name: 'Class 12', stream: 'Arts & Humanities', order: 2, code: '12-ART' },
  { id: 'class-10', name: 'Class 10', stream: 'Matriculation (General)', order: 3, code: '10-GEN' },
  { id: 'class-neet', name: 'NEET UG', stream: 'Medical Entrance Exam', order: 4, code: 'NEET-UG' },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  { id: 'sub-bio-12', classId: 'class-12', name: 'Biology', hindiName: 'जीव विज्ञान', code: 'BIO-12', iconName: 'Dna', color: 'emerald', paperCount: 4 },
  { id: 'sub-phy-12', classId: 'class-12', name: 'Physics', hindiName: 'भौतिक विज्ञान', code: 'PHY-12', iconName: 'Atom', color: 'indigo', paperCount: 4 },
  { id: 'sub-chem-12', classId: 'class-12', name: 'Chemistry', hindiName: 'रसायन विज्ञान', code: 'CHEM-12', iconName: 'FlaskConical', color: 'amber', paperCount: 3 },
  { id: 'sub-math-12', classId: 'class-12', name: 'Mathematics', hindiName: 'गणित', code: 'MATH-12', iconName: 'Calculator', color: 'blue', paperCount: 3 },
  { id: 'sub-hindi-12', classId: 'class-12', name: 'Hindi (100 Marks)', hindiName: 'हिंदी', code: 'HIN-12', iconName: 'BookOpen', color: 'rose', paperCount: 2 },
  { id: 'sub-eng-12', classId: 'class-12', name: 'English (100 Marks)', hindiName: 'अंग्रेज़ी', code: 'ENG-12', iconName: 'Languages', color: 'violet', paperCount: 2 },
];

// Generate 70 questions for Biology 2026 Set A to match real board pattern exactly (60 Approved, 7 Review, 3 Missing)
const generateBio70Questions = (): Question[] => {
  const qList: Question[] = [
    {
      id: 'q-bio-1',
      paperId: 'paper-bio-2026-a',
      questionNumber: 1,
      type: 'mcq',
      text: 'Which of the following undergoes binary fission?',
      textHindi: 'निम्नलिखित में से किसमें द्विखंडन (Binary Fission) होता है?',
      options: [
        { id: 'o1', key: 'A', text: 'Amoeba', textHindi: 'अमीबा' },
        { id: 'o2', key: 'B', text: 'Hydra', textHindi: 'हाइड्रा' },
        { id: 'o3', key: 'C', text: 'Yeast', textHindi: 'यीस्ट' },
        { id: 'o4', key: 'D', text: 'Sponge', textHindi: 'स्पंज' },
      ],
      correctAnswer: 'A',
      explanation: 'Amoeba reproduces asexually through binary fission where the parent cell divides into two identical daughter cells.',
      explanationHindi: 'अमीबा में अलैंगिक जनन द्विखंडन द्वारा होता है जिसमें जनक कोशिका दो संतति कोशिकाओं में विभाजित होती है।',
      aiAnswer: 'Option A (Amoeba) is correct. In Amoeba, the nucleus divides amitotically followed by cytoplasmic division forming two daughter amoebae.',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-1',
      difficulty: 'easy',
    },
    {
      id: 'q-bio-2',
      paperId: 'paper-bio-2026-a',
      questionNumber: 2,
      type: 'mcq',
      text: 'Which of the following is a primary sex organ in human females?',
      textHindi: 'मानव मादा में निम्नलिखित में से कौन प्राथमिक जनन अंग है?',
      options: [
        { id: 'o1', key: 'A', text: 'Uterus', textHindi: 'गर्भाशय' },
        { id: 'o2', key: 'B', text: 'Ovary', textHindi: 'अंडाशय (Ovary)' },
        { id: 'o3', key: 'C', text: 'Fallopian Tube', textHindi: 'फैलोपियन नलिका' },
        { id: 'o4', key: 'D', text: 'Vagina', textHindi: 'योनि' },
      ],
      correctAnswer: 'B',
      explanation: 'Ovaries are the primary female sex organs because they produce female gametes (ova) and steroid hormones.',
      explanationHindi: 'अंडाशय प्राथमिक जनन अंग है क्योंकि यह मादा युग्मक (अंडाणु) और हॉर्मोन उत्पन्न करता है।',
      aiAnswer: 'Option B is correct. Primary sex organs produce gametes and secrete hormones, which is done by ovaries in females.',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-1',
      difficulty: 'easy',
    },
    {
      id: 'q-bio-3',
      paperId: 'paper-bio-2026-a',
      questionNumber: 3,
      type: 'mcq',
      text: 'Mendel conducted his hybridization experiments on which plant?',
      textHindi: 'मेंडल ने अपने संकरण प्रयोग किस पौधे पर किए थे?',
      options: [
        { id: 'o1', key: 'A', text: 'Wild Pea', textHindi: 'जंगली मटर' },
        { id: 'o2', key: 'B', text: 'Garden Pea (Pisum sativum)', textHindi: 'उद्यान मटर (Pisum sativum)' },
        { id: 'o3', key: 'C', text: 'Sweet Pea', textHindi: 'मीठी मटर' },
        { id: 'o4', key: 'D', text: 'Chickpea', textHindi: 'चना' },
      ],
      correctAnswer: 'B',
      explanation: 'Gregor Mendel used Garden Pea (Pisum sativum) due to contrasting characters, short life span and bisexual flowers.',
      explanationHindi: 'ग्रेगर मेंडल ने उद्यान मटर (Pisum sativum) का चयन किया क्योंकि इसमें स्पष्ट विपर्यासी लक्षण होते हैं।',
      aiAnswer: 'Option B is correct. Gregor Mendel conducted hybridization experiments on garden pea (Pisum sativum) between 1856 and 1863.',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-2',
      difficulty: 'easy',
    },
    {
      id: 'q-bio-4',
      paperId: 'paper-bio-2026-a',
      questionNumber: 4,
      type: 'mcq',
      text: 'Which nitrogenous base is present in RNA but absent in DNA?',
      textHindi: 'RNA में कौन सा नाइट्रोजनी क्षार उपस्थित होता है लेकिन DNA में अनुपस्थित होता है?',
      options: [
        { id: 'o1', key: 'A', text: 'Adenine', textHindi: 'एडेनिन' },
        { id: 'o2', key: 'B', text: 'Guanine', textHindi: 'गुआनिन' },
        { id: 'o3', key: 'C', text: 'Thymine', textHindi: 'थाइमिन' },
        { id: 'o4', key: 'D', text: 'Uracil', textHindi: 'यूरैसिल' },
      ],
      correctAnswer: 'D',
      explanation: 'Uracil is present in RNA in place of Thymine which is present in DNA.',
      explanationHindi: 'RNA में थाइमिन के स्थान पर यूरैसिल (Uracil) पाया जाता है।',
      aiAnswer: 'Option D (Uracil). DNA contains A, T, G, C while RNA contains A, U, G, C.',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-2',
      difficulty: 'easy',
    },
    {
      id: 'q-bio-5',
      paperId: 'paper-bio-2026-a',
      questionNumber: 5,
      type: 'mcq',
      text: 'The enzyme used in Polymerase Chain Reaction (PCR) is:',
      textHindi: 'पॉलीमरेज चेन रिएक्शन (PCR) में प्रयुक्त एंजाइम कौन सा है?',
      options: [
        { id: 'o1', key: 'A', text: 'DNA Ligase', textHindi: 'डीएनए लाइगेज' },
        { id: 'o2', key: 'B', text: 'Taq Polymerase', textHindi: 'टैक पॉलीमरेज (Taq Polymerase)' },
        { id: 'o3', key: 'C', text: 'RNA Polymerase', textHindi: 'आरएनए पॉलीमरेज' },
        { id: 'o4', key: 'D', text: 'Helicase', textHindi: 'हेलीकेज' },
      ],
      correctAnswer: 'B',
      explanation: 'Taq polymerase is isolated from bacterium Thermus aquaticus and is thermostable during PCR denaturation cycle.',
      explanationHindi: 'टैक पॉलीमरेज थर्मस एक्वैटिकस जीवाणु से प्राप्त ताप-सहनशील एंजाइम है।',
      aiAnswer: 'Option B is correct. Taq Polymerase remains active during high temperature steps of PCR.',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-4',
      difficulty: 'medium',
    },
    {
      id: 'q-bio-6',
      paperId: 'paper-bio-2026-a',
      questionNumber: 6,
      type: 'mcq',
      text: 'Which vector is commonly used for cloning genes in plants?',
      textHindi: 'पौधों में जीन क्लोनिंग के लिए सामान्यतः किस संवाहक (Vector) का उपयोग किया जाता है?',
      options: [
        { id: 'o1', key: 'A', text: 'Ti Plasmid of Agrobacterium', textHindi: 'एग्रोबैक्टीरियम का Ti प्लास्मिड' },
        { id: 'o2', key: 'B', text: 'pBR322', textHindi: 'pBR322' },
        { id: 'o3', key: 'C', text: 'Bacteriophage', textHindi: 'जीवाणुभोजी' },
        { id: 'o4', key: 'D', text: 'Cosmid', textHindi: 'कॉस्मिड' },
      ],
      correctAnswer: 'A',
      explanation: 'Agrobacterium tumefaciens with Ti-plasmid is widely used as a natural genetic engineer for plants.',
      explanationHindi: 'एग्रोबैक्टीरियम ट्यूमीफेशियंस के Ti-प्लास्मिड का उपयोग पादप आनुवंशिक इंजीनियरिंग में किया जाता है।',
      aiAnswer: 'Option A (Ti Plasmid of Agrobacterium tumefaciens).',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-4',
      difficulty: 'medium',
    },
    {
      id: 'q-bio-7',
      paperId: 'paper-bio-2026-a',
      questionNumber: 7,
      type: 'mcq',
      text: 'Causative agent of Typhoid fever is:',
      textHindi: 'टाइफाइड ज्वर का रोगजनक कौन सा जीवाणु है?',
      options: [
        { id: 'o1', key: 'A', text: 'Plasmodium vivax', textHindi: 'प्लास्मोडियम वाइवैक्स' },
        { id: 'o2', key: 'B', text: 'Salmonella typhi', textHindi: 'साल्मोनेला टाइफी' },
        { id: 'o3', key: 'C', text: 'Streptococcus pneumoniae', textHindi: 'स्ट्रेप्टोकोकस न्यूमोनी' },
        { id: 'o4', key: 'D', text: 'Entamoeba histolytica', textHindi: 'एंटअमीबा हिस्टोलिटिका' },
      ],
      correctAnswer: 'B',
      explanation: 'Salmonella typhi is a pathogenic bacterium causing typhoid fever confirmed by Widal test.',
      explanationHindi: 'साल्मोनेला टाइफी जीवाणु टाइफाइड का कारक है, जिसकी पुष्टि विडाल परीक्षण (Widal Test) से होती है।',
      aiAnswer: 'Option B (Salmonella typhi).',
      aiStatus: 'approved',
      marks: 1,
      negativeMarks: 0,
      chapterId: 'chap-bio-3',
      difficulty: 'easy',
    },
    // Example question with Review Status
    {
      id: 'q-bio-8',
      paperId: 'paper-bio-2026-a',
      questionNumber: 8,
      type: 'short',
      text: 'What is Contact Inhibition? Why do cancer cells lose this property?',
      textHindi: 'स्पर्श संदमन (Contact Inhibition) क्या है? कैंसर कोशिकाएं इस गुण को क्यों खो देती हैं?',
      correctAnswer: 'Subjective',
      explanation: 'Normal cells show contact inhibition where contact with other cells inhibits their uncontrolled growth.',
      explanationHindi: 'सामान्य कोशिकाएं स्पर्श संदमन दर्शाती हैं। कैंसर कोशिकाओं में यह नियंत्रण समाप्त हो जाता है जिससे वे ट्यूमर बनाती हैं।',
      aiAnswer: 'Contact inhibition is a regulatory mechanism in normal animal cells that ensures cells form a monolayer and cease division upon touching adjacent cells. Cancer cells undergo malignant transformation, losing contact inhibition due to mutations in tumor-suppressor genes (like p53) and cell-surface adhesion proteins, resulting in multi-layered tumors.',
      aiStatus: 'review',
      marks: 2,
      chapterId: 'chap-bio-3',
      difficulty: 'medium',
    },
    // Example Question 9 with Review Status
    {
      id: 'q-bio-9',
      paperId: 'paper-bio-2026-a',
      questionNumber: 9,
      type: 'long',
      text: 'Explain the process of double fertilization in angiosperms with a neat labelled diagram concept.',
      textHindi: 'आवृतबीजी पौधों में द्विनिषेचन (Double Fertilization) की प्रक्रिया को समझाइए।',
      correctAnswer: 'Subjective',
      explanation: 'Double fertilization involves syngamy (fertilization of egg) and triple fusion (fertilization of central cell nuclei).',
      explanationHindi: 'द्विनिषेचन में युग्मक संलयन (Syngamy) तथा त्रिसंलयन (Triple Fusion) दोनों शामिल होते हैं।',
      aiAnswer: 'Double fertilization is a unique characteristic of flowering plants:\n1. Syngamy: One haploid male gamete (n) fuses with the haploid egg cell (n) to form a diploid Zygote (2n), developing into the embryo.\n2. Triple Fusion: The second haploid male gamete (n) fuses with the diploid secondary nucleus (2n) in the central cell to produce a triploid Primary Endosperm Nucleus (PEN, 3n), which develops into nutritive endosperm.\nBecause two fertilizations occur in the same embryo sac, it is called Double Fertilization.',
      aiStatus: 'review',
      marks: 5,
      chapterId: 'chap-bio-1',
      difficulty: 'hard',
    },
    // Example Question 70 with Missing Status
    {
      id: 'q-bio-10',
      paperId: 'paper-bio-2026-a',
      questionNumber: 10,
      type: 'short',
      text: 'Define Eco-san toilets and their environmental advantages in rural sanitation.',
      textHindi: 'इको-सैल शौचालय (Eco-san toilets) क्या हैं और ग्रामीण स्वच्छता में इसके क्या लाभ हैं?',
      correctAnswer: 'Subjective',
      explanation: '',
      aiAnswer: '',
      aiStatus: 'missing',
      marks: 2,
      chapterId: 'chap-bio-5',
      difficulty: 'medium',
    },
  ];

  // Fill up to 70 questions for complete mobile palette simulation
  const topics = [
    'Genetic code characteristics and degenerate codons',
    'Oogenesis stages in human female reproduction',
    'Biomagnification in aquatic food chains (DDT accumulation)',
    'Difference between Homologous and Analogous organs with examples',
    'Role of Microbes in Household Food Processing and Curd Formation',
    'Structure and function of tRNA (adapter molecule)',
    'DNA Fingerprinting steps and applications in forensics',
    'Bt Cotton mechanism against bollworm pest',
    'Global warming greenhouse gases contribution percentage',
    'Cryopreservation and Ex-situ biodiversity conservation methods',
  ];

  for (let i = 11; i <= 70; i++) {
    const isMissing = i > 67; // 3 missing (68, 69, 70)
    const isReview = i >= 61 && i <= 67; // 7 need review (61..67)
    const status: QuestionStatus = isMissing ? 'missing' : (isReview ? 'review' : 'approved');
    const topic = topics[(i - 11) % topics.length];

    qList.push({
      id: `q-bio-${i}`,
      paperId: 'paper-bio-2026-a',
      questionNumber: i,
      type: i % 4 === 0 ? 'short' : (i % 7 === 0 ? 'long' : 'mcq'),
      text: i % 4 === 0 
        ? `Explain the biological principle behind: ${topic}?`
        : `Which statement is correct regarding ${topic.toLowerCase()}?`,
      textHindi: `प्रश्न संख्या ${i}: ${topic} के संबंध में सही कथन अथवा व्याख्या प्रस्तुत करें।`,
      options: i % 4 !== 0 ? [
        { id: `o-${i}-1`, key: 'A', text: `Option A for ${topic.slice(0, 20)}`, textHindi: `विकल्प A` },
        { id: `o-${i}-2`, key: 'B', text: `Option B for ${topic.slice(0, 20)}`, textHindi: `विकल्प B` },
        { id: `o-${i}-3`, key: 'C', text: `Option C for ${topic.slice(0, 20)}`, textHindi: `विकल्प C` },
        { id: `o-${i}-4`, key: 'D', text: `Option D for ${topic.slice(0, 20)}`, textHindi: `विकल्प D` },
      ] : undefined,
      correctAnswer: ['A', 'B', 'C', 'D'][(i % 4)],
      explanation: `Detailed explanation for question ${i} covering key principles of ${topic}.`,
      explanationHindi: `इस प्रश्न की विस्तृत व्याख्या एवं बोर्ड परीक्षा में अंक प्राप्ति के महत्वपूर्ण बिंदु।`,
      aiAnswer: isMissing ? '' : `AI Answer for Q${i}: The standard scientific explanation relates to ${topic}. Key points include verified biological facts, terminology, and exam-oriented definitions.`,
      aiStatus: status,
      marks: i % 7 === 0 ? 5 : (i % 4 === 0 ? 2 : 1),
      negativeMarks: 0,
      chapterId: `chap-bio-${(i % 5) + 1}`,
      difficulty: i % 3 === 0 ? 'hard' : (i % 2 === 0 ? 'medium' : 'easy'),
    });
  }

  return qList;
};

export const INITIAL_PAPERS: QuestionPaper[] = [
  {
    id: 'paper-bio-2026-a',
    classId: 'class-12',
    subjectId: 'sub-bio-12',
    title: 'Biology 2026 Set A',
    year: 2026,
    set: 'Set A',
    durationMinutes: 195,
    totalMarks: 70,
    totalQuestions: 70,
    status: 'review',
    version: 2,
    questions: generateBio70Questions(),
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-28T14:30:00Z',
  },
  {
    id: 'paper-phy-2026-b',
    classId: 'class-12',
    subjectId: 'sub-phy-12',
    title: 'Physics 2026 Set B',
    year: 2026,
    set: 'Set B',
    durationMinutes: 195,
    totalMarks: 70,
    totalQuestions: 70,
    status: 'published',
    version: 3,
    questions: [],
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-26T18:00:00Z',
  },
  {
    id: 'paper-chem-2026-a',
    classId: 'class-12',
    subjectId: 'sub-chem-12',
    title: 'Chemistry 2026 Set A',
    year: 2026,
    set: 'Set A',
    durationMinutes: 195,
    totalMarks: 70,
    totalQuestions: 70,
    status: 'generating',
    version: 1,
    questions: [],
    createdAt: '2026-08-22T11:00:00Z',
    updatedAt: '2026-08-29T06:00:00Z',
  },
  {
    id: 'paper-math-2026-c',
    classId: 'class-12',
    subjectId: 'sub-math-12',
    title: 'Mathematics 2026 Set C',
    year: 2026,
    set: 'Set C',
    durationMinutes: 195,
    totalMarks: 100,
    totalQuestions: 100,
    status: 'ready',
    version: 1,
    questions: [],
    createdAt: '2026-08-25T14:00:00Z',
    updatedAt: '2026-08-27T12:00:00Z',
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
    message: 'Physics 2026 Set B verified and published for student app sync',
    paperCount: 124,
    questionCount: 8450,
    notesCount: 86,
    status: 'success',
    branch: 'main',
  },
  {
    id: 'rel-v1',
    version: 1,
    timestamp: '2026-08-10T12:00:00Z',
    commitSha: '3e41b7d',
    message: 'Initial release of Class 12 Syllabus and Question Bank',
    paperCount: 110,
    questionCount: 7200,
    notesCount: 65,
    status: 'success',
    branch: 'main',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Biology 2026 Set A',
    subtitle: 'Answer generation completed (60 Approved, 7 Review, 3 Missing)',
    timestamp: '10 mins ago',
    type: 'ai',
    status: 'info',
  },
  {
    id: 'act-2',
    title: 'Physics 2026 Set B',
    subtitle: 'Published successfully to GitHub (Version 2)',
    timestamp: '2 hours ago',
    type: 'publish',
    status: 'success',
  },
  {
    id: 'act-3',
    title: 'Class 12 Chemistry',
    subtitle: '15 new questions added to Question Bank',
    timestamp: 'Yesterday',
    type: 'paper',
    status: 'info',
  },
  {
    id: 'act-4',
    title: 'Syllabus Updated',
    subtitle: 'Reproduction chapter topics marked 80% complete',
    timestamp: '2 days ago',
    type: 'syllabus',
    status: 'success',
  },
];
