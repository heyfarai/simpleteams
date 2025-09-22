"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Trophy,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import Link from "next/link";

interface RegistrationData {
  team: {
    id: string;
    name: string;
    city: string;
    region: string;
    contact_email: string;
    selected_package: string;
    status: string;
    payment_status: string;
  };
  payment: {
    amount: number;
    currency: string;
    description: string;
    status: string;
    verified: boolean;
  };
  stripe_session: {
    id: string;
    payment_status: string;
    status: string;
  };
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    // Fetch registration details using session ID
    fetch(`/api/registration/success?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setRegistrationData(data);
        }
      })
      .catch(() => {
        setError("Failed to load registration details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  const getPackageDetails = (packageType: string) => {
    switch (packageType) {
      case "full-season":
        return {
          name: "Full Season Team Registration",
          amount: "$3,495",
          description: "Complete season registration with all benefits",
        };
      case "two-session":
        return {
          name: "Two Session Pack Registration",
          amount: "$1,795",
          description: "Registration for two session blocks",
        };
      case "pay-per-session":
        return {
          name: "Pay Per Session Registration",
          amount: "$895",
          description: "Flexible pay-as-you-go registration",
        };
      default:
        return {
          name: "Registration Package",
          amount: "$0",
          description: "Registration package",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your registration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/register">
              <Button>Back to Registration</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const packageDetails = registrationData
    ? getPackageDetails(registrationData.team.selected_package)
    : null;

  // Determine if payment is fully verified and successful
  const isPaymentVerified =
    registrationData?.payment?.verified &&
    registrationData?.payment?.status === "completed";
  const isPaymentPending = registrationData?.payment?.status === "pending";
  const isPaymentFailed = registrationData?.payment?.status === "failed";

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            {isPaymentVerified ? (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl text-gray-900 mb-2">
                  You're Registered!
                </h1>
                <p className="text-lg text-gray-600">
                  Get ready for the 2025-26 season.
                </p>
              </>
            ) : isPaymentPending ? (
              <>
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Processing
                </h1>
                <p className="text-lg text-gray-600">
                  Your registration is being processed. We'll update you once
                  payment is confirmed.
                </p>
              </>
            ) : isPaymentFailed ? (
              <>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Issue
                </h1>
                <p className="text-lg text-gray-600">
                  There was an issue with your payment. Please contact support
                  to complete your registration.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Registration Complete
                </h1>
                <p className="text-lg text-gray-600">
                  Your registration has been submitted successfully.
                </p>
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Registration Summary */}
            <Card className="bg-white p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <h2 className="text-xl">Team Registration</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                {registrationData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Name:</span>
                      <span className="font-medium">
                        {registrationData.team.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {registrationData.team.city},{" "}
                        {registrationData.team.region}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact Email:</span>
                      <span className="font-medium">
                        {registrationData.team.contact_email}
                      </span>
                    </div>
                    {packageDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">
                            {packageDetails.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Paid:</span>
                          <span className="font-medium text-green-600">
                            {packageDetails.amount}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <h2 className="text-xl">What's Next?</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        Check your email (or junk) for confirmation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        <Link href="/dashboard/roster">
                          Add your team roster
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Get your reps in!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto"
              >
                Go to Team Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@league.com"
                className="text-blue-600 hover:underline"
              >
                support@league.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutSuccessFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading registration details...</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
