"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPackageConfig, type PackageType } from "@/lib/config/packages";

interface PaymentScheduleProps {
  packageType: PackageType;
  className?: string;
  defaultExpanded?: boolean;
}

interface PaymentScheduleItem {
  date: string;
  amount: number;
  description: string;
  status?: 'upcoming' | 'completed' | 'failed';
}

export function PaymentSchedule({
  packageType,
  className,
  defaultExpanded = false
}: PaymentScheduleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const packageConfig = getPackageConfig()[packageType];

  if (!packageConfig.installments?.enabled) {
    return null;
  }

  const { installments, installmentPriceId } = packageConfig.installments;
  const monthlyAmount = Math.round(packageConfig.amount / installments);

  // Generate payment schedule dates (first payment today, then monthly)
  const generatePaymentSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const startDate = new Date();

    for (let i = 0; i < installments; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);

      schedule.push({
        date: paymentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        amount: monthlyAmount,
        description: i === 0 ? 'Initial Payment' : `Payment ${i + 1}`,
        status: i === 0 ? 'upcoming' : 'upcoming'
      });
    }

    return schedule;
  };

  const schedule = generatePaymentSchedule();
  const totalAmount = schedule.reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'failed':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <Card className={cn("border-blue-200 bg-blue-50", className)}>
      <CardContent className="p-6">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Schedule
              </h3>
              <p className="text-sm text-gray-600">
                {installments} payments • ${(monthlyAmount / 100).toFixed(2)} CAD monthly
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </Button>

        {isExpanded && (
          <div className="mt-6 space-y-4">
            {/* Schedule Items */}
            <div className="space-y-3">
              {schedule.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/70 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        {payment.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-gray-900">
                    <DollarSign className="w-4 h-4" />
                    {(payment.amount / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">Total Amount</div>
                <div className="flex items-center gap-1 font-bold text-lg text-gray-900">
                  <DollarSign className="w-5 h-5" />
                  {(totalAmount / 100).toFixed(2)} CAD
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Payment dates are approximate. Actual billing will occur according to your subscription schedule set up with Stripe.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}