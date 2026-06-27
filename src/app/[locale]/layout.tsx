import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAppUrl } from "@/lib/env";
import { ContactFabHost } from "@/components/contact/contact-fab-host";
import { SiteCopyEditShell } from "@/components/admin/site-copy/site-copy-edit-shell";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isAdmin } from "@/lib/auth/roles";
import { getSiteTextOverrides } from "@/lib/site-copy/overrides";
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
    default: "CAMBA - Nền tảng tự học Tiếng Anh",
    template: "%s | CAMBA",
  },
  description:
    "Nền tảng tự học đa chương trình — Cambridge, IELTS, SAT, ĐGNL — có AI chấm sửa",
  openGraph: {
    type: "website",
    siteName: "CAMBA",
    title: "CAMBA - Nền tảng tự học Tiếng Anh",
    description:
      "Nền tảng tự học đa chương trình — Cambridge, IELTS, SAT, ĐGNL — có AI chấm sửa",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAMBA - Nền tảng tự học Tiếng Anh",
    description:
      "Nền tảng tự học đa chương trình — Cambridge, IELTS, SAT, ĐGNL — có AI chấm sửa",
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
  const user = await getCurrentUser();
  const admin = user ? isAdmin(user.roles) : false;
  const overrides = admin ? await getSiteTextOverrides(locale) : {};
  const baseMessages = admin
    ? (await import(`@/i18n/messages/${locale}.json`)).default
    : messages;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteCopyEditShell
          locale={locale}
          isAdmin={admin}
          messages={messages}
          baseMessages={baseMessages}
          overrides={overrides}
        >
          {children}
          <Toaster position="top-right" richColors />
          <ContactFabHost />
        </SiteCopyEditShell>
      </body>
    </html>
  );
}
