'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

interface HydrateProps<TQueryKey extends readonly unknown[], TQueryFnData> {
  children: React.ReactNode
  queryKey: TQueryKey
  queryFn: () => Promise<TQueryFnData>
}

export function Hydrate<TQueryKey extends readonly unknown[], TQueryFnData>({ 
  children, 
  queryKey, 
  queryFn 
}: HydrateProps<TQueryKey, TQueryFnData>) {
  const [isHydrating, setIsHydrating] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    const hydrate = async () => {
      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn,
        })
      } catch (error) {
        console.error('Error hydrating query:', error)
      } finally {
        setIsHydrating(false)
      }
    }

    hydrate()
  }, [queryClient, queryKey, queryFn])

  if (isHydrating) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    )
  }

  return children
}
