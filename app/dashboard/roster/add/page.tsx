'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, User, Upload } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser, getUserSanityTeamId } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client-safe'

interface PlayerForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  height: string
  weight: string
  jersey_number: string
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | ''
  grad_year: string
  guardian_name: string
  guardian_phone: string
  guardian_email: string
  medical_notes: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship: string
  status: 'active' | 'inactive' | 'injured' | 'suspended'
}

const initialFormData: PlayerForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  height: '',
  weight: '',
  jersey_number: '',
  position: '',
  grad_year: '',
  guardian_name: '',
  guardian_phone: '',
  guardian_email: '',
  medical_notes: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relationship: '',
  status: 'active'
}

const positions = [
  { value: 'PG', label: 'Point Guard (PG)' },
  { value: 'SG', label: 'Shooting Guard (SG)' },
  { value: 'SF', label: 'Small Forward (SF)' },
  { value: 'PF', label: 'Power Forward (PF)' },
  { value: 'C', label: 'Center (C)' }
]

export default function AddPlayerPage() {
  const [formData, setFormData] = useState<PlayerForm>(initialFormData)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = (field: keyof PlayerForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPhoto = async (file: File, playerId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `players/${playerId}/photo.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('team-assets')
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        console.error('Photo upload error:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('team-assets')
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading photo:', error)
      return null
    }
  }

  const validateForm = (): string | null => {
    if (!formData.first_name.trim()) return 'First name is required'
    if (!formData.last_name.trim()) return 'Last name is required'
    if (formData.jersey_number && isNaN(Number(formData.jersey_number))) {
      return 'Jersey number must be a number'
    }
    if (formData.weight && isNaN(Number(formData.weight))) {
      return 'Weight must be a number'
    }
    if (formData.grad_year && isNaN(Number(formData.grad_year))) {
      return 'Graduation year must be a number'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Get user's team
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const team = await getUserPrimaryTeam(user.id)
      if (!team) throw new Error('No team found')

      // Prepare player data
      const playerData = {
        team_id: team.id,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        height: formData.height.trim() || null,
        weight: formData.weight ? Number(formData.weight) : null,
        jersey_number: formData.jersey_number ? Number(formData.jersey_number) : null,
        position: formData.position || null,
        grad_year: formData.grad_year ? Number(formData.grad_year) : null,
        guardian_name: formData.guardian_name.trim() || null,
        guardian_phone: formData.guardian_phone.trim() || null,
        guardian_email: formData.guardian_email.trim() || null,
        medical_notes: formData.medical_notes.trim() || null,
        emergency_contact_name: formData.emergency_contact_name.trim() || null,
        emergency_contact_phone: formData.emergency_contact_phone.trim() || null,
        emergency_contact_relationship: formData.emergency_contact_relationship.trim() || null,
        status: formData.status,
        photo_url: null
      }

      // Create player
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert(playerData)
        .select()
        .single()

      if (playerError) throw playerError

      // Upload photo if provided
      if (photoFile && player) {
        const photoUrl = await uploadPhoto(photoFile, player.id)
        if (photoUrl) {
          await supabase
            .from('players')
            .update({ photo_url: photoUrl })
            .eq('id', player.id)
        }
      }

      router.push('/dashboard/roster')
    } catch (error) {
      console.error('Error creating player:', error)
      setError(error instanceof Error ? error.message : 'Failed to create player')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/roster">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roster
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Player</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new player to your team roster
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="player@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="grad_year">Graduation Year</Label>
                <Input
                  id="grad_year"
                  type="number"
                  value={formData.grad_year}
                  onChange={(e) => handleInputChange('grad_year', e.target.value)}
                  placeholder="2025"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basketball Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basketball Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="jersey_number">Jersey Number</Label>
                <Input
                  id="jersey_number"
                  type="number"
                  min="0"
                  max="99"
                  value={formData.jersey_number}
                  onChange={(e) => handleInputChange('jersey_number', e.target.value)}
                  placeholder="23"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleInputChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="6'2&quot;"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="180"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Player Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              {photoPreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photoPreview}
                    alt="Player photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a photo of the player (PNG, JPG, max 5MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
            <p className="text-sm text-gray-500">For players under 18</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="guardian_name">Guardian Name</Label>
                <Input
                  id="guardian_name"
                  value={formData.guardian_name}
                  onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                  placeholder="Parent/Guardian name"
                />
              </div>
              <div>
                <Label htmlFor="guardian_phone">Guardian Phone</Label>
                <Input
                  id="guardian_phone"
                  type="tel"
                  value={formData.guardian_phone}
                  onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="guardian_email">Guardian Email</Label>
                <Input
                  id="guardian_email"
                  type="email"
                  value={formData.guardian_email}
                  onChange={(e) => handleInputChange('guardian_email', e.target.value)}
                  placeholder="guardian@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                <Input
                  id="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                  placeholder="Parent, Spouse, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="medical_notes">Medical Notes</Label>
              <Textarea
                id="medical_notes"
                value={formData.medical_notes}
                onChange={(e) => handleInputChange('medical_notes', e.target.value)}
                placeholder="Any medical conditions, allergies, medications, or other important medical information..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Player Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Label htmlFor="status">Current Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value as PlayerForm['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/roster">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Player...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Add Player
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}