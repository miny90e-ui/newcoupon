import type { Metadata, Viewport } from "next";
import { after } from "next/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SITE_NAME, siteUrl } from "@/lib/utils";
import { syncIfStale } from "@/lib/sheet-sync";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — Coupons, Promo Codes & Deals`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Save on fashion, tech, travel, beauty and more with verified coupon codes and deals from the stores you love.",
  openGraph: { siteName: SITE_NAME, type: "website" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b2545",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Keeps the site in step with the Google Sheet: after a page is sent, re-sync if the last sync is over 10 minutes old.
  after(() => syncIfStale().catch((e) => console.error("Sheet sync failed", e)));
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
