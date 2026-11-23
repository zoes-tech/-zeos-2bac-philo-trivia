import localeData from "@/data/locales.json";

export type Locale = "ar" | "fr" | "en";

type LocaleConfig = {
  id: Locale;
  path: string;
  htmlLang: string;
  hreflang: string;
  ogLocale: string;
  dir: "rtl" | "ltr";
  label: string;
};

const CONFIG = localeData as LocaleConfig[];

export const LOCALE_CONFIG = Object.fromEntries(
  CONFIG.map((locale) => [locale.id, locale]),
) as Record<Locale, LocaleConfig>;

export const LOCALES = CONFIG.map((locale) => locale.id);

const DEFAULT_LOCALE: Locale = "ar";

/** Module detail pages exist only in Arabic today. */
export const MODULE_PAGE_LOCALES: Locale[] = ["ar"];

export function localePath(locale: Locale): string {
  return LOCALE_CONFIG[locale].path;
}

export const HTML_LANG: Record<Locale, string> = Object.fromEntries(
  CONFIG.map((locale) => [locale.id, locale.htmlLang]),
) as Record<Locale, string>;

export const TEXT_DIR: Record<Locale, "rtl" | "ltr"> = Object.fromEntries(
  CONFIG.map((locale) => [locale.id, locale.dir]),
) as Record<Locale, "rtl" | "ltr">;

/** hreflang map shared by metadata, sitemap and the visible switcher. */
export const HREFLANG_PATHS: Record<string, string> = {
  ...Object.fromEntries(CONFIG.map((locale) => [locale.hreflang, locale.path])),
  "x-default": LOCALE_CONFIG[DEFAULT_LOCALE].path,
};

export const LOCALE_LABEL: Record<Locale, string> = Object.fromEntries(
  CONFIG.map((locale) => [locale.id, locale.label]),
) as Record<Locale, string>;
