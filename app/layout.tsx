"use client";

import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Schibsted_Grotesk } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-schibsted-grotesk",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${schibstedGrotesk.variable}`}
      >
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
          </Suspense>
          {children}
          {!isAdminPage && <Footer />}
          <Analytics />
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
