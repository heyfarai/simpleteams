"use client";

import { CheckCircle, Users, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SuccessStepProps {
  formData: {
    teamName: string;
    city: string;
    province: string;
    primaryContactName: string;
    primaryContactEmail: string;
    divisionPreference: string;
  };
  onStartOver: () => void;
}

export function SuccessStep({ formData, onStartOver }: SuccessStepProps) {
  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Registration Complete!
        </h2>
        <p className="text-lg text-gray-600">
          Welcome to the 2025-26 Regular Season
        </p>
      </div>

      {/* Team Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left max-w-md mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Team Details</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Team:</span>
            <span className="ml-2 text-gray-900">{formData.teamName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>
            <span className="ml-2 text-gray-900">
              {formData.city}, {formData.province}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Contact:</span>
            <span className="ml-2 text-gray-900">{formData.primaryContactName}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-md mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">What's Next?</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <Badge variant="outline" className="text-xs mt-0.5">1</Badge>
            <span>You'll receive a confirmation email shortly</span>
          </li>
          <li className="flex items-start space-x-2">
            <Badge variant="outline" className="text-xs mt-0.5">2</Badge>
            <span>League administrators will review your registration</span>
          </li>
          <li className="flex items-start space-x-2">
            <Badge variant="outline" className="text-xs mt-0.5">3</Badge>
            <span>You'll be notified about division placement and schedule</span>
          </li>
          <li className="flex items-start space-x-2">
            <Badge variant="outline" className="text-xs mt-0.5">4</Badge>
            <span>Season begins with team roster submissions</span>
          </li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-md mx-auto">
        <div className="flex items-center space-x-2 mb-2">
          <Mail className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-800 text-sm">Questions?</h4>
        </div>
        <p className="text-sm text-gray-600">
          Contact us at{" "}
          <a 
            href="mailto:info@nchc.ca" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            info@nchc.ca
          </a>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Return to Home
        </Button>
        <Button 
          variant="outline" 
          onClick={onStartOver}
        >
          Register Another Team
        </Button>
      </div>
    </div>
  );
}