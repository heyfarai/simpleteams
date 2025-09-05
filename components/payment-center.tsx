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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Upload,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Receipt,
  DollarSign,
  Eye,
} from "lucide-react"
import { getTeamInvoicesByTeamId, getTeamPaymentsByTeamId, sampleAdminSeasons } from "@/lib/admin-data"
import type { TeamPayment } from "@/lib/admin-data"

interface PaymentCenterProps {
  teamId: string
  canViewPayments: boolean
  canUploadPayments: boolean
}

export function PaymentCenter({ teamId, canViewPayments, canUploadPayments }: PaymentCenterProps) {
  const [selectedSeason, setSelectedSeason] = useState("admin-season-1")
  const [uploadingInvoiceId, setUploadingInvoiceId] = useState<string | null>(null)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<TeamPayment["paymentMethod"]>("bank_transfer")
  const [paymentNotes, setPaymentNotes] = useState("")

  // Get data
  const allInvoices = getTeamInvoicesByTeamId(teamId)
  const allPayments = getTeamPaymentsByTeamId(teamId)
  const seasonInvoices = allInvoices.filter((inv) => inv.seasonId === selectedSeason)

  if (!canViewPayments) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">You don't have permission to view payment information.</p>
        </CardContent>
      </Card>
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPaymentFile(file)
    }
  }

  const handleUploadPayment = async (invoiceId: string) => {
    if (!paymentFile) return

    console.log("[v0] Uploading payment proof:", {
      invoiceId,
      file: paymentFile.name,
      method: paymentMethod,
      notes: paymentNotes,
    })

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form
    setUploadingInvoiceId(null)
    setPaymentFile(null)
    setPaymentMethod("bank_transfer")
    setPaymentNotes("")
  }

  const handleDownloadReceipt = (invoiceId: string) => {
    console.log("[v0] Downloading receipt for invoice:", invoiceId)
    // In real app, this would trigger a download
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodLabel = (method: TeamPayment["paymentMethod"]) => {
    switch (method) {
      case "bank_transfer":
        return "Bank Transfer"
      case "check":
        return "Check"
      case "cash":
        return "Cash"
      case "online":
        return "Online Payment"
      default:
        return method
    }
  }

  const totalAmount = seasonInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = seasonInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = seasonInvoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = seasonInvoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header with Season Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Center</h2>
          <p className="text-gray-600">Manage invoices and payment submissions</p>
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

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">${totalAmount}</p>
                <p className="text-xs text-gray-600">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">${paidAmount}</p>
                <p className="text-xs text-gray-600">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">${pendingAmount}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">${overdueAmount}</p>
                <p className="text-xs text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices and Payments */}
      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Season Invoices</CardTitle>
              <CardDescription>View and manage your team's invoices for the selected season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seasonInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(invoice.status)}
                        <div>
                          <h3 className="font-medium text-gray-900">{invoice.description}</h3>
                          <p className="text-sm text-gray-600">Invoice #{invoice.invoiceNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        <span className="text-lg font-semibold text-gray-900">${invoice.amount}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium capitalize">{invoice.type.replace("_", " ")}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <span className="ml-2 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {invoice.status === "paid" && (
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(invoice.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </Button>
                        )}
                      </div>

                      {canUploadPayments && invoice.status === "pending" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setUploadingInvoiceId(invoice.id)}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Upload Payment Proof</DialogTitle>
                              <DialogDescription>Upload proof of payment for {invoice.description}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between text-sm">
                                  <span>Invoice Amount:</span>
                                  <span className="font-semibold">${invoice.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Due Date:</span>
                                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="payment-method">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="check">Check</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="online">Online Payment</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="payment-file">Payment Proof (PDF/Image)</Label>
                                <Input
                                  id="payment-file"
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileUpload}
                                />
                                {paymentFile && <p className="text-sm text-gray-600">Selected: {paymentFile.name}</p>}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                                <Input
                                  id="payment-notes"
                                  value={paymentNotes}
                                  onChange={(e) => setPaymentNotes(e.target.value)}
                                  placeholder="Additional payment details..."
                                />
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleUploadPayment(invoice.id)}
                                  disabled={!paymentFile}
                                  className="flex-1"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Payment
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}

                {seasonInvoices.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices found for this season</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all payment submissions and their verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allPayments.map((payment) => {
                  const invoice = allInvoices.find((inv) => inv.id === payment.invoiceId)
                  return (
                    <div key={payment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(payment.status)}
                          <div>
                            <h3 className="font-medium text-gray-900">{invoice?.description || "Unknown Invoice"}</h3>
                            <p className="text-sm text-gray-600">
                              Payment via {getPaymentMethodLabel(payment.paymentMethod)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                          <span className="text-lg font-semibold text-gray-900">${payment.amount}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Uploaded:</span>
                          <span className="ml-2 font-medium">{new Date(payment.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        {payment.verifiedAt && (
                          <div>
                            <span className="text-gray-500">Verified:</span>
                            <span className="ml-2 font-medium">
                              {new Date(payment.verifiedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Method:</span>
                          <span className="ml-2 font-medium">{getPaymentMethodLabel(payment.paymentMethod)}</span>
                        </div>
                      </div>

                      {payment.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">{payment.notes}</p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Proof
                        </Button>
                        {payment.status === "verified" && (
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(payment.invoiceId)}>
                            <Receipt className="h-4 w-4 mr-2" />
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {allPayments.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No payment history found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
