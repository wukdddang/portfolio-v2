import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("homeTitle");
  const description = t("homeDescription");

  // 검색엔진 소유권 인증 — Search Console / 네이버 서치어드바이저에서 발급한
  // 토큰을 환경변수로 주입하면 <meta> 태그로 노출 (미설정 시 태그 생략).
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const naverVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: "Changwook Woo · Portfolio",
    authors: [{ name: "우창욱 (Changwook Woo)", url: "https://github.com/wukdddang" }],
    creator: "우창욱 (Changwook Woo)",
    keywords: [
      "우창욱", "Changwook Woo", "Lumir", "루미르",
      "Portfolio", "Web Developer", "Full-stack", "AI Native",
      "SAR", "Satellite", "Sentinel", "InSAR",
      "Next.js", "NestJS", "TypeScript",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { ko: "/ko", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: "Changwook Woo · Portfolio",
      title,
      description,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      alternateLocale: locale === "ko" ? "en_US" : "ko_KR",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(naverVerification
        ? { other: { "naver-site-verification": naverVerification } }
        : {}),
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Pretendard full variable CDN — 모든 한글 글리프 보장. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Nav />
          <main className="flex-1">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
