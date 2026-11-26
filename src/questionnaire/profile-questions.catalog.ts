/**
 * "Personnalité" and "Savoir-être" questions shown in the app, FR + AR.
 * Answers are stored as option ids (e.g. { p1: 'agree' }), never as text,
 * so they stay valid whatever the app language was.
 */
export interface Choice {
  id: string;
  fr: string;
  ar: string;
}

export interface ProfileQuestion {
  id: string;
  fr: string;
  ar: string;
  choices: Choice[];
}

const AGREE_SCALE: Choice[] = [
  { id: 'strongly_agree', fr: 'Tout à fait d’accord', ar: 'متفق بزاف' },
  { id: 'agree', fr: 'D’accord', ar: 'متفق' },
  { id: 'neutral', fr: 'Ça dépend', ar: 'على حساب' },
  { id: 'disagree', fr: 'Pas d’accord', ar: 'ماشي متفق' },
  { id: 'strongly_disagree', fr: 'Pas du tout d’accord', ar: 'ماشي متفق نهائيا' },
];

export const PERSONALITY_QUESTIONS: ProfileQuestion[] = [
  { id: 'p1', fr: 'J’aime travailler avec d’autres personnes, en équipe.', ar: 'كنستمتع بالخدمة مع ناس آخرين فالفريق', choices: AGREE_SCALE },
  { id: 'p2', fr: 'Je suis à l’aise pour parler devant un groupe.', ar: 'كنحس براسي مرتاح ملي كنهضر قدام الناس', choices: AGREE_SCALE },
  { id: 'p3', fr: 'J’aime résoudre des problèmes concrets.', ar: 'كنبغي نحل المشاكل العملية', choices: AGREE_SCALE },
  { id: 'p4', fr: 'Je préfère planifier avant de commencer un travail.', ar: 'كنفضل نخطط قبل ما نبدا شي خدمة', choices: AGREE_SCALE },
  { id: 'p5', fr: 'Je m’adapte facilement aux changements.', ar: 'كنتأقلم بسهولة مع التغييرات', choices: AGREE_SCALE },
];

/** Choices are ordered from the strongest to the weakest answer. */
export const SOFT_SKILL_QUESTIONS: ProfileQuestion[] = [
  {
    id: 's1', fr: 'Arrives-tu à l’heure au travail ?', ar: 'واش كتجي فالوقت ديالك للخدمة؟',
    choices: [
      { id: 'o1', fr: 'Toujours', ar: 'ديما' },
      { id: 'o2', fr: 'Souvent', ar: 'غالبا' },
      { id: 'o3', fr: 'Parfois', ar: 'بعض المرات' },
      { id: 'o4', fr: 'Rarement', ar: 'قليل' },
    ],
  },
  {
    id: 's2', fr: 'Comment gères-tu la pression au travail ?', ar: 'كيفاش كتعامل مع الضغط فالخدمة؟',
    choices: [
      { id: 'o1', fr: 'Je reste calme et je trouve des solutions', ar: 'كنبقى هادي وكنلقى حلول' },
      { id: 'o2', fr: 'J’essaie de m’adapter', ar: 'كنحاول نتأقلم' },
      { id: 'o3', fr: 'Je stresse un peu', ar: 'كنتوتر شوية' },
      { id: 'o4', fr: 'C’est difficile pour moi', ar: 'صعيب عليا' },
    ],
  },
  {
    id: 's3', fr: 'Acceptes-tu les remarques des autres ?', ar: 'واش كتقبل الملاحظات من الناس؟',
    choices: [
      { id: 'o1', fr: 'Sans problème', ar: 'بكل ارتياح' },
      { id: 'o2', fr: 'Oui, la plupart du temps', ar: 'غالبا نعم' },
      { id: 'o3', fr: 'Ça me dérange un peu', ar: 'كيقلقني شوية' },
      { id: 'o4', fr: 'Difficilement', ar: 'ما كنقبلش بسهولة' },
    ],
  },
  {
    id: 's4', fr: 'Peux-tu travailler seul(e), sans être surveillé(e) ?', ar: 'واش كتقدر تخدم بوحدك بلا ما حد يراقبك؟',
    choices: [
      { id: 'o1', fr: 'Oui, je suis autonome', ar: 'نعم، كنكون مستقل' },
      { id: 'o2', fr: 'Oui, la plupart du temps', ar: 'غالبا نعم' },
      { id: 'o3', fr: 'J’ai parfois besoin d’être guidé(e)', ar: 'كنحتاج توجيه أحيانا' },
      { id: 'o4', fr: 'J’ai toujours besoin d’aide', ar: 'كنحتاج مساعدة ديما' },
    ],
  },
  {
    id: 's5', fr: 'Comment organises-tu ton temps ?', ar: 'كيفاش كتنظم الوقت ديالك؟',
    choices: [
      { id: 'o1', fr: 'J’ai toujours un plan clair', ar: 'عندي خطة واضحة ديما' },
      { id: 'o2', fr: 'J’essaie de m’organiser', ar: 'كنحاول نتنظم' },
      { id: 'o3', fr: 'Je perds parfois du temps', ar: 'مرات كنضيع الوقت' },
      { id: 'o4', fr: 'Je ne suis pas organisé(e)', ar: 'ما عنديش تنظيم' },
    ],
  },
  {
    id: 's6', fr: 'Communiques-tu facilement avec les autres ?', ar: 'واش كتواصل مزيان مع الآخرين؟',
    choices: [
      { id: 'o1', fr: 'Oui, facilement', ar: 'نعم، بسهولة' },
      { id: 'o2', fr: 'Souvent', ar: 'غالبا' },
      { id: 'o3', fr: 'J’ai parfois du mal', ar: 'كنلقى صعوبة أحيانا' },
      { id: 'o4', fr: 'C’est difficile pour moi', ar: 'صعيب عليا' },
    ],
  },
];

/** Keep only answers whose question and choice exist in the catalogue. */
export function validAnswers(
  questions: ProfileQuestion[],
  answers: Record<string, string> | null | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const q of questions) {
    const a = answers?.[q.id];
    if (a && q.choices.some((c) => c.id === a)) out[q.id] = a;
  }
  return out;
}

/** { "question (FR)": "answer (FR)" } for the admin panel. */
export function readableAnswers(
  questions: ProfileQuestion[],
  answers: Record<string, string> | null | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const q of questions) {
    const c = q.choices.find((x) => x.id === answers?.[q.id]);
    if (c) out[q.fr] = c.fr;
  }
  return out;
}
