import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { ScoringProvider } from "@/contexts/ScoringProvider";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "رحلة الفيلسوف - لعبة الفلسفة 2 بك",
  description: "لعبة تعليمية مجانية لمادة الفلسفة للسنة الثانية بكالوريا - مراجعة وتمارين للمغرب",
  keywords: ["فلسفة 2 بك", "الفلسفة للسنة الثانية بكالوريا", "مراجعة الفلسفة", "اختبار الفلسفة", "تمارين فلسفة 2Bac", "بكالوريا فلسفة", "philosophy quiz 2bac", "امتحان فلسفة", "دروس الفلسفة"],
  openGraph: {
    title: "رحلة الفيلسوف - لعبة الفلسفة 2 بك",
    description: "لعبة تعليمية مجانية لمادة الفلسفة للسنة الثانية بكالوريا",
    type: "website",
    locale: "ar_MA",
    alternateLocale: "fr_FR",
  },
  metadataBase: new URL("https://zeos-2bac-philo-trivia.vercel.app"),
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#fdf6e3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={cn(
          "min-h-screen bg-black text-white antialiased selection:bg-cyan-500/30",
          cairo.variable,
          amiri.variable,
          "font-sans"
        )}
      >
        <SpeedInsights />
        <BackgroundOrbs />
        <ScoringProvider>
          <div className="relative z-10">
            {children}
          </div>
        </ScoringProvider>
      </body>
    </html>
  );
}
