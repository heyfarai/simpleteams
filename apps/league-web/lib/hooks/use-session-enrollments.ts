import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RosterSessionEnrollment } from '../domain/models';

interface EnrollmentsResponse {
  enrollments: RosterSessionEnrollment[];
  count: number;
}

interface EnrollmentRequest {
  rosterId: string;
}

// Get enrollments for a specific session
export function useSessionEnrollments(sessionId: string, rosterId?: string) {
  return useQuery({
    queryKey: ['session-enrollments', sessionId, rosterId],
    queryFn: async (): Promise<EnrollmentsResponse> => {
      const params = new URLSearchParams();
      if (rosterId) params.set('rosterId', rosterId);

      const response = await fetch(`/api/game-sessions/${sessionId}/enrollment?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session enrollments');
      }
      return response.json();
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Check if a specific roster is enrolled in a session
export function useIsRosterEnrolled(sessionId: string, rosterId: string) {
  const { data, ...rest } = useSessionEnrollments(sessionId, rosterId);

  return {
    isEnrolled: (data?.enrollments.length || 0) > 0,
    enrollment: data?.enrollments[0] || null,
    ...rest,
  };
}

// Get all enrollments for a roster across all sessions
export function useRosterEnrollments(rosterId: string, seasonId?: string) {
  return useQuery({
    queryKey: ['roster-enrollments', rosterId, seasonId],
    queryFn: async (): Promise<RosterSessionEnrollment[]> => {
      // This would require a new API endpoint
      const response = await fetch(`/api/rosters/${rosterId}/enrollments${seasonId ? `?seasonId=${seasonId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch roster enrollments');
      }
      const data = await response.json();
      return data.enrollments || [];
    },
    enabled: !!rosterId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Enroll a roster in a session
export function useEnrollInSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, rosterId }: { sessionId: string; rosterId: string }): Promise<{ enrollment: RosterSessionEnrollment }> => {
      const response = await fetch(`/api/game-sessions/${sessionId}/enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rosterId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enroll in session');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['session-enrollments', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['roster-enrollments', variables.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['session-enrollments', variables.sessionId, variables.rosterId] });
    },
  });
}

// Withdraw a roster from a session
export function useWithdrawFromSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, rosterId }: { sessionId: string; rosterId: string }): Promise<{ success: boolean }> => {
      const response = await fetch(`/api/game-sessions/${sessionId}/enrollment?rosterId=${rosterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw from session');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['session-enrollments', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['roster-enrollments', variables.rosterId] });
      queryClient.invalidateQueries({ queryKey: ['session-enrollments', variables.sessionId, variables.rosterId] });
    },
  });
}

// Utility hook for session enrollment operations
export function useSessionEnrollmentOperations(sessionId: string, rosterId?: string) {
  const enrollmentsQuery = useSessionEnrollments(sessionId, rosterId);
  const enrollMutation = useEnrollInSession();
  const withdrawMutation = useWithdrawFromSession();

  const isEnrolled = rosterId ? (enrollmentsQuery.data?.enrollments.length || 0) > 0 : false;
  const enrollment = rosterId ? enrollmentsQuery.data?.enrollments[0] || null : null;

  const enrollInSession = (rosterIdToEnroll: string) => {
    enrollMutation.mutate({ sessionId, rosterId: rosterIdToEnroll });
  };

  const withdrawFromSession = (rosterIdToWithdraw: string) => {
    withdrawMutation.mutate({ sessionId, rosterId: rosterIdToWithdraw });
  };

  return {
    enrollments: enrollmentsQuery.data?.enrollments || [],
    isLoading: enrollmentsQuery.isLoading,
    error: enrollmentsQuery.error,
    isEnrolled,
    enrollment,
    enrollInSession,
    withdrawFromSession,
    isEnrolling: enrollMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    enrollError: enrollMutation.error,
    withdrawError: withdrawMutation.error,
  };
}