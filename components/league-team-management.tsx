"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, CheckCircle, Clock, AlertCircle, X, FileText, CreditCard, Send, Eye, Search } from "lucide-react"
import {
  sampleAdminSeasons,
  sampleTeamRegistrations,
  sampleTeamInvoices,
  sampleTeamPayments,
  getAdminTeamById,
  getDivisionById,
} from "@/lib/admin-data"
import type { TeamInvoice } from "@/lib/admin-data"

export function LeagueTeamManagement() {
  const [selectedSeason, setSelectedSeason] = useState("admin-season-1")
  const [registrationFilter, setRegistrationFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [selectedTeamForInvoice, setSelectedTeamForInvoice] = useState<string | null>(null)

  // Get data for selected season
  const seasonRegistrations = sampleTeamRegistrations.filter((reg) => reg.seasonId === selectedSeason)
  const seasonInvoices = sampleTeamInvoices.filter((inv) => inv.seasonId === selectedSeason)
  const seasonPayments = sampleTeamPayments

  // Filter registrations
  const filteredRegistrations = seasonRegistrations.filter((reg) => {
    const team = getAdminTeamById(reg.teamId)
    const matchesFilter = registrationFilter === "all" || reg.status === registrationFilter
    const matchesSearch = !searchTerm || team?.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Filter invoices by payment status
  const filteredInvoices = seasonInvoices.filter((inv) => {
    const team = getAdminTeamById(inv.teamId)
    const matchesFilter = paymentFilter === "all" || inv.status === paymentFilter
    const matchesSearch = !searchTerm || team?.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleApproveRegistration = (registrationId: string, divisionId: string) => {
    console.log("[v0] Approving registration:", registrationId, "for division:", divisionId)
    // In real app, this would make an API call
  }

  const handleRejectRegistration = (registrationId: string, reason: string) => {
    console.log("[v0] Rejecting registration:", registrationId, "reason:", reason)
    // In real app, this would make an API call
  }

  const handleCreateInvoice = (teamId: string, invoiceData: Partial<TeamInvoice>) => {
    console.log("[v0] Creating invoice for team:", teamId, invoiceData)
    setIsInvoiceModalOpen(false)
    setSelectedTeamForInvoice(null)
    // In real app, this would make an API call
  }

  const handleMarkInvoicePaid = (invoiceId: string) => {
    console.log("[v0] Marking invoice as paid:", invoiceId)
    // In real app, this would make an API call
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const registrationStats = {
    total: seasonRegistrations.length,
    pending: seasonRegistrations.filter((r) => r.status === "pending").length,
    approved: seasonRegistrations.filter((r) => r.status === "approved").length,
    rejected: seasonRegistrations.filter((r) => r.status === "rejected").length,
  }

  const paymentStats = {
    total: seasonInvoices.length,
    paid: seasonInvoices.filter((i) => i.status === "paid").length,
    pending: seasonInvoices.filter((i) => i.status === "pending").length,
    overdue: seasonInvoices.filter((i) => i.status === "overdue").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage team registrations, approvals, and payments</p>
        </div>
        <div className="w-48">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {sampleAdminSeasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{registrationStats.total}</p>
                <p className="text-xs text-gray-600">Total Registrations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{registrationStats.pending}</p>
                <p className="text-xs text-gray-600">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{paymentStats.paid}</p>
                <p className="text-xs text-gray-600">Payments Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{paymentStats.overdue}</p>
                <p className="text-xs text-gray-600">Overdue Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="registrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="registrations">Team Registrations</TabsTrigger>
          <TabsTrigger value="payments">Payments & Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Registrations</CardTitle>
                  <CardDescription>Review and approve team registrations for the season</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search teams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRegistrations.map((registration) => {
                  const team = getAdminTeamById(registration.teamId)
                  const division = getDivisionById(registration.divisionPreference || "")
                  return (
                    <div key={registration.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={team?.logo || "/placeholder.svg"} alt={team?.name} />
                            <AvatarFallback>{team?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900">{team?.name}</h3>
                            <p className="text-sm text-gray-600">
                              {team?.city}, {team?.region}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(registration.status)}>{registration.status}</Badge>
                          <span className="text-sm font-medium">${registration.registrationFee}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Division Preference:</span>
                          <span className="ml-2 font-medium">{division?.name || "Unknown"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Registered:</span>
                          <span className="ml-2 font-medium">
                            {new Date(registration.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Founded:</span>
                          <span className="ml-2 font-medium">{team?.founded}</span>
                        </div>
                      </div>

                      {registration.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">{registration.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTeamForInvoice(registration.teamId)
                              setIsInvoiceModalOpen(true)
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Create Invoice
                          </Button>
                        </div>

                        {registration.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleApproveRegistration(registration.id, registration.divisionPreference || "")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectRegistration(registration.id, "Manual rejection")}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No registrations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payments & Invoices</CardTitle>
                  <CardDescription>Manage team invoices and payment verification</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search teams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => {
                  const team = getAdminTeamById(invoice.teamId)
                  const payment = seasonPayments.find((p) => p.invoiceId === invoice.id)
                  return (
                    <div key={invoice.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={team?.logo || "/placeholder.svg"} alt={team?.name} />
                            <AvatarFallback>{team?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900">{team?.name}</h3>
                            <p className="text-sm text-gray-600">{invoice.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                          <span className="text-lg font-semibold text-gray-900">${invoice.amount}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Invoice #:</span>
                          <span className="ml-2 font-medium">{invoice.invoiceNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <span className="ml-2 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium capitalize">{invoice.type.replace("_", " ")}</span>
                        </div>
                        {payment && (
                          <div>
                            <span className="text-gray-500">Payment Method:</span>
                            <span className="ml-2 font-medium capitalize">
                              {payment.paymentMethod.replace("_", " ")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Invoice
                          </Button>
                          {payment && (
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Payment Proof
                            </Button>
                          )}
                        </div>

                        {invoice.status === "pending" && payment && (
                          <Button size="sm" onClick={() => handleMarkInvoicePaid(invoice.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {filteredInvoices.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Invoice Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Create a new invoice for the selected team</DialogDescription>
          </DialogHeader>
          <InvoiceForm
            teamId={selectedTeamForInvoice}
            seasonId={selectedSeason}
            onSubmit={handleCreateInvoice}
            onCancel={() => setIsInvoiceModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InvoiceForm({
  teamId,
  seasonId,
  onSubmit,
  onCancel,
}: {
  teamId: string | null
  seasonId: string
  onSubmit: (teamId: string, invoiceData: Partial<TeamInvoice>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    type: "registration" as TeamInvoice["type"],
    description: "",
    amount: 500,
    dueDate: "",
  })

  const team = teamId ? getAdminTeamById(teamId) : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId) return

    const invoiceData: Partial<TeamInvoice> = {
      ...formData,
      teamId,
      seasonId,
      status: "pending",
      invoiceNumber: `INV-${Date.now()}`,
      createdBy: "league-admin-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSubmit(teamId, invoiceData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {team && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={team.logo || "/placeholder.svg"} alt={team.name} />
              <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{team.name}</p>
              <p className="text-sm text-gray-600">
                {team.city}, {team.region}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="type">Invoice Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="registration">Registration Fee</SelectItem>
            <SelectItem value="tournament">Tournament Fee</SelectItem>
            <SelectItem value="equipment">Equipment Fee</SelectItem>
            <SelectItem value="facility">Facility Fee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter invoice description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          <Send className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
