import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Github,
  Languages,
  ShieldCheck,
  Target,
  WifiOff,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LEVEL_COPY, MODULE_COPY } from "@/i18n/curriculum-copy";
import { questionCountLabel } from "@/i18n/labels";
import type { SiteContent } from "@/i18n/site-content";
import type { Locale } from "@/i18n/locales";
import { LEVELS, MODULES_BY_LEVEL, modulePath } from "@/lib/curriculum";

const FEATURE_ICONS: LucideIcon[] = [
  Target,
  Zap,
  WifiOff,
  ShieldCheck,
  Languages,
  Github,
];

export function Hero({
  content,
  playHref,
}: {
  content: SiteContent;
  playHref: string;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 pb-10 pt-8 text-center">
      <p className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-200">
        {content.hero.eyebrow}
      </p>

      <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl">
        <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-300 bg-clip-text drop-shadow-[0_0_18px_rgba(6,182,212,0.35)]">
          {content.hero.title}
        </span>{" "}
        <span className="mt-3 block text-lg font-normal text-zinc-300 sm:text-xl">
          {content.hero.titleLine2}
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
        {content.hero.subtitle}
      </p>

      {content.hero.note && (
        <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-zinc-500">
          {content.hero.note}
        </p>
      )}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={playHref}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-shadow hover:shadow-[0_0_36px_rgba(6,182,212,0.55)] sm:w-auto"
        >
          {content.hero.primaryCta}
        </Link>
        <a
          href="#curriculum"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-zinc-200 transition-colors hover:bg-white/10 sm:w-auto"
        >
          {content.hero.secondaryCta}
        </a>
      </div>
    </section>
  );
}

export function StatsGrid({ content }: { content: SiteContent }) {
  return (
    <section
      aria-label={content.hero.title}
      className="relative z-10 mx-auto max-w-3xl px-4 pb-12"
    >
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {content.stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel flex flex-col-reverse rounded-2xl px-4 py-4 text-center"
          >
            <dt className="mt-1 text-xs text-zinc-400">{stat.label}</dt>
            <dd className="text-2xl font-bold text-white">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function FeatureGrid({ content }: { content: SiteContent }) {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-14">
      <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
        {content.features.title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:text-base">
        {content.features.intro}
      </p>

      <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.features.items.map((item, index) => {
          const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
          return (
            <li
              key={item.title}
              className="glass-panel rounded-2xl p-5 transition-colors hover:border-cyan-500/30"
            >
              <Icon
                aria-hidden="true"
                className="h-5 w-5 text-cyan-300"
              />
              <h3 className="mt-3 text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.text}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function CurriculumList({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const levelCopy = LEVEL_COPY[locale];
  const moduleCopy = MODULE_COPY[locale];

  return (
    <section
      id="curriculum"
      className="relative z-10 mx-auto max-w-5xl scroll-mt-8 px-4 py-14"
    >
      <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
        {content.curriculum.title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:text-base">
        {content.curriculum.intro}
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {LEVELS.map((level) => (
          <div key={level.id}>
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-cyan-300">
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              {levelCopy[level.id].title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {levelCopy[level.id].description}
            </p>

            <ul className="mt-4 space-y-3">
              {MODULES_BY_LEVEL[level.id].map((module) => {
                const copy = moduleCopy[module.id];
                const count = module.quiz?.length ?? 0;
                return (
                  <li
                    key={module.id}
                    className="glass-panel rounded-xl p-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="text-sm font-bold text-white">
                        {locale === "ar" ? (
                          <Link
                            href={modulePath(level.id, module.id)}
                            className="transition-colors hover:text-cyan-300"
                          >
                            {copy?.title ?? module.title}
                          </Link>
                        ) : (
                          (copy?.title ?? module.title)
                        )}
                      </h4>
                      <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                        {questionCountLabel(locale, count)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                      {copy?.description ?? module.description}
                    </p>
                    {locale === "ar" && (
                      <Link
                        href={modulePath(level.id, module.id)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 transition-colors hover:text-cyan-200"
                      >
                        صفحة المحور
                        <ArrowLeft aria-hidden="true" className="h-3 w-3" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks({ content }: { content: SiteContent }) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 py-14">
      <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
        {content.how.title}
      </h2>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {content.how.steps.map((step, index) => (
          <li key={step.title} className="glass-panel rounded-2xl p-5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FaqSection({ content }: { content: SiteContent }) {
  return (
    <section
      id="faq"
      className="relative z-10 mx-auto max-w-3xl scroll-mt-8 px-4 py-14"
    >
      <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
        {content.faq.title}
      </h2>
      <p className="mt-3 text-center text-sm text-zinc-400">
        {content.faq.intro}
      </p>

      <div className="mt-8 space-y-3">
        {content.faq.items.map((item) => (
          <details
            key={item.q}
            className="glass-panel group rounded-xl px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white">
              {item.q}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-cyan-300 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
