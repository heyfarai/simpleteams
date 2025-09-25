import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TeamRegistration, RegistrationStatus, PaymentStatus } from '../domain/models';

interface RegistrationsResponse {
  registrations: TeamRegistration[];
  count: number;
}

interface RegistrationSummaryResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  paymentPending: number;
  paymentPaid: number;
  byPackage: Record<string, number>;
}

interface CreateRegistrationRequest {
  userId: string;
  teamName: string;
  city: string;
  region: string;
  phone?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactRole: string;
  headCoachName?: string;
  headCoachEmail?: string;
  headCoachPhone?: string;
  headCoachCertifications?: string;
  divisionPreference: string;
  registrationNotes?: string;
  selectedPackage: string;
  selectedSessionIds?: string[];
  status?: RegistrationStatus;
  paymentStatus?: PaymentStatus;
}

interface UpdateRegistrationRequest {
  teamName?: string;
  city?: string;
  region?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  primaryContactRole?: string;
  headCoachName?: string;
  headCoachEmail?: string;
  headCoachPhone?: string;
  headCoachCertifications?: string;
  divisionPreference?: string;
  registrationNotes?: string;
  selectedPackage?: string;
  selectedSessionIds?: string[];
  status?: RegistrationStatus;
  paymentStatus?: PaymentStatus;
}

// Get all registrations
export function useRegistrations() {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: async (): Promise<RegistrationsResponse> => {
      const response = await fetch('/api/registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get registrations for a specific user
export function useUserRegistrations(userId: string) {
  return useQuery({
    queryKey: ['registrations', 'user', userId],
    queryFn: async (): Promise<RegistrationsResponse> => {
      const response = await fetch(`/api/registrations?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user registrations');
      }
      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get registrations by status
export function useRegistrationsByStatus(status: RegistrationStatus) {
  return useQuery({
    queryKey: ['registrations', 'status', status],
    queryFn: async (): Promise<RegistrationsResponse> => {
      const response = await fetch(`/api/registrations?status=${status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${status} registrations`);
      }
      return response.json();
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get pending registrations (for admin review)
export function usePendingRegistrations() {
  return useRegistrationsByStatus('pending');
}

// Get approved registrations
export function useApprovedRegistrations() {
  return useRegistrationsByStatus('approved');
}

// Get registration by ID
export function useRegistration(registrationId: string) {
  return useQuery({
    queryKey: ['registrations', registrationId],
    queryFn: async (): Promise<TeamRegistration> => {
      const response = await fetch(`/api/registrations/${registrationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch registration');
      }
      return response.json();
    },
    enabled: !!registrationId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get registration by Stripe session ID
export function useRegistrationByStripeSession(sessionId: string) {
  return useQuery({
    queryKey: ['registrations', 'stripe-session', sessionId],
    queryFn: async (): Promise<{ registration: TeamRegistration | null }> => {
      const response = await fetch(`/api/registrations/by-stripe-session/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch registration by Stripe session');
      }
      return response.json();
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get registration summary/statistics
export function useRegistrationSummary() {
  return useQuery({
    queryKey: ['registrations', 'summary'],
    queryFn: async (): Promise<RegistrationSummaryResponse> => {
      const response = await fetch('/api/registrations/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch registration summary');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Check if user can register (business logic validation)
export function useCanUserRegister(userId: string) {
  return useQuery({
    queryKey: ['registrations', 'can-register', userId],
    queryFn: async (): Promise<{ canRegister: boolean; reason?: string }> => {
      const response = await fetch(`/api/registrations/can-register?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to check registration eligibility');
      }
      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Create a new registration
export function useCreateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationData: CreateRegistrationRequest): Promise<{ registration: TeamRegistration }> => {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create registration');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'user', data.registration.userId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'status', data.registration.status] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'can-register', data.registration.userId] });
    },
  });
}

// Update an existing registration
export function useUpdateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      updateData
    }: {
      registrationId: string;
      updateData: UpdateRegistrationRequest;
    }): Promise<{ registration: TeamRegistration }> => {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update registration');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.registrationId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'user', data.registration.userId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'summary'] });
    },
  });
}

// Update registration status (approve, reject, cancel)
export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      status
    }: {
      registrationId: string;
      status: RegistrationStatus;
    }): Promise<{ registration: TeamRegistration }> => {
      const response = await fetch(`/api/registrations/${registrationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update registration status');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.registrationId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'user', data.registration.userId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'summary'] });
    },
  });
}

// Update payment status
export function useUpdateRegistrationPaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      paymentStatus
    }: {
      registrationId: string;
      paymentStatus: PaymentStatus;
    }): Promise<{ registration: TeamRegistration }> => {
      const response = await fetch(`/api/registrations/${registrationId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update payment status');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.registrationId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'user', data.registration.userId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'summary'] });
    },
  });
}

// Link Stripe session to registration
export function useLinkStripeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      stripeSessionId
    }: {
      registrationId: string;
      stripeSessionId: string;
    }): Promise<{ success: boolean }> => {
      const response = await fetch(`/api/registrations/${registrationId}/stripe-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stripeSessionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to link Stripe session');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.registrationId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'stripe-session', variables.stripeSessionId] });
    },
  });
}

// Delete a registration (admin only)
export function useDeleteRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: string): Promise<{ success: boolean }> => {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete registration');
      }

      return response.json();
    },
    onSuccess: (data, registrationId) => {
      // Invalidate all registration queries and remove the specific one
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.removeQueries({ queryKey: ['registrations', registrationId] });
    },
  });
}

// Utility hooks for common operations
export function useRegistrationOperations(userId?: string) {
  const registrationsQuery = useUserRegistrations(userId!);
  const canRegisterQuery = useCanUserRegister(userId!);
  const createRegistrationMutation = useCreateRegistration();
  const updateRegistrationMutation = useUpdateRegistration();
  const updateStatusMutation = useUpdateRegistrationStatus();

  return {
    registrations: registrationsQuery.data?.registrations || [],
    canRegister: canRegisterQuery.data?.canRegister ?? false,
    canRegisterReason: canRegisterQuery.data?.reason,
    isLoading: registrationsQuery.isLoading || canRegisterQuery.isLoading,
    error: registrationsQuery.error || canRegisterQuery.error,
    createRegistration: createRegistrationMutation.mutate,
    updateRegistration: updateRegistrationMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isCreating: createRegistrationMutation.isPending,
    isUpdating: updateRegistrationMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    createError: createRegistrationMutation.error,
    updateError: updateRegistrationMutation.error,
    statusError: updateStatusMutation.error,
  };
}

// Admin utility hooks
export function useRegistrationAdminOperations() {
  const allRegistrationsQuery = useRegistrations();
  const pendingQuery = usePendingRegistrations();
  const summaryQuery = useRegistrationSummary();
  const updateStatusMutation = useUpdateRegistrationStatus();
  const deleteRegistrationMutation = useDeleteRegistration();

  const approveRegistration = (registrationId: string) => {
    updateStatusMutation.mutate({ registrationId, status: 'approved' });
  };

  const rejectRegistration = (registrationId: string) => {
    updateStatusMutation.mutate({ registrationId, status: 'rejected' });
  };

  const cancelRegistration = (registrationId: string) => {
    updateStatusMutation.mutate({ registrationId, status: 'cancelled' });
  };

  return {
    allRegistrations: allRegistrationsQuery.data?.registrations || [],
    pendingRegistrations: pendingQuery.data?.registrations || [],
    summary: summaryQuery.data,
    isLoading: allRegistrationsQuery.isLoading || pendingQuery.isLoading || summaryQuery.isLoading,
    error: allRegistrationsQuery.error || pendingQuery.error || summaryQuery.error,
    approveRegistration,
    rejectRegistration,
    cancelRegistration,
    deleteRegistration: deleteRegistrationMutation.mutate,
    isProcessing: updateStatusMutation.isPending,
    isDeleting: deleteRegistrationMutation.isPending,
    processError: updateStatusMutation.error,
    deleteError: deleteRegistrationMutation.error,
  };
}