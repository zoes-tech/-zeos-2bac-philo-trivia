import type { Metadata, Viewport } from "next";
import { getLevelCopy, getModuleCopy } from "@/i18n/curriculum-copy";
import type { SiteContent } from "@/i18n/site-content";
import {
  HREFLANG_PATHS,
  LOCALE_CONFIG,
  localePath,
  type Locale,
} from "@/i18n/locales";
import { modulePath, type LevelId } from "@/lib/curriculum";
import type { Module } from "@/types";
import { SITE } from "@/lib/site";

interface PageMeta {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
  alternates?: Record<string, string>;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  type = "website",
  alternates = HREFLANG_PATHS,
}: PageMeta): Metadata {
  const config = LOCALE_CONFIG[locale];

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    keywords,
    applicationName: SITE.name,
    authors: [{ name: SITE.brand, url: SITE.github }],
    creator: SITE.brand,
    publisher: SITE.brand,
    category: "education",
    alternates: { canonical: path, languages: alternates },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE.name,
      type,
      locale: config.ogLocale,
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
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/icon-192.png",
    },
  };
}

export function buildMetadata(
  locale: Locale,
  meta: SiteContent["meta"],
): Metadata {
  return buildPageMetadata({
    locale,
    path: localePath(locale),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  });
}

/** Metadata for a curriculum module page (Arabic only today). */
export function buildModuleMetadata(
  level: LevelId,
  module: Module,
  locale: Locale = "ar",
): Metadata {
  const copy = getModuleCopy(locale, module);
  const levelTitle = getLevelCopy(locale, level).title;
  const path = modulePath(level, module.id);
  const count = module.quiz?.length ?? 0;
  const hreflang = LOCALE_CONFIG[locale].hreflang;

  return buildPageMetadata({
    locale,
    path,
    title: `${copy.title} — ${levelTitle} | ${SITE.name}`,
    description: `${copy.description} اختبر نفسك في ${count} سؤالاً مع تصحيح فوري ومراجعة للأخطاء.`,
    keywords: [
      copy.title,
      `${copy.title} باك`,
      levelTitle,
      "الفلسفة باكالوريا",
      "أسئلة فلسفة",
      "مراجعة الفلسفة",
    ],
    type: "article",
    alternates: { [hreflang]: path, "x-default": path },
  });
}

export const siteViewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};
