import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/i18n/locales";
import type { LevelId } from "@/lib/curriculum";
import {
  appJsonLd,
  breadcrumbJsonLd,
  curriculumJsonLd,
  faqJsonLd,
  moduleJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import type { Module } from "@/types";
import type { Crumb } from "@/lib/breadcrumbs";

type PageSeoProps =
  | { locale: Locale; page: "landing" }
  | {
      locale: Locale;
      page: "module";
      level: LevelId;
      module: Module;
      breadcrumbs: Crumb[];
    };

/** The single JSON-LD entry point for a page. */
export function PageSeo(props: PageSeoProps) {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(props.locale)} />

      {props.page === "landing" ? (
        <>
          <JsonLd data={appJsonLd(props.locale)} />
          <JsonLd data={curriculumJsonLd(props.locale)} />
          <JsonLd data={faqJsonLd(props.locale)} />
        </>
      ) : (
        <JsonLd data={moduleJsonLd(props.level, props.module)} />
      )}

      {"breadcrumbs" in props && props.breadcrumbs.length > 0 && (
        <JsonLd data={breadcrumbJsonLd(props.breadcrumbs)} />
      )}
    </>
  );
}
