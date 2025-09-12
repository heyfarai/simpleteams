"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getTeamLogoUrl } from "@/lib/utils/sanity-image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  CreditCard,
  Edit3,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  UserMinus,
  Settings,
  Shield,
} from "lucide-react"
import {
  getAdminTeamById,
  getTeamAdminsByTeamId,
  getTeamRegistrationsByTeamId,
  getTeamInvoicesByTeamId,
} from "@/lib/admin-data"
import { StaffManagementModal } from "@/components/staff-management-modal"
import { PaymentCenter } from "@/components/payment-center"
import type { TeamAdminUser } from "@/lib/admin-data"

// Mock current user - in real app this would come from auth
const mockCurrentUser = {
  id: "admin-1",
  teamId: "1",
  role: "head_coach" as const,
  permissions: ["perm-1", "perm-2", "perm-3", "perm-4"],
}

export function TeamDashboard() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedTeam, setEditedTeam] = useState<any>(null)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [staffMembers, setStaffMembers] = useState(() => getTeamAdminsByTeamId(mockCurrentUser.teamId))

  // Get team data
  const team = getAdminTeamById(mockCurrentUser.teamId)
  const registrations = getTeamRegistrationsByTeamId(mockCurrentUser.teamId)
  const invoices = getTeamInvoicesByTeamId(mockCurrentUser.teamId)

  if (!team) {
    return <div className="p-8">Team not found</div>
  }

  const currentRegistration = registrations.find((reg) => reg.seasonId === "admin-season-1")
  const canEditProfile = mockCurrentUser.permissions.includes("perm-1")
  const canManageStaff = mockCurrentUser.permissions.includes("perm-6")
  const canViewPayments = mockCurrentUser.permissions.includes("perm-3")
  const canUploadPayments = mockCurrentUser.permissions.includes("perm-4")

  const handleEditProfile = () => {
    setEditedTeam({ ...team })
    setIsEditingProfile(true)
  }

  const handleSaveProfile = () => {
    // In real app, this would make an API call
    console.log("[v0] Saving team profile:", editedTeam)
    setIsEditingProfile(false)
    setEditedTeam(null)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setEditedTeam(null)
  }

  const handleInviteStaff = (staffData: Partial<TeamAdminUser>) => {
    console.log("[v0] Inviting staff member:", staffData)
    // In real app, this would make an API call to send invitation
    const newStaffMember: TeamAdminUser = {
      id: `admin-${Date.now()}`,
      name: staffData.name!,
      email: staffData.email!,
      phone: staffData.phone,
      role: staffData.role!,
      teamId: staffData.teamId!,
      permissions: staffData.permissions || [],
      isActive: false, // Will be active once they accept invitation
      invitedBy: mockCurrentUser.id,
      invitedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setStaffMembers([...staffMembers, newStaffMember])
  }

  const handleRemoveStaff = (staffId: string) => {
    console.log("[v0] Removing staff member:", staffId)
    setStaffMembers(staffMembers.filter((staff) => staff.id !== staffId))
  }

  const handleToggleStaffStatus = (staffId: string) => {
    console.log("[v0] Toggling staff status:", staffId)
    setStaffMembers(
      staffMembers.map((staff) => (staff.id === staffId ? { ...staff, isActive: !staff.isActive } : staff)),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={getTeamLogoUrl(team.logo, 'small')} alt={team.name} />
            <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-600">
              {team.city}, {team.region}
            </p>
          </div>
        </div>
        <Badge className={getRoleColor(mockCurrentUser.role)}>{getRoleLabel(mockCurrentUser.role)}</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(currentRegistration?.status || "pending")}
              <div>
                <p className="text-sm font-medium text-gray-900">Registration Status</p>
                <p className="text-xs text-gray-600">2024-25 Season</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{staffMembers.length} Staff Members</p>
                <p className="text-xs text-gray-600">Active team staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {invoices.filter((inv) => inv.status === "paid").length} Paid
                </p>
                <p className="text-xs text-gray-600">of {invoices.length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Founded {team.founded}</p>
                <p className="text-xs text-gray-600">Team history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Team Profile</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>Basic team details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{team.homeVenue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{team.contacts.find((c) => c.isPrimary)?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{team.contacts.find((c) => c.isPrimary)?.phone}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">{team.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest team updates and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Registration approved</p>
                      <p className="text-xs text-gray-500">2024-25 Championship Season</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment verified</p>
                      <p className="text-xs text-gray-500">Registration fee processed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Staff member added</p>
                      <p className="text-xs text-gray-500">Assistant Coach Johnson joined</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Profile</CardTitle>
                <CardDescription>Manage your team's basic information and settings</CardDescription>
              </div>
              {canEditProfile && !isEditingProfile && (
                <Button onClick={handleEditProfile} variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Team Name</Label>
                      <Input
                        id="name"
                        value={editedTeam?.name || ""}
                        onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editedTeam?.city || ""}
                        onChange={(e) => setEditedTeam({ ...editedTeam, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        value={editedTeam?.region || ""}
                        onChange={(e) => setEditedTeam({ ...editedTeam, region: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="homeVenue">Home Venue</Label>
                      <Input
                        id="homeVenue"
                        value={editedTeam?.homeVenue || ""}
                        onChange={(e) => setEditedTeam({ ...editedTeam, homeVenue: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Team Description</Label>
                    <Textarea
                      id="description"
                      value={editedTeam?.description || ""}
                      onChange={(e) => setEditedTeam({ ...editedTeam, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Team Name</Label>
                      <p className="text-sm font-medium text-gray-900">{team.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">City</Label>
                      <p className="text-sm font-medium text-gray-900">{team.city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Region</Label>
                      <p className="text-sm font-medium text-gray-900">{team.region}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Home Venue</Label>
                      <p className="text-sm font-medium text-gray-900">{team.homeVenue}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Founded</Label>
                      <p className="text-sm font-medium text-gray-900">{team.founded}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge className={getStatusColor(team.status)}>{team.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-sm text-gray-900 mt-1">{team.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Primary Colors</Label>
                    <div className="flex space-x-2 mt-1">
                      {team.primaryColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage team staff members and their roles</CardDescription>
              </div>
              {canManageStaff && (
                <Button onClick={() => setIsStaffModalOpen(true)} size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Staff
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMembers.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{admin.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{admin.name}</p>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        {admin.phone && <p className="text-sm text-gray-600">{admin.phone}</p>}
                        {!admin.acceptedAt && admin.invitedAt && (
                          <p className="text-xs text-yellow-600">
                            Invitation sent {new Date(admin.invitedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(admin.role)}>{getRoleLabel(admin.role)}</Badge>
                      <Badge variant="outline" className={admin.isActive ? "text-green-600" : "text-gray-400"}>
                        {admin.isActive ? "Active" : admin.acceptedAt ? "Inactive" : "Pending"}
                      </Badge>
                      {canManageStaff && admin.id !== mockCurrentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage Staff</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStaffStatus(admin.id)}>
                              <Settings className="h-4 w-4 mr-2" />
                              {admin.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRemoveStaff(admin.id)} className="text-red-600">
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove Staff
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
                {staffMembers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No staff members yet</p>
                    {canManageStaff && (
                      <Button onClick={() => setIsStaffModalOpen(true)} className="mt-2">
                        Invite Your First Staff Member
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentCenter
            teamId={mockCurrentUser.teamId}
            canViewPayments={canViewPayments}
            canUploadPayments={canUploadPayments}
          />
        </TabsContent>

        <TabsContent value="registration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Season Registration</CardTitle>
              <CardDescription>View and manage your team's season registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div key={registration.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(registration.status)}
                        <h3 className="font-medium text-gray-900">2024-25 Championship Season</h3>
                      </div>
                      <Badge className={getStatusColor(registration.status)}>{registration.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Registration Fee:</span>
                        <span className="ml-2 font-medium">${registration.registrationFee}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Division Preference:</span>
                        <span className="ml-2 font-medium">{registration.divisionPreference}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Registered:</span>
                        <span className="ml-2 font-medium">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {registration.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">{registration.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <StaffManagementModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onInviteStaff={handleInviteStaff}
        teamId={mockCurrentUser.teamId}
      />
    </div>
  )
}
