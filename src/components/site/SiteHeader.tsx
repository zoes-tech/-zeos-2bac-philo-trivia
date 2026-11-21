import Link from "next/link";
import { Github } from "lucide-react";
import { LOCALES, localePath, type Locale } from "@/i18n/locales";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV: Record<
  Locale,
  { home: string; curriculum: string; faq: string; language: string; navLabel: string }
> = {
  ar: {
    home: "الرئيسية",
    curriculum: "المحاور",
    faq: "الأسئلة الشائعة",
    language: "اللغة",
    navLabel: "التنقل",
  },
  fr: {
    home: "Accueil",
    curriculum: "Thèmes",
    faq: "FAQ",
    language: "Langue",
    navLabel: "Navigation",
  },
  en: {
    home: "Home",
    curriculum: "Themes",
    faq: "FAQ",
    language: "Language",
    navLabel: "Navigation",
  },
};

const LOCALE_LABEL: Record<Locale, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
};

export function SiteHeader({ locale }: { locale: Locale }) {
  const nav = NAV[locale];

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5">
      <Link
        href={localePath(locale)}
        className="flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 font-serif text-lg font-bold text-white shadow-[0_0_18px_rgba(6,182,212,0.45)]"
        >
          ف
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold text-white sm:text-base">
            {SITE.name}
          </span>
          <span className="block text-[11px] text-zinc-500">
            {SITE.brand}
          </span>
        </span>
      </Link>

      <nav
        aria-label={nav.navLabel}
        className="flex items-center gap-1 text-sm text-zinc-400"
      >
        <Link
          href="#curriculum"
          className="rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
        >
          {nav.curriculum}
        </Link>
        <Link
          href="#faq"
          className="rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/5 hover:text-white"
        >
          {nav.faq}
        </Link>

        <span
          aria-hidden="true"
          className="mx-1 hidden h-4 w-px bg-white/10 sm:block"
        />

        <span className="sr-only">{nav.language}</span>
        {LOCALES.map((item) => (
          <Link
            key={item}
            href={localePath(item)}
            hrefLang={item}
            aria-current={item === locale ? "page" : undefined}
            title={LOCALE_LABEL[item]}
            className={cn(
              "rounded-lg px-1.5 py-1 text-xs font-bold uppercase tracking-wide transition-colors",
              item === locale
                ? "text-cyan-300"
                : "text-zinc-500 hover:text-white",
            )}
          >
            {item}
          </Link>
        ))}

        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="ms-1 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Github className="h-4 w-4" />
        </a>
      </nav>
    </header>
  );
}
