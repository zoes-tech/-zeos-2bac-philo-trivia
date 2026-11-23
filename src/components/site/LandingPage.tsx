import { SITE_CONTENT } from "@/i18n/content";
import { localePath, type Locale } from "@/i18n/locales";
import {
  CurriculumList,
  FaqSection,
  FeatureGrid,
  Hero,
  HowItWorks,
  StatsGrid,
} from "@/components/site/LandingSections";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  appJsonLd,
  breadcrumbJsonLd,
  curriculumJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import { HTML_LANG } from "@/i18n/locales";
import { SITE } from "@/lib/site";

/** Full informational page used for the French and English locales. */
export function LandingPage({ locale }: { locale: Locale }) {
  const content = SITE_CONTENT[locale];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(locale, SITE.name)} />
      <JsonLd data={appJsonLd(locale, content, HTML_LANG[locale])} />
      <JsonLd data={curriculumJsonLd(locale)} />
      <JsonLd data={faqJsonLd(content)} />
      <JsonLd
        data={breadcrumbJsonLd(
          {
            home: "Home",
            current: content.hero.title,
          },
          localePath(locale),
        )}
      />

      <SiteHeader locale={locale} />

      <main id="main">
        <Hero content={content} playHref="/" />
        <StatsGrid content={content} />
        <FeatureGrid content={content} />
        <CurriculumList content={content} locale={locale} />
        <HowItWorks content={content} />
        <FaqSection content={content} />
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
