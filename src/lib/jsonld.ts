import type { SiteContent } from "@/i18n/content";
import { LEVEL_COPY, MODULE_COPY, questionCountLabel } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import {
  ALL_MODULES,
  LEVELS,
  MODULES_BY_LEVEL,
  TOTAL_QUESTIONS,
} from "@/lib/curriculum";
import { SITE } from "@/lib/site";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.brand,
    url: SITE.url,
    sameAs: [SITE.github],
    description:
      "Zoes Tech builds free, open-source learning tools for Moroccan students.",
  };
}

export function websiteJsonLd(locale: Locale, siteName: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: siteName,
    inLanguage: locale === "ar" ? "ar-MA" : locale,
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function appJsonLd(
  locale: Locale,
  content: SiteContent,
  language: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#app`,
    name: SITE.name,
    alternateName: SITE.nameEn,
    description: content.meta.description,
    applicationCategory: "EducationalApplication",
    applicationSubCategory: "Quiz",
    operatingSystem: "Web, Android, iOS",
    url: `${SITE.url}/`,
    inLanguage: language,
    isAccessibleForFree: true,
    educationalLevel: "Baccalaureate",
    teaches: ALL_MODULES.map((module) => module.title),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Moroccan Baccalaureate students",
    },
    creator: { "@id": `${SITE.url}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MAD",
    },
    featureList: [
      `${TOTAL_QUESTIONS} interactive questions`,
      "Instant answer feedback",
      "Mistake review after each quiz",
      "Offline support",
      "No account required",
    ],
  };
}

/** One LearningResource per curriculum module, grouped in an ItemList. */
export function curriculumJsonLd(locale: Locale): JsonLd {
  const copy = MODULE_COPY[locale];
  let position = 0;

  const items = LEVELS.flatMap((level) =>
    MODULES_BY_LEVEL[level.id].map((module) => {
      position += 1;
      const questionCount = module.quiz?.length ?? 0;
      return {
        "@type": "ListItem",
        position,
        item: {
          "@type": "Quiz",
          "@id": `${SITE.url}/#module-${module.id}`,
          name: copy[module.id]?.title ?? module.title,
          description: copy[module.id]?.description ?? module.description,
          learningResourceType: "Quiz",
          educationalLevel: LEVEL_COPY[locale][level.id].title,
          inLanguage: "ar-MA",
          isAccessibleForFree: true,
          numberOfQuestions: questionCount,
          about: module.title,
        },
      };
    }),
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Philosophy curriculum — ${questionCountLabel(locale, TOTAL_QUESTIONS)}`,
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export function faqJsonLd(content: SiteContent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(
  labels: { home: string; current: string },
  currentPath: string,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: labels.home,
        item: `${SITE.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: labels.current,
        item: `${SITE.url}${currentPath}`,
      },
    ],
  };
}
