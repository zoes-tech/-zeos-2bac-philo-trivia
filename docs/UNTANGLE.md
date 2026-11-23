# Untangle log

Scope: restructure for locality and remove dead weight. Comments are cleaned at
the same time: rationale and external-constraint comments stay, decorative ones
go. There are no tests in the repo, so the skill's test-pruning step does not
apply.

## Problems (grouped)

### 1. The same curriculum facts are written in four places

- `src/lib/curriculum.ts` hardcodes the `LevelId` union, level order, bank
  grouping, slug map and the inverse map.
- `scripts/generate-seo.mjs` copies the bank→slug table (the comment even says
  “Must match”).
- `scripts/check-content.mjs` copies the bank list a third time.
- `src/app/(ar)/[level]/[module]/page.tsx` rebuilds the module-page list while
  `MODULE_PAGES` sits unused.

**Fix:** `src/data/levels.json` is the single manifest (`id`, `slug`, `banks`).
`curriculum.ts`, both scripts and `generateStaticParams` derive from it.

### 2. The same locale facts are written in five places

- `localePath`, `HTML_LANG`, `TEXT_DIR`, `HREFLANG_PATHS` in `i18n/locales.ts`.
- `OG_LOCALES` in `lib/seo.ts`.
- Hardcoded `ar-MA`/`rtl`/`ar_MA`/`Home` in `jsonld.ts`, `manifest.json`, the
  footer, header and breadcrumb.
- `/`, `/fr/`, `/en/` repeated in `generate-seo.mjs` and `public/sw.js`.
- Locale labels duplicated in header and footer.

**Fix:** `src/data/locales.json` is the single manifest. All maps, labels,
hreflang, OG locales, SW precache and sitemap entries derive from it.

### 3. Site identity is written in three places

- Default URL, repo URL, brand and OG path/size in `lib/site.ts`.
- The same values again in `generate-seo.mjs` and `generate-og.mjs`.
- Theme colours duplicated between `seo.ts` and `manifest.json`.

**Fix:** `src/data/site.json` is the single manifest; scripts read it too.

### 4. The Arabic page is a clone of the FR/EN landing page

- `(ar)/page.tsx` and `LandingPage.tsx` assemble the same sections with already
  drifted differences (stats vs dashboard, play target, JSON-LD set).
- Header/footer/main wrappers are repeated on every page and easy to forget.
- Three JSON-LD stacks; two metadata builders; three breadcrumb
  implementations.

**Fix:** `RootShell` owns chrome and `<main id="main">`; one `LandingPage`
accepts an optional interactive island; one `PageSeo` and one
`buildPageMetadata`; one breadcrumb model rendered as both `<nav>` and JSON-LD.

### 5. Two score systems for one answer

- `ScoringProvider` owns points/streak/rank and its own `localStorage`.
- The game store owns a second `score`/`xp` and a capped history.
- `xp` is written, never read; `endQuiz` invents `xpEarned`; the result card
  needs both currencies to describe one session.

**Fix:** one persisted `points`/`currentStreak`/lifetime counters in the store;
scoring helpers stay pure; remove `ScoringProvider` and `xp`. Old `zeos-stats`
is read once for migration.

### 6. One answer event has three owners

- `QuizCard` decides the advance delay, `GameShell` decides whether to end, and
  the store decides the next index.
- Per-question state depends on a parent `key`; including the mode in the key
  restarts the timer and loses the selection.
- Four flags represent “answered”.

**Fix:** a single attempt object and two store actions (`submitAnswer`,
`advanceOrEnd`) own the transition; the card resets on `question.id` and only
renders.

### 7. “Start a quiz” is rebuilt in four places

Four call sites scan modules by hand, ignore `getModuleById`, and two produce
different titles for the same review quiz.

**Fix:** store actions `startModuleQuiz(id)`, `startDailyChallenge()`,
`startReview(refs)`; views pass ids, never question arrays.

### 8. Mistake identity is a string format owned four times

`moduleId:questionId` is encoded in `daily.ts`, decoded in the store, rebuilt in
`explanations.ts` and assumed by the JSON files; `mistakes` and
`mistakeCounts` are hand-synchronised.

**Fix:** one `QuestionRef` codec; one `mistakes: Record<key, {count, lastMissedAt}>`
in the store; `questionsForRefs` resolves them.

### 9. God components

`QuizCard` 561 lines, `GameShell` 495, `RetentionDashboard` 320, `ModulePage`
307, `i18n/content.ts` 639. Each mixes presentation, policy, copy and data
lookup.

**Fix:** split by reason to change:
- `i18n/content.ts` → `site-content`, `curriculum-copy`, `labels`.
- `GameShell` → `GameHeader`, `QuizSession`, `LevelBrowser`, `EndQuizDialog`.
- `QuizCard` → `QuizTimer`, `AnswerOptions`, `ConceptFeedback`.
- `RetentionDashboard` → four cards + one data hook.
- `ModulePage` → `SampleQuestionCard`, `Breadcrumbs`.

### 10. Dead and speculative surface

- `ui/Button.tsx` (unused, obsolete tokens).
- `MODULE_PAGES`, `TOTAL_PHILOSOPHERS`, `EXPLANATION_COUNT`, `SITE.license`,
  `footer.play`, `nav.home`.
- Store actions `addXp`, `completeQuiz`, `unlockConcept`; provider `lastAnswer`,
  `resetScore`, `getRankInfo`.
- Unused exports of internal types/helpers.

**Fix:** delete or unexport. Remove the obsolete `--color-ink/gold/parchment`
tokens.

### 11. Duplicated presentation rules

- CTA gradient copied in three places; card styling has `.glass-panel` and
  `GlassCard`; section width/z-index repeated per section; streak tiers and
  time limits copied across shell/card/lib.
- `QuizCard` passes `timeLimit` as `timeTaken` on timeout.

**Fix:** one `Cta` primitive, one surface class, one `Section`, one
`ScoreHud`, one rules module; timeouts submit without a fabricated duration.

### 12. Build-generated assets are hand-maintained

- `public/sw.js` precaches a hardcoded locale list and needs a manual cache
  version.
- `public/manifest.json` duplicates site identity.
- `og.png` embeds hardcoded counts and is only regenerated manually.

**Fix:** generate SW, manifest and OG from the manifests during `build`.

## Verification

- `npm run lint`, `tsc --noEmit`, `npm run build` including the content check.
- Browser flow: home → daily → wrong answer + explanation → next → end →
  result → review; resume after reload; study mode; module page; FR/EN pages.
- Header/JSON-LD/canonical spot checks on `/`, `/fr/`, `/en/`, one module page.
- Second read-only audit after the refactor; fix anything still worth fixing.
