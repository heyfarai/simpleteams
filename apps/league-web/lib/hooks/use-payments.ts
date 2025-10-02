import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TeamPayment, PaymentStatus, PaymentType } from '../domain/models';

interface PaymentsResponse {
  payments: TeamPayment[];
  count: number;
}

interface PaymentSummaryResponse {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  overduePayments: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  outstandingAmount: number;
}

interface CreatePaymentRequest {
  rosterId: string;
  amount: number;
  description: string;
  dueDate?: string;
  paymentType?: PaymentType;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}

interface UpdatePaymentRequest {
  amount?: number;
  description?: string;
  status?: PaymentStatus;
  dueDate?: string;
  paidAt?: string;
  receiptUrl?: string;
}

// Get all payments
export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch('/api/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get payments for a specific roster
export function usePaymentsByRoster(rosterId: string) {
  return useQuery({
    queryKey: ['payments', 'roster', rosterId],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch(`/api/payments?rosterId=${rosterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments for roster');
      }
      return response.json();
    },
    enabled: !!rosterId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get payments by status
export function usePaymentsByStatus(status: PaymentStatus) {
  return useQuery({
    queryKey: ['payments', 'status', status],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch(`/api/payments?status=${status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${status} payments`);
      }
      return response.json();
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get payments by type
export function usePaymentsByType(paymentType: PaymentType) {
  return useQuery({
    queryKey: ['payments', 'type', paymentType],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch(`/api/payments?type=${paymentType}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${paymentType} payments`);
      }
      return response.json();
    },
    enabled: !!paymentType,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get payments for a specific team
export function usePaymentsByTeam(teamId: string) {
  return useQuery({
    queryKey: ['payments', 'team', teamId],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch(`/api/payments/by-team?teamId=${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments for team');
      }
      return response.json();
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get overdue payments
export function useOverduePayments() {
  return useQuery({
    queryKey: ['payments', 'overdue'],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await fetch('/api/payments?status=overdue');
      if (!response.ok) {
        throw new Error('Failed to fetch overdue payments');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 1, // 1 minute (more frequent updates for overdue)
  });
}

// Get payment by ID
export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: ['payments', paymentId],
    queryFn: async (): Promise<TeamPayment> => {
      const response = await fetch(`/api/payments/${paymentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment');
      }
      return response.json();
    },
    enabled: !!paymentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get payment summary for a roster
export function usePaymentSummary(rosterId: string) {
  return useQuery({
    queryKey: ['payments', 'summary', rosterId],
    queryFn: async (): Promise<PaymentSummaryResponse> => {
      const response = await fetch(`/api/payments/summary?rosterId=${rosterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment summary');
      }
      return response.json();
    },
    enabled: !!rosterId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get installment payment for user and team (for billing portal)
export function useInstallmentPayment(userId: string, teamId: string) {
  return useQuery({
    queryKey: ['payments', 'installment', userId, teamId],
    queryFn: async (): Promise<{ payment: TeamPayment | null }> => {
      const response = await fetch(`/api/payments/installment?userId=${userId}&teamId=${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch installment payment');
      }
      return response.json();
    },
    enabled: !!userId && !!teamId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create a new payment
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: CreatePaymentRequest): Promise<{ payment: TeamPayment }> => {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'roster', data.payment.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'summary', data.payment.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'status', data.payment.status] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'type', data.payment.paymentType] });
    },
  });
}

// Update an existing payment
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, updateData }: { paymentId: string; updateData: UpdatePaymentRequest }): Promise<{ payment: TeamPayment }> => {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update payment');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'roster', data.payment.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'summary', data.payment.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'type'] });
    },
  });
}

// Mark a payment as paid
export function useMarkPaymentPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      paidAt,
      receiptUrl
    }: {
      paymentId: string;
      paidAt?: string;
      receiptUrl?: string;
    }): Promise<{ payment: TeamPayment }> => {
      const response = await fetch(`/api/payments/${paymentId}/paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paidAt, receiptUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark payment as paid');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'roster', data.payment.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'summary', data.payment.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'overdue'] });
    },
  });
}

// Delete a payment
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string): Promise<{ success: boolean }> => {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete payment');
      }

      return response.json();
    },
    onSuccess: (_, paymentId) => {
      // Invalidate all payment queries since we don't know the roster ID
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.removeQueries({ queryKey: ['payments', paymentId] });
    },
  });
}

// Utility hook for common payment operations
export function usePaymentOperations(rosterId?: string) {
  const paymentsQuery = usePaymentsByRoster(rosterId!);
  const summaryQuery = usePaymentSummary(rosterId!);
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const markPaidMutation = useMarkPaymentPaid();

  return {
    payments: paymentsQuery.data?.payments || [],
    paymentSummary: summaryQuery.data,
    isLoading: paymentsQuery.isLoading || summaryQuery.isLoading,
    error: paymentsQuery.error || summaryQuery.error,
    createPayment: createPaymentMutation.mutate,
    updatePayment: updatePaymentMutation.mutate,
    markPaymentPaid: markPaidMutation.mutate,
    isCreating: createPaymentMutation.isPending,
    isUpdating: updatePaymentMutation.isPending,
    isMarkingPaid: markPaidMutation.isPending,
    createError: createPaymentMutation.error,
    updateError: updatePaymentMutation.error,
    markPaidError: markPaidMutation.error,
  };
}

// Hook for billing portal access validation
export function useBillingPortalValidation(userId: string, teamId: string) {
  return useQuery({
    queryKey: ['billing-portal', 'validation', userId, teamId],
    queryFn: async (): Promise<{
      isValid: boolean;
      payment?: TeamPayment;
      error?: string;
    }> => {
      const response = await fetch(`/api/billing/validation?userId=${userId}&teamId=${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to validate billing portal access');
      }
      return response.json();
    },
    enabled: !!userId && !!teamId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}