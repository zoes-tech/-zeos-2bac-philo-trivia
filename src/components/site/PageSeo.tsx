import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/i18n/locales";
import { SITE_CONTENT } from "@/i18n/site-content";
import type { LevelId } from "@/lib/curriculum";
import {
  appJsonLd,
  breadcrumbJsonLd,
  curriculumJsonLd,
  faqJsonLd,
  moduleJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  type Crumb,
} from "@/lib/jsonld";
import type { Module } from "@/types";

type PageSeoProps =
  | { locale: Locale; page: "landing"; breadcrumbs?: Crumb[] }
  | {
      locale: Locale;
      page: "module";
      level: LevelId;
      module: Module;
      breadcrumbs: Crumb[];
    };

/** The single JSON-LD entry point for a page. */
export function PageSeo(props: PageSeoProps) {
  const content = SITE_CONTENT[props.locale];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(props.locale)} />

      {props.page === "landing" ? (
        <>
          <JsonLd data={appJsonLd(props.locale, content)} />
          <JsonLd data={curriculumJsonLd(props.locale)} />
          <JsonLd data={faqJsonLd(content)} />
        </>
      ) : (
        <JsonLd data={moduleJsonLd(props.level, props.module, props.locale)} />
      )}

      {props.breadcrumbs && props.breadcrumbs.length > 0 && (
        <JsonLd data={breadcrumbJsonLd(props.breadcrumbs)} />
      )}
    </>
  );
}
