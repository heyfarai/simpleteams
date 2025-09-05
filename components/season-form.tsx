"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, ArrowLeft } from "lucide-react"
import { adminSampleData } from "@/lib/admin-data"

interface SeasonFormData {
  name: string
  type: "Regular" | "Summer"
  year: number
  startDate: string
  endDate: string
  description: string
  locations: string[]
  officials: string[]
  isActive: boolean
}

export function SeasonForm({ seasonId }: { seasonId?: string }) {
  const router = useRouter()
  const isEditing = !!seasonId

  // In a real app, this would fetch the season data if editing
  const [formData, setFormData] = useState<SeasonFormData>({
    name: "",
    type: "Regular",
    year: new Date().getFullYear(),
    startDate: "",
    endDate: "",
    description: "",
    locations: [],
    officials: [],
    isActive: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the database
    console.log("Saving season:", formData)
    router.push("/admin/seasons")
  }

  const handleLocationToggle = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.includes(locationId)
        ? prev.locations.filter((id) => id !== locationId)
        : [...prev.locations, locationId],
    }))
  }

  const handleOfficialToggle = (officialId: string) => {
    setFormData((prev) => ({
      ...prev,
      officials: prev.officials.includes(officialId)
        ? prev.officials.filter((id) => id !== officialId)
        : [...prev.officials, officialId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Season Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., 2024-25 Championship Season"
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Season Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "Regular" | "Summer") => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular Season</SelectItem>
                <SelectItem value="Summer">Summer League</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description of the season"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive">Set as active season</Label>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminSampleData.locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location.id}`}
                  checked={formData.locations.includes(location.id)}
                  onCheckedChange={() => handleLocationToggle(location.id)}
                />
                <Label htmlFor={`location-${location.id}`} className="flex-1">
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {location.city}, {location.state}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Officials */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Officials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminSampleData.officials.map((official) => (
              <div key={official.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`official-${official.id}`}
                  checked={formData.officials.includes(official.id)}
                  onCheckedChange={() => handleOfficialToggle(official.id)}
                />
                <Label htmlFor={`official-${official.id}`} className="flex-1">
                  <div>
                    <div className="font-medium">{official.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {official.certificationLevel} • {official.specialties.join(", ")}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Update Season" : "Create Season"}
        </Button>
      </div>
    </form>
  )
}
