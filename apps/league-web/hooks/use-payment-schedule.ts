"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PackageType } from "@/lib/config/packages";

interface PaymentSchedule {
  dates: string[];
  nextPayment: string | null;
}

interface UsePaymentScheduleOptions {
  packageType?: PackageType;
  paymentMethod?: "full" | "installments";
  subscriptionId?: string;
  enabled?: boolean;
}

export function usePaymentSchedule({
  packageType,
  paymentMethod,
  subscriptionId,
  enabled = true,
}: UsePaymentScheduleOptions) {
  const [fallbackDates, setFallbackDates] = useState<string[]>([]);

  // Calculate fallback dates for immediate display
  useEffect(() => {
    if (packageType && paymentMethod === "installments") {
      const { getInstallmentDetails } = require("@/lib/config/packages");
      const installmentDetails = getInstallmentDetails(packageType);

      if (installmentDetails) {
        const dates: string[] = [];
        const today = new Date();

        // Generate fallback dates (skip first payment as it's "today")
        for (let i = 1; i < installmentDetails.installments; i++) {
          const paymentDate = new Date(today);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          dates.push(paymentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }));
        }

        setFallbackDates(dates);
      }
    }
  }, [packageType, paymentMethod]);

  // Query real payment dates from Stripe
  const query = useQuery({
    queryKey: ['payment-schedule', packageType, subscriptionId],
    queryFn: async (): Promise<PaymentSchedule> => {
      const params = new URLSearchParams();

      if (packageType) {
        params.append('packageType', packageType);
      }

      if (subscriptionId) {
        params.append('subscriptionId', subscriptionId);
      }

      const response = await fetch(`/api/stripe/payment-schedule?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payment schedule');
      }

      return response.json();
    },
    enabled: enabled && (!!packageType || !!subscriptionId) && paymentMethod === "installments",
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Return real dates if available, otherwise fallback to calculated dates
  const paymentDates = query.data?.dates || fallbackDates;
  const nextPayment = query.data?.nextPayment || (paymentDates.length > 0 ? paymentDates[0] : null);

  return {
    paymentDates,
    nextPayment,
    isLoading: query.isLoading,
    error: query.error,
    isUsingFallback: !query.data && fallbackDates.length > 0,
  };
}