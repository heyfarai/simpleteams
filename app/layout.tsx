"use client";

import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import { Providers } from '@/lib/providers'
import { Toaster } from '@/components/ui/toaster'
import { Hanken_Grotesk } from 'next/font/google'
import './globals.css'

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${hankenGrotesk.variable}`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
          </Suspense>
          {children}
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
