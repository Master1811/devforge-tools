import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devforge.tools"),
  title: {
    default: "DevForge — Free Developer Tools Online",
    template: "%s | DevForge",
  },
  description:
    "10 essential developer tools in one place. JWT decoder, JSON to TypeScript, SQL formatter, regex tester, and more. Free forever, no signup required.",
  keywords: [
    "developer tools",
    "jwt decoder",
    "json to typescript",
    "sql formatter",
    "regex tester",
    "base64 encoder",
    "curl converter",
    "yaml json converter",
    "markdown previewer",
    "password generator",
    "cron visualizer",
  ],
  authors: [{ name: "DevForge" }],
  creator: "DevForge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devforge.tools",
    siteName: "DevForge",
    title: "DevForge — Free Developer Tools Online",
    description: "10 essential developer tools. Free forever, no signup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevForge — Free Developer Tools Online",
    description: "10 essential developer tools. Free forever, no signup.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://devforge.tools" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
