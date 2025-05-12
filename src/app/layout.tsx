import type { Metadata } from "next";
import { Jura } from "next/font/google";
import "./globals.css";
import React from "react";
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
};

export default function RootLayout(
  { children, }: Readonly<{ children: React.ReactNode; }>
) {
  return (
    <html lang="en">
      <body className={`${jura.variable} antialiased bg-[#2D3538]`}>
        <Toaster />
        <Sonner />
        <Header></Header>
        {children}
      </body>
    </html>
  );
}