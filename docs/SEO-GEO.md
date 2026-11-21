# SEO and GEO

## What is implemented

### Crawlable structure

- Ten indexable URLs: `/`, `/fr/`, `/en/` and seven theme pages such as
  `/2bac/human-condition/`, each with its own `lang`, `dir`, title,
  description and canonical.
- `hreflang` for `ar-MA`, `fr`, `en` and `x-default`, in both the HTML head and
  `sitemap.xml`.
- A real `<h1>` per page, descriptive H2s, and **server-rendered** marketing
  copy. The Arabic home page has ~500 words of visible text before any JS runs.
- `sitemap.xml`, `robots.txt` and `llms.txt` are generated from the curriculum
  data at build time, so counts and titles cannot drift.

### Structured data (JSON-LD)

| Type | Where | Purpose |
| --- | --- | --- |
| `Organization` | all pages | Entity for "Zoes Tech" |
| `WebSite` | all pages | Site entity |
| `SoftwareApplication` (`EducationalApplication`) | all pages | What the app is, free offer, features |
| `ItemList` of `LearningResource` | all pages | Each curriculum module as a learning resource |
| `FAQPage` | all pages | Question/answer pairs for answer engines |
| `BreadcrumbList` | `/fr/`, `/en/`, theme pages | Navigation |
| `Quiz` | theme pages | Per-module question count, level, related concepts |

All blocks are injected by `src/components/seo/JsonLd.tsx`, which escapes `<`
to keep the JSON safe inside `<script>`.

### Generative Engine Optimisation (GEO)

GEO is about being easy for ChatGPT, Perplexity, Claude, Gemini and AI Overviews
to quote correctly. This repo does four things:

1. **`/llms.txt`** — a short, factual, link-rich summary of the project:
   publisher, licence, price, languages, question count, themes, limits.
2. **Answer-first copy** — the FAQ gives a direct sentence before any nuance,
   which is what extractive systems quote.
3. **Consistent entity facts** — name, brand (`Zoes Tech`), licence (`MIT`),
   price (`0`), language (`ar-MA`) appear identically in metadata, JSON-LD,
   `llms.txt` and the visible page.
4. **No paywall, no login, no cookie wall** — AI crawlers and humans see the same
   content.

`robots.txt` allows every crawler. There is no `GPTBot`/`ClaudeBot` block.

### Technical hygiene

- Static HTML on a CDN, no hydration-dependent content for the marketing copy.
- Self-hosted fonts via `next/font` (no third-party font request).
- No tracking cookies. Cloudflare Web Analytics, if enabled, is cookieless.
- `_headers` sets `nosniff`, referrer policy and a frame policy.
- Open Graph/Twitter card image at `/og.png` (1200×630), plus per-locale titles.

## How to verify

```bash
npm run build
npm run preview
```

Then check:

- `http://localhost:3000/robots.txt`
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/llms.txt`
- view-source of `/`, `/fr/`, `/en/`: `lang`, `dir`, canonical, hreflang, JSON-LD
- [Rich Results Test](https://search.google.com/test/rich-results) on the
  deployed URL
- [Schema Markup Validator](https://validator.schema.org/)

## What is still weak (and the next levers)

1. **The full question bank is still client-side.** Theme pages publish four
   worked examples each plus the topic structure, but the remaining ~320
   questions only exist inside the quiz. The next lever is reviewed study
   summaries per theme, not more question dumps: thin auto-generated pages would
   cannibalise the ones that now exist.
2. **No custom domain yet.** `*.pages.dev` is indexable but has weaker trust
   signals and no branded search demand. A cheap `.com`/`.ma` with the same
   content is worth more than any metadata tweak.
3. **No backlinks.** Zero external links means zero authority. Realistic free
   options: school and teacher pages, Moroccan education forums/Facebook groups,
   GitHub topic pages, DEV.to / Hashnode write-ups, open-source directories.
4. **Thin study content.** `concepts[].content` is mostly a single sentence.
   Theme pages are honest but short (~290 words). Teachers should expand the 7
   themes into reviewed, citable summaries before promising "revision course".
5. **No freshness signal.** `lastmod` changes on every build, which is only
   honest if content changes too. Publish a changelog or dated updates.

## Search Console setup (free)

1. **Google Search Console** → add the `pages.dev` property (or custom domain).
   Verify with the existing `google4fe2f0dccb992b2c.html` file or a DNS TXT
   record.
2. Submit `https://<domain>/sitemap.xml`.
3. **Bing Webmaster Tools** → import from Search Console; submit the same
   sitemap. Bing feeds several AI answer surfaces.
4. Optional: **IndexNow** (Bing/Yandex) can be wired into the deploy workflow for
   instant indexing after each release.

## Content rules for future pages

- One page per intent: a theme page answers "what is X in the Moroccan bac",
  not "everything about philosophy".
- Answer in the first paragraph, then explain, then link to the quiz.
- Cite the curriculum axis, not vague claims. Avoid inventing exam questions or
  official statements.
- Keep Arabic as the authoritative version; French and English should be
  genuinely written, not machine-dumped duplicates.
- Every page needs a canonical and belongs in the sitemap. No orphan pages.
