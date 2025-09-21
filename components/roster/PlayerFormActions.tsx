import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import Link from "next/link";

interface PlayerFormActionsProps {
  isSubmitting: boolean;
  disabled: boolean;
  cancelPath: string;
  submitText: string;
}

export function PlayerFormActions({
  isSubmitting,
  disabled,
  cancelPath,
  submitText,
}: PlayerFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Link href={cancelPath}>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </Link>
      <Button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {submitText}
          </>
        )}
      </Button>
    </div>
  );
}