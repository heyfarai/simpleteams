"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Division } from "./division-data";

interface DivisionCTAProps {
  activeDivision: Division | null;
  isMobile?: boolean;
}

export function DivisionCTA({ activeDivision, isMobile = false }: DivisionCTAProps) {
  if (isMobile) {
    return (
      <div className="md:hidden mt-8 flex justify-center">
        <Link href="/register">
          <Button size="lg" className="px-8">
            Register
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  if (!activeDivision) return null;

  return (
    <div className="hidden md:block mt-6">
      <Link href="/register">
        <Button size="lg" className="w-full">
          Register for {activeDivision.displayName}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}