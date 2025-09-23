"use client";

import type React from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DebugBanner } from "@/components/debug-banner";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <>
      <DebugBanner />
      {!isAdminPage && (
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
        </Suspense>
      )}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}