import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import type { FormData } from "@/hooks/use-registration-form";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle, Info, Mail } from "lucide-react";
import { signInWithEmail } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";

interface ContactEmailSectionProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  onShowSignIn: () => void;
}

interface EmailStatus {
  exists: boolean;
  hasExistingRegistration: boolean;
  loading: boolean;
  checked: boolean;
  magicLinkSent: boolean;
  sendingMagicLink: boolean;
}

export function ContactEmailSection({
  formData,
  onInputChange,
  onShowSignIn,
}: ContactEmailSectionProps) {
  const { user } = useAuth();
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({
    exists: false,
    hasExistingRegistration: false,
    loading: false,
    checked: false,
    magicLinkSent: false,
    sendingMagicLink: false,
  });

  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) return;

    setEmailStatus(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to check email');
      }

      const data = await response.json();
      setEmailStatus({
        exists: data.exists,
        hasExistingRegistration: data.hasExistingRegistration,
        loading: false,
        checked: true,
      });

      // If user has existing registration, automatically show sign-in modal
      if (data.hasExistingRegistration) {
        onShowSignIn();
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailStatus(prev => ({ ...prev, loading: false, checked: true }));
      toast.error('Error checking email. Please try again.');
    }
  }, [onShowSignIn]);

  const handleEmailBlur = useCallback(() => {
    if (formData.contactEmail && !user) {
      checkEmailExists(formData.contactEmail);
    }
  }, [formData.contactEmail, user, checkEmailExists]);

  const sendMagicLink = useCallback(async (email: string) => {
    setEmailStatus(prev => ({ ...prev, sendingMagicLink: true }));

    try {
      await signInWithEmail(email, `/register/checkout?package=${formData.selectedPackage || ''}`);
      setEmailStatus(prev => ({
        ...prev,
        sendingMagicLink: false,
        magicLinkSent: true
      }));
      toast.success("Verification email sent!", {
        description: "Check your email for the link to continue.",
      });
    } catch (error) {
      console.error("Error sending magic link:", error);
      setEmailStatus(prev => ({ ...prev, sendingMagicLink: false }));
      toast.error("Failed to send verification email", {
        description: "Please try again.",
      });
    }
  }, [formData.selectedPackage]);

  const renderEmailStatusMessage = () => {
    if (user) return null;
    if (!emailStatus.checked || emailStatus.loading) return null;

    if (emailStatus.hasExistingRegistration) {
      return (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium">
              Welcome back! We found your account.
            </p>
            <p className="text-blue-700 mt-1">
              Please sign in to continue with your registration.
            </p>
          </div>
        </div>
      );
    }

    if (emailStatus.exists) {
      return (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm flex-1">
            <p className="text-blue-800 font-medium">Welcome back!</p>
            <p className="text-blue-700 mt-1">
              We found an account with this email.{' '}
              <button
                type="button"
                onClick={onShowSignIn}
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Please sign in to continue
              </button>
            </p>
          </div>
        </div>
      );
    }

    // New email - show magic link verification
    if (emailStatus.magicLinkSent) {
      return (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-green-800 font-medium">Check your email</p>
            <p className="text-green-700 mt-1">
              📧 We've sent a verification link to <strong>{formData.contactEmail}</strong>.
              Please check your inbox and click the link to continue.
            </p>
          </div>
        </div>
      );
    }

    // New email - show verification button
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
        <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm flex-1">
          <p className="text-blue-800 font-medium">Verify your email to continue</p>
          <p className="text-blue-700 mt-1 mb-3">
            We need to verify this email address before you can register your team.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => sendMagicLink(formData.contactEmail)}
            disabled={emailStatus.sendingMagicLink}
            className="h-8 text-xs"
          >
            {emailStatus.sendingMagicLink ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Send verification email
              </div>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl text-gray-900 mb-4">
        {user ? "Contact Email" : "Let's check we have the right email address"}
      </h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="contactEmail">
                Email Address *
                {user && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (using your account email)
                  </span>
                )}
              </Label>
              {!user && (
                <button
                  type="button"
                  onClick={onShowSignIn}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  Already have an account?
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => onInputChange("contactEmail", e.target.value)}
                onBlur={handleEmailBlur}
                className={`bg-primary/10 shadow-none ${
                  user ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                readOnly={!!user}
                disabled={!!user}
                required
                placeholder="Enter your email address"
              />
              {emailStatus.loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            {renderEmailStatusMessage()}
          </div>
        </div>
      </div>
    </div>
  );
}