import { GameIsland } from "@/components/game/GameIsland";
import { AppProviders } from "@/components/site/AppProviders";
import { JsonLd } from "@/components/seo/JsonLd";
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
import { SITE_CONTENT } from "@/i18n/content";
import { HTML_LANG } from "@/i18n/locales";
import { SITE } from "@/lib/site";
import {
  appJsonLd,
  curriculumJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";

export default function HomePage() {
  const content = SITE_CONTENT.ar;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd("ar", SITE.name)} />
      <JsonLd data={appJsonLd("ar", content, HTML_LANG.ar)} />
      <JsonLd data={curriculumJsonLd("ar")} />
      <JsonLd data={faqJsonLd(content)} />

      <SiteHeader locale="ar" />

      <main id="main">
        <Hero content={content} playHref="#play" />
        <StatsGrid content={content} />
        <AppProviders>
          <GameIsland />
        </AppProviders>
        <FeatureGrid content={content} />
        <CurriculumList content={content} locale="ar" />
        <HowItWorks content={content} />
        <FaqSection content={content} />
      </main>

      <SiteFooter locale="ar" />
    </>
  );
}
