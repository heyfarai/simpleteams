"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, UserPlus, Shield, X } from "lucide-react"
import { sampleTeamPermissions, getTeamPermissionsByRole } from "@/lib/admin-data"
import type { TeamAdminUser } from "@/lib/admin-data"

interface StaffManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onInviteStaff: (staffData: Partial<TeamAdminUser>) => void
  teamId: string
}

export function StaffManagementModal({ isOpen, onClose, onInviteStaff, teamId }: StaffManagementModalProps) {
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as TeamAdminUser["role"] | "",
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRoleChange = (role: TeamAdminUser["role"]) => {
    setInviteForm({ ...inviteForm, role })
    // Auto-select default permissions for role
    const defaultPermissions = getTeamPermissionsByRole(role)
    setSelectedPermissions(defaultPermissions)
  }

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteForm.name || !inviteForm.email || !inviteForm.role) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const staffData: Partial<TeamAdminUser> = {
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone || undefined,
      role: inviteForm.role,
      teamId,
      permissions: selectedPermissions,
      isActive: false, // Will be active once they accept invitation
    }

    onInviteStaff(staffData)

    // Reset form
    setInviteForm({ name: "", email: "", phone: "", role: "" as any })
    setSelectedPermissions([])
    setIsSubmitting(false)
    onClose()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "head_coach":
        return "bg-orange-100 text-orange-800"
      case "team_manager":
        return "bg-blue-100 text-blue-800"
      case "assistant_coach":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "head_coach":
        return "Head Coach"
      case "team_manager":
        return "Team Manager"
      case "assistant_coach":
        return "Assistant Coach"
      default:
        return role
    }
  }

  const getPermissionsByCategory = (category: string) => {
    return sampleTeamPermissions.filter((perm) => perm.category === category)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Invite Staff Member</span>
          </DialogTitle>
          <DialogDescription>
            Send an invitation to a new staff member to join your team with specific roles and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <Separator />

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Role Assignment</h3>
            <div className="space-y-2">
              <Label htmlFor="role">Select Role *</Label>
              <Select value={inviteForm.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="head_coach">Head Coach</SelectItem>
                  <SelectItem value="team_manager">Team Manager</SelectItem>
                  <SelectItem value="assistant_coach">Assistant Coach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {inviteForm.role && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getRoleColor(inviteForm.role)}>{getRoleLabel(inviteForm.role)}</Badge>
                  <span className="text-sm text-gray-600">Default permissions will be applied</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Permissions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
            </div>
            <p className="text-sm text-gray-600">
              Customize the permissions for this staff member. Default permissions are selected based on their role.
            </p>

            <div className="space-y-6">
              {["profile", "roster", "payments", "staff"].map((category) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-gray-900 capitalize">{category} Management</h4>
                  <div className="space-y-2">
                    {getPermissionsByCategory(category).map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                            {permission.name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Label>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !inviteForm.name || !inviteForm.email || !inviteForm.role}>
              <Mail className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
