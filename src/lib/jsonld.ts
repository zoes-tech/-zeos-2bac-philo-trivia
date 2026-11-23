import { getLevelCopy, getModuleCopy } from "@/i18n/curriculum-copy";
import { questionCountLabel } from "@/i18n/labels";
import { SITE_CONTENT } from "@/i18n/site-content";
import { HTML_LANG, MODULE_PAGE_LOCALES, type Locale } from "@/i18n/locales";
import {
  ALL_MODULES,
  LEVELS,
  MODULES_BY_LEVEL,
  TOTAL_QUESTIONS,
  modulePath,
  type LevelId,
} from "@/lib/curriculum";
import type { Module } from "@/types";
import { SITE } from "@/lib/site";

type JsonLd = Record<string, unknown>;

import type { Crumb } from "@/lib/breadcrumbs";

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

export function websiteJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: HTML_LANG[locale],
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function appJsonLd(locale: Locale): JsonLd {
  const content = SITE_CONTENT[locale];
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
    inLanguage: HTML_LANG[locale],
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

function moduleEntity(
  locale: Locale,
  level: LevelId,
  module: Module,
): JsonLd {
  const copy = getModuleCopy(locale, module);

  return {
    "@type": "Quiz",
    "@id": `${SITE.url}/#module-${module.id}`,
    name: copy.title,
    description: copy.description,
    url: `${SITE.url}${modulePath(level, module.id)}`,
    learningResourceType: "Quiz",
    educationalLevel: getLevelCopy(locale, level).title,
    inLanguage: HTML_LANG[locale],
    isAccessibleForFree: true,
    numberOfQuestions: module.quiz?.length ?? 0,
    about: module.concepts.map((concept) => concept.name),
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

/** One Quiz entity per curriculum module, grouped in an ItemList. */
export function curriculumJsonLd(locale: Locale): JsonLd {
  let position = 0;

  const items = LEVELS.flatMap((level) =>
    MODULES_BY_LEVEL[level.id].map((module) => {
      position += 1;
      return {
        "@type": "ListItem",
        position,
        item: moduleEntity(locale, level.id, module),
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

export function faqJsonLd(locale: Locale): JsonLd {
  const content = SITE_CONTENT[locale];
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

export function breadcrumbJsonLd(items: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${SITE.url}${item.href}`,
    })),
  };
}

export function moduleJsonLd(level: LevelId, module: Module): JsonLd {
  return {
    "@context": "https://schema.org",
    ...moduleEntity(MODULE_PAGE_LOCALES[0], level, module),
  };
}
