# رحلة الفيلسوف — Philosopher's Journey

A free, open-source philosophy quiz for Moroccan Baccalaureate students.

**349 questions · 7 curriculum themes · 3 school levels · Arabic (RTL), with French and English overview pages.**

- Live (free Cloudflare Pages URL): <https://zoes-philo.pages.dev>
- Maintained by [Zoes Tech](https://github.com/zoes-tech)
- Licence: MIT

## Why this exists

Most philosophy revision material for the Moroccan bac is either paid, locked
inside a school platform, or buried in PDFs. This project is a small, fast,
installable quiz that works offline and collects no personal data. It stays
free, open source and free of product pitches.

## Features

- **349 questions** across 7 themes and 3 levels (tronc commun, 1re and 2e bac).
- **7 indexable theme pages** (`/2bac/human-condition/`, …) with an overview,
  question distribution, worked examples and links to the quiz.
- **Daily challenge** (10 deterministic questions per day) with a real daily
  streak, so there is a reason to come back tomorrow.
- **Mistake bank**: every wrong answer is stored locally and can be replayed as
  its own quiz; repeated misses are reviewed first, and correct answers remove
  them.
- **Concept feedback**: a wrong answer stays on screen with the related concept,
  a short Arabic explanation and a link to the full theme page, instead of
  auto-advancing.
- **Resume**: an interrupted quiz is persisted and restored on the next visit.
- **Study mode**: a no-timer, no-speed-bonus mode for calm revision.
- **Instant feedback** with a mistake-review card at the end of every quiz.
- **Gamification**: base points, speed bonus, streak multipliers up to ×2.5.
- **Offline-first**: progressive web app with a hand-written service worker.
- **Share results** with the Web Share API (falls back to copying a link), plus
  a "weakest concept" summary at the end of each session.
- **First-visit onboarding** on the dashboard, dismissible and never repeated.
- **Private by design**: no accounts, no server, no analytics cookies; progress
  lives in `localStorage`.
- **Trilingual web presence**: the app is Arabic; `/fr/` and `/en/` are
  informational landing pages with unique copy, hreflang and JSON-LD.
- **Static and free to host**: `next build` emits `out/`, deployed to
  Cloudflare Pages.

## Stack

Next.js 16 (static export) · React 19 · Tailwind CSS 4 · Zustand ·
Framer Motion · TypeScript.

There is no backend. The "server" is Cloudflare Pages serving static files.

## Project layout

```text
src/
  app/
    (ar)/            Arabic app at /            (own <html lang="ar-MA" dir="rtl">)
    (fr)/fr/         French overview at /fr/     (own <html lang="fr" dir="ltr">)
    (en)/en/         English overview at /en/    (own <html lang="en" dir="ltr">)
    (ar)/[level]/[module]/   Theme pages, e.g. /2bac/human-condition/
    globals.css
  components/
    game/            GameShell: the client-side quiz island
    site/            Header, hero, FAQ, footer, providers
    ui/              GlassCard, LiquidButton, background orbs
    seo/             JSON-LD renderer
  data/curriculum/   Question banks (JSON)
  i18n/              Locale config and all site copy
  lib/               Curriculum index, SEO, JSON-LD, scoring, site config
  store/             Zustand game store (progress in localStorage)
scripts/
  generate-seo.mjs   robots.txt, sitemap.xml, llms.txt → out/
  generate-og.mjs    public/og.png (1200×630) from SVG
```

Each locale has its own root layout so `lang`/`dir` are correct in the
server-rendered HTML. Navigation between locales performs a full page load,
which is the expected behaviour for a static multilingual site.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Requirements: Node.js ≥ 20.9.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export to `out/`, then generates SEO files |
| `npm run preview` | Serves `out/` locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run og` | Regenerates `public/og.png` |
| `npm run deploy` | `wrangler pages deploy out` |

## Curriculum data

Each JSON file is an array of modules:

```json
{
  "id": "human-condition",
  "title": "الوضع البشري",
  "description": "الشخص والغير: الهوية، الحرية، والعلاقة بالآخر.",
  "concepts": [{ "id": "person", "name": "الشخص", "description": "…", "content": "…" }],
  "quiz": [
    {
      "id": "q1",
      "question": "…",
      "options": ["…", "…", "…", "…"],
      "correctAnswer": 1,
      "category": "الشخص"
    }
  ],
  "philosopher": { "id": "sartre", "name": "جان بول سارتر", "era": "القرن 20", "bio": "…", "quote": "…" }
}
```

`src/lib/curriculum.ts` is the single place that imports and aggregates the
banks. Counts on the site, in the sitemap, in `llms.txt` and on the generated
theme pages are derived from this data, so adding questions updates everything
after one build.

Adding a module also creates its page at `/{level-slug}/{module-id}/`
automatically (`generateStaticParams`).

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://zoes-philo.pages.dev` | Canonical URL, sitemap, robots, OG, JSON-LD |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | unset | Optional Cloudflare Web Analytics beacon |

`NEXT_PUBLIC_SITE_URL` is inlined at build time. Changing domains is a one-line
change plus a rebuild — see [`docs/DEPLOY-CLOUDFLARE.md`](docs/DEPLOY-CLOUDFLARE.md).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deploying to Cloudflare Pages](docs/DEPLOY-CLOUDFLARE.md)
- [SEO and GEO](docs/SEO-GEO.md)
- [Content guide](docs/CONTENT.md)
- [Roadmap: retention and learning first](docs/ROADMAP.md)

## Privacy

No account, no server-side database, no tracking cookies. Progress and scores
are stored in the browser (`zeos-stats`, `zeos-game-storage`). The storage keys
keep their historical names so existing users do not lose progress.

## Licence

MIT — see [LICENSE](LICENSE). Contributions are welcome.
