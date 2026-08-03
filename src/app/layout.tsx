import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        height: 630,
        url: "/opengraph-image",
        width: 1200,
      },
    ],
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    images: ["/opengraph-image"],
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      id="top"
      lang={siteConfig.language}
      className="h-full"
      data-scroll-behavior="smooth"
    >
      <body
        className={`${manrope.variable} ${bodoniModa.variable} flex min-h-full flex-col antialiased`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
