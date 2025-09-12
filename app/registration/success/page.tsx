import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function RegistrationSuccess() {
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <CardTitle>Registration Submitted Successfully</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Thank you for registering your team! We&apos;ve received your payment and are
            processing your registration.
          </p>
          <p className="text-sm text-gray-500">
            You&apos;ll receive a confirmation email shortly with next steps.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
