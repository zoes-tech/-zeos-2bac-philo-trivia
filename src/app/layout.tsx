import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { ScoringProvider } from "@/contexts/ScoringProvider";
import { StructuredData } from "@/components/StructuredData";

const siteUrl = "https://zeos-2bac-philo-trivia.vercel.app";
const siteTitle = "رحلة الفيلسوف | اختبار الفلسفة للباكالوريا";
const siteDescription =
  "تطبيق عربي مجاني لمراجعة واختبار دروس الفلسفة لتلاميذ الباكالوريا بالمغرب، مع أسئلة تفاعلية، نظام نقاط، ومراجعة للأخطاء.";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | رحلة الفيلسوف",
  },
  description: siteDescription,
  applicationName: "رحلة الفيلسوف",
  authors: [{ name: "Zoes Tech", url: "https://github.com/zoes-tech/-zeos-2bac-philo-trivia" }],
  creator: "Zoes Tech",
  publisher: "Zoes Tech",
  category: "education",
  keywords: [
    "رحلة الفيلسوف",
    "فلسفة 2 بك",
    "فلسفة الثانية باك",
    "الفلسفة للسنة الثانية بكالوريا",
    "الفلسفة باكالوريا المغرب",
    "مراجعة الفلسفة",
    "اختبار الفلسفة",
    "تمارين فلسفة 2Bac",
    "بكالوريا فلسفة",
    "امتحان فلسفة",
    "دروس الفلسفة",
    "الوضع البشري",
    "المعرفة",
    "الأخلاق",
    "السياسة",
    "philosophy trivia app",
    "moroccan philosophy",
    "philosophy quiz 2bac",
    "philosophie 2eme annee bac",
    "quiz philosophie maroc"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "ar-MA": "/",
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "رحلة الفيلسوف",
    type: "website",
    locale: "ar_MA",
    alternateLocale: "fr_FR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "رحلة الفيلسوف - اختبار الفلسفة للباكالوريا",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
        <StructuredData />
        <SpeedInsights />
        <Analytics />
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
