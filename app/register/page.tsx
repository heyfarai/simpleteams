"use client"

import { useState } from "react"
import { TeamRegistrationForm } from "@/components/team-registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users } from "lucide-react"
import { sampleAdminSeasons } from "@/lib/admin-data"
import type { TeamRegistration } from "@/lib/admin-data"

export default function RegisterPage() {
  const [selectedSeason, setSelectedSeason] = useState("admin-season-1")
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeSeasons = sampleAdminSeasons.filter((season) => season.status === "active")
  const selectedSeasonData = sampleAdminSeasons.find((s) => s.id === selectedSeason)

  const handleRegistrationSubmit = async (registrationData: Partial<TeamRegistration>) => {
    setIsSubmitting(true)

    // Simulate API call
    console.log("[v0] Submitting team registration:", registrationData)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setRegistrationSubmitted(true)
  }

  if (registrationSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
                <p className="text-gray-600 mb-6">
                  Your team registration has been submitted successfully. You will receive an email confirmation
                  shortly.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>League admin will review your registration (1-3 business days)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>You'll be notified of approval and division assignment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Payment instructions will be provided upon approval</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => (window.location.href = "/")}>Return to Homepage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Registration</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Register your team for the upcoming basketball season. Complete the form below to submit your application.
          </p>
        </div>

        {/* Season Selection */}
        <div className="max-w-md mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Season</CardTitle>
              <CardDescription>Choose the season you want to register for</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  {activeSeasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{season.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {season.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSeasonData && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Season:</span>
                      <span className="font-medium">{selectedSeasonData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">
                        {new Date(selectedSeasonData.startDate).toLocaleDateString()} -{" "}
                        {new Date(selectedSeasonData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <Badge className="bg-green-100 text-green-800">{selectedSeasonData.status}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <TeamRegistrationForm
          seasonId={selectedSeason}
          onSubmit={handleRegistrationSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
