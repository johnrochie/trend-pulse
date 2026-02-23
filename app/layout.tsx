import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { config } from "@/lib/config";

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
  openGraph: {
    type: "website",
    url: config.site.url,
    title: `${config.site.name} | Real-Time News & Trend Analysis`,
    description: config.site.description,
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.name,
    description: config.site.description,
    images: ["/twitter-image.jpg"],
    creator: "@trendpulse",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3B82F6",
      },
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3B82F6" />
        
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
        <meta name="google-adsense-account" content="ca-pub-YOUR_PUBLISHER_ID_HERE" />
        
        {/* Social media meta tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Trend Pulse - Real-Time News & Analysis" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:image:alt" content="Trend Pulse - Real-Time News & Analysis" />
        <meta name="twitter:site" content="@trendpulse" />
        
        <link rel="canonical" href={config.site.url} />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Performance monitoring
                if ('performance' in window) {
                  window.addEventListener('load', function() {
                    setTimeout(function() {
                      var timing = performance.timing;
                      var loadTime = timing.loadEventEnd - timing.navigationStart;
                      if (loadTime > 0) {
                        console.log('Page load time: ' + loadTime + 'ms');
                      }
                    }, 0);
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-gray-900 text-gray-100`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        
        {/* Analytics script placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics placeholder
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </body>
    </html>
  );
}