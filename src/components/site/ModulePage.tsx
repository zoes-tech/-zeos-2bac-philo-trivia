import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ListChecks,
  Play,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  conceptCountLabel,
  LEVEL_COPY,
  MODULE_COPY,
  MODULE_PAGE_COPY,
} from "@/i18n/content";
import {
  getCategoryCounts,
  getSampleQuestions,
  MODULES_BY_LEVEL,
  modulePath,
  type LevelId,
} from "@/lib/curriculum";
import {
  moduleBreadcrumbJsonLd,
  moduleJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import type { Module } from "@/types";

/**
 * One indexable page per curriculum module. Everything here is server-rendered:
 * a short overview, the question distribution, four worked examples (with the
 * correct answer visible) and links to related modules.
 *
 * The interactive quiz stays on the home page; the CTA deep-links into it with
 * `?module=<id>` so a shared link opens the right quiz.
 */
export function ModulePage({
  level,
  module,
}: {
  level: LevelId;
  module: Module;
}) {
  const copy = MODULE_COPY.ar[module.id] ?? {
    title: module.title,
    description: module.description,
  };
  const levelTitle = LEVEL_COPY.ar[level].title;
  const count = module.quiz?.length ?? 0;
  const categories = getCategoryCounts(module);
  const samples = getSampleQuestions(module, 4);
  const related = MODULES_BY_LEVEL[level]
    .filter((item) => item.id !== module.id)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd("ar", "رحلة الفيلسوف")} />
      <JsonLd data={moduleJsonLd(level, module)} />
      <JsonLd data={moduleBreadcrumbJsonLd(level, module)} />

      <SiteHeader locale="ar" />

      <main id="main" className="relative z-10 mx-auto max-w-3xl px-4 pb-8">
        <nav
          aria-label="مسار التنقل"
          className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-500"
        >
          <Link href="/" className="transition-colors hover:text-white">
            {MODULE_PAGE_COPY.home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/#curriculum"
            className="transition-colors hover:text-white"
          >
            {levelTitle}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-300">{copy.title}</span>
        </nav>

        <header className="pt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-bold text-cyan-200">
              {levelTitle}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
              {count} سؤالاً
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
              {conceptCountLabel(categories.length)}
            </span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            {copy.description}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            يغطي هذا المحور {module.concepts.map((concept) => concept.name).join("، ")}{" "}
            ضمن مستوى {levelTitle}. يضم بنك الأسئلة {count} سؤالاً موزعة على{" "}
            {conceptCountLabel(categories.length)}، مع تصحيح فوري ومراجعة
            للأخطاء.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                {MODULE_PAGE_COPY.startCta}
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                {MODULE_PAGE_COPY.startNote}
              </p>
            </div>
            <Link
              href={`/?module=${module.id}#play`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-shadow hover:shadow-[0_0_36px_rgba(6,182,212,0.55)]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              {MODULE_PAGE_COPY.startCta}
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-white">
            <ListChecks aria-hidden="true" className="h-5 w-5 text-cyan-300" />
            {MODULE_PAGE_COPY.categoriesTitle}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {MODULE_PAGE_COPY.categoriesIntro}
          </p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {categories.map((category) => (
              <li
                key={category.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <span className="text-zinc-200">{category.name}</span>
                <span className="shrink-0 rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-bold text-cyan-200">
                  {category.count}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-white">
            <Sparkles aria-hidden="true" className="h-5 w-5 text-purple-300" />
            {MODULE_PAGE_COPY.samplesTitle}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {MODULE_PAGE_COPY.samplesIntro}
          </p>

          <div className="mt-5 space-y-4">
            {samples.map((question, index) => (
              <article
                key={question.id}
                className="glass-panel rounded-2xl p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
                  <span>سؤال {index + 1}</span>
                  <span>{question.category || "عام"}</span>
                </div>
                <h3 className="text-base font-bold leading-relaxed text-white">
                  {question.question}
                </h3>
                <ul className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === question.correctAnswer;
                    return (
                      <li
                        key={option}
                        className={
                          isCorrect
                            ? "flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-100"
                            : "flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-zinc-400"
                        }
                      >
                        {isCorrect ? (
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-green-400"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600"
                          />
                        )}
                        <span>{option}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-xs font-bold text-green-300">
                  {MODULE_PAGE_COPY.correctAnswer}:{" "}
                  <span className="font-normal text-green-100">
                    {question.options[question.correctAnswer]}
                  </span>
                </p>
              </article>
            ))}
          </div>

          <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-zinc-400">
            {MODULE_PAGE_COPY.bankNote(count)}
          </p>
        </section>

        {module.concepts.length > 0 && (
          <section className="mt-12">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-white">
              <BookOpen aria-hidden="true" className="h-5 w-5 text-cyan-300" />
              {MODULE_PAGE_COPY.conceptsTitle}
            </h2>
            <dl className="mt-4 space-y-3">
              {module.concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <dt className="text-sm font-bold text-white">
                    {concept.name}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {concept.description}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-xl font-bold text-white">
              {MODULE_PAGE_COPY.relatedTitle}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((item) => {
                const itemCopy = MODULE_COPY.ar[item.id] ?? {
                  title: item.title,
                  description: item.description,
                };
                return (
                  <li key={item.id}>
                    <Link
                      href={modulePath(level, item.id)}
                      className="glass-panel block h-full rounded-xl p-4 transition-colors hover:border-cyan-500/30"
                    >
                      <span className="text-sm font-bold text-white">
                        {itemCopy.title}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-xs text-cyan-300">
                        {item.quiz?.length ?? 0} سؤالاً
                        <ArrowLeft aria-hidden="true" className="h-3 w-3" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Link
            href="/#curriculum"
            className="text-sm font-bold text-cyan-300 transition-colors hover:text-cyan-200"
          >
            {MODULE_PAGE_COPY.allModules}
          </Link>
          <p className="max-w-lg text-xs leading-relaxed text-zinc-500">
            {MODULE_PAGE_COPY.disclaimer}
          </p>
        </div>
      </main>

      <SiteFooter locale="ar" />
    </>
  );
}
