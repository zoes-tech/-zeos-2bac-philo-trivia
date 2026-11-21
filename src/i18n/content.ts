import type { Locale } from "@/i18n/locales";
import type { LevelId } from "@/lib/curriculum";

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    eyebrow: string;
    title: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    note?: string;
  };
  stats: ReadonlyArray<{ value: string; label: string }>;
  features: {
    title: string;
    intro: string;
    items: ReadonlyArray<{ title: string; text: string }>;
  };
  curriculum: {
    title: string;
    intro: string;
  };
  how: {
    title: string;
    steps: ReadonlyArray<{ title: string; text: string }>;
  };
  faq: {
    title: string;
    intro: string;
    items: ReadonlyArray<{ q: string; a: string }>;
  };
  footer: {
    made: string;
    openSource: string;
    license: string;
    play: string;
  };
}

export type LevelCopy = Record<LevelId, { title: string; description: string }>;
export type ModuleCopy = Record<string, { title: string; description: string }>;

export const LEVEL_COPY: Record<Locale, LevelCopy> = {
  ar: {
    "common-core": {
      title: "الجذع المشترك",
      description: "نشأة الفلسفة: من الأسطورة إلى اللوغوس.",
    },
    "1st-bac": {
      title: "الأولى باك",
      description: "الإنسان والفاعلية: الوعي، الرغبة، اللغة، التقنية والعمل.",
    },
    "2nd-bac": {
      title: "الثانية باك",
      description: "الوضع البشري، المعرفة، الأخلاق والسياسة.",
    },
  },
  fr: {
    "common-core": {
      title: "Tronc commun",
      description: "Naissance de la philosophie : du mythe au logos.",
    },
    "1st-bac": {
      title: "1re année Bac",
      description:
        "L'humain et l'action : conscience, désir, langage, technique et travail.",
    },
    "2nd-bac": {
      title: "2e année Bac",
      description: "Condition humaine, connaissance, morale et politique.",
    },
  },
  en: {
    "common-core": {
      title: "Common Core",
      description: "The birth of philosophy: from myth to logos.",
    },
    "1st-bac": {
      title: "11th Grade",
      description:
        "The human being and action: consciousness, desire, language, technique and work.",
    },
    "2nd-bac": {
      title: "12th Grade",
      description: "Human condition, knowledge, ethics and politics.",
    },
  },
};

export const MODULE_COPY: Record<Locale, ModuleCopy> = {
  ar: {
    "intro-philosophy": {
      title: "نشأة الفلسفة",
      description:
        "من الأسطورة إلى التفكير العقلاني: أولى المفاهيم الفلسفية وأسئلتها.",
    },
    humanity: {
      title: "الإنسان",
      description: "أبعاد الوجود الإنساني: الوعي، الرغبة، واللغة.",
    },
    effectiveness: {
      title: "الفاعلية والإبداع",
      description:
        "علاقة الإنسان بالعالم من خلال التقنية والعلم والعمل.",
    },
    "human-condition": {
      title: "الوضع البشري",
      description: "الشخص والغير: الهوية، الحرية، والعلاقة بالآخر.",
    },
    politics: {
      title: "السياسة",
      description: "الدولة، الحق والعدالة، والعنف.",
    },
    knowledge: {
      title: "المعرفة",
      description: "النظرية والتجربة، الحقيقة، والعلوم.",
    },
    morality: {
      title: "الأخلاق",
      description: "الواجب، السعادة، والحرية.",
    },
  },
  fr: {
    "intro-philosophy": {
      title: "Naissance de la philosophie",
      description:
        "Du mythe au raisonnement : premiers concepts et premières questions philosophiques.",
    },
    humanity: {
      title: "L'humain",
      description:
        "Les dimensions de l'existence humaine : conscience, désir et langage.",
    },
    effectiveness: {
      title: "Agir et créer",
      description:
        "Le rapport au monde à travers la technique, la science et le travail.",
    },
    "human-condition": {
      title: "La condition humaine",
      description:
        "La personne et l'autre : identité, liberté et altérité.",
    },
    politics: {
      title: "La politique",
      description: "L'État, le droit et la justice, la violence.",
    },
    knowledge: {
      title: "La connaissance",
      description: "Théorie et expérience, vérité, sciences.",
    },
    morality: {
      title: "La morale",
      description: "Le devoir, le bonheur, la liberté.",
    },
  },
  en: {
    "intro-philosophy": {
      title: "The Birth of Philosophy",
      description:
        "From myth to reasoned argument: the first philosophical concepts and questions.",
    },
    humanity: {
      title: "The Human Being",
      description:
        "Dimensions of human existence: consciousness, desire and language.",
    },
    effectiveness: {
      title: "Action and Creation",
      description:
        "How humans engage with the world through technique, science and work.",
    },
    "human-condition": {
      title: "The Human Condition",
      description: "The self and the other: identity, freedom and otherness.",
    },
    politics: {
      title: "Politics",
      description: "The state, right and justice, violence.",
    },
    knowledge: {
      title: "Knowledge",
      description: "Theory and experience, truth, the sciences.",
    },
    morality: {
      title: "Ethics",
      description: "Duty, happiness, freedom.",
    },
  },
};

export const SITE_CONTENT = {
  ar: {
    meta: {
      title: "رحلة الفيلسوف — اختبار الفلسفة للباكالوريا المغربية",
      description:
        "تطبيق مجاني ومفتوح المصدر لمراجعة الفلسفة للباكالوريا المغربية: أسئلة تفاعلية على 7 محاور و3 مستويات، مع تصحيح فوري ومراجعة للأخطاء. يعمل دون إنترنت وبدون حساب.",
      keywords: [
        "فلسفة الثانية باك",
        "الفلسفة للباكالوريا",
        "مراجعة الفلسفة",
        "اختبار الفلسفة",
        "أسئلة فلسفة",
        "الوضع البشري",
        "المعرفة",
        "الأخلاق",
        "السياسة",
        "الفاعلية والإبداع",
        "نشأة الفلسفة",
        "باكالوريا المغرب",
        "philosophie 2 bac maroc",
        "moroccan philosophy quiz",
      ],
    },
    hero: {
      eyebrow: "مجاني · مفتوح المصدر · بدون حساب",
      title: "رحلة الفيلسوف",
      titleLine2: "اختبار الفلسفة للباكالوريا المغربية",
      subtitle:
        "اختبار الفلسفة للباكالوريا المغربية: 349 سؤالاً على 7 محاور و3 مستويات، مع تصحيح فوري، سلاسل نقاط، ومراجعة أخطائك بعد كل اختبار.",
      primaryCta: "ابدأ الاختبار الآن",
      secondaryCta: "استكشف المحاور",
    },
    stats: [
      { value: "349", label: "سؤالاً تفاعلياً" },
      { value: "7", label: "محاور من المقرر" },
      { value: "3", label: "مستويات دراسية" },
      { value: "0", label: "حساب مطلوب" },
    ],
    features: {
      title: "لماذا هذا التطبيق مختلف",
      intro:
        "أداة مراجعة صُممت حول طريقة المراجعة الفعلية: أسئلة قصيرة، تغذية راجعة فورية، وتكرار الأسئلة التي أخطأت فيها.",
      items: [
        {
          title: "تصحيح فوري",
          text: "تظهر الإجابة الصحيحة مباشرة، وتُجمع كل الأخطاء في بطاقة مراجعة بعد نهاية الاختبار.",
        },
        {
          title: "نقاط وسلاسل",
          text: "نقاط أساسية، مكافأة سرعة، ومضاعف يصل إلى ×2.5 مع السلاسل الطويلة.",
        },
        {
          title: "يعمل دون إنترنت",
          text: "بعد أول زيارة يمكن تثبيت التطبيق على الهاتف واستخدامه دون اتصال.",
        },
        {
          title: "خصوصية كاملة",
          text: "لا حساب ولا خادم: تقدمك ونقاطك يُحفظان على جهازك فقط.",
        },
        {
          title: "عربي بالكامل",
          text: "واجهة من اليمين إلى اليسار بخط عربي واضح، دون ترجمة آلية.",
        },
        {
          title: "مفتوح المصدر",
          text: "الشيفرة متاحة برخصة MIT، ويمكن لأي أستاذ أو مدرسة نسخها وتعديلها.",
        },
      ],
    },
    curriculum: {
      title: "المحاور المغطاة",
      intro:
        "تُبنى الأسئلة حول محاور المقرر المغربي، من نشأة الفلسفة في الجذع المشترك إلى الوضع البشري والأخلاق في الثانية باك.",
    },
    how: {
      title: "كيف تراجع في دقيقتين",
      steps: [
        {
          title: "اختر مستواك",
          text: "الجذع المشترك، الأولى باك، أو الثانية باك، ثم اختر المحور.",
        },
        {
          title: "أجب قبل انتهاء الوقت",
          text: "لكل سؤال مؤقت قصير، والإجابة السريعة تمنحك نقاطاً إضافية.",
        },
        {
          title: "راجع أخطاءك",
          text: "في النهاية تظهر بطاقة بكل سؤال أخطأت فيه مع الإجابة الصحيحة.",
        },
      ],
    },
    faq: {
      title: "أسئلة شائعة",
      intro: "كل ما تحتاج معرفته قبل البدء.",
      items: [
        {
          q: "هل التطبيق مجاني فعلاً؟",
          a: "نعم. التطبيق مجاني بالكامل، دون إعلانات أو اشتراك أو حساب، والشيفرة منشورة برخصة MIT.",
        },
        {
          q: "هل يحتاج إنشاء حساب؟",
          a: "لا. لا نجمع أي بيانات شخصية، وتُحفظ نقاطك وتقدمك محلياً في متصفحك فقط.",
        },
        {
          q: "كم عدد الأسئلة والمحاور؟",
          a: "يحتوي التطبيق على 349 سؤالاً موزعة على 7 محاور و3 مستويات: الجذع المشترك، الأولى باك، والثانية باك.",
        },
        {
          q: "هل يعمل بدون إنترنت؟",
          a: "نعم، بعد أول زيارة. التطبيق تطبيق ويب تقدمي (PWA) يمكن تثبيته على الشاشة الرئيسية واستخدامه دون اتصال.",
        },
        {
          q: "هل يغطي مقرر الفلسفة المغربي؟",
          a: "نعم، يغطي نشأة الفلسفة، الإنسان، الفاعلية والإبداع، الوضع البشري، المعرفة، الأخلاق، والسياسة.",
        },
        {
          q: "هل يغني عن الأستاذ أو المقرر؟",
          a: "لا. التطبيق أداة مراجعة وتقييم ذاتي، وليس بديلاً عن الدرس أو الكتاب المدرسي أو توجيه الأستاذ.",
        },
        {
          q: "هل يمكن استخدامه في القسم؟",
          a: "نعم. لأنه ثابت ومفتوح المصدر، يمكن لأي أستاذ أو مؤسسة استضافته أو تعديله بحرية.",
        },
      ],
    },
    footer: {
      made: "صُنع لتلاميذ المغرب",
      openSource: "مشروع مفتوح المصدر على GitHub",
      license: "رخصة MIT",
      play: "ابدأ الاختبار",
    },
  },
  fr: {
    meta: {
      title: "Philosophe 2BAC — quiz de philosophie pour le bac marocain",
      description:
        "Application gratuite et open source pour réviser la philosophie du baccalauréat marocain : 349 questions, 7 thèmes, 3 niveaux, correction immédiate et révision des erreurs. Sans compte, fonctionne hors ligne.",
      keywords: [
        "philosophie 2 bac",
        "philosophie bac maroc",
        "réviser philosophie",
        "quiz philosophie",
        "programme philosophie maroc",
        "condition humaine",
        "connaissance",
        "morale",
        "politique",
        "baccalauréat marocain",
        "philosophy quiz morocco",
      ],
    },
    hero: {
      eyebrow: "Gratuit · open source · sans compte",
      title: "La philosophie du bac, en questions.",
      titleLine2: "7 thèmes · 3 niveaux · gratuit",
      subtitle:
        "349 questions interactives sur les 7 thèmes du programme marocain, réparties en 3 niveaux. Correction immédiate, séries de points et révision de vos erreurs.",
      primaryCta: "Lancer le quiz",
      secondaryCta: "Voir les thèmes",
      note: "L'interface et les questions du quiz sont en arabe, langue d'enseignement de la philosophie au Maroc. Cette page explique l'outil en français.",
    },
    stats: [
      { value: "349", label: "questions" },
      { value: "7", label: "thèmes du programme" },
      { value: "3", label: "niveaux" },
      { value: "0", label: "compte requis" },
    ],
    features: {
      title: "Conçu pour réviser, pas pour distraire",
      intro:
        "Des questions courtes, une correction immédiate et une fiche de révision qui rassemble vos erreurs à la fin de chaque quiz.",
      items: [
        {
          title: "Correction immédiate",
          text: "La bonne réponse s'affiche tout de suite; vos erreurs sont rassemblées dans une fiche de révision en fin de quiz.",
        },
        {
          title: "Points et séries",
          text: "Points de base, bonus de rapidité et multiplicateur jusqu'à ×2,5 pour les longues séries.",
        },
        {
          title: "Hors ligne",
          text: "Installable comme application web (PWA), le site fonctionne sans connexion après la première visite.",
        },
        {
          title: "Vie privée",
          text: "Aucun compte, aucun serveur : la progression et les points restent sur votre appareil.",
        },
        {
          title: "Arabe soigné, page française",
          text: "Une interface arabe de droite à gauche, et cette page d'information en français pour les enseignants et les familles.",
        },
        {
          title: "Open source",
          text: "Code publié sous licence MIT : une école ou un enseignant peut le dupliquer et l'adapter.",
        },
      ],
    },
    curriculum: {
      title: "Les thèmes couverts",
      intro:
        "Les questions suivent les axes du programme marocain, de la naissance de la philosophie en tronc commun à la condition humaine et à la morale en 2e année du bac.",
    },
    how: {
      title: "Réviser en deux minutes",
      steps: [
        {
          title: "Choisissez votre niveau",
          text: "Tronc commun, 1re année ou 2e année du bac, puis un thème.",
        },
        {
          title: "Répondez avant la fin du temps",
          text: "Chaque question a un minuteur court; une réponse rapide rapporte des points bonus.",
        },
        {
          title: "Revoyez vos erreurs",
          text: "À la fin, une fiche reprend chaque question manquée avec la bonne réponse.",
        },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      intro: "L'essentiel avant de commencer.",
      items: [
        {
          q: "L'application est-elle vraiment gratuite ?",
          a: "Oui. Elle est gratuite, sans publicité ni abonnement, et publiée sous licence MIT.",
        },
        {
          q: "Faut-il créer un compte ?",
          a: "Non. Aucune donnée personnelle n'est collectée; la progression est enregistrée localement dans votre navigateur.",
        },
        {
          q: "Combien y a-t-il de questions ?",
          a: "349 questions réparties sur 7 thèmes et 3 niveaux : tronc commun, 1re et 2e année du baccalauréat.",
        },
        {
          q: "Le quiz est-il en arabe ?",
          a: "Oui. L'interface et les questions sont en arabe, conformément à l'enseignement de la philosophie au Maroc. Cette page française présente l'outil.",
        },
        {
          q: "Fonctionne-t-il hors ligne ?",
          a: "Oui, après la première visite : le site met ses ressources en cache et peut être installé sur mobile.",
        },
        {
          q: "Remplace-t-il le cours ou le manuel ?",
          a: "Non. C'est un outil de révision et d'auto-évaluation, complémentaire au cours de l'enseignant.",
        },
        {
          q: "Peut-on l'utiliser en classe ?",
          a: "Oui. Le code est ouvert et le site étant statique, une école peut le déployer gratuitement.",
        },
      ],
    },
    footer: {
      made: "Fait pour les élèves du Maroc",
      openSource: "Projet open source sur GitHub",
      license: "Licence MIT",
      play: "Lancer le quiz",
    },
  },
  en: {
    meta: {
      title: "Philosophy Quiz for the Moroccan Baccalaureate (2BAC)",
      description:
        "Free, open-source philosophy revision for Moroccan Baccalaureate students: 349 interactive questions across 7 themes and 3 levels, with instant feedback and mistake review. No account, works offline.",
      keywords: [
        "philosophy quiz morocco",
        "2 bac philosophy",
        "moroccan baccalaureate philosophy",
        "revise philosophy",
        "philosophy questions",
        "human condition",
        "knowledge",
        "ethics",
        "politics",
        "baccalaureate morocco",
      ],
    },
    hero: {
      eyebrow: "Free · open source · no account",
      title: "Philosophy revision, one question at a time.",
      titleLine2: "7 themes · 3 levels · free",
      subtitle:
        "349 interactive questions covering the 7 themes of the Moroccan philosophy curriculum, across 3 school levels. Instant feedback, point streaks and a mistake review after every quiz.",
      primaryCta: "Start the quiz",
      secondaryCta: "Explore the themes",
      note: "The quiz interface and questions are in Arabic, the language of philosophy teaching in Morocco. This page explains the tool in English.",
    },
    stats: [
      { value: "349", label: "questions" },
      { value: "7", label: "curriculum themes" },
      { value: "3", label: "school levels" },
      { value: "0", label: "accounts needed" },
    ],
    features: {
      title: "Built for revision, not distraction",
      intro:
        "Short questions, immediate correction, and a review card that collects every mistake at the end of each quiz.",
      items: [
        {
          title: "Instant feedback",
          text: "The correct answer appears immediately, and every mistake is collected into a review card after the quiz.",
        },
        {
          title: "Points and streaks",
          text: "Base points, a speed bonus, and a multiplier up to ×2.5 for long correct streaks.",
        },
        {
          title: "Works offline",
          text: "Installable as a progressive web app; after the first visit it works without a connection.",
        },
        {
          title: "Private by design",
          text: "No account and no server: your progress and points stay on your device.",
        },
        {
          title: "Arabic-first, documented in English",
          text: "A polished right-to-left Arabic interface, with this page for teachers, parents and international readers.",
        },
        {
          title: "Open source",
          text: "Released under the MIT licence, so any teacher or school can copy and adapt it.",
        },
      ],
    },
    curriculum: {
      title: "Themes covered",
      intro:
        "Questions follow the axes of the Moroccan curriculum, from the birth of philosophy in common core to the human condition and ethics in the final year.",
    },
    how: {
      title: "Revise in two minutes",
      steps: [
        {
          title: "Pick your level",
          text: "Common core, 11th grade or 12th grade, then choose a theme.",
        },
        {
          title: "Answer before time runs out",
          text: "Each question has a short timer; fast answers earn bonus points.",
        },
        {
          title: "Review your mistakes",
          text: "At the end, a card lists every missed question with the correct answer.",
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      intro: "What you need to know before starting.",
      items: [
        {
          q: "Is the app really free?",
          a: "Yes. It is free, with no ads and no subscription, and the source code is published under the MIT licence.",
        },
        {
          q: "Do I need an account?",
          a: "No. No personal data is collected; progress is stored locally in your browser.",
        },
        {
          q: "How many questions are there?",
          a: "349 questions across 7 themes and 3 levels: common core, 11th grade and 12th grade.",
        },
        {
          q: "Is the quiz in Arabic?",
          a: "Yes. The interface and questions are in Arabic, matching how philosophy is taught in Morocco. This page presents the tool in English.",
        },
        {
          q: "Does it work offline?",
          a: "Yes, after the first visit. The site caches its resources and can be installed on a phone.",
        },
        {
          q: "Does it replace the teacher or textbook?",
          a: "No. It is a revision and self-assessment tool that complements the lesson and the teacher's guidance.",
        },
        {
          q: "Can a school use it?",
          a: "Yes. The code is open and the site is fully static, so a school can host its own copy for free.",
        },
      ],
    },
    footer: {
      made: "Made for students in Morocco",
      openSource: "Open source on GitHub",
      license: "MIT licence",
      play: "Start the quiz",
    },
  },
} satisfies Record<Locale, SiteContent>;

export function questionCountLabel(locale: Locale, count: number): string {
  if (locale === "ar") {
    if (count === 1) return "سؤال واحد";
    if (count === 2) return "سؤالان";
    if (count <= 10) return `${count} أسئلة`;
    return `${count} سؤالاً`;
  }
  if (locale === "fr") return `${count} questions`;
  return `${count} questions`;
}

/** Arabic count for mistakes, used by the result card. */
export function mistakeCountLabel(count: number): string {
  if (count === 0) return "0 أخطاء";
  if (count === 1) return "خطأ واحد";
  if (count === 2) return "خطأان";
  if (count <= 10) return `${count} أخطاء`;
  return `${count} خطأً`;
}

/**
 * Copy for the Arabic module pages. Kept separate from the landing copy because
 * these strings only ever render on `/tronc-commun/*`, `/1bac/*`, `/2bac/*`.
 */
/** Arabic number agreement for "concept(s)", used on module pages. */
export function conceptCountLabel(count: number): string {
  if (count === 1) return "مفهوم واحد";
  if (count === 2) return "مفهومين";
  if (count <= 10) return `${count} مفاهيم`;
  return `${count} مفهوماً`;
}

export const MODULE_PAGE_COPY = {
  home: "الرئيسية",
  curriculum: "المحاور",
  startCta: "ابدأ اختبار هذا المحور",
  startNote: "يفتح التطبيق ويبدأ هذا الاختبار مباشرة.",
  categoriesTitle: "توزيع الأسئلة حسب المفهوم",
  categoriesIntro: "عدد الأسئلة المخصصة لكل مفهوم داخل هذا المحور.",
  samplesTitle: "أمثلة من الأسئلة",
  samplesIntro: "أسئلة نموذجية من بنك هذا المحور، مع الإجابة الصحيحة.",
  correctAnswer: "الإجابة الصحيحة",
  conceptsTitle: "المفاهيم الأساسية",
  relatedTitle: "محاور أخرى في نفس المستوى",
  allModules: "كل المحاور",
  disclaimer:
    "أسئلة تدريبية وفق محاور المقرر المغربي، وليست أسئلة امتحان رسمية.",
  bankNote: (count: number) =>
    `هذه أمثلة فقط. الاختبار الكامل يحتوي على ${count} سؤالاً، مع تصحيح فوري ومراجعة للأخطاء في النهاية.`,
} as const;

