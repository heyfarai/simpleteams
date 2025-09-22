import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import {
  generateMetadata as generateSiteMetadata,
  generateOrganizationSchema,
} from "@/lib/metadata";
import "./globals.css";

export const metadata = generateSiteMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="any"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />
        <link
          rel="manifest"
          href="/manifest.json"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Analytics />
          <Toaster />
          <SonnerToaster
            position="top-right"
            richColors
          />
        </Providers>
      </body>
    </html>
  );
}
