import type { Metadata } from "next";
import "../globals.css";
import { RootShell } from "@/components/site/RootShell";
import { AppProviders } from "@/components/site/AppProviders";
import { SITE_CONTENT } from "@/i18n/content";
import { buildMetadata, siteViewport } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("ar", SITE_CONTENT.ar.meta);
export const viewport = siteViewport;

export default function ArabicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootShell locale="ar">
      <AppProviders>{children}</AppProviders>
    </RootShell>
  );
}
