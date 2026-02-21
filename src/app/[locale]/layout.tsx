import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import Script from "next/script";

const BASE_URL = "https://skinlab011.com";

const SEO: Record<string, { title: string; description: string; keywords: string }> = {
  me: {
    title: "SkinLab 011 – Kozmetički salon Podgorica | Tretmani lica, tijela i depilacija",
    description:
      "Moderni kozmetički salon u Podgorici. Higijenski tretmani lica, mezoterapija, mikronidling, masaže, depilacija voskom i šećernom pastom. Zakažite tretman online!",
    keywords:
      "kozmetički salon Podgorica, tretmani lica, higijenski tretman, mezoterapija, mikronidling, masaže Podgorica, depilacija voskom, depilacija šećernom pastom, SkinLab 011",
  },
  en: {
    title: "SkinLab 011 – Beauty Salon Podgorica | Facial, Body & Hair Removal Treatments",
    description:
      "Modern beauty salon in Podgorica, Montenegro. Facial treatments, mesotherapy, microneedling, massages, wax and sugar paste hair removal. Book online!",
    keywords:
      "beauty salon Podgorica, facial treatment, mesotherapy, microneedling, massage Podgorica, wax hair removal, sugar paste depilation, SkinLab 011",
  },
  ru: {
    title: "SkinLab 011 – Салон красоты Подгорица | Уход за лицом, телом и депиляция",
    description:
      "Современный салон красоты в Подгорице, Черногория. Уходовые процедуры для лица, мезотерапия, микронидлинг, массаж, депиляция воском и сахарной пастой. Запишитесь онлайн!",
    keywords:
      "салон красоты Подгорица, уход за лицом, мезотерапия, микронидлинг, массаж Подгорица, депиляция воском, сахарная паста, SkinLab 011",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO[locale] || SEO.me;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "x-default": `${BASE_URL}/me`,
        "sr-ME": `${BASE_URL}/me`,
        en: `${BASE_URL}/en`,
        ru: `${BASE_URL}/ru`,
      },
    },
    openGraph: {
      type: "website",
      url: `${BASE_URL}/${locale}`,
      siteName: "SkinLab 011",
      title: seo.title,
      description: seo.description,
      locale: locale === "me" ? "sr_ME" : locale === "ru" ? "ru_RU" : "en_US",
      images: [
        {
          url: `${BASE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "SkinLab 011 – Kozmetički salon Podgorica",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${BASE_URL}/images/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "SkinLab 011",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  image: `${BASE_URL}/images/neda.png`,
  description:
    "Moderni kozmetički salon u Podgorici. Tretmani lica, tijela, masaže i depilacija.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ul Baku 9A",
    addressLocality: "Podgorica",
    addressCountry: "ME",
  },
  telephone: "+38267487497",
  email: "skinlab011@gmail.com",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "15:00",
    },
  ],
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Card",
  sameAs: ["https://instagram.com/skinlab011"],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
      <Toaster position="bottom-right" />
    </NextIntlClientProvider>
  );
}
