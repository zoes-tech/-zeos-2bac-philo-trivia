import type { ReactNode } from "react";
import type { Locale } from "@/i18n/locales";
import { SITE_CONTENT } from "@/i18n/site-content";
import {
  CurriculumList,
  FaqSection,
  FeatureGrid,
  Hero,
  HowItWorks,
  StatsGrid,
} from "@/components/site/LandingSections";
import { PageSeo } from "@/components/site/PageSeo";

/**
 * The shared landing composition. The Arabic page passes the game islands as
 * `interactive`; the FR/EN pages only pass copy.
 */
export function LandingPage({
  locale,
  interactive,
  playHref = "/",
  showStats = true,
}: {
  locale: Locale;
  interactive?: ReactNode;
  playHref?: string;
  showStats?: boolean;
}) {
  const content = SITE_CONTENT[locale];

  return (
    <>
      <PageSeo locale={locale} page="landing" />
      <Hero content={content} playHref={playHref} />
      {showStats && <StatsGrid content={content} />}
      {interactive}
      <FeatureGrid content={content} />
      <CurriculumList content={content} locale={locale} />
      <HowItWorks content={content} />
      <FaqSection content={content} />
    </>
  );
}
