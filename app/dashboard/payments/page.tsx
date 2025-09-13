'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  DollarSign, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { getCurrentUser, getUserSanityTeamId } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client-safe'

interface TeamPayment {
  id: string
  amount: number
  currency: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  created_at: string
  paid_at?: string
  payment_type: string
  receipt_url?: string
  receipt_number?: string
}

interface PaymentSummary {
  totalPaid: number
  totalPending: number
  totalOutstanding: number
  lastPaymentDate: string | null
}

export default function PaymentsPage() {
  const [teamId, setTeamId] = useState<string | null>(null)
  const [payments, setPayments] = useState<TeamPayment[]>([])
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const userSanityTeamId = await getUserSanityTeamId(user.id)
        if (!userSanityTeamId) return

        setTeamId(userSanityTeamId)

        // Load payments
        const { data: paymentsData, error } = await supabase
          .from('team_payments')
          .select('*')
          .eq('sanity_team_id', userSanityTeamId)
          .order('created_at', { ascending: false })

        if (error) throw error

        setPayments(paymentsData || [])

        // Calculate summary
        const totalPaid = paymentsData
          ?.filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0) || 0

        const totalPending = paymentsData
          ?.filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0) || 0

        const totalOutstanding = paymentsData
          ?.filter(p => ['pending', 'failed'].includes(p.status))
          .reduce((sum, p) => sum + p.amount, 0) || 0

        const lastPayment = paymentsData
          ?.find(p => p.status === 'completed' && p.paid_at)

        setSummary({
          totalPaid,
          totalPending,
          totalOutstanding,
          lastPaymentDate: lastPayment?.paid_at || null
        })
      } catch (error) {
        console.error('Error loading payment data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPaymentData()
  }, [])

  const getStatusIcon = (status: TeamPayment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: TeamPayment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadReceipt = async (payment: TeamPayment) => {
    if (payment.receipt_url) {
      window.open(payment.receipt_url, '_blank')
    } else {
      // Generate receipt if needed
      alert('Receipt not available')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!teamId || !summary) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Failed to load payment data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments & Receipts</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your team's payment history and download receipts
        </p>
      </div>

      {/* Outstanding Balance Alert */}
      {summary.totalOutstanding > 0 && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Outstanding Balance
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    You have an outstanding balance of <strong>${(summary.totalOutstanding / 100).toFixed(2)}</strong>.
                    Please complete your payment to ensure your team's participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Paid
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${(summary.totalPaid / 100).toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${(summary.totalPending / 100).toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Last Payment
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {summary.lastPaymentDate
                      ? new Date(summary.lastPaymentDate).toLocaleDateString()
                      : 'No payments yet'
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
              <p className="mt-1 text-sm text-gray-500">
                Payment transactions will appear here once you make a payment.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.payment_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(payment.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}