"use client";

import Image from "next/image";
import { TeamLogoService } from "@/lib/services/team-logo-service";

interface TeamLogoProps {
  teamName: string;
  logoUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

export function TeamLogo({
  teamName,
  logoUrl,
  size = "md",
  className = "",
  priority = false,
}: TeamLogoProps) {
  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const displayLogoUrl = logoUrl || TeamLogoService.getDefaultLogoUrl(teamName);

  return (
    <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      <Image
        src={displayLogoUrl}
        alt={`${teamName} logo`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100px, 200px"
        priority={priority}
      />
    </div>
  );
}