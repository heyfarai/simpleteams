"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Eye, MapPin, Phone, Mail, Users, Calendar, Settings } from "lucide-react"
import { adminSampleData, type AdminLocation } from "@/lib/admin-data"

export function LocationsIndex() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)

  const filteredLocations = adminSampleData.locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || (statusFilter === "active") === location.isActive
    const matchesCity = cityFilter === "all" || location.city === cityFilter
    return matchesSearch && matchesStatus && matchesCity
  })

  const cities = Array.from(new Set(adminSampleData.locations.map((loc) => loc.city)))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Location Manager</h1>
          <p className="text-muted-foreground">Manage league-wide venue pool and assignments</p>
        </div>
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <LocationForm onClose={() => setIsLocationDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{adminSampleData.locations.length}</div>
            <div className="text-sm text-muted-foreground">Total Locations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {adminSampleData.locations.filter((loc) => loc.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Venues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {adminSampleData.locations.reduce((acc, loc) => acc + (loc.capacity || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Capacity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{cities.length}</div>
            <div className="text-sm text-muted-foreground">Cities</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No locations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || cityFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first location to get started"}
            </p>
            <Button onClick={() => setIsLocationDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LocationCard({ location }: { location: AdminLocation }) {
  const assignedSeasons = adminSampleData.seasons.filter((season) => season.locations.includes(location.id))

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {location.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {location.address}, {location.city}, {location.state} {location.zipCode}
            </p>
          </div>
          <Badge variant={location.isActive ? "default" : "secondary"}>
            {location.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Capacity & Facilities */}
        <div className="space-y-3 mb-6">
          {location.capacity && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Capacity: {location.capacity.toLocaleString()}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {location.facilities.slice(0, 3).map((facility) => (
              <Badge key={facility} variant="outline" className="text-xs">
                {facility}
              </Badge>
            ))}
            {location.facilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{location.facilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Contact Info */}
        {(location.contactName || location.contactPhone || location.contactEmail) && (
          <div className="space-y-2 mb-6 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
            {location.contactName && <p className="text-sm text-muted-foreground">{location.contactName}</p>}
            {location.contactPhone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                {location.contactPhone}
              </div>
            )}
            {location.contactEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {location.contactEmail}
              </div>
            )}
          </div>
        )}

        {/* Season Assignments */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Season Assignments</h4>
          {assignedSeasons.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {assignedSeasons.map((season) => (
                <Badge key={season.id} variant="secondary" className="text-xs">
                  {season.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not assigned to any seasons</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <Link href={`/admin/locations/${location.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LocationForm({ locationId, onClose }: { locationId?: string; onClose: () => void }) {
  const isEditing = !!locationId
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    capacity: "",
    facilities: [] as string[],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    isActive: true,
  })

  const [newFacility, setNewFacility] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the database
    console.log("Saving location:", formData)
    onClose()
  }

  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()],
      }))
      setNewFacility("")
    }
  }

  const removeFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location Information</h3>
        <div>
          <label htmlFor="location-name" className="block text-sm font-medium mb-1">
            Venue Name *
          </label>
          <input
            id="location-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="e.g., Thunder Arena"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Street Address *
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="123 Sports Complex Dr"
            required
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City *
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="Springfield"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State *
            </label>
            <input
              id="state"
              type="text"
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="IL"
              required
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
              ZIP Code *
            </label>
            <input
              id="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="62701"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium mb-1">
            Seating Capacity
          </label>
          <input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="2500"
            min="1"
          />
        </div>
      </div>

      {/* Facilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Facilities</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            className="flex-1 px-3 py-2 border border-input rounded-md"
            placeholder="Add facility (e.g., Main Court, Locker Rooms)"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
          />
          <Button type="button" onClick={addFacility}>
            Add
          </Button>
        </div>
        {formData.facilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.facilities.map((facility) => (
              <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                {facility}
                <button type="button" onClick={() => removeFacility(facility)} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
            Contact Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md"
            placeholder="Facility Manager"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="manager@venue.com"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        <input
          id="is-active"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="rounded border-input"
        />
        <label htmlFor="is-active" className="text-sm font-medium">
          Location is active and available for use
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
          {isEditing ? "Update Location" : "Add Location"}
        </Button>
      </div>
    </form>
  )
}
