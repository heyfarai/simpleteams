import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GameSession } from '../domain/models';

interface SessionsResponse {
  sessions: GameSession[];
  count: number;
}

interface CreateSessionRequest {
  seasonId: string;
  name: string;
  sequence: number;
  startDate: string;
  endDate: string;
  type: 'regular' | 'playoffs';
  maxTeams?: number;
}

// Fetch sessions for a specific season
export function useSessions(seasonId?: string, activeOnly = false) {
  return useQuery({
    queryKey: ['sessions', seasonId, activeOnly],
    queryFn: async (): Promise<SessionsResponse> => {
      const params = new URLSearchParams();
      if (seasonId) params.set('seasonId', seasonId);
      if (activeOnly) params.set('active', 'true');

      const response = await fetch(`/api/sessions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return response.json();
    },
    enabled: !!seasonId || !seasonId, // Always enabled unless explicitly disabled
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch sessions for a specific season (alternative endpoint)
export function useSessionsBySeason(seasonId: string) {
  return useQuery({
    queryKey: ['sessions', 'season', seasonId],
    queryFn: async (): Promise<SessionsResponse> => {
      const response = await fetch(`/api/sessions-by-season/${seasonId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions for season');
      }
      return response.json();
    },
    enabled: !!seasonId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get all active sessions
export function useActiveSessions() {
  return useQuery({
    queryKey: ['sessions', 'active'],
    queryFn: async (): Promise<SessionsResponse> => {
      const response = await fetch('/api/sessions?active=true');
      if (!response.ok) {
        throw new Error('Failed to fetch active sessions');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get session options for dropdowns/selection UI
export function useSessionOptions(seasonId?: string) {
  const { data, ...rest } = useSessions(seasonId, true);

  const sessionOptions = data?.sessions.map(session => ({
    value: session.id,
    label: session.name,
    sequence: session.sequence,
    type: session.type,
    disabled: !session.isActive,
    startDate: session.startDate,
    endDate: session.endDate,
    session: session, // Include full session object for additional data
  })).sort((a, b) => a.sequence - b.sequence) || [];

  return {
    sessionOptions,
    ...rest,
  };
}

// Create a new session
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: CreateSessionRequest): Promise<{ session: GameSession }> => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create session');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'season', data.session.seasonId] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'active'] });
    },
  });
}

// Utility hook for common session operations
export function useSessionOperations(seasonId?: string) {
  const sessionsQuery = useSessions(seasonId, true);
  const createSessionMutation = useCreateSession();

  return {
    sessions: sessionsQuery.data?.sessions || [],
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    createSession: createSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    createError: createSessionMutation.error,
  };
}