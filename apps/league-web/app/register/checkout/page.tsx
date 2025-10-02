"use client";

import { Suspense } from "react";
import { CheckoutForm } from "@/components/registration/checkout-form";

function CheckoutFormFallback() {
  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading registration form...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFormFallback />}>
      <CheckoutForm />
    </Suspense>
  );
}
