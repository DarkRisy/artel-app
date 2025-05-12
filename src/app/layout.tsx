
'use client'
import { Jura } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Toaster } from "./components/toaster";
import { Toaster as Sonner } from "./components/sonner";

const jura = Jura({
  variable: "--font-jura-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${jura.variable} antialiased bg-[#2D3538] min-h-screen`}>
        <Toaster />
        <Sonner />
        <Header />
        {children}
      </body>
    </html>
  );
}