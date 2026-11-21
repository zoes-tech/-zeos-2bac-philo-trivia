# Roadmap: from quiz to portal

The current release is a clean, fast, free revision tool. The goal is to turn it
into a **free acquisition and retention surface** for Zoes Tech's paid products
in edtech, economics and fintech — without turning the student experience into an
advert.

Guiding rule: every phase must ship value to students on its own. Marketing is a
consequence of being useful, not a layer on top.

## Phase 1 — Foundation (done in this pass)

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

## Phase 2 — Indexable curriculum pages

**Goal:** 7–10 pages that can rank for long-tail Arabic queries, and that AI
engines can cite.

- [x] Generate `/{level}/{module}/` pages from the curriculum data.
- [x] Each page: server-rendered overview, question distribution, four worked
      examples, related modules and `Quiz` + `BreadcrumbList` JSON-LD.
- [x] Deep-link a theme into the quiz with `?module=<id>`.
- [x] Internal links: home curriculum → theme pages → related themes.
- [ ] Expand `concepts[].content` with reviewed, teacher-approved Arabic
      summaries. This is the real content moat and the blocker for long-tail
      rankings.
- [ ] Measure: indexed pages, impressions per query cluster, average position.

**Content work required:** ~2–3 paragraphs per module (7 modules). Drafts can be
generated, but a philosophy teacher must review before publishing.

## Phase 3 — Lead capture and product showcase

**Goal:** convert free users into an owned audience, and give the paid products a
public surface.

- [ ] A `/products/` section describing each Zoes Tech product: what it does,
      who it is for, free vs paid, and a clear CTA.
- [ ] One low-friction capture: "receive a weekly 10-question quiz" by email or
      WhatsApp. Requires a provider (Resend, Buttondown, MailerLite, or a
      Cloudflare Worker + D1 table). Keep it single-field and explicit.
- [ ] Shareable result cards (score + module + link), using the Web Share API.
      This is the cheapest organic loop.
- [ ] UTM convention for every outbound product link.
- [ ] Privacy page and consent copy in Arabic, French and English.

**Do not** gate the quiz, add interstitials, or sell student data.

## Phase 4 — Accounts, sync and streaks

**Goal:** retention. A student who returns weekly is worth more than one quiz
completion.

- [ ] Optional account (magic link or passkey) — never required for the quiz.
- [ ] Cloudflare D1 schema: `users`, `progress`, `quiz_attempts`, `streaks`.
- [ ] Merge local progress into the account on first login.
- [ ] Weekly streak reminders (email/WhatsApp) with a one-click return link.
- [ ] Teacher view: class code, aggregate accuracy per theme (no personal data).

**Architecture:** Pages Functions or a separate Worker. The static site stays
static; only `/api/*` becomes dynamic.

## Phase 5 — Funnel and decision-making

- [ ] Product analytics with events: `quiz_started`, `quiz_completed`,
      `mistake_review_opened`, `share_clicked`, `product_cta_clicked`.
- [ ] Attribution: which content brings signups vs. which brings product clicks.
- [ ] A simple weekly dashboard: new users, returning users, quiz completion,
      capture rate, product click-through.
- [ ] Kill criteria: if a channel does not produce qualified clicks in 8 weeks,
      stop investing in it.

## Metrics that matter

| Stage | Metric | Target to beat |
| --- | --- | --- |
| Acquisition | organic sessions/month | baseline after Phase 2 |
| Activation | quiz completion rate | > 40 % of starts |
| Retention | 7-day return rate | > 15 % |
| Referral | shares per 100 completions | > 3 |
| Revenue intent | product CTA click-through | > 2 % of active users |

## Explicit non-goals

- No ads, no tracking pixels, no selling data.
- No AI-generated philosophy claims published without teacher review.
- No forced account creation.
- No paid hosting bill before there is revenue.
