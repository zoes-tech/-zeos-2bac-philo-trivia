# Roadmap: retention and learning first

The immediate goal is **not** to sell anything. It is to make the free revision
tool good enough that students come back on their own: clear UX, honest
progress, and a daily reason to return.

A product or "portal" layer is explicitly **out of scope until the retention and
UX bar below is met**. There is no closed-source product to link to yet, and
adding one before the free tool earns trust would be backwards.

## Phase 1 — Foundation (done)

- [x] Remove dead code, duplicate data and stale docs.
- [x] Static export, deployable to Cloudflare Pages at zero cost.
- [x] Correct `lang`/`dir` per locale, hreflang, canonicals.
- [x] JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`, `ItemList`,
      `FAQPage`), `sitemap.xml`, `robots.txt`, `llms.txt`.
- [x] French and English overview pages with original copy.
- [x] Fix the quiz double-advance race; make the review card honest when a quiz
      is ended early.
- [x] Accessibility pass: skip link, dialog semantics, `aria-live`, timer
      progressbar, reduced motion, no forced zoom lock.
- [x] Offline service worker without a 400 KB Workbox artifact.

## Phase 2 — Indexable curriculum pages (done)

- [x] Generate `/{level}/{module}/` pages from the curriculum data.
- [x] Each page: overview, question distribution, four worked examples, related
      modules and `Quiz` + `BreadcrumbList` JSON-LD.
- [x] Deep-link a theme into the quiz with `?module=<id>`.
- [x] Internal links: home curriculum → theme pages → related themes.
- [ ] Measure indexed pages, impressions and average position in Search Console.

## Phase 3 — Retention loops and UX (done in this pass)

- [x] **Real daily streak** (one increment per local day, resets after a gap).
- [x] **Daily challenge**: ten deterministic questions per day, drawn from all
      three levels, identical for every student.
- [x] **Mistake bank**: every wrong answer is stored and can be replayed as a
      quiz; a correct answer removes it.
- [x] **Resume**: an interrupted quiz survives a reload.
- [x] **Study mode**: no timer and no speed bonus, for calm revision.
- [x] **Dashboard** above the quiz: daily challenge, mistake review, resume and
      personal numbers.
- [x] **Skip** an individual question; **confirm** before ending a quiz.
- [x] **Keyboard shortcuts** (1–4, Enter) on desktop.
- [x] **Share result** via the Web Share API, linking back to the module page.
- [x] Client providers mounted only around the islands; the marketing page
      stays at ~170 KB gzip initial JS.

## Phase 4 — Learning quality (next)

Retention without learning is a game; learning without retention is a PDF. This
phase is about making the quiz teach, not just score.

- [ ] **Answer explanations.** Add an optional `explanation` field to questions
      and show it after a wrong answer. Even 30–50 reviewed explanations on the
      most-missed questions would be a real improvement.
- [ ] **Teacher-reviewed summaries** for the seven themes (`concepts[].content`).
      This is also the content moat for SEO and AI citations.
- [ ] **Adaptive review ordering**: prioritise questions missed more than once.
- [ ] **First-visit onboarding**: one screen, "what this is", recommended start,
      and a single primary action. No carousel.
- [ ] **Install prompt**: offer "add to home screen" after the second visit.
- [ ] **Session summary**: weakest concept of the session + one next action.
- [ ] **Performance budget**: keep initial JS under 180 KB gzip and LCP under
      2.5 s on a mid-range phone.

## Phase 5 — Accounts, sync and reminders (only if retention justifies it)

Gate: only start this if the 7-day return rate is above 15 % and the daily
challenge completion rate is healthy. Otherwise the problem is the product, not
the backend.

- [ ] Optional account (magic link or passkey) — never required for the quiz.
- [ ] Cloudflare D1 schema: `users`, `progress`, `quiz_attempts`, `streaks`.
- [ ] Merge local progress into the account on first login.
- [ ] Weekly streak reminder (email/WhatsApp) with a one-click return link.
- [ ] Teacher view: class code and aggregate accuracy per theme (no personal
      data).

**Architecture:** Pages Functions or a separate Worker. The static site stays
static; only `/api/*` becomes dynamic.

## Phase 6 — Products and lead capture (deferred)

Only after Phases 3–5 show that students return and learn. At that point, and
only then, a showcase for Zoes Tech products can be added.

- [ ] Product pages with real, verifiable descriptions (no placeholders).
- [ ] One low-friction capture, clearly optional.
- [ ] Shareable result cards with a branded image.
- [ ] UTM convention and a privacy page in Arabic, French and English.

**Do not** gate the quiz, add interstitials, or sell student data.

## Metrics that matter

| Stage | Metric | Target to beat |
| --- | --- | --- |
| Activation | quiz completion rate | > 40 % of starts |
| Habit | daily challenge completion | > 25 % of active days |
| Habit | streak of 3+ days | > 20 % of returning users |
| Retention | 7-day return rate | > 15 % |
| Learning | mistake-review completion | > 30 % of opened reviews |
| Referral | shares per 100 completions | > 3 |
| Performance | initial JS (home) | < 180 KB gzip |

## Explicit non-goals

- No products or upsells before retention and UX targets are met.
- No ads, no tracking pixels, no selling data.
- No AI-generated philosophy claims published without teacher review.
- No forced account creation.
- No paid hosting bill before there is revenue.
