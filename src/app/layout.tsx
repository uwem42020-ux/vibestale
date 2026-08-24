import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeStale",
  description: "AI-powered Nigerian news intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}