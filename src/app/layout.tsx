import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const heading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Companion Entry",
  description: "Frontend-only entry experience for an AI companion app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <body>{children}</body>
    </html>
  );
}
