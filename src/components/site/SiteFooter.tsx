import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { SITE_CONTENT } from "@/i18n/site-content";
import { LOCALE_CONFIG, LOCALE_LABEL, LOCALES, localePath, type Locale } from "@/i18n/locales";
import { SITE } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const content = SITE_CONTENT[locale];

  return (
    <footer className="relative z-10 mx-auto mt-16 w-full max-w-3xl border-t border-white/10 px-4 py-8 text-sm text-zinc-500">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="flex items-center gap-2 text-zinc-400">
          <Heart aria-hidden="true" className="h-4 w-4 text-pink-400" />
          {content.footer.made}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Github aria-hidden="true" className="h-4 w-4" />
            {content.footer.openSource}
          </a>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span>{content.footer.license}</span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span>{SITE.brand}</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {LOCALES.map((item) => (
            <Link
              key={item}
              href={localePath(item)}
              hrefLang={LOCALE_CONFIG[item].hreflang}
              aria-current={item === locale ? "page" : undefined}
              className={
                item === locale
                  ? "font-bold text-cyan-300"
                  : "transition-colors hover:text-white"
              }
            >
              {LOCALE_LABEL[item]}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
