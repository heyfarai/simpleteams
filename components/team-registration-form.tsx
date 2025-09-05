"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Upload, Check, AlertCircle, Users, MapPin, Palette } from "lucide-react"
import { sampleAdminSeasons, getDivisionById } from "@/lib/admin-data"
import type { TeamRegistration } from "@/lib/admin-data"

interface TeamRegistrationFormProps {
  teamId?: string // If provided, this is a returning team
  seasonId: string
  onSubmit: (registrationData: Partial<TeamRegistration>) => void
  isSubmitting?: boolean
}

export function TeamRegistrationForm({ teamId, seasonId, onSubmit, isSubmitting = false }: TeamRegistrationFormProps) {
  const [formData, setFormData] = useState({
    // Team Information
    teamName: "",
    city: "",
    region: "",
    homeVenue: "",
    founded: "",
    description: "",
    logo: null as File | null,
    primaryColors: ["#1e40af", "#fbbf24"], // Default blue and gold

    // Registration Details
    divisionPreference: "",
    registrationNotes: "",

    // Contact Information
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactRole: "manager" as const,

    // Coach Information
    headCoachName: "",
    headCoachEmail: "",
    headCoachPhone: "",
    headCoachCertifications: "",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const season = sampleAdminSeasons.find((s) => s.id === seasonId)
  const availableDivisions = season?.conferences.flatMap((conf) => conf.divisions) || []

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.primaryColors]
    newColors[index] = color
    setFormData((prev) => ({ ...prev, primaryColors: newColors }))
  }

  const addColor = () => {
    if (formData.primaryColors.length < 3) {
      setFormData((prev) => ({
        ...prev,
        primaryColors: [...prev.primaryColors, "#000000"],
      }))
    }
  }

  const removeColor = (index: number) => {
    if (formData.primaryColors.length > 1) {
      const newColors = formData.primaryColors.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, primaryColors: newColors }))
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.teamName && formData.city && formData.region
      case 2:
        return formData.divisionPreference
      case 3:
        return (
          formData.primaryContactName &&
          formData.primaryContactEmail &&
          formData.headCoachName &&
          formData.headCoachEmail
        )
      case 4:
        return true // Review step
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const registrationData: Partial<TeamRegistration> = {
      teamId: teamId || `team-${Date.now()}`,
      seasonId,
      status: "pending",
      divisionPreference: formData.divisionPreference,
      registrationFee: 500, // Default fee
      registrationDate: new Date().toISOString(),
      notes: formData.registrationNotes,
    }

    onSubmit(registrationData)
  }

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <Check className="h-4 w-4" />
    if (step === currentStep) return <div className="h-2 w-2 bg-orange-600 rounded-full" />
    return <div className="h-2 w-2 bg-gray-300 rounded-full" />
  }

  const getStepColor = (step: number) => {
    if (step < currentStep) return "bg-green-100 text-green-800 border-green-200"
    if (step === currentStep) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-gray-100 text-gray-500 border-gray-200"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: "Team Info", icon: Users },
              { step: 2, title: "Division", icon: MapPin },
              { step: 3, title: "Contacts", icon: Users },
              { step: 4, title: "Review", icon: Check },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getStepColor(step)}`}
                >
                  {step < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : step === currentStep ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">Step {step}</p>
                </div>
                {step < totalSteps && <div className="hidden sm:block w-16 h-0.5 bg-gray-200 ml-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{teamId ? "Season Registration" : "Team Registration"}</CardTitle>
          <CardDescription>
            {season?.name} - {teamId ? "Register your existing team" : "Register a new team"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Team Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange("teamName", e.target.value)}
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => handleInputChange("region", e.target.value)}
                      placeholder="Enter region"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeVenue">Home Venue</Label>
                    <Input
                      id="homeVenue"
                      value={formData.homeVenue}
                      onChange={(e) => handleInputChange("homeVenue", e.target.value)}
                      placeholder="Enter home venue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      value={formData.founded}
                      onChange={(e) => handleInputChange("founded", e.target.value)}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Team Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your team's style, achievements, or philosophy..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Team Branding</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="logo">Team Logo</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={logoPreview || "/placeholder.svg"} alt="Team logo" />
                        <AvatarFallback>{formData.teamName.substring(0, 2) || "TM"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <Label htmlFor="logo" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Logo
                            </span>
                          </Button>
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Colors */}
                  <div className="space-y-2">
                    <Label>Primary Colors</Label>
                    <div className="space-y-3">
                      {formData.primaryColors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                          />
                          <Input
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                          {formData.primaryColors.length > 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeColor(index)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      {formData.primaryColors.length < 3 && (
                        <Button type="button" variant="outline" size="sm" onClick={addColor}>
                          <Palette className="h-4 w-4 mr-2" />
                          Add Color
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Division Preference */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Division Preference</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="division">Preferred Division *</Label>
                    <Select
                      value={formData.divisionPreference}
                      onValueChange={(value) => handleInputChange("divisionPreference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred division" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDivisions.map((division) => (
                          <SelectItem key={division.id} value={division.id}>
                            {division.name} - {division.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.divisionPreference && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Division Information</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            {getDivisionById(formData.divisionPreference)?.description}
                          </p>
                          <div className="mt-2 text-sm text-blue-600">
                            <span>Team Capacity: </span>
                            <span className="font-medium">
                              {getDivisionById(formData.divisionPreference)?.minTeams}-
                              {getDivisionById(formData.divisionPreference)?.maxTeams} teams
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="registrationNotes">Additional Notes</Label>
                    <Textarea
                      id="registrationNotes"
                      value={formData.registrationNotes}
                      onChange={(e) => handleInputChange("registrationNotes", e.target.value)}
                      placeholder="Any additional information about your team or special requests..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>

                {/* Primary Contact */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Primary Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactName">Full Name *</Label>
                      <Input
                        id="primaryContactName"
                        value={formData.primaryContactName}
                        onChange={(e) => handleInputChange("primaryContactName", e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactEmail">Email Address *</Label>
                      <Input
                        id="primaryContactEmail"
                        type="email"
                        value={formData.primaryContactEmail}
                        onChange={(e) => handleInputChange("primaryContactEmail", e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactPhone">Phone Number</Label>
                      <Input
                        id="primaryContactPhone"
                        value={formData.primaryContactPhone}
                        onChange={(e) => handleInputChange("primaryContactPhone", e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryContactRole">Role</Label>
                      <Select
                        value={formData.primaryContactRole}
                        onValueChange={(value: any) => handleInputChange("primaryContactRole", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Team Manager</SelectItem>
                          <SelectItem value="parent">Parent Coordinator</SelectItem>
                          <SelectItem value="coordinator">Team Coordinator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Head Coach */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Head Coach</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="headCoachName">Full Name *</Label>
                      <Input
                        id="headCoachName"
                        value={formData.headCoachName}
                        onChange={(e) => handleInputChange("headCoachName", e.target.value)}
                        placeholder="Enter coach name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headCoachEmail">Email Address *</Label>
                      <Input
                        id="headCoachEmail"
                        type="email"
                        value={formData.headCoachEmail}
                        onChange={(e) => handleInputChange("headCoachEmail", e.target.value)}
                        placeholder="Enter coach email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headCoachPhone">Phone Number</Label>
                      <Input
                        id="headCoachPhone"
                        value={formData.headCoachPhone}
                        onChange={(e) => handleInputChange("headCoachPhone", e.target.value)}
                        placeholder="Enter coach phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headCoachCertifications">Certifications</Label>
                      <Input
                        id="headCoachCertifications"
                        value={formData.headCoachCertifications}
                        onChange={(e) => handleInputChange("headCoachCertifications", e.target.value)}
                        placeholder="e.g., Level 3 Certified, Youth Development"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Registration</h3>

                <div className="space-y-6">
                  {/* Team Information Summary */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Team Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Team Name:</span>
                        <span className="ml-2 font-medium">{formData.teamName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 font-medium">
                          {formData.city}, {formData.region}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Home Venue:</span>
                        <span className="ml-2 font-medium">{formData.homeVenue || "Not specified"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Founded:</span>
                        <span className="ml-2 font-medium">{formData.founded || "Not specified"}</span>
                      </div>
                    </div>
                    {formData.description && (
                      <div className="mt-3">
                        <span className="text-gray-500">Description:</span>
                        <p className="text-sm text-gray-900 mt-1">{formData.description}</p>
                      </div>
                    )}
                    <div className="mt-3 flex items-center space-x-4">
                      <span className="text-gray-500">Colors:</span>
                      <div className="flex space-x-2">
                        {formData.primaryColors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Division Preference */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Division Preference</h4>
                    <div className="text-sm">
                      <span className="text-gray-500">Preferred Division:</span>
                      <span className="ml-2 font-medium">{getDivisionById(formData.divisionPreference)?.name}</span>
                    </div>
                    {formData.registrationNotes && (
                      <div className="mt-3">
                        <span className="text-gray-500">Notes:</span>
                        <p className="text-sm text-gray-900 mt-1">{formData.registrationNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Primary Contact</h5>
                        <div className="space-y-1">
                          <div>{formData.primaryContactName}</div>
                          <div className="text-gray-600">{formData.primaryContactEmail}</div>
                          {formData.primaryContactPhone && (
                            <div className="text-gray-600">{formData.primaryContactPhone}</div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {formData.primaryContactRole.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Head Coach</h5>
                        <div className="space-y-1">
                          <div>{formData.headCoachName}</div>
                          <div className="text-gray-600">{formData.headCoachEmail}</div>
                          {formData.headCoachPhone && <div className="text-gray-600">{formData.headCoachPhone}</div>}
                          {formData.headCoachCertifications && (
                            <div className="text-xs text-gray-500">{formData.headCoachCertifications}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Fee */}
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-orange-900">Registration Fee</h4>
                        <p className="text-sm text-orange-700">Payment will be required after approval</p>
                      </div>
                      <div className="text-2xl font-bold text-orange-900">$500</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext} disabled={!validateStep(currentStep)}>
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
