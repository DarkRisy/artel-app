// layout.tsx
import type { Metadata } from "next";
import { Jura } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Toaster } from "./components/toaster";
import { Toaster as Sonner } from "./components/sonner";

const jura = Jura({
  variable: "--font-jura-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Артель",
  description: "Профессиональные строительные решения",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/images/logo.svg",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/images/logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="icon"
          href="/images/logo.svg"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="/images/logo.png"
          sizes="180x180"
        />
      </head>
      <body className={`${jura.variable} antialiased bg-[#2D3538] min-h-screen`}>
        <Toaster />
        <Sonner />
        <Header />
        {children}
      </body>
    </html>
  );
}