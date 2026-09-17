import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Vibestale — Nigerian News, Explained",
  description:
    "Understand what is happening in Nigeria — not just what happened. AI-powered summaries, context, and trusted sources across politics, business, sports, tech, and entertainment.",
  applicationName: "Vibestale",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vibestale.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    siteName: "Vibestale",
    title: "Vibestale — Nigerian News, Explained",
    description:
      "Understand what is happening in Nigeria — not just what happened. AI-powered summaries, context, and trusted sources.",
    type: "website",
    url: "https://vibestale.com",
    images: [
      {
        url: "/blacklogo.png",
        width: 1200,
        height: 630,
        alt: "Vibestale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibestale — Nigerian News, Explained",
    description:
      "Understand what is happening in Nigeria — not just what happened.",
    images: ["/blacklogo.png"],
  },
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

        {/* Theme script */}
        <script
          dangerouslySetInnerHTML={{
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
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}