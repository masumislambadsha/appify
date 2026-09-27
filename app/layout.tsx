import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoGPT — Multi-AI Chat, Redesigned",
  description:
    "A modern redesign concept: multi-model AI workspace, landing page, and Chrome extension. Compare GPT, Claude, Gemini, Grok & DeepSeek side by side.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "EchoGPT — One prompt. Every AI answer.",
    description:
      "Ask once across GPT, Claude, Gemini, Grok & DeepSeek. Web app redesign, landing page and Chrome extension concept.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EchoGPT — One prompt. Every AI answer.",
    description:
      "Multi-AI workspace redesign: compare models side by side, right in your browser.",
  },
};

export const viewport = {
  themeColor: "#F5EFE3",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-olive focus:px-4 focus:py-2 focus:text-cream"
          >
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
