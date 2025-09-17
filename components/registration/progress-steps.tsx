"use client";

import { Check, Users, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  const getStepColor = (step: number) => {
    if (step < currentStep)
      return "bg-green-100 text-green-800 border-green-200";
    if (step === currentStep)
      return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  const steps = [
    { step: 1, title: "Package", icon: Package },
    { step: 2, title: "Team Info", icon: Users },
    { step: 3, title: "Contacts", icon: Users },
    { step: 4, title: "Review", icon: Check },
    { step: 5, title: "Success", icon: Check },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getStepColor(
                  step
                )}`}
              >
                {step < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">Step {step}</p>
              </div>
              {step < totalSteps && (
                <div className="hidden sm:block w-16 h-0.5 bg-gray-200 ml-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
