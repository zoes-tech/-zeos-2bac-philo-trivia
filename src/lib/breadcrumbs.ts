import { getLevelCopy, getModuleCopy } from "@/i18n/curriculum-copy";
import { localePath, type Locale } from "@/i18n/locales";
import { SITE_CONTENT } from "@/i18n/site-content";
import { type LevelId, modulePath } from "@/lib/curriculum";
import type { Module } from "@/types";
import type { Crumb } from "@/lib/jsonld";

export function moduleCrumbs(
  locale: Locale,
  level: LevelId,
  module: Module,
): Crumb[] {
  const home = SITE_CONTENT[locale].chrome.breadcrumbHome;
  const levelCopy = getLevelCopy(locale, level);
  const moduleCopy = getModuleCopy(locale, module);

  return [
    { name: home, href: localePath(locale) },
    { name: levelCopy.title, href: `${localePath(locale)}#curriculum` },
    { name: moduleCopy.title, href: modulePath(level, module.id) },
  ];
}
