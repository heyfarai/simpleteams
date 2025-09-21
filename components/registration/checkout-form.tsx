"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/sanity/client";
import { toast } from "sonner";
import { useServiceStatus } from "@/hooks/use-service-status";
import { useAuth } from "@/hooks/use-auth";
import { InlineMagicLinkSignIn } from "@/components/auth/magic-link-signin";

interface Division {
  _id: string;
  name: string;
  ageGroup: string;
}

interface FormData {
  selectedPackage: string;
  teamName: string;
  city: string;
  province: string;
  contactEmail: string;
  divisionPreference: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  primaryContactRole: string;
  headCoachName: string;
  headCoachEmail: string;
  headCoachPhone: string;
  headCoachCertifications: string;
}

const fetchDivisions = async () => {
  const query = `*[_type == "season" && _id == $seasonId][0]{
    "divisions": activeDivisions[].division->{
      _id,
      name,
      ageGroup
    }
  }`;

  const result = await client.fetch(query, {
    seasonId: process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID,
  });

  return result?.divisions || [];
};

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Service status monitoring
  useServiceStatus();

  const {
    data: divisions = [],
    isLoading: divisionsLoading,
    error: divisionsError,
  } = useQuery<Division[]>({
    queryKey: ["divisions"],
    queryFn: fetchDivisions,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState<FormData>({
    selectedPackage: searchParams.get("package") || "",
    teamName: "",
    city: "",
    province: "",
    contactEmail: "",
    divisionPreference: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactRole: "manager",
    headCoachName: "",
    headCoachEmail: "",
    headCoachPhone: "",
    headCoachCertifications: "",
  });

  // Set authenticated user's email as contact email
  useEffect(() => {
    if (user?.email && !formData.contactEmail) {
      setFormData((prev) => ({
        ...prev,
        contactEmail: user.email || "",
      }));
    }
  }, [user?.email, formData.contactEmail]);

  // Mark this as a registration tab and listen for auth success
  useEffect(() => {
    // Mark this tab as having a registration form
    const tabId = `tab-${Date.now()}-${Math.random()}`;
    localStorage.setItem("registration-tab-id", tabId);

    // Listen for auth success from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth-success") {
        // Auth succeeded in another tab, refresh this tab to get the session
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      const currentStoredId = localStorage.getItem("registration-tab-id");
      if (currentStoredId === tabId) {
        localStorage.removeItem("registration-tab-id");
      }
    };
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeEmail = async () => {
    try {
      await signOut();
      // Clear the contact email so user can enter a new one
      setFormData((prev) => ({
        ...prev,
        contactEmail: "",
      }));
      // Show the sign-in modal for new email
      setShowSignInModal(true);
      toast.success("Signed out successfully", {
        description: "You can now enter a different email address.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out", {
        description: "Please try again.",
      });
    }
  };

  const getPackageDetails = () => {
    switch (formData.selectedPackage) {
      case "full-season":
        return {
          name: "Full Season Team Registration",
          amount: 3495,
          originalAmount: 3795,
          description: "Complete season registration with all benefits",
        };
      case "two-session":
        return {
          name: "Two Session Pack Registration",
          amount: 1795,
          description: "Registration for two session blocks",
        };
      case "pay-per-session":
        return {
          name: "Pay Per Session Registration",
          amount: 895,
          description: "Flexible pay-as-you-go registration",
        };
      default:
        return {
          name: "Registration Package",
          amount: 0,
          description: "Please select a package",
        };
    }
  };

  const packageDetails = getPackageDetails();
  const selectedDivision = divisions.find(
    (d) => d._id === formData.divisionPreference
  );

  const isFormValid = () => {
    return !!(
      formData.selectedPackage &&
      formData.teamName &&
      formData.city &&
      formData.province &&
      formData.contactEmail &&
      formData.divisionPreference &&
      formData.primaryContactName &&
      formData.primaryContactEmail &&
      formData.headCoachName &&
      formData.headCoachEmail
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting || !isFormValid()) return;

    // Prevent double-clicking and multiple submissions
    if (isSubmitting) {
      toast.error("Submission in progress", {
        description: "Please wait while we process your registration.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const registrationData = {
        teamName: formData.teamName,
        contactEmail: formData.contactEmail,
        primaryContactName: formData.primaryContactName,
        primaryContactEmail: formData.primaryContactEmail,
        primaryContactPhone: formData.primaryContactPhone,
        primaryContactRole: formData.primaryContactRole,
        headCoachName: formData.headCoachName,
        headCoachEmail: formData.headCoachEmail,
        headCoachPhone: formData.headCoachPhone,
        headCoachCertifications: formData.headCoachCertifications,
        divisionPreference: formData.divisionPreference,
        city: formData.city,
        province: formData.province,
        selectedPackage: formData.selectedPackage,
        paymentPlan: "full",
        userId: user?.id, // Send authenticated user ID if available
      };

      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: registrationData }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "duplicate_email") {
          toast.error("Email Already Registered", {
            description: data.message,
            duration: 10000,
            action: {
              label: "Need help?",
              onClick: () => {},
            },
          });
          return;
        }

        throw new Error(data.error || "Failed to submit registration");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 py-8">
        {/* Mobile Summary Accordion */}
        <div className="lg:hidden mb-6 max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          >
            <span>
              {formData.selectedPackage
                ? `${
                    packageDetails.name
                  } - $${packageDetails.amount.toLocaleString()}`
                : "Order Summary"}
            </span>
            {isMobileSummaryOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {isMobileSummaryOpen && (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-3">
                {/* Package Details */}
                {formData.selectedPackage && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">{packageDetails.name}</span>
                      <div className="text-right">
                        {packageDetails.originalAmount && (
                          <div className="text-sm text-gray-500 line-through">
                            ${packageDetails.originalAmount.toLocaleString()}
                          </div>
                        )}
                        <div className="font-medium">
                          ${packageDetails.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {packageDetails.originalAmount && (
                      <Badge
                        variant="secondary"
                        className="text-green-700 bg-green-50"
                      >
                        Save $
                        {(
                          packageDetails.originalAmount - packageDetails.amount
                        ).toLocaleString()}
                      </Badge>
                    )}
                  </>
                )}

                {/* Registration Details */}
                {(formData.teamName ||
                  formData.city ||
                  selectedDivision ||
                  formData.contactEmail) && (
                  <div className="pt-3 border-t space-y-2">
                    {formData.teamName && (
                      <div className="flex justify-between text-sm">
                        <span>Team:</span>
                        <span className="font-medium">{formData.teamName}</span>
                      </div>
                    )}
                    {(formData.city || formData.province) && (
                      <div className="flex justify-between text-sm">
                        <span>Location:</span>
                        <span className="font-medium">
                          {[formData.city, formData.province]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                    {selectedDivision && (
                      <div className="flex justify-between text-sm">
                        <span>Division:</span>
                        <span className="font-medium">
                          {selectedDivision.name}
                        </span>
                      </div>
                    )}
                    {formData.contactEmail && (
                      <div className="flex justify-between text-sm">
                        <span>Contact:</span>
                        <span className="font-medium">
                          {formData.contactEmail}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          {/* Main Form Column */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl mx-auto lg:max-w-none">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="space-y-6 md:space-y-8">
                  {/* Team Information */}
                  <div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4">
                      Team Information
                    </h2>
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div className="sm:col-span-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="contactEmail">
                              Contact Email *
                              {user && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  (using your account email)
                                </span>
                              )}
                            </Label>
                            {!user ? (
                              <button
                                type="button"
                                onClick={() => setShowSignInModal(true)}
                                className="text-sm text-primary hover:text-primary/80 underline"
                              >
                                Sign in
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleChangeEmail}
                                className="text-sm text-primary hover:text-primary/80 underline"
                              >
                                Change email
                              </button>
                            )}
                          </div>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) =>
                              handleInputChange("contactEmail", e.target.value)
                            }
                            className={`mt-1 bg-primary/10 shadow-none ${
                              user ? "bg-gray-50 cursor-not-allowed" : ""
                            }`}
                            readOnly={!!user}
                            disabled={!!user}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamName">Team Name *</Label>
                          <Input
                            id="teamName"
                            value={formData.teamName}
                            onChange={(e) =>
                              handleInputChange("teamName", e.target.value)
                            }
                            className="mt-1 bg-primary/10 shadow-none"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            className="mt-1 bg-primary/10 shadow-none"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="province">Province *</Label>
                          <Input
                            id="province"
                            value={formData.province}
                            onChange={(e) =>
                              handleInputChange("province", e.target.value)
                            }
                            className="mt-1 bg-primary/10 shadow-none"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Division Selection */}
                  <div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4">
                      Division
                    </h2>
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
                      {divisionsLoading ? (
                        <div className="text-gray-500">
                          Loading divisions...
                        </div>
                      ) : divisionsError ? (
                        <div className="text-red-500 bg-red-50 p-3 rounded-md">
                          <p className="font-medium">
                            Unable to load divisions
                          </p>
                          <p className="text-sm mt-1">
                            Please refresh the page or try again later.
                          </p>
                        </div>
                      ) : divisions.length === 0 ? (
                        <div className="text-yellow-600 bg-yellow-50 p-3 rounded-md">
                          <p className="font-medium">No divisions found</p>
                          <p className="text-sm mt-1">
                            No divisions are configured for the active season.
                          </p>
                        </div>
                      ) : (
                        <RadioGroup
                          value={formData.divisionPreference}
                          onValueChange={(value) =>
                            handleInputChange("divisionPreference", value)
                          }
                          className="space-y-3"
                        >
                          {divisions.map((division) => (
                            <div
                              key={division._id}
                              className="flex items-center space-x-3"
                            >
                              <RadioGroupItem
                                value={division._id}
                                id={division._id}
                                className="bg-primary/10 shadow-none"
                              />
                              <Label
                                htmlFor={division._id}
                                className="cursor-pointer"
                              >
                                {division.name} - {division.ageGroup}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-4">
                      Contact Information
                    </h2>
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border space-y-4 md:space-y-6">
                      {/* Primary Contact */}
                      <div>
                        <h3 className="text-base font-medium text-gray-900 mb-4">
                          Primary Contact
                        </h3>
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                          <div>
                            <Label htmlFor="primaryContactName">
                              Full Name *
                            </Label>
                            <Input
                              id="primaryContactName"
                              value={formData.primaryContactName}
                              onChange={(e) =>
                                handleInputChange(
                                  "primaryContactName",
                                  e.target.value
                                )
                              }
                              className="mt-1 bg-primary/10 shadow-none"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="primaryContactEmail">
                              Email Address *
                            </Label>
                            <Input
                              id="primaryContactEmail"
                              type="email"
                              value={formData.primaryContactEmail}
                              onChange={(e) =>
                                handleInputChange(
                                  "primaryContactEmail",
                                  e.target.value
                                )
                              }
                              className="mt-1 bg-primary/10 shadow-none"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="primaryContactPhone">
                              Phone Number
                            </Label>
                            <Input
                              id="primaryContactPhone"
                              value={formData.primaryContactPhone}
                              onChange={(e) =>
                                handleInputChange(
                                  "primaryContactPhone",
                                  e.target.value
                                )
                              }
                              className="mt-1 bg-primary/10 shadow-none"
                            />
                          </div>
                          <div>
                            <Label htmlFor="primaryContactRole">Role</Label>
                            <Select
                              value={formData.primaryContactRole}
                              onValueChange={(value) =>
                                handleInputChange("primaryContactRole", value)
                              }
                            >
                              <SelectTrigger className="mt-1 bg-primary/10 shadow-none w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manager">
                                  Team Manager
                                </SelectItem>
                                <SelectItem value="parent">
                                  Parent Coordinator
                                </SelectItem>
                                <SelectItem value="coordinator">
                                  Team Coordinator
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Head Coach */}
                      <div>
                        <h3 className="text-base font-medium text-gray-900 mb-4">
                          Head Coach
                        </h3>
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                          <div>
                            <Label htmlFor="headCoachName">Full Name *</Label>
                            <Input
                              id="headCoachName"
                              value={formData.headCoachName}
                              onChange={(e) =>
                                handleInputChange(
                                  "headCoachName",
                                  e.target.value
                                )
                              }
                              className="mt-1 bg-primary/10 shadow-none"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="headCoachEmail">
                              Email Address *
                            </Label>
                            <Input
                              id="headCoachEmail"
                              type="email"
                              value={formData.headCoachEmail}
                              onChange={(e) =>
                                handleInputChange(
                                  "headCoachEmail",
                                  e.target.value
                                )
                              }
                              className="mt-1 bg-primary/10 shadow-none"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="headCoachPhone">Phone Number</Label>
                            <Input
                              id="headCoachPhone"
                              value={formData.headCoachPhone}
                              onChange={(e) =>
                                handleInputChange(
                                  "headCoachPhone",
                                  e.target.value
                                )
                              }
                              className="mt-1 bg-primary/10 shadow-none"
                            />
                          </div>
                          <div>
                            <Label htmlFor="headCoachCertifications">
                              Certifications
                            </Label>
                            <Input
                              id="headCoachCertifications"
                              value={formData.headCoachCertifications}
                              onChange={(e) =>
                                handleInputChange(
                                  "headCoachCertifications",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Level 3 Certified, Youth Development"
                              className="mt-1 bg-primary/10 shadow-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-5 mt-11">
            <div className="sticky top-8">
              <Card className="bg-secondary text-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-0">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6 px-6">
                  {/* Package Details */}
                  {formData.selectedPackage && (
                    <div className="space-y-3">
                      <div className="flex justify-between mb-0">
                        <span className="font-bold">{packageDetails.name}</span>
                        <div className="text-right">
                          {packageDetails.originalAmount && (
                            <div className="text-sm text-gray-500 line-through">
                              ${packageDetails.originalAmount.toLocaleString()}
                            </div>
                          )}
                          <div className="font-bold">
                            ${packageDetails.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#f3f4f5] mt-0">
                        {packageDetails.description}
                      </p>
                      {packageDetails.originalAmount && (
                        <Badge
                          variant="secondary"
                          className="text-green-700 bg-green-50"
                        >
                          Save $
                          {(
                            packageDetails.originalAmount -
                            packageDetails.amount
                          ).toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Registration Details */}
                  <div className="space-y-3 pt-0 ">
                    {formData.teamName && (
                      <div className="flex justify-between text-sm">
                        <span>Team</span>
                        <span className="font-bold">{formData.teamName}</span>
                      </div>
                    )}
                    {selectedDivision && (
                      <div className="flex justify-between text-sm">
                        <span>Division</span>
                        <span className="font-bold">
                          {selectedDivision.name}
                        </span>
                      </div>
                    )}
                    {(formData.city || formData.province) && (
                      <div className="flex justify-between text-sm">
                        <span>Location</span>
                        <span className="font-bold">
                          {[formData.city, formData.province]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                    {formData.contactEmail && (
                      <div className="flex justify-between text-sm">
                        <span>Contact</span>
                        <span className="font-bold">
                          {formData.contactEmail}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-6 border-t border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">
                        ${packageDetails.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isSubmitting}
                    className="w-full bg-primary/80 hover:bg-primary-700 text-white"
                    size="lg"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : "Complete Registration & Pay"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By completing this registration, you agree to our terms and
                    conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in Modal */}
      {showSignInModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ zIndex: 9999 }}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowSignInModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <button
              onClick={() => setShowSignInModal(false)}
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
                returnTo={`/register/checkout?package=${formData.selectedPackage}`}
                onSuccess={() => {
                  setShowSignInModal(false);
                  toast.success("Magic link sent!", {
                    description: "Check your email for the sign-in link.",
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
