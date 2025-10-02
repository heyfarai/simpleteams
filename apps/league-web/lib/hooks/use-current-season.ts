import { useQuery } from '@tanstack/react-query';
import { league } from '@/lib/services/league';
import type { Season } from '../domain/models';

// React Query hook for current season using league service
export function useCurrentSeason() {
  return useQuery({
    queryKey: ['current-season'],
    queryFn: () => league.getCurrentSeason(),
    staleTime: 1000 * 60 * 15, // 15 minutes - seasons don't change often
    refetchOnWindowFocus: false, // Don't refetch on window focus for seasons
  });
}

// Utility hook to get just the current season ID
export function useCurrentSeasonId(): string | undefined {
  const { data: season } = useCurrentSeason();
  return season?.id;
}

// Utility hook to get season name
export function useCurrentSeasonName(): string | undefined {
  const { data: season } = useCurrentSeason();
  return season?.name;
}

// Utility hook to get season year
export function useCurrentSeasonYear(): number | undefined {
  const { data: season } = useCurrentSeason();
  return season?.year;
}