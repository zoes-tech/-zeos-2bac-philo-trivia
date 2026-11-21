export const LOCALES = ["ar", "fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

/** URL path for a locale. Arabic is served at the root. */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
}

export const HTML_LANG: Record<Locale, string> = {
  ar: "ar-MA",
  fr: "fr",
  en: "en",
};

export const TEXT_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  fr: "ltr",
  en: "ltr",
};

/** hreflang map shared by metadata and the generated sitemap. */
export const HREFLANG_PATHS = {
  "ar-MA": "/",
  fr: "/fr/",
  en: "/en/",
  "x-default": "/",
} as const;
