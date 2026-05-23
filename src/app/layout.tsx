import type { Metadata } from "next";
import "./globals.css";
import RefreshRedirect from '@/components/RefreshRedirect'

export const metadata: Metadata = {
  title: {
    default: "Vibhav Patel |Portfolio",
    template: "%s | Vibhav Patel"
  },
  description: "Welcome to my portfolio! I am Vibhav Patel, a Frontend Developer creating modern, responsive, and high-performance websites using React, Next.js, TypeScript, and Tailwind CSS.",
  keywords: [
    "Vibhav Patel",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Web Developer Portfolio",
    "Software Engineer",
    "Creative Frontend Developer",
    "vibhavpatel.site"
  ],
  authors: [{ name: "Vibhav Patel", url: "https://vibhavpatel.site" }],
  creator: "Vibhav Patel",
  metadataBase: new URL("https://vibhavpatel.site"),
  openGraph: {
    title: "Vibhav Patel | Frontend Developer Portfolio",
    description: "Welcome to my portfolio! I am Vibhav Patel, a Frontend Developer creating modern, responsive, and high-performance websites.",
    url: "https://vibhavpatel.site",
    siteName: "Vibhav Patel Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibhav Patel | Frontend Developer Portfolio",
    description: "Welcome to my portfolio! I am Vibhav Patel, a Frontend Developer creating modern, responsive, and high-performance websites.",
    creator: "@vibhavpatel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefreshRedirect />
        {children}
      </body>
    </html>
  );
}