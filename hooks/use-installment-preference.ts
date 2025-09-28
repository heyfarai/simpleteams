"use client";

import { useState, useEffect } from "react";
import type { PackageType } from "@/lib/config/packages";

const STORAGE_KEY = "installment-preferences";

interface InstallmentPreferences {
  [packageType: string]: boolean;
}

export function useInstallmentPreference(packageType: PackageType, userId?: string) {
  const [isInstallmentEnabled, setIsInstallmentEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create a unique storage key for the user
  const storageKey = userId ? `${STORAGE_KEY}-${userId}` : STORAGE_KEY;

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      let stored = localStorage.getItem(storageKey);

      // If no preference found and we're using a user-specific key,
      // try the generic key as fallback (for cross-auth-state compatibility)
      if (!stored && userId) {
        stored = localStorage.getItem(STORAGE_KEY);
      }

      if (stored) {
        const preferences: InstallmentPreferences = JSON.parse(stored);
        setIsInstallmentEnabled(preferences[packageType] ?? false);
      }
    } catch (error) {
      console.warn('Failed to load installment preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey, packageType, userId]);

  // Save preference to localStorage
  const setInstallmentPreference = (enabled: boolean) => {
    try {
      setIsInstallmentEnabled(enabled);

      // Get existing preferences
      const stored = localStorage.getItem(storageKey);
      const preferences: InstallmentPreferences = stored ? JSON.parse(stored) : {};

      // Update preference for this package
      preferences[packageType] = enabled;

      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save installment preference:', error);
    }
  };

  // Clear all preferences (useful for testing or user reset)
  const clearPreferences = () => {
    try {
      localStorage.removeItem(storageKey);
      setIsInstallmentEnabled(false);
    } catch (error) {
      console.error('Failed to clear installment preferences:', error);
    }
  };

  return {
    isInstallmentEnabled,
    setInstallmentPreference,
    clearPreferences,
    isLoading
  };
}