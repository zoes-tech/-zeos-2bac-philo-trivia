import type { Metadata } from "next";
import "../globals.css";
import { RootShell } from "@/components/site/RootShell";
import { SITE_CONTENT } from "@/i18n/site-content";
import { buildMetadata, siteViewport } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("en", SITE_CONTENT.en.meta);
export const viewport = siteViewport;

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell locale="en">{children}</RootShell>;
}
