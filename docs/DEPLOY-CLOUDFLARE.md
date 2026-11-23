# Deploying to Cloudflare Pages

Everything here is free-tier friendly: the site is static, so Pages serves files
from its CDN and there is no compute bill.

## How the deploy works

```text
push to main
   │
   ▼
GitHub Actions (.github/workflows/deploy.yml)
   ├── npm ci
   ├── npm run typecheck
   ├── npm run lint
   ├── npm run build          → out/
   └── wrangler pages deploy out --project-name zoes-philo
```

## 1. Create the Pages project (once)

Either create it in the dashboard:

> **Workers & Pages → Create → Pages → Upload assets** → name it `zoes-philo`

…or with wrangler:

```bash
npx wrangler login
npx wrangler pages project create zoes-philo --production-branch main
```

## 2. Add repository secrets

In GitHub → **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Create a **custom token** with exactly **Account → Cloudflare Pages → Edit**, limited to the one account. Do not use a global/API key token. |
| `CLOUDFLARE_ACCOUNT_ID` | Right-hand sidebar of the Workers & Pages overview, or any zone's overview page. |

Optional repository **variable** (Settings → Variables):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical URL, e.g. `https://philo.example.com`. Defaults to `https://zoes-philo.pages.dev`. |

## 3. Security checks in CI

The workflow runs before every deploy:

- `npm audit --omit=dev --audit-level=high` — production dependencies must have
  no high/critical advisory;
- typecheck and lint;
- the content integrity check (349/349 explanations).

`public/_headers` ships the security headers (CSP, HSTS, frame denial, referrer
and permissions policies). See [`SECURITY.md`](../SECURITY.md).

## 4. Deploy

Push to `main`, or run the workflow manually:

> **Actions → Deploy to Cloudflare Pages → Run workflow**

## 5. Attach a domain

Free option: use the generated `https://zoes-philo.pages.dev` URL. It is
indexable and HTTPS by default.

Custom domain later:

1. Add the zone to Cloudflare (or use an existing zone).
2. Pages project → **Custom domains → Set up a domain**.
3. Point the domain at the project (Cloudflare creates the CNAME for you).
4. Set the `SITE_URL` repository variable to the new origin.
5. Re-run the workflow.

Because every URL is derived from `NEXT_PUBLIC_SITE_URL`, this updates the
canonical tag, hreflang, Open Graph URLs, sitemap, robots and JSON-LD in one
build. No find-and-replace.

## 6. Retire the Vercel deployment

Only after the Pages URL and (if used) the custom domain serve the new site:

1. verify canonical, sitemap and hreflang point to the new origin;
2. keep the old Vercel project for a short rollback window if you need it;
3. then delete the Vercel project and remove its domain/DNS records.

Leaving both live splits indexing and keeps an unmaintained deployment online.

## Headers and caching

`public/_headers` is copied into `out/` and applied by Pages:

- immutable one-year caching for `/_next/static/*`
- `no-cache` for `sw.js`
- `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`

A strict Content-Security-Policy is deliberately **not** enabled yet: Next emits
inline bootstrap scripts, so a CSP needs a nonce/hash strategy that static export
cannot provide. If you enable one, use a Cloudflare Transform Rule and test
thoroughly.

## Rollbacks

Every Pages deployment is immutable. Open the project → **Deployments**, pick a
previous one → **Rollback**. No rebuild required.

## Local preview

```bash
npm run build
npm run preview     # serves out/ with correct trailing-slash behaviour
```

`npx serve` is used because it resolves `/fr/` to `/fr/index.html`. A bare
`python -m http.server` will not match the routing.

## Why Pages and not Workers

Cloudflare now recommends Workers with static assets for new projects. Pages is
still fully supported and is the simplest fit here: zero functions, zero
bindings, zero runtime. If a backend is added later (accounts, leaderboards,
email capture), the migration path is `wrangler.toml` + Pages Functions, or a
move to Workers — see [`ROADMAP.md`](ROADMAP.md).
