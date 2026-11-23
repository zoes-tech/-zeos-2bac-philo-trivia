import Script from "next/script";

/**
 * Cloudflare Web Analytics is cookieless and free. It can also be enabled
 * from the Pages dashboard (which injects the beacon automatically); setting
 * NEXT_PUBLIC_CF_ANALYTICS_TOKEN is the explicit, version-controlled route.
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
