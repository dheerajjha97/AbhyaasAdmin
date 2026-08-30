export type NoteType = 'revision' | 'comprehensive' | 'formula_sheet' | 'board_special' | 'mindmap';

export interface ParsedNoteSection {
  id: string;
  sectionNumber: number;
  heading: string;
  headingHindi?: string;
  type: 'concept' | 'summary' | 'formula' | 'important_q' | 'tips';
  content: string;
  contentHindi?: string;
  keyPoints?: string[];
}

export interface ParsedFormulaItem {
  id: string;
  title: string;
  formula: string;
  description?: string;
  chapter?: string;
}

export interface ParsedNoteResult {
  noteId: string;
  title: string;
  titleHindi?: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  chapterTitleHindi?: string;
  board: string;
  academicYear: string;
  noteType: NoteType;
  author: string;
  readTimeMinutes: number;
  tags: string[];
  keyTakeaways: string[];
  formulas: ParsedFormulaItem[];
  sections: ParsedNoteSection[];
  stats: {
    totalSections: number;
    totalFormulas: number;
    totalKeyTakeaways: number;
    wordCount: number;
    readingTime: number;
  };
}

export interface NotesMetadata {
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterNumber?: number;
  chapterTitle?: string;
  chapterTitleHindi?: string;
  board: string;
  academicYear: string;
  noteType: NoteType;
  author?: string;
}

export const SAMPLE_BIOLOGY_NOTES_TEXT = `# Chapter 3: Human Reproduction (मानव जनन)
## Complete Comprehensive Revision & Board Exam Notes
**Subject:** Biology (जीव विज्ञान) | **Class:** 12th | **Board:** BSEB / CBSE / NCERT
**Tags:** #HumanReproduction #GametoGenesis #Fertilization #Board2026 #SuperImportant

### Summary & Core Overview
Human reproduction is viviparous and sexually dimorphic. The reproductive events include gametogenesis (formation of sperms and ova), insemination, fertilization leading to formation of zygote, blastocyst development, implantation, gestation, and parturition.

### Key Takeaways
- Spermatogenesis occurs inside the seminiferous tubules of testes and produces 4 haploid functional spermatozoa from 1 primary spermatocyte.
- Oogenesis begins during embryonic development and arrests at Prophase-I (diplotene stage) until puberty.
- Ovulation occurs on approximately day 14 of a 28-day menstrual cycle, triggered by a rapid LH Surge.
- Fertilization strictly takes place at the Ampullary-isthmic junction of the Fallopian tube.
- Acrosome reaction involves hyaluronidase enzyme dissolving the corona radiata and zona pellucida.
- Implantation occurs approximately on day 7 at the blastocyst stage into the endometrial lining of the uterus.

### Key Formulas & Scientific Ratios
[Formula: Primary Spermatocyte Yield]
1 Primary Spermatocyte (2n) -> 2 Secondary Spermatocytes (n) -> 4 Spermatids -> 4 Functional Spermatozoa (100% yield)

[Formula: Primary Oocyte Yield]
1 Primary Oocyte (2n) -> 1 Secondary Oocyte (n) + 1st Polar Body -> 1 Functional Ovum (n) + 2nd Polar Body (25% functional yield)

[Formula: Normal Semen Profile]
Ejaculate Volume = 2.5 - 5.0 mL | Sperm Count = 200 - 300 Million (Min 60% normal shape, Min 40% vigorous motility)

### Section 1: Male Reproductive System (नर जनन तंत्र)
The male reproductive system consists of primary sex organs (testes) located outside the abdominal cavity in the scrotum to maintain 2-2.5°C lower temperature required for spermatogenesis.
- **Seminiferous Tubules**: Contain Spermatogenic cells and Sertoli (nurse) cells providing nutrition.
- **Leydig Cells**: Present in interstitial spaces; synthesize and secrete Androgens (Testosterone).
- **Accessory Ducts**: Rete testis -> Vasa efferentia -> Epididymis (sperm storage & maturation) -> Vas deferens -> Urethra.
- **Accessory Glands**: Seminal vesicles (produce fructose & prostaglandins), Prostate gland (alkaline fluid), and Bulbourethral (Cowper's) glands (lubrication).

### Section 2: Female Reproductive System (मादा जनन तंत्र)
Consists of a pair of ovaries, oviducts (Fallopian tubes), uterus (womb), cervix, vagina, and external genitalia (vulva).
- **Fallopian Tube Parts**: Infundibulum with fimbriae (catches ovum) -> Ampulla (site of fertilization) -> Isthmus (connects to uterus).
- **Uterine Wall Layers**:
  1. Perimetrium: Thin external membranous layer.
  2. Myometrium: Thick middle muscular layer exhibiting strong contractions during parturition.
  3. Endometrium: Inner glandular layer undergoing cyclical changes during the menstrual cycle.

### Section 3: Menstrual Cycle & Hormonal Regulation (आर्तव चक्र)
- **Menstrual Phase (Days 1-5)**: Breakdown of endometrial lining due to progesterone drop; bleeding occurs.
- **Follicular / Proliferative Phase (Days 6-13)**: FSH and Estrogen stimulate follicle maturation and uterine regeneration.
- **Ovulatory Phase (Day 14)**: High levels of LH (LH Surge) induce rupture of Graafian follicle and release of secondary oocyte.
- **Luteal / Secretory Phase (Days 15-28)**: Ruptured follicle converts into Corpus Luteum, secreting high Progesterone to maintain pregnancy.

### Section 4: High-Yield Board Exam Questions & Tips
- **Q1 (5 Marks)**: Describe the process of Spermatogenesis with a schematic diagram.
- **Q2 (2 Marks)**: Why are testes situated outside the abdominal cavity? (Answer: To maintain optimal temperature 2–2.5°C below core body temperature).
- **Q3 (2 Marks)**: State the function of Placenta and its endocrine role (secretes hCG, hPL, Estrogen, and Progesterone).
`;

export const SAMPLE_PHYSICS_NOTES_TEXT = `# Chapter 1: Electrostatics & Gauss's Law (स्थिर वैद्युतिकी एवं गाउस का नियम)
## Board Master Formula & Quick Revision Sheet
**Subject:** Physics (भौतिक विज्ञान) | **Class:** 12th | **Board:** BSEB / CBSE / State Boards
**Tags:** #Electrostatics #GaussLaw #CoulombsLaw #ElectricField #PhysicsFormulas

### Summary & Core Overview
Electrostatics deals with static electric charges, electric fields, potentials, and flux. Electric charge is quantized, conserved, and additive. Gauss's Law simplifies electric field calculations for highly symmetric charge distributions.

### Key Takeaways
- Charge is quantized: Q = ±ne, where e = 1.6 × 10⁻¹⁹ C.
- Coulomb's Law gives electrostatic force in vacuum: F = (1/4πε₀) * (q₁q₂ / r²), where 1/4πε₀ = 9 × 10⁹ N·m²/C².
- Electric field inside a conductor in electrostatic equilibrium is always zero (E = 0).
- Electric potential on an equipotential surface is constant, and electric field lines are always perpendicular to it.
- Gauss's Law states that total electric flux through a closed surface is equal to 1/ε₀ times the total net enclosed charge.

### Key Formulas & Scientific Ratios
[Formula: Coulomb's Force]
F = (1 / 4πε₀) * (|q₁·q₂| / r²) = 9 × 10⁹ * (|q₁·q₂| / r²) [N]

[Formula: Gauss's Law Flux]
Φ = ∮ E · dA = Q_enclosed / ε₀ [N·m²/C]

[Formula: Field due to Infinite Line Charge]
E = λ / (2πε₀·r) = (2kλ) / r [N/C]

[Formula: Field due to Infinite Uniform Charged Plane Sheet]
E = σ / (2ε₀) [N/C] (Independent of distance r)

[Formula: Electric Potential Energy]
U = (1 / 4πε₀) * (q₁·q₂ / r) [Joules]

[Formula: Capacitance of Parallel Plate Capacitor]
C = (K · ε₀ · A) / d [Farads]

### Section 1: Electric Charges & Coulomb's Law
- **Conservation of Charge**: Total electric charge of an isolated system remains constant in all physical processes.
- **Quantization of Charge**: Charge exists in discrete packets of elementary charge: Q = ne (n = 0, ±1, ±2...).
- **Vector Form of Coulomb's Law**: F₁₂ = -F₂₁ (obeys Newton's Third Law).
- **Dielectric Constant (Relative Permittivity)**: K = εᵣ = ε / ε₀ = F_vacuum / F_medium.

### Section 2: Electric Field & Electric Dipole
- Electric field intensity E = F / q₀ (unit: N/C or V/m).
- Electric Dipole Moment: p = q × 2a (directed from negative charge -q to positive charge +q).
- Electric Field on Axial Line of Dipole: E_axial = (1/4πε₀) * (2pr / (r² - a²)²) ≈ 2kp / r³.
- Electric Field on Equatorial Line: E_equatorial = (1/4πε₀) * (p / (r² + a²)^(3/2)) ≈ kp / r³.
- Torque on Dipole in Uniform Field: τ = p × E = pE sinθ.
- Potential Energy of Dipole: U = -p · E = -pE cosθ.

### Section 3: Gauss's Law and Its Applications
Gauss's theorem is valid for any closed Gaussian surface enclosing net charge Q.
1. **Infinitely Long Charged Wire**: Choose a cylindrical Gaussian surface. Flux through curved surface gives E = λ / (2πε₀r).
2. **Infinite Sheet of Charge**: Choose pillbox cylinder. E = σ / (2ε₀).
3. **Thin Spherical Conducting Shell**:
   - Outside (r > R): E = Q / (4πε₀r²).
   - On surface (r = R): E = Q / (4πε₀R²).
   - Inside (r < R): E = 0 (Electrostatic Shielding).

### Section 4: Super 10 Must-Revise Board Questions
- Derive expression for electric field due to an electric dipole at an axial point.
- State and prove Gauss's theorem in electrostatics.
- Explain why two electric field lines can never cross each other.
- Calculate work done in rotating a dipole from angle θ₁ to θ₂ in a uniform electric field.
`;

export function parseNotesContent(rawText: string, metadata: NotesMetadata): ParsedNoteResult {
  const lines = rawText.split('\n');
  let title = `${metadata.className} ${metadata.subjectName} Revision Notes`;
  let titleHindi: string | undefined;
  const tags: string[] = [];
  const keyTakeaways: string[] = [];
  const formulas: ParsedFormulaItem[] = [];
  const sections: ParsedNoteSection[] = [];

  let currentSection: Partial<ParsedNoteSection> | null = null;
  let sectionIndex = 1;
  let inFormulaBlock = false;
  let currentFormulaTitle = '';
  let currentFormulaText = '';

  let mode: 'header' | 'takeaways' | 'formulas' | 'section' = 'header';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) {
      if (currentSection && currentSection.content) {
        currentSection.content += '\n\n';
      }
      continue;
    }

    // 1. Title matching: # Chapter X: Title
    if (line.startsWith('# ') && !title.includes('Chapter')) {
      const titleClean = line.replace(/^#\s+/, '').trim();
      title = titleClean;
      // Check for Hindi brackets e.g. Human Reproduction (मानव जनन)
      const hindiMatch = titleClean.match(/\(([\u0900-\u097F\s]+)\)/);
      if (hindiMatch) {
        titleHindi = hindiMatch[1].trim();
      }
      continue;
    }

    // 2. Tags extraction e.g. **Tags:** #Tag1 #Tag2
    if (line.toLowerCase().includes('tags:') || line.startsWith('#') && line.includes('#')) {
      const tagMatches = line.match(/#[\w\u0900-\u097F]+/g);
      if (tagMatches) {
        tagMatches.forEach((t) => {
          const cleanTag = t.replace('#', '').trim();
          if (cleanTag && !tags.includes(cleanTag)) {
            tags.push(cleanTag);
          }
        });
      }
    }

    // 3. Section / Subtitle Headers: ### Key Takeaways, ### Formulas, ### Section X
    if (line.startsWith('### ')) {
      // Save previous section if exists
      if (currentSection && currentSection.heading) {
        sections.push({
          id: currentSection.id || `sec-${sections.length + 1}`,
          sectionNumber: sections.length + 1,
          heading: currentSection.heading,
          headingHindi: currentSection.headingHindi,
          type: currentSection.type || 'concept',
          content: (currentSection.content || '').trim(),
          keyPoints: currentSection.keyPoints || [],
        });
        currentSection = null;
      }

      const headingText = line.replace(/^###\s+/, '').trim();
      const lowerHeading = headingText.toLowerCase();

      if (lowerHeading.includes('takeaway') || lowerHeading.includes('key points') || lowerHeading.includes('मुख्य बिंदु')) {
        mode = 'takeaways';
        continue;
      } else if (lowerHeading.includes('formula') || lowerHeading.includes('सूत्र') || lowerHeading.includes('equation')) {
        mode = 'formulas';
        continue;
      } else {
        mode = 'section';
        const hindiMatch = headingText.match(/\(([\u0900-\u097F\s]+)\)/);
        let secType: ParsedNoteSection['type'] = 'concept';
        if (lowerHeading.includes('question') || lowerHeading.includes('प्रश्न') || lowerHeading.includes('board')) {
          secType = 'important_q';
        } else if (lowerHeading.includes('summary') || lowerHeading.includes('सारांश')) {
          secType = 'summary';
        } else if (lowerHeading.includes('tip') || lowerHeading.includes('trick')) {
          secType = 'tips';
        }

        currentSection = {
          id: `sec-${sectionIndex++}`,
          sectionNumber: sectionIndex - 1,
          heading: headingText,
          headingHindi: hindiMatch ? hindiMatch[1].trim() : undefined,
          type: secType,
          content: '',
          keyPoints: [],
        };
        continue;
      }
    }

    // 4. Handle Takeaways Mode
    if (mode === 'takeaways') {
      if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s+/.test(line)) {
        const point = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
        if (point) keyTakeaways.push(point);
        continue;
      }
    }

    // 5. Handle Formula Mode
    if (mode === 'formulas') {
      if (line.startsWith('[Formula:') || line.startsWith('[सूत्र:')) {
        currentFormulaTitle = line.replace(/^\[(Formula|सूत्र):\s*/, '').replace(/\]$/, '').trim();
        inFormulaBlock = true;
        currentFormulaText = '';
        continue;
      } else if (inFormulaBlock) {
        if (line.startsWith('[') && line.endsWith(']')) {
          inFormulaBlock = false;
        } else {
          currentFormulaText = line;
          formulas.push({
            id: `f-${formulas.length + 1}`,
            title: currentFormulaTitle || `Formula ${formulas.length + 1}`,
            formula: currentFormulaText,
            chapter: metadata.chapterTitle,
          });
          inFormulaBlock = false;
          continue;
        }
      } else if (line.startsWith('- ') || line.includes('=')) {
        formulas.push({
          id: `f-${formulas.length + 1}`,
          title: `Equation ${formulas.length + 1}`,
          formula: line.replace(/^[-*]\s+/, ''),
          chapter: metadata.chapterTitle,
        });
        continue;
      }
    }

    // 6. Handle Standard Section Content Mode
    if (mode === 'section' && currentSection) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const pt = line.replace(/^[-*]\s+/, '').trim();
        if (!currentSection.keyPoints) currentSection.keyPoints = [];
        currentSection.keyPoints.push(pt);
      }
      currentSection.content = (currentSection.content ? currentSection.content + '\n' : '') + rawLine;
    } else if (mode === 'header') {
      // Collect initial summary paragraph
      if (!line.startsWith('#') && !line.startsWith('**')) {
        if (!currentSection) {
          currentSection = {
            id: 'sec-overview',
            sectionNumber: 1,
            heading: 'Chapter Overview & Summary',
            headingHindi: 'अध्याय का संक्षिप्त परिचय',
            type: 'summary',
            content: rawLine,
            keyPoints: [],
          };
          mode = 'section';
        }
      }
    }
  }

  // Push last section
  if (currentSection && currentSection.heading) {
    sections.push({
      id: currentSection.id || `sec-${sections.length + 1}`,
      sectionNumber: sections.length + 1,
      heading: currentSection.heading,
      headingHindi: currentSection.headingHindi,
      type: currentSection.type || 'concept',
      content: (currentSection.content || '').trim(),
      keyPoints: currentSection.keyPoints || [],
    });
  }

  // Default tags if none found
  if (tags.length === 0) {
    tags.push(metadata.subjectName, metadata.className, 'RevisionNotes', 'Board2026');
  }

  // Calculate word count & estimated read time
  const totalWords = rawText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(2, Math.ceil(totalWords / 180));

  const noteId = `note-${metadata.classId}-${metadata.subjectId}-ch${metadata.chapterNumber || 1}-${Date.now().toString().slice(-4)}`;

  return {
    noteId,
    title,
    titleHindi,
    classId: metadata.classId,
    className: metadata.className,
    subjectId: metadata.subjectId,
    subjectName: metadata.subjectName,
    chapterId: metadata.chapterNumber ? `chap-${metadata.chapterNumber}` : undefined,
    chapterNumber: metadata.chapterNumber || 1,
    chapterTitle: metadata.chapterTitle || 'Chapter Notes',
    chapterTitleHindi: metadata.chapterTitleHindi,
    board: metadata.board,
    academicYear: metadata.academicYear,
    noteType: metadata.noteType,
    author: metadata.author || 'Abhyaas Subject Experts',
    readTimeMinutes: readingTime,
    tags,
    keyTakeaways,
    formulas,
    sections,
    stats: {
      totalSections: sections.length,
      totalFormulas: formulas.length,
      totalKeyTakeaways: keyTakeaways.length,
      wordCount: totalWords,
      readingTime,
    },
  };
}
