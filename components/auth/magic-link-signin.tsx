"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signInWithEmail } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Mail, CheckCircle } from "lucide-react";

interface MagicLinkSignInProps {
  children: React.ReactNode;
  onSuccess?: () => void;
  returnTo?: string;
}

export function MagicLinkSignIn({
  children,
  onSuccess,
  returnTo,
}: MagicLinkSignInProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email, returnTo);
      setIsEmailSent(true);
      toast.success("Magic link sent!", {
        description: "Check your email for the sign-in link.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to send magic link", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setIsEmailSent(false);
    setIsLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        asChild
        onClick={() => setOpen(true)}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a magic link to sign in.
          </DialogDescription>
        </DialogHeader>

        {!isEmailSent ? (
          <form
            onSubmit={handleSignIn}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Magic Link
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check your email
            </h3>
            <p className="text-gray-600 mb-4">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in your email to sign in. You can close this
              window.
            </p>
            <Button
              onClick={handleClose}
              variant="outline"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Inline version for use within forms
interface InlineMagicLinkSignInProps {
  onSuccess?: () => void;
  className?: string;
  returnTo?: string;
  initialEmail?: string;
}

export function InlineMagicLinkSignIn({
  onSuccess,
  className = "",
  returnTo,
  initialEmail = "",
}: InlineMagicLinkSignInProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email, returnTo);
      setIsEmailSent(true);
      toast.success("Magic link sent!", {
        description: "Check your email for the sign-in link.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to send magic link", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-6">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Check your email</h3>
          <p className="text-sm text-gray-600">
            We've sent a magic link to <strong>{email}</strong>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent>
        <form
          onSubmit={handleSignIn}
          className="space-y-3"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending magic link...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Magic Link
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
