import type { Locale } from "@/i18n/locales";

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
  questionOf: (index: number) => `سؤال ${index + 1}`,
  generalCategory: "عام",
  explanationLabel: "الشرح",
  conceptsIntro: (
    concepts: string,
    level: string,
    questions: string,
    conceptsCount: string,
  ) =>
    `يغطي هذا المحور ${concepts} ضمن مستوى ${level}. يضم بنك الأسئلة ${questions} موزعة على ${conceptsCount}، مع تصحيح فوري ومراجعة للأخطاء.`,
  correctAnswer: "الإجابة الصحيحة",
  conceptsTitle: "المفاهيم الأساسية",
  relatedTitle: "محاور أخرى في نفس المستوى",
  allModules: "كل المحاور",
  disclaimer:
    "أسئلة تدريبية وشروح مبسطة وفق محاور المقرر المغربي؛ ليست أسئلة امتحان رسمية ولا تغني عن مراجعة الأستاذ.",
  bankNote: (count: number) =>
    `هذه أمثلة فقط. الاختبار الكامل يحتوي على ${count} سؤالاً، مع تصحيح فوري ومراجعة للأخطاء في النهاية.`,
} as const;

