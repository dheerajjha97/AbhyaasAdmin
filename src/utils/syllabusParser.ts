import { Chapter, Topic } from '../types';

export interface ParsedSyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  hindiTitle?: string;
  marksWeightage?: number;
  chapters: ParsedSyllabusChapter[];
}

export interface ParsedSyllabusChapter {
  id: string;
  chapterNumber: number;
  unitNumber?: number;
  unitTitle?: string;
  title: string;
  hindiTitle?: string;
  marksWeightage?: number;
  periods?: number;
  topics: ParsedSyllabusTopic[];
}

export interface ParsedSyllabusTopic {
  id: string;
  topicNumber?: string;
  title: string;
  hindiTitle?: string;
  completed?: boolean;
  order: number;
  subtopics?: string[];
}

export interface ParsedSyllabusResult {
  syllabusId: string;
  title: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  board: string;
  academicYear: string;
  totalMarks: number;
  stream?: string;
  units: ParsedSyllabusUnit[];
  chapters: ParsedSyllabusChapter[];
  stats: {
    totalUnits: number;
    totalChapters: number;
    totalTopics: number;
    totalMarks: number;
  };
}

export interface SyllabusMetadata {
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  board: string;
  academicYear: string;
  stream?: string;
  totalMarks?: number;
}

// Sample Class 12 Biology Comprehensive Syllabus
export const SAMPLE_BIOLOGY_SYLLABUS_TEXT = `
# BIOLOGY (जीव विज्ञान) - CLASS 12 SYLLABUS (2025-2026)
# Board: Bihar School Examination Board (BSEB) & CBSE / NCERT
# Total Marks: 70 Theory + 30 Practical

UNIT VI: REPRODUCTION (जनन) [14 Marks]
Chapter 1: Reproduction in Organisms (जीवों में जनन) [4 Marks]
- Asexual reproduction: Binary fission, sporulation, budding, gemmule, fragmentation; vegetative propagation in plants.
- Sexual reproduction in organisms: Pre-fertilization events, Gametogenesis, Gamete transfer, Fertilization (Syngamy), Post-fertilization events, Embryogenesis.

Chapter 2: Sexual Reproduction in Flowering Plants (पुष्पी पादपों में लैंगिक जनन) [5 Marks]
- Flower structure and development of male and female gametophytes.
- Pollination: Types, agencies and examples; Outbreeding devices; Pollen-Pistil interaction.
- Double fertilization; Post fertilization events: Development of endosperm and embryo, development of seed and formation of fruit.
- Special modes: Apomixis, Parthenocarpy, Polyembryony; Significance of seed and fruit formation.

Chapter 3: Human Reproduction (मानव जनन) [5 Marks]
- Male and female reproductive systems; Microscopic anatomy of testis and ovary.
- Gametogenesis: Spermatogenesis & Oogenesis; Menstrual cycle.
- Fertilization, embryo development up to blastocyst formation, implantation; Pregnancy and placenta formation; Parturition and Lactation.

Chapter 4: Reproductive Health (जनन स्वास्थ्य) [4 Marks]
- Need for reproductive health and prevention of sexually transmitted diseases (STDs).
- Birth control methods: Contraception and Medical Termination of Pregnancy (MTP).
- Amniocentesis; Infertility and assisted reproductive technologies (ART): IVF, ZIFT, GIFT.

UNIT VII: GENETICS AND EVOLUTION (आनुवंशिकी तथा विकास) [18 Marks]
Chapter 5: Principles of Inheritance and Variation (वंशागति तथा विविधता के सिद्धांत) [7 Marks]
- Mendelian Inheritance; Deviations from Mendelism: Incomplete dominance, Co-dominance, Multiple alleles and Inheritance of blood groups, Pleiotropy.
- Chromosome theory of inheritance; Chromosomes and genes; Sex determination in humans, birds, honey bee.
- Linkage and crossing over; Sex linked inheritance: Haemophilia, Colour blindness; Mendelian disorders in humans: Thalassemia, Sickle cell anaemia, Phenylketonuria; Chromosomal disorders: Down's syndrome, Turner's and Klinefelter's syndromes.

Chapter 6: Molecular Basis of Inheritance (वंशागति के आण्विक आधार) [7 Marks]
- Search for genetic material and DNA as genetic material; Structure of DNA and RNA; DNA packaging.
- DNA replication; Central dogma; Transcription, genetic code, translation; Gene expression and regulation (Lac Operon).
- Human Genome Project (HGP); DNA finger printing.

Chapter 7: Evolution (विकास) [4 Marks]
- Origin of life; Biological evolution and evidences for biological evolution from Paleontology, comparative anatomy, embryology and molecular evidence.
- Darwin's contribution, Modern Synthetic theory of Evolution; Mechanism of evolution: Variation (Mutation and Recombination) and Natural Selection.
- Types of natural selection; Gene flow and genetic drift; Hardy-Weinberg's principle; Adaptive Radiation; Human evolution.

UNIT VIII: BIOLOGY AND HUMAN WELFARE (मानव कल्याण में जीव विज्ञान) [14 Marks]
Chapter 8: Human Health and Disease (मानव स्वास्थ्य तथा रोग) [7 Marks]
- Pathogens; Parasites causing human diseases (Malaria, Filariasis, Ascariasis, Typhoid, Pneumonia, Common cold, Amoebiasis, Ring worm) and their control.
- Basic concepts of immunology: Vaccines; Cancer, HIV and AIDS.
- Adolescence, drug and alcohol abuse.

Chapter 9: Strategies for Enhancement in Food Production (खाद्य उत्पादन में वृद्धि की कार्यनीति) [3 Marks]
- Animal husbandry: Dairy farm management, Poultry farm management, Apiculture, Fisheries.
- Plant breeding: Tissue culture, Single cell protein, Biofortification.

Chapter 10: Microbes in Human Welfare (मानव कल्याण में सूक्ष्मजीव) [4 Marks]
- In household food processing, industrial production, sewage treatment, energy generation (biogas production).
- As biocontrol agents and biofertilizers; Antibiotics; production and judicious use.

UNIT IX: BIOTECHNOLOGY AND ITS APPLICATIONS (जैव प्रौद्योगिकी) [10 Marks]
Chapter 11: Biotechnology - Principles and Processes (जैव प्रौद्योगिकी - सिद्धांत व प्रक्रम) [5 Marks]
- Genetic engineering: Recombinant DNA technology, Restriction enzymes, Cloning vectors (pBR322), PCR, Gel electrophoresis, Bioreactors.
- Insertion of recombinant DNA into the host cell.

Chapter 12: Biotechnology and its Applications (जैव प्रौद्योगिकी एवं उसके उपयोग) [5 Marks]
- Applications of Biotechnology in health and agriculture: Human insulin and vaccine production, Gene therapy; Genetically modified organisms (Bt crops, Transgenic animals).
- Biosafety issues, Biopiracy and patents.

UNIT X: ECOLOGY AND ENVIRONMENT (पारिस्थितिकी एवं पर्यावरण) [14 Marks]
Chapter 13: Organisms and Populations (जीव और समष्टियाँ) [4 Marks]
- Organisms and environment: Habitat and niche; Population and ecological adaptations; Population interactions: Mutualism, Competition, Predation, Parasitism; Population attributes: Growth, birth rate and death rate, age distribution.

Chapter 14: Ecosystem (पारितंत्र) [4 Marks]
- Ecosystems: Patterns, components; Productivity and decomposition; Energy flow; Pyramids of number, biomass, energy; Nutrient cycling (Carbon and Phosphorous).
- Ecological succession; Ecological Services: Carbon fixation, pollination, oxygen release.

Chapter 15: Biodiversity and its Conservation (जैव विविधता एवं संरक्षण) [4 Marks]
- Concept of Biodiversity; Patterns of Biodiversity; Importance of Biodiversity; Loss of Biodiversity; Biodiversity conservation: Hotspots, endangered organisms, extinction, Red Data Book, Sacred Groves, Biosphere reserves, National parks and sanctuaries.

Chapter 16: Environmental Issues (पर्यावरण के मुद्दे) [2 Marks]
- Air pollution and its control; Water pollution and its control; Agrochemicals and their effects; Solid waste management; Radioactive waste management; Greenhouse effect and climate change; Ozone depletion; Deforestation.
`;

// Sample Class 12 Physics Syllabus
export const SAMPLE_PHYSICS_SYLLABUS_TEXT = `
# PHYSICS (भौतिक विज्ञान) - CLASS 12 SYLLABUS (2025-2026)
# Total Marks: 70 Theory + 30 Practical

UNIT 1: ELECTROSTATICS (स्थिर वैद्युतिकी) [8 Marks]
Chapter 1: Electric Charges and Fields (वैद्युत आवेश तथा क्षेत्र) [4 Marks]
- Electric charges, Conservation of charge, Coulomb's law force between two point charges, forces between multiple charges; superposition principle and continuous charge distribution.
- Electric field, Electric field due to a point charge, Electric field lines, Electric dipole, Electric field due to a dipole, Torque on a dipole in uniform electric field.
- Electric flux, Statement of Gauss's theorem and its applications to find field due to infinitely long straight wire, uniformly charged infinite plane sheet and uniformly charged thin spherical shell.

Chapter 2: Electrostatic Potential and Capacitance (स्थिर वैद्युत विभव तथा धारिता) [4 Marks]
- Electric potential, Potential difference, Electric potential due to a point charge, a dipole and system of charges; Equipotential surfaces, Electrical potential energy of a system of two point charges and of electric dipole in an electrostatic field.
- Conductors and insulators, Free charges and bound charges inside a conductor. Dielectrics and electric polarisation, Capacitors and capacitance, Combination of capacitors in series and in parallel, Capacitance of a parallel plate capacitor with and without dielectric medium between the plates, Energy stored in a capacitor.

UNIT 2: CURRENT ELECTRICITY (धारा वैद्युतिकी) [7 Marks]
Chapter 3: Current Electricity (विद्युत धारा) [7 Marks]
- Electric current, Flow of electric charges in a metallic conductor, Drift velocity, Mobility and their relation with electric current; Ohm's law, V-I characteristics (linear and non-linear), Electrical energy and power, Electrical resistivity and conductivity.
- Temperature dependence of resistance; Internal resistance of a cell, Potential difference and emf of a cell, Combination of cells in series and in parallel, Kirchhoff's rules and simple applications, Wheatstone bridge.

UNIT 3: MAGNETIC EFFECTS OF CURRENT AND MAGNETISM (धारा के चुम्बकीय प्रभाव तथा चुम्बकत्व) [8 Marks]
Chapter 4: Moving Charges and Magnetism (गतिमान आवेश और चुम्बकत्व) [4 Marks]
- Concept of magnetic field, Oersted's experiment; Biot-Savart law and its application to current carrying circular loop; Ampere's law and its applications to infinitely long straight wire, Straight solenoid.
- Force on a moving charge in uniform magnetic and electric fields; Force on a current-carrying conductor in a uniform magnetic field; Force between two parallel current-carrying conductors - definition of ampere.
- Torque experienced by a current loop in uniform magnetic field; Moving coil galvanometer - its current sensitivity and conversion to ammeter and voltmeter.

Chapter 5: Magnetism and Matter (चुम्बकत्व एवं द्रव्य) [4 Marks]
- Bar magnet, Bar magnet as an equivalent solenoid, Magnetic field lines; Earth's magnetic field and magnetic elements; Diamagnetic, Paramagnetic and Ferromagnetic substances with examples, Electromagnets and factors affecting their strengths, Permanent magnets.

UNIT 4: ELECTROMAGNETIC INDUCTION AND ALTERNATING CURRENTS (वैद्युतचुम्बकीय प्रेरण तथा प्रत्यावर्ती धाराएं) [8 Marks]
Chapter 6: Electromagnetic Induction (वैद्युतचुम्बकीय प्रेरण) [4 Marks]
- Electromagnetic induction; Faraday's laws, Induced EMF and current; Lenz's Law, Eddy currents; Self and mutual induction.

Chapter 7: Alternating Current (प्रत्यावर्ती धारा) [4 Marks]
- Alternating currents, Peak and RMS value of alternating current/voltage; Reactance and impedance; LC oscillations, LCR series circuit, Resonance; Power in AC circuits, Wattless current; AC generator and transformer.

UNIT 5: OPTICS (प्रकाशिकी) [14 Marks]
Chapter 8: Ray Optics and Optical Instruments (किरण प्रकाशिकी एवं प्रकाशिक यंत्र) [7 Marks]
- Reflection of light, Spherical mirrors, Mirror formula; Refraction of light, Total internal reflection and its optical applications, Optical fibers, Refraction at spherical surfaces, Lenses, Thin lens formula, Lensmaker's formula, Magnification, Power of a lens, Combination of thin lenses in contact, Refraction through a prism.
- Optical instruments: Microscopes and astronomical telescopes (reflecting and refracting) and their magnifying powers.

Chapter 9: Wave Optics (तरंग प्रकाशिकी) [7 Marks]
- Wave front and Huygens' principle, Reflection and refraction of plane wave at a plane surface using wave fronts; Proof of laws of reflection and refraction using Huygens' principle.
- Interference, Young's double slit experiment and expression for fringe width, Coherent sources and sustained interference of light; Diffraction due to a single slit, Width of central maxima.
`;

// Smart Syllabus Parser Engine
export function parseSyllabusContent(
  rawText: string,
  meta: SyllabusMetadata
): ParsedSyllabusResult {
  const lines = rawText.split('\n');
  const units: ParsedSyllabusUnit[] = [];
  const allChapters: ParsedSyllabusChapter[] = [];

  let currentUnit: ParsedSyllabusUnit | null = null;
  let currentChapter: ParsedSyllabusChapter | null = null;
  let unitCounter = 0;
  let chapterCounter = 0;
  let topicCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      // Check if line contains title/header
      continue;
    }

    // 1. Detect Unit Header
    // Examples: "UNIT VI: REPRODUCTION [14 Marks]", "UNIT 1: ELECTROSTATICS", "इकाई 1: स्थिर वैद्युतिकी"
    const unitMatch = trimmed.match(
      /^(?:UNIT|इकाई)\s*([IVXLCDM\d]+)[:.\-–\s]+([^[(\n]+)(?:\[(\d+)\s*(?:Marks|अंक)?\])?/i
    );

    if (unitMatch) {
      unitCounter++;
      const unitNumStr = unitMatch[1];
      let unitNum = parseInt(unitNumStr, 10);
      if (isNaN(unitNum)) {
        // Roman numeral to number converter
        unitNum = romanToNumber(unitNumStr) || unitCounter;
      }

      const unitTitleRaw = unitMatch[2].trim();
      const marks = unitMatch[3] ? parseInt(unitMatch[3], 10) : undefined;
      const { english, hindi } = splitBilingual(unitTitleRaw);

      currentUnit = {
        id: `unit-${unitNum}`,
        unitNumber: unitNum,
        title: english || unitTitleRaw,
        hindiTitle: hindi,
        marksWeightage: marks,
        chapters: [],
      };
      units.push(currentUnit);
      continue;
    }

    // 2. Detect Chapter Header
    // Examples: "Chapter 1: Reproduction in Organisms (जीवों में जनन) [4 Marks]", "अध्याय 1: ...", "1. Reproduction..."
    const chapterMatch = trimmed.match(
      /^(?:Chapter|अध्याय|Chap|Ch\.)?\s*(\d+)[:.\-–\s]+([^[(\n]+(?:\([^)]+\))?)(?:\[(\d+)\s*(?:Marks|अंक|Periods)?\])?/i
    );

    const isExplicitChapter =
      /^(?:Chapter|अध्याय|Chap|Ch\.)/i.test(trimmed) ||
      (/^\d+\.\s+[A-Z\u0900-\u097F]/.test(trimmed) && !trimmed.startsWith('-') && !trimmed.startsWith('•'));

    if (chapterMatch && (isExplicitChapter || !currentChapter)) {
      chapterCounter++;
      const chapNum = parseInt(chapterMatch[1], 10) || chapterCounter;
      const chapTitleRaw = chapterMatch[2].trim();
      const marks = chapterMatch[3] ? parseInt(chapterMatch[3], 10) : undefined;
      const { english, hindi } = splitBilingual(chapTitleRaw);

      currentChapter = {
        id: `chap-${meta.subjectId}-${chapNum}`,
        chapterNumber: chapNum,
        unitNumber: currentUnit?.unitNumber,
        unitTitle: currentUnit?.title,
        title: english || chapTitleRaw,
        hindiTitle: hindi,
        marksWeightage: marks,
        topics: [],
      };

      allChapters.push(currentChapter);
      if (currentUnit) {
        currentUnit.chapters.push(currentChapter);
      } else {
        // Create an implicit default unit if none was declared
        if (units.length === 0) {
          currentUnit = {
            id: 'unit-1',
            unitNumber: 1,
            title: `${meta.subjectName} Core Units`,
            chapters: [currentChapter],
          };
          units.push(currentUnit);
        } else {
          units[units.length - 1].chapters.push(currentChapter);
        }
      }
      continue;
    }

    // 3. Detect Topic / Subtopic line
    // Examples: "- Asexual reproduction: Binary fission...", "• Pollination: Types...", "1.1 Electric Charges"
    if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || /^\d+\.\d+/.test(trimmed)) {
      if (!currentChapter) {
        // Create initial chapter if topics listed before chapter header
        chapterCounter++;
        currentChapter = {
          id: `chap-${meta.subjectId}-${chapterCounter}`,
          chapterNumber: chapterCounter,
          title: `Chapter ${chapterCounter}`,
          topics: [],
        };
        allChapters.push(currentChapter);
        if (units.length === 0) {
          currentUnit = {
            id: 'unit-1',
            unitNumber: 1,
            title: 'General Syllabus',
            chapters: [currentChapter],
          };
          units.push(currentUnit);
        } else {
          units[units.length - 1].chapters.push(currentChapter);
        }
      }

      topicCounter++;
      const cleanTopic = trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+\.\d+\s*/, '').trim();
      const { english, hindi } = splitBilingual(cleanTopic);

      // Check sub-topics if delimited by semicolons or colons
      const subtopics: string[] = [];
      if (cleanTopic.includes(':')) {
        const parts = cleanTopic.split(':');
        if (parts[1]) {
          parts[1].split(';').forEach((s) => {
            const st = s.trim();
            if (st) subtopics.push(st);
          });
        }
      }

      const topicObj: ParsedSyllabusTopic = {
        id: `topic-${currentChapter.chapterNumber}-${currentChapter.topics.length + 1}`,
        topicNumber: `${currentChapter.chapterNumber}.${currentChapter.topics.length + 1}`,
        title: english || cleanTopic,
        hindiTitle: hindi,
        completed: false,
        order: currentChapter.topics.length + 1,
        subtopics: subtopics.length > 0 ? subtopics : undefined,
      };

      currentChapter.topics.push(topicObj);
    }
  }

  // Calculate stats
  const totalUnits = units.length;
  const totalChapters = allChapters.length;
  let totalTopics = 0;
  let calculatedMarks = 0;

  allChapters.forEach((ch) => {
    totalTopics += ch.topics.length;
    if (ch.marksWeightage) {
      calculatedMarks += ch.marksWeightage;
    }
  });

  const finalTotalMarks = meta.totalMarks || (calculatedMarks > 0 ? calculatedMarks : 70);

  return {
    syllabusId: `syllabus-${meta.classId}-${meta.subjectId}-${meta.academicYear.replace(/[^0-9]/g, '')}`,
    title: `${meta.className} ${meta.subjectName} Syllabus (${meta.academicYear})`,
    classId: meta.classId,
    className: meta.className,
    subjectId: meta.subjectId,
    subjectName: meta.subjectName,
    board: meta.board,
    academicYear: meta.academicYear,
    totalMarks: finalTotalMarks,
    stream: meta.stream,
    units,
    chapters: allChapters,
    stats: {
      totalUnits,
      totalChapters,
      totalTopics,
      totalMarks: finalTotalMarks,
    },
  };
}

// Helper: Split bilingual string like "Reproduction in Organisms (जीवों में जनन)"
function splitBilingual(text: string): { english: string; hindi?: string } {
  const parenMatch = text.match(/^([^(]+)\(([^)]+)\)$/);
  if (parenMatch) {
    const part1 = parenMatch[1].trim();
    const part2 = parenMatch[2].trim();

    // Check which one contains Devanagari script (\u0900-\u097F)
    const isHindi2 = /[\u0900-\u097F]/.test(part2);
    const isHindi1 = /[\u0900-\u097F]/.test(part1);

    if (isHindi2 && !isHindi1) {
      return { english: part1, hindi: part2 };
    }
    if (isHindi1 && !isHindi2) {
      return { english: part2, hindi: part1 };
    }
  }

  // If entire string is Hindi
  if (/^[\u0900-\u097F\s,.:\-–]+$/.test(text)) {
    return { english: text, hindi: text };
  }

  return { english: text };
}

// Roman numeral to Integer helper
function romanToNumber(roman: string): number | null {
  const romanMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 100,
  };
  const upper = roman.toUpperCase();
  let total = 0;
  for (let i = 0; i < upper.length; i++) {
    const current = romanMap[upper[i]];
    const next = romanMap[upper[i + 1]];
    if (!current) return null;
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total > 0 ? total : null;
}
