import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAppUrl } from "@/lib/env";
import { Toaster } from "sonner";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "CAMBA - Luyện thi Cambridge English",
    template: "%s | CAMBA",
  },
  description:
    "Nền tảng tự học luyện thi Cambridge English dành cho học sinh K12",
  openGraph: {
    type: "website",
    siteName: "CAMBA",
    title: "CAMBA - Luyện thi Cambridge English",
    description:
      "Nền tảng tự học luyện thi Cambridge English dành cho học sinh K12",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAMBA - Luyện thi Cambridge English",
    description:
      "Nền tảng tự học luyện thi Cambridge English dành cho học sinh K12",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
