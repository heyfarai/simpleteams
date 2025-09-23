'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Save, 
  Upload, 
  Palette,
  Settings as SettingsIcon,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { useSelectedTeam } from '@/components/dashboard/team-selector'
import { supabase } from '@/lib/supabase/client-safe'
import type { Database } from '@/lib/supabase/database.types'
import { TeamLogoUpload } from '@/components/team-logo-upload'

type Team = Database['public']['Tables']['teams']['Row']

interface TeamSettingsForm {
  name: string
  city: string
  region: string
  contact_email: string
  phone: string
  website: string
  primary_color: string
  secondary_color: string
  accent_color: string
  primary_contact_name: string
  primary_contact_email: string
  primary_contact_phone: string
  primary_contact_role: string
  head_coach_name: string
  head_coach_email: string
  head_coach_phone: string
  head_coach_certifications: string
  registration_notes: string
}

export default function TeamSettingsPage() {
  const selectedTeamId = useSelectedTeam()
  const [team, setTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState<TeamSettingsForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadTeamData = async () => {
      if (!selectedTeamId || !supabase) {
        setIsLoading(false)
        return
      }

      try {
        // Load team data from Supabase
        const { data: userTeam, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', selectedTeamId)
          .single()

        if (error || !userTeam) {
          console.error('Error loading team:', error)
          return
        }

        setTeam(userTeam)
        
        // Initialize form with team data
        setFormData({
          name: userTeam.name,
          city: userTeam.city,
          region: userTeam.region || '',
          contact_email: userTeam.contact_email,
          phone: userTeam.phone || '',
          website: userTeam.website || '',
          primary_color: userTeam.primary_color,
          secondary_color: userTeam.secondary_color,
          accent_color: userTeam.accent_color || '',
          primary_contact_name: userTeam.primary_contact_name,
          primary_contact_email: userTeam.primary_contact_email,
          primary_contact_phone: userTeam.primary_contact_phone || '',
          primary_contact_role: userTeam.primary_contact_role,
          head_coach_name: userTeam.head_coach_name || '',
          head_coach_email: userTeam.head_coach_email || '',
          head_coach_phone: userTeam.head_coach_phone || '',
          head_coach_certifications: userTeam.head_coach_certifications || '',
          registration_notes: userTeam.registration_notes || ''
        })
        
        if (userTeam.logo_url) {
          setLogoPreview(userTeam.logo_url)
        }
      } catch (error) {
        console.error('Error loading team data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamData()
  }, [selectedTeamId])

  const handleInputChange = (field: keyof TeamSettingsForm, value: string) => {
    if (!formData) return
    setFormData({ ...formData, [field]: value })
  }


  const handleSave = async () => {
    if (!team || !formData) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      // Update team data (logo is handled by TeamLogoUpload component)
      const { error } = await supabase
        .from('teams')
        .update(formData)
        .eq('id', team.id)

      if (error) {
        throw error
      }

      // Update local state
      setTeam({ ...team, ...formData })
      setSaveMessage({ type: 'success', message: 'Team settings saved successfully!' })

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error('Error saving team settings:', error)
      setSaveMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save settings'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team's profile and contact information
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-md ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {saveMessage.message}
        </div>
      )}

      <div className="space-y-6">
        {/* Team Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Team Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="region">Region/Province</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  placeholder="Enter region or province"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://your-team-website.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo & Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Logo & Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Upload */}
            <div>
              <Label>Team Logo</Label>
              <div className="mt-2">
                {team && (
                  <TeamLogoUpload
                    teamId={team.id}
                    teamName={team.name}
                    currentLogoUrl={team.logo_url}
                    onLogoUpdated={(logoUrl) => {
                      setTeam({ ...team, logo_url: logoUrl })
                      setLogoPreview(logoUrl)
                    }}
                    size="lg"
                  />
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="primary_color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#1e40af"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="secondary_color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#fbbf24"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accent_color">Accent Color (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="accent_color"
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    placeholder="#10b981"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Team Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="team@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Team Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_contact_name">Name</Label>
                <Input
                  id="primary_contact_name"
                  value={formData.primary_contact_name}
                  onChange={(e) => handleInputChange('primary_contact_name', e.target.value)}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="primary_contact_role">Role</Label>
                <Input
                  id="primary_contact_role"
                  value={formData.primary_contact_role}
                  onChange={(e) => handleInputChange('primary_contact_role', e.target.value)}
                  placeholder="Manager"
                />
              </div>
              <div>
                <Label htmlFor="primary_contact_email">Email</Label>
                <Input
                  id="primary_contact_email"
                  type="email"
                  value={formData.primary_contact_email}
                  onChange={(e) => handleInputChange('primary_contact_email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="primary_contact_phone">Phone</Label>
                <Input
                  id="primary_contact_phone"
                  type="tel"
                  value={formData.primary_contact_phone}
                  onChange={(e) => handleInputChange('primary_contact_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Head Coach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Head Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="head_coach_name">Name</Label>
                <Input
                  id="head_coach_name"
                  value={formData.head_coach_name}
                  onChange={(e) => handleInputChange('head_coach_name', e.target.value)}
                  placeholder="Coach name"
                />
              </div>
              <div>
                <Label htmlFor="head_coach_email">Email</Label>
                <Input
                  id="head_coach_email"
                  type="email"
                  value={formData.head_coach_email}
                  onChange={(e) => handleInputChange('head_coach_email', e.target.value)}
                  placeholder="coach@example.com"
                />
              </div>
              <div>
                <Label htmlFor="head_coach_phone">Phone</Label>
                <Input
                  id="head_coach_phone"
                  type="tel"
                  value={formData.head_coach_phone}
                  onChange={(e) => handleInputChange('head_coach_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="head_coach_certifications">Certifications</Label>
                <Input
                  id="head_coach_certifications"
                  value={formData.head_coach_certifications}
                  onChange={(e) => handleInputChange('head_coach_certifications', e.target.value)}
                  placeholder="NCCP, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="registration_notes">Registration Notes</Label>
              <Textarea
                id="registration_notes"
                value={formData.registration_notes}
                onChange={(e) => handleInputChange('registration_notes', e.target.value)}
                placeholder="Any additional information about your team..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}