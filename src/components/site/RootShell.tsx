import type { ReactNode } from "react";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { CloudflareAnalytics } from "@/components/site/CloudflareAnalytics";
import { ServiceWorkerRegistrar } from "@/components/site/ServiceWorkerRegistrar";
import { cn } from "@/lib/utils";
import { amiri, cairo } from "@/lib/fonts";
import { HTML_LANG, TEXT_DIR, type Locale } from "@/i18n/locales";

const SKIP_LABEL: Record<Locale, string> = {
  ar: "تخطَّ إلى المحتوى",
  fr: "Aller au contenu",
  en: "Skip to content",
};

/**
 * Shared <html>/<body> shell. Each locale has its own root layout so that
 * `lang` and `dir` are correct in the server-rendered HTML (crawlers rely on
 * this; client-side patching would not be enough).
 */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html lang={HTML_LANG[locale]} dir={TEXT_DIR[locale]}>
      <body
        className={cn(
          "min-h-screen bg-black text-white antialiased selection:bg-cyan-500/30",
          cairo.variable,
          amiri.variable,
          "font-sans",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[100] focus:rounded-lg focus:bg-cyan-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          {SKIP_LABEL[locale]}
        </a>
        <BackgroundOrbs />
        {children}
        <CloudflareAnalytics />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
