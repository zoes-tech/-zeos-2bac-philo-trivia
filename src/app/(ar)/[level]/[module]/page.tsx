import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePage } from "@/components/site/ModulePage";
import { findModule, MODULE_PAGES } from "@/lib/curriculum";
import { buildModuleMetadata } from "@/lib/seo";

type PageParams = { level: string; module: string };

/** Every module page is known at build time. */
export function generateStaticParams(): PageParams[] {
  return MODULE_PAGES.map(({ levelSlug, moduleId }) => ({
    level: levelSlug,
    module: moduleId,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { level, module: moduleId } = await params;
  const found = findModule(level, moduleId);
  if (!found) return {};
  return buildModuleMetadata(found.level, found.module, "ar");
}

export default async function CurriculumModulePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { level, module: moduleId } = await params;
  const found = findModule(level, moduleId);
  if (!found) notFound();

  return <ModulePage level={found.level} module={found.module} locale="ar" />;
}
