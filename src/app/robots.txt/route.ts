import { NextResponse } from "next/server";

export async function GET() {
  const robots = `User-agent: *
Allow: /
Sitemap: https://zeos-2bac-philo-trivia.vercel.app/sitemap.xml`;
  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}