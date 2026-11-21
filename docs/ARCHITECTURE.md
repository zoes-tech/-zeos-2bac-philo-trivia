# Architecture

## Shape of the system

This is a **static site with one interactive island**.

```text
Request ──> Cloudflare Pages (static files)
                 │
                 ├── /            Arabic app: server-rendered landing + quiz island
                 ├── /fr/         French overview (pure HTML)
                 ├── /en/         English overview (pure HTML)
                 ├── /sitemap.xml /robots.txt /llms.txt   (generated at build)
                 └── /sw.js       offline service worker
```

There is no API, no database and no server runtime. Everything the quiz needs
is bundled at build time; user state is local.

## Route groups

The three locales are separate root layouts, because `lang` and `dir` must be
correct in the **server-rendered** HTML:

| Route | Layout | `<html>` |
| --- | --- | --- |
| `/` | `src/app/(ar)/layout.tsx` | `lang="ar-MA" dir="rtl"` |
| `/fr/` | `src/app/(fr)/layout.tsx` | `lang="fr" dir="ltr"` |
| `/en/` | `src/app/(en)/layout.tsx` | `lang="en" dir="ltr"` |
| `/[level]/[module]/` | `src/app/(ar)/[level]/[module]/page.tsx` | Arabic theme pages |

Client-side patching of `document.documentElement.lang` would not be enough for
crawlers, hence the separate roots. A side effect is that switching language
does a full page load, which is fine (and cacheable) for static content.

## Rendering model

- `src/app/(ar)/page.tsx` is a **server component**. It renders the hero,
  stats, features, curriculum list, how-it-works, FAQ and footer as static HTML.
- `GameShell` (`src/components/game/GameShell.tsx`) is the only client island
  on the home page. It owns the quiz screens, the level map and the result card.
- `RetentionDashboard` is a second lazy island, above the quiz. It owns the
  daily challenge, mistake review, resume card and streak. It is loaded with
  `ssr: false` so the store and the question bank do not enter the initial
  bundle; the server HTML reserves a skeleton with the same height.
- Theme pages (`/[level]/[module]/`) are **fully server-rendered**. They reuse
  the JSON data to publish an overview, the per-concept question distribution,
  four worked examples and internal links. No client providers are mounted
  there, so they ship only the Next/React baseline.
- `?module=<id>` on the home page deep-links into a quiz; theme pages use it for
  their CTA, and it makes shared links open the right module.
- `RootShell` adds the shared `<html>/<body>`, providers, background orbs,
  skip link, optional analytics and the service-worker registration.
- `AppProviders` wraps `MotionConfig reducedMotion="user"` and `ScoringProvider`.
  It is mounted on the home page only, around `GameIsland`, not in the locale
  layout, so theme pages do not pay for Framer Motion or the scoring context.

Keeping marketing copy server-rendered is what makes the page indexable: the
Arabic home page ships ~500 words of visible text plus five JSON-LD graphs,
instead of an empty client shell.

## State

Two stores, on purpose:

1. **`ScoringProvider`** (`src/contexts/ScoringProvider.tsx`) — points, answer
   streak, rank and multiplier for the current session; persisted under
   `zeos-stats`. It deliberately does **not** track days.
2. **`useGameStore`** (`src/store/useStore.ts`) — everything durable: level,
   unlocked philosophers, completed quizzes, **daily streak**, **mistake bank**,
   **recent results**, **daily challenge result**, quiz mode and the
   **in-progress quiz**. Persisted with Zustand under `zeos-game-storage`.

Daily activity is owned by the game store because it must survive without the
quiz being mounted. `answerQuiz` touches the day once (local date, not UTC) and
increments `dailyStreak` only when the previous activity was yesterday.

The old `progressStore.ts` duplicated both and was never imported; it was
removed. Storage keys keep the historical `zeos-` prefix so returning users do
not lose progress. Do not rename them without a migration.

`QuizCard` is mounted with `key={moduleId-index-mode}` so each question (and a
mode switch) gets a fresh component. That replaced an effect-based reset and avoids cascading renders.
Answering schedules exactly one advance (1.4 s), which fixes the old
double-advance race between the page-level timeout and the manual "next" button.

## Retention mechanics

- **Daily challenge** (`src/lib/daily.ts`): a seeded PRNG builds the same ten
  questions for everyone on a given local date, drawing round-robin from the
  three levels. No server, no leaderboard, no coordination.
- **Mistake bank**: keys are `moduleId:questionId` because question ids repeat
  across modules. Wrong answers are added; correct answers remove the key.
- **Resume**: `currentQuiz` is part of the persisted state, including the
  question list, index and review items. Reloading restores it and shows a
  "resumed" banner. The timer restarts for the current question.
- **Study mode**: no countdown and no speed bonus; `quizMode` persists.
- **Streak**: one increment per local day, regardless of how many quizzes were
  played. Missing a day resets to 1 on the next activity.

## Static-export constraints

These are intentional, not accidental:

- **No `runtime = "edge"` routes.** The OG image is a committed PNG generated by
  `scripts/generate-og.mjs`, because Next cannot render `next/og` without a
  server.
- **No `next headers()` / `redirects()`.** Security and cache headers live in
  `public/_headers`, which Pages applies.
- **No dynamic `sitemap.ts`.** `scripts/generate-seo.mjs` writes
  `robots.txt`, `sitemap.xml` and `llms.txt` into `out/` after the build, from
  the same JSON data the pages use.
- **No image optimisation.** `images.unoptimized` is required by static export;
  icons are plain PNGs.

## PWA and offline behaviour

`public/sw.js` is a small hand-written worker (no Workbox build step):

- `_next/static/*` → cache-first with an immutable cache.
- navigations → network-first, falling back to the cached page, then `/`.
- other same-origin GETs → stale-while-revalidate.

Bump `CACHE_VERSION` when cached HTML changes meaningfully. The worker is
registered only in production and failures are swallowed — offline support is an
enhancement, never a blocker.

## Fonts

`next/font/google` self-hosts Cairo (UI) and Amiri (headings) at build time and
exposes them as `--font-cairo` / `--font-amiri`. No runtime request to Google.

## Accessibility decisions

- A skip link, `aria-live` feedback in the quiz, `progressbar` semantics for the
  timer, dialog semantics and Escape handling for the philosopher modal.
- `MotionConfig reducedMotion="user"` honours the OS setting.
- Entrance animations were removed from server-rendered cards: content must not
  start at `opacity: 0`, otherwise no-JS users and crawlers see blank space.
- `maximumScale` is not set, so pinch-zoom keeps working.
