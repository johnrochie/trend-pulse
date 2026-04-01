import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import AnalyticsGate from "@/components/AnalyticsGate";
import SwRegister from "@/components/SwRegister";
import { config } from "@/lib/config";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${config.site.name} | Real-Time News & Trend Analysis`,
  description: config.site.description,
  keywords: ["news", "trends", "trend analysis", "real-time news", "tech trends", "business news", "market trends"],
  authors: [{ name: config.site.name }],
  metadataBase: new URL(config.site.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: config.site.url,
    title: `${config.site.name} | Real-Time News & Trend Analysis`,
    description: config.site.description,
    images: ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop&crop=entropy&q=80&auto=format"],
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.name,
    description: config.site.description,
    images: ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop&crop=entropy&q=80&auto=format"],
    creator: "@trendpulse",
  },
  icons: {
    icon: [
      { url: "/brand/favicon.ico", type: "image/x-icon" },
      { url: "/logo-simple.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/brand/favicon.ico" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicons and icons */}
        <link rel="icon" href="/brand/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/logo-simple.svg" />
        
        {/* PWA and mobile meta tags */}
        <meta name="application-name" content="Trend Pulse" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Trend Pulse" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* AdSense Verification - Add your Publisher ID after ca-pub- */}
        <meta name="google-adsense-account" content="ca-pub-9658578792001646" />
        
        {/* Social media meta tags */}
        <meta property="og:image" content="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop&crop=entropy&q=80&auto=format" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Trend Pulse - Real-Time News & Analysis" />
        <meta property="og:type" content="website" />

        <meta name="twitter:image" content="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop&crop=entropy&q=80&auto=format" />
        <meta name="twitter:image:alt" content="Trend Pulse - Real-Time News & Analysis" />
        <meta name="twitter:site" content="@trendpulse" />
        
        <link rel="canonical" href={config.site.url} />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title={`${config.site.name} RSS`} href={`${config.site.url}/feed.xml`} />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
        
        </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-gray-900 text-gray-100`}
      >
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-screen" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
        <AnalyticsGate />
        <SwRegister />
      </body>
    </html>
  );
}