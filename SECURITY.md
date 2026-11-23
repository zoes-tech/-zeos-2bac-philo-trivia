# Security policy

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting:

<https://github.com/zoes-tech/-zeos-2bac-philo-trivia/security/advisories/new>

Do not open a public issue for a vulnerability. Include the affected URL or file,
reproduction steps, and impact. This is a volunteer open-source project, so there
is no bug bounty; credit is given in the advisory unless you prefer otherwise.

## Scope

This is a **static site**. There is no server-side API, database, account system
or file upload. The deployable artifact is the `out/` directory produced by
`npm run build` and served by Cloudflare Pages.

In scope:

- the generated site, service worker and headers;
- client-side storage handling (`localStorage`) and quiz state;
- dependency and supply-chain issues that affect the production build;
- CI workflow and repository configuration.

Out of scope:

- Cloudflare's own infrastructure and Pages platform;
- volumetric denial of service;
- social engineering and phishing;
- issues that require a compromised browser, extension or device;
- old deployments that are no longer served.

## Handling of user data

- No account, no analytics cookies, no server-side storage.
- Progress, streaks and mistakes live in the browser under `zeos-*` keys.
- The optional Cloudflare Web Analytics beacon is cookieless and only enabled
  when `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` is set at build time.
- The quiz never asks for a name, email, phone number or location.

## What we already do

- Static export; no dynamic server code to exploit.
- Security headers in `public/_headers`: CSP, HSTS, `nosniff`, frame denial,
  referrer policy, permissions policy, COOP/CORP.
- `npm audit --omit=dev` is part of CI; production dependencies must stay at zero
  known vulnerabilities.
- Dependabot watches npm and GitHub Actions dependencies.
- GitHub Actions runs with `contents: read` and does not persist the checkout
  token.
- No secrets are committed; Cloudflare credentials live in repository secrets.

## CSP limitation

Next.js injects inline bootstrap and RSC scripts into the static HTML. A nonce is
not possible with static export and Cloudflare Pages, so the policy allows
`'unsafe-inline'` for scripts. External scripts are still restricted to the site
and the Cloudflare analytics host. If the app ever adds a server runtime, move to
a nonce-based policy.

## Supported versions

Only the `main` branch and the current Pages deployment are supported. There is no
LTS branch.
