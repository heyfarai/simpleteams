"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useSelectedTeam } from "@/components/dashboard/team-selector";
import { usePaymentsByTeam } from "@/lib/hooks/use-payments";
import { useAuth } from "@/hooks/use-auth";
import type { TeamPayment } from "@/lib/domain/models";

export default function PaymentsPage() {
  const selectedTeamId = useSelectedTeam();
  const { user } = useAuth();

  // Use our new hook instead of direct Supabase calls!
  const {
    data: paymentsData,
    isLoading,
    error
  } = usePaymentsByTeam(selectedTeamId || '');

  const payments = paymentsData?.payments || [];

  const getStatusIcon = (status: TeamPayment["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TeamPayment["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewReceipt = async (payment: TeamPayment) => {
    // Try to get official Stripe receipt URL first
    if (payment.stripePaymentIntentId) {
      try {
        const response = await fetch(
          `/api/receipts/intent/${payment.stripePaymentIntentId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.receipt_url) {
            window.open(data.receipt_url, "_blank");
            return;
          }
        }
      } catch (error) {
        console.error("Error getting official receipt URL:", error);
      }
    }

    // Fallback to custom receipt page (for test mode or when no official receipt)
    if (payment.stripeSessionId) {
      const receiptUrl = `/api/receipts/${payment.stripeSessionId}`;
      window.open(receiptUrl, "_blank");
    } else if (payment.stripePaymentIntentId) {
      // Create a simple receipt fallback URL - we'll need to implement this
      const receiptUrl = `/api/receipts/intent/${payment.stripePaymentIntentId}`;
      window.open(receiptUrl, "_blank");
    } else {
      console.error(
        "No receipt identifiers available for payment:",
        payment.id
      );
    }
  };

  const handleManageSubscription = async () => {
    try {
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          teamId: selectedTeamId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.portal_url) {
          window.open(data.portal_url, "_blank");
        }
      } else {
        console.error("Failed to create billing portal session");
      }
    } catch (error) {
      console.error("Error creating billing portal session:", error);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading payments</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTeamId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Please select a team to view payments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View completed payments and download receipts from Stripe
        </p>
      </div>

      {/* Installment Status */}
      {payments.some((p) => p.paymentType === "installment") && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Installment Plan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    8-Month Payment Plan
                  </h4>
                  <p className="text-sm text-blue-700">
                    Payments of $437/month • Next payment:{" "}
                    {new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-900">
                    {
                      payments.filter(
                        (p) =>
                          p.paymentType === "installment" &&
                          p.status === "paid"
                      ).length
                    }
                    /8
                  </div>
                  <div className="text-sm text-blue-700">payments made</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageSubscription}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No payment history
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Payment transactions will appear here once you make a payment.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.description.length > 50
                                ? `${payment.description.slice(0, 20)}...`
                                : payment.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.paymentType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(payment.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReceipt(payment)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
