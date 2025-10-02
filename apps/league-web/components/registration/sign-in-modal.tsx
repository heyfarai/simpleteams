import { toast } from "sonner";
import { InlineMagicLinkSignIn } from "@/components/auth/magic-link-signin";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: string;
  initialEmail?: string;
}

export function SignInModal({ isOpen, onClose, selectedPackage, initialEmail }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-bold">Sign in to your account</h2>
          <p className="text-gray-600 text-sm mt-1">
            Already have an account? Sign in to add this team to your
            existing account.
          </p>
        </div>

        <div className="py-4">
          <InlineMagicLinkSignIn
            returnTo={`/register/checkout?package=${selectedPackage}`}
            initialEmail={initialEmail}
            onSuccess={() => {
              onClose();
              toast.success("Magic link sent!", {
                description: "Check your email for the sign-in link.",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}