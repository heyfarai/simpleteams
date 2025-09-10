# React Query Implementation

This document outlines the React Query implementation in the SimpleTeams League App.

## Setup

The app uses React Query for data fetching, caching, and state management. The setup is configured in `lib/providers.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error instanceof Error && error.message.includes('404')) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

## Features

### Infinite Scrolling
- Implemented in `components/games/infinite-scroll.tsx`
- Uses Intersection Observer API for performance
- Automatically loads more games when reaching the bottom of the list

### Error Handling
- Custom error handling in `lib/utils/errors.ts`
- Toast notifications for user feedback
- Retry functionality with exponential backoff
- Error boundaries for graceful degradation

### Loading States
- Skeleton loading states in `components/games/filter-skeleton.tsx`
- Loading indicators for infinite scroll
- Optimistic updates for better UX

### Data Fetching
- Centralized in `lib/data/fetch-games.ts`
- Type-safe queries and mutations
- Server-side filtering support
- Pagination handling

## Usage

### Games List
```typescript
const { data, fetchNextPage, hasNextPage, isLoading } = useGames({
  season,
  session,
  division,
  status,
})
```

### Single Game
```typescript
const { data: game } = useGame(id)
```

### Error Handling
```typescript
if (isError) {
  toast({
    variant: "destructive",
    title: "Error loading games",
    description: error.message,
    action: <RetryButton />,
  })
}
```

## Best Practices

1. Always use the custom hooks from `hooks/use-games.ts`
2. Handle loading and error states appropriately
3. Implement retry functionality for failed requests
4. Use skeleton loading states for better UX
5. Keep stale time reasonable (currently 1 minute)
6. Avoid unnecessary refetches on window focus
