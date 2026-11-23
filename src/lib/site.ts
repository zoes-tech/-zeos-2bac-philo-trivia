/**
 * Single source of truth for the site's public identity.
 *
 * `NEXT_PUBLIC_SITE_URL` is inlined at build time. Set it in the Cloudflare
 * Pages project (Settings → Environment variables) once a real domain exists;
 * until then the free `*.pages.dev` URL is used.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoes-philo.pages.dev";

export const SITE = {
  url: rawUrl.replace(/\/+$/, ""),
  name: "رحلة الفيلسوف",
  nameEn: "Philosopher's Journey",
  brand: "Zoes Tech",
  github: "https://github.com/zoes-tech/-zeos-2bac-philo-trivia",
  license: "MIT",
  ogImage: "/og.png",
  ogImageSize: { width: 1200, height: 630 },
} as const;
