import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Web3Provider from "@/components/Web3Provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale, getTranslations } from "next-intl/server";
import NoticeModal from "@/components/NoticeModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { BRAND, brandTitle } from "@/lib/brand";
import { SpeedInsights } from "@vercel/speed-insights/next";

const interDisplay = localFont({
  src: [
    { path: "./fonts/InterDisplay-Light.woff2",     weight: "300", style: "normal" },
    { path: "./fonts/InterDisplay-Regular.woff2",   weight: "400", style: "normal" },
    { path: "./fonts/InterDisplay-Medium.woff2",    weight: "500", style: "normal" },
    { path: "./fonts/InterDisplay-SemiBold.woff2",  weight: "600", style: "normal" },
    { path: "./fonts/InterDisplay-Bold.woff2",      weight: "700", style: "normal" },
    { path: "./fonts/InterDisplay-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-inter-display",
});

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Light.woff2",     weight: "300", style: "normal" },
    { path: "./fonts/Inter-Regular.woff2",   weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2",    weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2",  weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.woff2",      weight: "700", style: "normal" },
    { path: "./fonts/Inter-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: brandTitle(),
  applicationName: BRAND.name,
  description: BRAND.longDescription,
  keywords: ["ecology", "open-source", "web3", "crowdfunding", "solarpunk", "blockchain"],
  authors: [{ name: `${BRAND.name} Team` }],
  openGraph: {
    title: brandTitle(),
    description: BRAND.shortDescription,
    type: "website",
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    title: brandTitle(),
    description: BRAND.shortDescription,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const footerT = await getTranslations("Footer");

  return (
    <html
      lang={locale}
      className={`${interDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-screen bg-[var(--bg)]">
        <Web3Provider>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <NoticeModal />
              <Navbar />

              {/* Main content */}
              <main>{children}</main>

              {/* Footer */}
              <footer className="mt-20 border-t border-verdant-800/30 py-8 text-center">
                <p className="text-sm text-verdant-600">
                  {footerT("built_with", { brand: BRAND.communityLabel })} ·{" "}
                  <a
                    href={BRAND.repositoryUrl}
                    className="hover:text-verdant-400 transition-colors"
                  >
                    {footerT("open_source")}
                  </a>
                </p>
              </footer>
            </NextIntlClientProvider>
          </ThemeProvider>
        </Web3Provider>
        <SpeedInsights />
      </body>
    </html>
  );
}
