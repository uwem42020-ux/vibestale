import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "VibeStale",
  description: "AI-powered Nigerian news intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon / Site Icon */}
        <link rel="icon" href="/blacklogo.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/blacklogo.png" />

        {/* Open Graph for WhatsApp/Facebook */}
        <meta property="og:site_name" content="VibeStale" />
        <meta property="og:title" content="VibeStale — AI-powered Nigerian news intelligence" />
        <meta property="og:description" content="VibeStale delivers fast, accurate Nigerian news with AI context, plus music, movies, live TV, celebrity news, and memes—all in one platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vibestale.com" />
        <meta property="og:image" content="https://vibestale.com/blacklogo.png" />
        <meta property="og:logo" content="https://vibestale.com/blacklogo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VibeStale — AI-powered Nigerian news intelligence" />
        <meta name="twitter:description" content="Fast, accurate Nigerian news with AI context, plus music, movies, live TV, celebrity news, and memes." />
        <meta name="twitter:image" content="https://vibestale.com/blacklogo.png" />

        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const stored = localStorage.getItem('theme');
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}