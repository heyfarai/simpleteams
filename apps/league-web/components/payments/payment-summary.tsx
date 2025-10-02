import { Calendar } from "lucide-react";

export interface PaymentSummaryProps {
  amount: number;
  packageTotal: string;
  paymentType: "full" | "installment";
  nextPaymentDate?: string | null;
  installmentDetails?: {
    installments: number;
    installmentAmount: number;
    description: string;
  };
}

export function PaymentSummary({
  amount,
  packageTotal,
  paymentType,
  nextPaymentDate,
  installmentDetails,
}: PaymentSummaryProps) {
  const formattedAmount = `$${(amount / 100).toFixed(2)}`;

  if (paymentType === "full") {
    return (
      <div className="flex justify-between">
        <span className="text-gray-600">Amount Paid:</span>
        <span className="font-medium text-green-600">{formattedAmount}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <span className="text-gray-600">First Payment:</span>
        <span className="font-medium text-green-600">{formattedAmount}</span>
      </div>
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-900 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">
            {installmentDetails
              ? `${installmentDetails.installments}-Payment Plan (${installmentDetails.description})`
              : "Monthly Installment Plan"}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-blue-700">Package total: {packageTotal}</p>
          {installmentDetails && (
            <p className="text-sm text-blue-700">
              Monthly payment: $
              {installmentDetails.installmentAmount.toFixed(2)}
            </p>
          )}
          {/* {nextPaymentDate && (
            <p className="text-sm text-blue-700">
              Next payment: {nextPaymentDate}
            </p>
          )} */}
        </div>
      </div>
    </>
  );
}
