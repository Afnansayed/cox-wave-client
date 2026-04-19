import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReadonlyURLSearchParams } from 'next/navigation'

export function useServerManagedDataTableSearch({
  searchParams,
  updateParams,
  debounceMs = 700,
}: {
  searchParams: ReadonlyURLSearchParams
  updateParams: (updates: Record<string, string | undefined>, resetPage?: boolean) => void
  debounceMs?: number
}) {
  const searchTermFromUrl = useMemo(() => {
    return searchParams.get('searchTerm') || ''
  }, [searchParams])

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTermFromUrl)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLocalSearchTerm(searchTermFromUrl)
  }, [searchTermFromUrl])

  const handleDebouncedSearchChange = useCallback(
    (value: string) => {
      setLocalSearchTerm(value)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        updateParams({
          searchTerm: value || undefined,
        })
      }, debounceMs)
    },
    [updateParams, debounceMs],
  )

  return {
    searchTermFromUrl,
    localSearchTerm,
    handleDebouncedSearchChange,
  }
}
