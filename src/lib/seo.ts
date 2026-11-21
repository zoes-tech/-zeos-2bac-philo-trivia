import type { Metadata, Viewport } from "next";
import type { SiteContent } from "@/i18n/content";
import { HREFLANG_PATHS, localePath, type Locale } from "@/i18n/locales";
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
