import type { Metadata, Viewport } from "next";
import {
  LEVEL_COPY,
  MODULE_COPY,
  type SiteContent,
} from "@/i18n/content";
import { HREFLANG_PATHS, localePath, type Locale } from "@/i18n/locales";
import { modulePath, type LevelId } from "@/lib/curriculum";
import type { Module } from "@/types";
import { SITE } from "@/lib/site";

const OG_LOCALES: Record<Locale, string> = {
  ar: "ar_MA",
  fr: "fr_MA",
  en: "en_US",
};

export function buildMetadata(
  locale: Locale,
  meta: SiteContent["meta"],
): Metadata {
  const path = localePath(locale);

  return {
    metadataBase: new URL(SITE.url),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    applicationName: SITE.name,
    authors: [{ name: SITE.brand, url: SITE.github }],
    creator: SITE.brand,
    publisher: SITE.brand,
    category: "education",
    alternates: {
      canonical: path,
      languages: { ...HREFLANG_PATHS },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: SITE.name,
      type: "website",
      locale: OG_LOCALES[locale],
      images: [
        {
          url: SITE.ogImage,
          width: SITE.ogImageSize.width,
          height: SITE.ogImageSize.height,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [SITE.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/icon-192.png",
    },
  };
}

export const siteViewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

/** Metadata for an Arabic curriculum module page. */
export function buildModuleMetadata(
  level: LevelId,
  module: Module,
): Metadata {
  const copy = MODULE_COPY.ar[module.id] ?? {
    title: module.title,
    description: module.description,
  };
  const levelTitle = LEVEL_COPY.ar[level].title;
  const path = modulePath(level, module.id);
  const count = module.quiz?.length ?? 0;

  const title = `${copy.title} — ${levelTitle} | ${SITE.name}`;
  const description = `${copy.description} اختبر نفسك في ${count} سؤالاً مع تصحيح فوري ومراجعة للأخطاء.`;

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    keywords: [
      copy.title,
      `${copy.title} باك`,
      levelTitle,
      "الفلسفة باكالوريا",
      "أسئلة فلسفة",
      "مراجعة الفلسفة",
    ],
    alternates: {
      canonical: path,
      languages: { "ar-MA": path, "x-default": path },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE.name,
      type: "article",
      locale: "ar_MA",
      images: [
        {
          url: SITE.ogImage,
          width: SITE.ogImageSize.width,
          height: SITE.ogImageSize.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
