import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const robots = `User-agent: *
Allow: /
Sitemap: https://zeos-2bac-philo-trivia.vercel.app/sitemap.xml`;
  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}