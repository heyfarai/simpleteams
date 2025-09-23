"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { TeamLogoService } from "@/lib/services/team-logo-service";
import { toast } from "sonner";

interface TeamLogoUploadProps {
  teamId: string;
  teamName: string;
  currentLogoUrl?: string | null;
  onLogoUpdated?: (logoUrl: string) => void;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export function TeamLogoUpload({
  teamId,
  teamName,
  currentLogoUrl,
  onLogoUpdated,
  size = "md",
  editable = true,
}: TeamLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await TeamLogoService.uploadTeamLogo(teamId, file);

      if (result.success && result.logoUrl) {
        setLogoUrl(result.logoUrl);
        onLogoUpdated?.(result.logoUrl);
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveLogo = async () => {
    setIsUploading(true);
    try {
      const result = await TeamLogoService.removeTeamLogo(teamId);
      if (result.success) {
        setLogoUrl(null);
        onLogoUpdated?.("");
        toast.success("Logo removed successfully!");
      } else {
        toast.error(result.error || "Failed to remove logo");
      }
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("An error occurred while removing logo");
    } finally {
      setIsUploading(false);
    }
  };

  const displayLogoUrl = logoUrl || TeamLogoService.getDefaultLogoUrl(teamName);

  if (!editable) {
    // Read-only mode - just display the logo
    return (
      <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden bg-gray-100`}>
        <Image
          src={displayLogoUrl}
          alt={`${teamName} logo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100px, 200px"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Logo Display/Upload Area */}
      <div
        className={`${sizeClasses[size]} relative group cursor-pointer rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          // Loading state
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          // Upload overlay
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Logo Image */}
        <Image
          src={displayLogoUrl}
          alt={`${teamName} logo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100px, 200px"
        />

        {/* Remove button */}
        {logoUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveLogo();
            }}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            disabled={isUploading}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Click or drag to upload logo</p>
        <p>Max 5MB • PNG, JPG, WebP</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}