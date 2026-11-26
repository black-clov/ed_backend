/**
 * Shared vocabulary for offer ↔ young-person matching.
 *
 * The app stores skills as fixed Arabic labels (SkillsService catalog) and
 * needs as fixed keys (NeedsService options), while admins used to type free
 * French text on offers. Everything is mapped to the same canonical tag ids
 * here, so old free-text offers keep matching and new offers use checkboxes.
 */

export interface Tag {
  id: string;
  fr: string;
  ar: string;
  /** Lower-case, accent-free terms that mean this tag (FR/AR/EN). */
  synonyms: string[];
}

export const SKILL_TAGS: Tag[] = [
  {
    id: 'communication', fr: 'Communication', ar: 'التواصل',
    synonyms: ['communication', 'communiquer', 'relation client', 'service client', 'accueil', 'oral', 'مهارات التواصل', 'التواصل'],
  },
  {
    id: 'digital', fr: 'Compétences numériques', ar: 'المهارات الرقمية',
    synonyms: ['numerique', 'digital', 'informatique', 'bureautique', 'excel', 'word', 'internet', 'reseaux sociaux', 'marketing digital', 'ordinateur', 'المهارات الرقمية', 'رقمية'],
  },
  {
    id: 'technical', fr: 'Compétences techniques / manuelles', ar: 'المهارات التقنية/اليدوية',
    synonyms: ['technique', 'manuel', 'manuelle', 'mecanique', 'electricite', 'maintenance', 'plomberie', 'menuiserie', 'soudure', 'المهارات التقنية/اليدوية', 'تقنية', 'يدوية'],
  },
  {
    id: 'teamwork', fr: 'Travail en équipe', ar: 'العمل الجماعي',
    synonyms: ['equipe', 'travail en equipe', 'collaboration', 'cooperation', 'teamwork', 'العمل الجماعي'],
  },
  {
    id: 'time', fr: 'Gestion du temps', ar: 'إدارة الوقت',
    synonyms: ['gestion du temps', 'organisation', 'organise', 'ponctualite', 'rigueur', 'planification', 'إدارة الوقت'],
  },
  {
    id: 'creativity', fr: 'Créativité', ar: 'الإبداع',
    synonyms: ['creativite', 'creatif', 'creative', 'design', 'creation', 'graphisme', 'الإبداع', 'ابداع'],
  },
  {
    id: 'sales', fr: 'Vente / négociation', ar: 'المبيعات/التفاوض',
    synonyms: ['vente', 'vendeur', 'commercial', 'commerce', 'negociation', 'sales', 'المبيعات/التفاوض', 'مبيعات', 'تفاوض'],
  },
];

export const NEED_TAGS: Tag[] = [
  { id: 'learning', fr: 'Apprendre / se former', ar: 'التعلم والتكوين', synonyms: ['learning', 'formation', 'se former', 'apprendre', 'apprentissage', 'التعلم والتكوين', 'تكوين'] },
  { id: 'training', fr: 'Stage / expérience pratique', ar: 'تدريب مهني', synonyms: ['training', 'stage', 'stagiaire', 'experience', 'pratique', 'تدريب مهني', 'تدريب'] },
  { id: 'confidence', fr: 'Confiance en soi', ar: 'الثقة بالنفس', synonyms: ['confidence', 'confiance', 'soft skills', 'savoir-etre', 'الثقة بالنفس'] },
  { id: 'cv', fr: 'Aide pour le CV', ar: 'المساعدة في الـ CV', synonyms: ['cv', 'candidature', 'curriculum'] },
  { id: 'jobs', fr: 'Trouver un emploi', ar: 'البحث عن عمل', synonyms: ['jobs', 'emploi', 'travail', 'job', 'premier emploi', 'recrutement', 'embauche', 'البحث عن عمل', 'عمل', 'شغل'] },
  { id: 'networking', fr: 'Réseau / contacts', ar: 'بناء شبكة علاقات', synonyms: ['networking', 'reseau', 'contacts', 'mise en relation', 'بناء شبكة علاقات'] },
  { id: 'languages', fr: 'Langues', ar: 'تعلم اللغات', synonyms: ['languages', 'langue', 'langues', 'anglais', 'francais', 'تعلم اللغات', 'لغات'] },
  { id: 'digital', fr: 'Compétences numériques', ar: 'المهارات الرقمية', synonyms: ['numerique', 'informatique', 'المهارات الرقمية'] },
  { id: 'entrepreneurship', fr: 'Entrepreneuriat', ar: 'ريادة الأعمال', synonyms: ['entrepreneurship', 'entrepreneuriat', 'entreprendre', 'creation d\'entreprise', 'auto-emploi', 'projet', 'ريادة الأعمال', 'مقاولة'] },
];

/** The offer type itself tells which need it answers. */
export const NEEDS_BY_TYPE: Record<string, string[]> = {
  job: ['jobs'],
  internship: ['training'],
  training: ['learning'],
};

/** Lower-case and strip Latin accents (é → e). Arabic text is unaffected. */
export function normalize(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Map free text / labels / ids to the canonical tag ids of a vocabulary. */
export function toTagIds(values: string[] | null | undefined, vocab: Tag[]): Set<string> {
  const out = new Set<string>();
  for (const raw of values ?? []) {
    const v = normalize(raw);
    if (!v) continue;
    for (const tag of vocab) {
      if (v === tag.id) { out.add(tag.id); continue; }
      const hit = tag.synonyms.some((syn) => {
        const s = normalize(syn);
        // whole-word-ish containment both ways, ignoring very short fragments
        return s === v || (s.length >= 3 && v.includes(s)) || (v.length >= 4 && s.includes(v));
      });
      if (hit) out.add(tag.id);
    }
  }
  return out;
}

/** Normalised text padded with spaces, words separated by single spaces. */
export function wordText(s: string): string {
  return ' ' + normalize(s).replace(/[^\p{L}\p{N}]+/gu, ' ').trim() + ' ';
}

/**
 * Whole-word keyword search in a `wordText()` string. Keywords of 6+ letters
 * also match as a word prefix (plurals / derived forms: "developpeur" →
 * "developpeurs"); short ones must match exactly ("son" ≠ "maison").
 */
export function hasKeyword(paddedText: string, keyword: string): boolean {
  const kw = wordText(keyword).trim();
  if (!kw) return false;
  if (paddedText.includes(' ' + kw + ' ')) return true;
  return kw.length >= 6 && paddedText.includes(' ' + kw);
}

export function tagById(vocab: Tag[], id: string): Tag | undefined {
  return vocab.find((t) => t.id === id);
}
