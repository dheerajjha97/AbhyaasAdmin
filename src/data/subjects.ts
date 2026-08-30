export interface SubjectOption {
  id: string;
  name: string;
  hindiName: string;
  code: string;
  stream: 'science' | 'commerce' | 'arts' | 'language' | 'general';
  categoryLabel: string;
  iconName?: string;
  color?: string;
}

export const ALL_SUBJECTS: SubjectOption[] = [
  // -------------------------------------------------------------
  // 1. Science Stream (विज्ञान संकाय)
  // -------------------------------------------------------------
  {
    id: 'biology',
    name: 'Biology (जीव विज्ञान)',
    hindiName: 'जीव विज्ञान',
    code: 'BIO',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Dna',
    color: 'emerald'
  },
  {
    id: 'physics',
    name: 'Physics (भौतिक विज्ञान)',
    hindiName: 'भौतिक विज्ञान / भौतिकी',
    code: 'PHY',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Atom',
    color: 'indigo'
  },
  {
    id: 'chemistry',
    name: 'Chemistry (रसायन विज्ञान)',
    hindiName: 'रसायन विज्ञान / रसायन',
    code: 'CHEM',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'FlaskConical',
    color: 'amber'
  },
  {
    id: 'mathematics',
    name: 'Mathematics (गणित)',
    hindiName: 'गणित',
    code: 'MATH',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Calculator',
    color: 'blue'
  },
  {
    id: 'cs',
    name: 'Computer Science (कंप्यूटर विज्ञान)',
    hindiName: 'कंप्यूटर विज्ञान / IT',
    code: 'CS',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Laptop',
    color: 'sky'
  },
  {
    id: 'ip',
    name: 'Informatics Practices (सूचना प्रौद्योगिकी)',
    hindiName: 'सूचना प्रौद्योगिकी (IP)',
    code: 'IP',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Code',
    color: 'teal'
  },
  {
    id: 'agriculture',
    name: 'Agriculture (कृषि विज्ञान)',
    hindiName: 'कृषि विज्ञान',
    code: 'AGRI',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Sprout',
    color: 'emerald'
  },
  {
    id: 'science-10',
    name: 'General Science (सामान्य विज्ञान - Class 9/10)',
    hindiName: 'विज्ञान',
    code: 'SCI',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Microscope',
    color: 'cyan'
  },
  {
    id: 'evs',
    name: 'Environmental Science (पर्यावरण विज्ञान)',
    hindiName: 'पर्यावरण विज्ञान',
    code: 'EVS',
    stream: 'science',
    categoryLabel: 'Science (विज्ञान)',
    iconName: 'Trees',
    color: 'green'
  },

  // -------------------------------------------------------------
  // 2. Commerce Stream (वाणिज्य संकाय)
  // -------------------------------------------------------------
  {
    id: 'accountancy',
    name: 'Accountancy (लेखाशास्त्र)',
    hindiName: 'लेखाशास्त्र',
    code: 'ACC',
    stream: 'commerce',
    categoryLabel: 'Commerce (वाणिज्य)',
    iconName: 'BookKey',
    color: 'rose'
  },
  {
    id: 'business-studies',
    name: 'Business Studies (व्यवसाय अध्ययन)',
    hindiName: 'व्यवसाय अध्ययन',
    code: 'BST',
    stream: 'commerce',
    categoryLabel: 'Commerce (वाणिज्य)',
    iconName: 'Briefcase',
    color: 'blue'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship (उद्यमिता / EPS)',
    hindiName: 'उद्यमिता',
    code: 'EPS',
    stream: 'commerce',
    categoryLabel: 'Commerce (वाणिज्य)',
    iconName: 'Lightbulb',
    color: 'amber'
  },
  {
    id: 'economics-com',
    name: 'Economics (अर्थशास्त्र - वाणिज्य)',
    hindiName: 'अर्थशास्त्र',
    code: 'ECO',
    stream: 'commerce',
    categoryLabel: 'Commerce (वाणिज्य)',
    iconName: 'TrendingUp',
    color: 'emerald'
  },
  {
    id: 'commercial-math',
    name: 'Commercial Mathematics (वाणिज्यिक गणित / सांख्यिकी)',
    hindiName: 'वाणिज्यिक गणित',
    code: 'CMATH',
    stream: 'commerce',
    categoryLabel: 'Commerce (वाणिज्य)',
    iconName: 'Percent',
    color: 'indigo'
  },
  {
    id: 'banking',
    name: 'Banking & Insurance (बैंकिंग एवं बीमा)',
    hindiName: 'बैंकिंग एवं बीमा',
    code: 'BNK',
    stream: 'commerce',
    categoryLabel: 'Commerce (वाणिज्य)',
    iconName: 'Landmark',
    color: 'slate'
  },

  // -------------------------------------------------------------
  // 3. Arts / Humanities Stream (कला संकाय)
  // -------------------------------------------------------------
  {
    id: 'history',
    name: 'History (इतिहास)',
    hindiName: 'इतिहास',
    code: 'HIST',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Landmark',
    color: 'amber'
  },
  {
    id: 'geography',
    name: 'Geography (भूगोल)',
    hindiName: 'भूगोल',
    code: 'GEO',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Globe',
    color: 'cyan'
  },
  {
    id: 'pol-science',
    name: 'Political Science (राजनीति विज्ञान)',
    hindiName: 'राजनीति विज्ञान',
    code: 'POL',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Scale',
    color: 'indigo'
  },
  {
    id: 'economics',
    name: 'Economics (अर्थशास्त्र - कला)',
    hindiName: 'अर्थशास्त्र',
    code: 'ECO',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'TrendingUp',
    color: 'emerald'
  },
  {
    id: 'sociology',
    name: 'Sociology (समाजशास्त्र)',
    hindiName: 'समाजशास्त्र',
    code: 'SOC',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Users',
    color: 'purple'
  },
  {
    id: 'psychology',
    name: 'Psychology (मनोविज्ञान)',
    hindiName: 'मनोविज्ञान',
    code: 'PSY',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Brain',
    color: 'pink'
  },
  {
    id: 'home-science',
    name: 'Home Science (गृह विज्ञान)',
    hindiName: 'गृह विज्ञान',
    code: 'HS',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Home',
    color: 'rose'
  },
  {
    id: 'philosophy',
    name: 'Philosophy (दर्शनशास्त्र)',
    hindiName: 'दर्शनशास्त्र',
    code: 'PHIL',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Feather',
    color: 'slate'
  },
  {
    id: 'music',
    name: 'Music (संगीत)',
    hindiName: 'संगीत',
    code: 'MUS',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Music',
    color: 'violet'
  },
  {
    id: 'fine-arts',
    name: 'Fine Arts & Painting (चित्रकला / ललित कला)',
    hindiName: 'चित्रकला',
    code: 'ARTS',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Palette',
    color: 'orange'
  },
  {
    id: 'social-science-10',
    name: 'Social Science (सामाजिक विज्ञान - Class 9/10)',
    hindiName: 'सामाजिक विज्ञान',
    code: 'SST',
    stream: 'arts',
    categoryLabel: 'Arts & Humanities (कला)',
    iconName: 'Compass',
    color: 'blue'
  },

  // -------------------------------------------------------------
  // 4. Languages (भाषा संकाय)
  // -------------------------------------------------------------
  {
    id: 'hindi',
    name: 'Hindi (हिंदी - 100 अंक)',
    hindiName: 'हिंदी',
    code: 'HIN',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'BookOpen',
    color: 'rose'
  },
  {
    id: 'english',
    name: 'English (अंग्रेज़ी - 100 Marks)',
    hindiName: 'अंग्रेज़ी',
    code: 'ENG',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'Languages',
    color: 'violet'
  },
  {
    id: 'sanskrit',
    name: 'Sanskrit (संस्कृत)',
    hindiName: 'संस्कृत',
    code: 'SANS',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'Scroll',
    color: 'amber'
  },
  {
    id: 'urdu',
    name: 'Urdu (उर्दू)',
    hindiName: 'उर्दू',
    code: 'URDU',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'BookText',
    color: 'emerald'
  },
  {
    id: 'maithili',
    name: 'Maithili (मैथिली)',
    hindiName: 'मैथिली',
    code: 'MAI',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'BookMarked',
    color: 'indigo'
  },
  {
    id: 'bhojpuri',
    name: 'Bhojpuri (भोजपुरी)',
    hindiName: 'भोजपुरी',
    code: 'BHOJ',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'BookOpenCheck',
    color: 'orange'
  },
  {
    id: 'pali',
    name: 'Pali (पालि)',
    hindiName: 'पालि',
    code: 'PALI',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'Book',
    color: 'yellow'
  },
  {
    id: 'prakrit',
    name: 'Prakrit (प्राकृत)',
    hindiName: 'प्राकृत',
    code: 'PRAK',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'Book',
    color: 'lime'
  },
  {
    id: 'persian',
    name: 'Persian (फारसी)',
    hindiName: 'फारसी',
    code: 'PERS',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'Languages',
    color: 'teal'
  },
  {
    id: 'arabic',
    name: 'Arabic (अरबी)',
    hindiName: 'अरबी',
    code: 'ARAB',
    stream: 'language',
    categoryLabel: 'Languages (भाषाएँ)',
    iconName: 'Languages',
    color: 'emerald'
  },
];

// Helper functions
export const getSubjectById = (id: string): SubjectOption | undefined => {
  return ALL_SUBJECTS.find((s) => s.id.toLowerCase() === id.toLowerCase());
};

export const getSubjectDisplayName = (id: string): string => {
  const sub = getSubjectById(id);
  if (sub) return sub.name;
  // Handle custom user-entered subject id cleanly
  return id.charAt(0).toUpperCase() + id.slice(1);
};

export const getSubjectsGroupedByStream = () => {
  const groups: { [stream: string]: { label: string; subjects: SubjectOption[] } } = {
    science: { label: '🧪 Science Stream (विज्ञान संकाय)', subjects: [] },
    commerce: { label: '📊 Commerce Stream (वाणिज्य संकाय)', subjects: [] },
    arts: { label: '🏛️ Arts & Humanities (कला संकाय)', subjects: [] },
    language: { label: '📖 Languages & Literature (भाषा संकाय)', subjects: [] },
  };

  ALL_SUBJECTS.forEach((subject) => {
    if (groups[subject.stream]) {
      groups[subject.stream].subjects.push(subject);
    }
  });

  return groups;
};
