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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#111827" />
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