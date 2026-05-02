import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: google4fe2f0dccb992b2c.html", {
    headers: {
      "Content-Type": "text/html",
    },
  });
}