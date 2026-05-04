export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    name: "رحلة الفيلسوف",
    alternateName: "اختبار الفلسفة للباكالوريا",
    description:
      "تطبيق تعليمي مجاني لاختبار ومراجعة دروس الفلسفة لتلاميذ الباكالوريا بالمغرب، مع أسئلة تفاعلية، تتبع للنقاط، ومراجعة للأخطاء.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, Android, iOS",
    inLanguage: "ar-MA",
    isAccessibleForFree: true,
    url: "https://zeos-2bac-philo-trivia.vercel.app/",
    educationalLevel: "Baccalaureate",
    teaches: ["الفلسفة", "الوعي واللاوعي", "الوضع البشري", "المعرفة", "الأخلاق", "السياسة"],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "تلاميذ الباكالوريا بالمغرب",
    },
    creator: {
      "@type": "Organization",
      name: "Zoes Tech",
      url: "https://github.com/zoes-tech/-zeos-2bac-philo-trivia",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MAD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
