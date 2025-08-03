import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promptbook Components Gallery",
  description: "A showcase of React components for developers using Promptbook technology",
  keywords: ["React", "Components", "Promptbook", "UI", "Gallery", "Developers"],
  authors: [{ name: "Promptbook Team" }],
  openGraph: {
    title: "Promptbook Components Gallery",
    description: "A showcase of React components for developers using Promptbook technology",
    type: "website",
    images: [
      {
        url: "https://www.ptbk.io/design",
        width: 1200,
        height: 630,
        alt: "Promptbook Components Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptbook Components Gallery",
    description: "A showcase of React components for developers using Promptbook technology",
    images: ["https://www.ptbk.io/design"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://www.ptbk.io/design" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
