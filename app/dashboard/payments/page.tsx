'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react'
import { useSelectedTeam } from '@/components/dashboard/team-selector'
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
  stripe_payment_intent_id?: string
  stripe_session_id?: string
}

export default function PaymentsPage() {
  const selectedTeamId = useSelectedTeam()
  const [payments, setPayments] = useState<TeamPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPaymentData = async () => {
      if (!selectedTeamId || !supabase) {
        setPayments([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // Load payments for selected team (via rosters)
        const { data: paymentsData, error } = await supabase
          .from('team_payments')
          .select(`
            *,
            rosters!inner(
              team_id
            )
          `)
          .eq('rosters.team_id', selectedTeamId)
          .eq('status', 'completed') // Only show completed payments
          .order('created_at', { ascending: false })

        if (error) throw error

        setPayments(paymentsData || [])
      } catch (error) {
        console.error('Error loading payment data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPaymentData()
  }, [selectedTeamId])

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

  const handleViewReceipt = async (payment: TeamPayment) => {
    if (payment.stripe_session_id) {
      // Open Stripe-hosted receipt
      const receiptUrl = `https://billing.stripe.com/p/session/${payment.stripe_session_id}`
      window.open(receiptUrl, '_blank')
    } else if (payment.stripe_payment_intent_id) {
      // For older payments, try to construct receipt URL
      const receiptUrl = `https://billing.stripe.com/p/pi/${payment.stripe_payment_intent_id}`
      window.open(receiptUrl, '_blank')
    } else {
      alert('Receipt not available for this payment')
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

  if (!selectedTeamId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Please select a team to view payments</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View completed payments and download receipts from Stripe
        </p>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReceipt(payment)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Receipt
                        </Button>
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