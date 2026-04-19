import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useTransition } from 'react'
import { ReadonlyURLSearchParams } from 'next/navigation'

interface SortingState {
  id: string
  desc: boolean
}

interface PaginationState {
  pageIndex: number
  pageSize: number
}

export function useServerManagedDataTable({
  searchParams,
  defaultPage = 1,
  defaultLimit = 12,
}: {
  searchParams: ReadonlyURLSearchParams
  defaultPage?: number
  defaultLimit?: number
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const queryStringFromUrl = useMemo(() => {
    return searchParams.toString()
  }, [searchParams])

  const currentPage = useMemo(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page, 10) : defaultPage
  }, [searchParams, defaultPage])

  const currentLimit = useMemo(() => {
    const limit = searchParams.get('limit')
    return limit ? parseInt(limit, 10) : defaultLimit
  }, [searchParams, defaultLimit])

  const optimisticPaginationState = useMemo<PaginationState>(() => {
    return {
      pageIndex: currentPage - 1,
      pageSize: currentLimit,
    }
  }, [currentPage, currentLimit])

  const sortByFromUrl = useMemo(() => {
    return searchParams.get('sortBy')
  }, [searchParams])

  const sortOrderFromUrl = useMemo(() => {
    return searchParams.get('sortOrder')
  }, [searchParams])

  const optimisticSortingState = useMemo<SortingState[]>(() => {
    if (!sortByFromUrl) return []
    return [
      {
        id: sortByFromUrl,
        desc: sortOrderFromUrl === 'desc',
      },
    ]
  }, [sortByFromUrl, sortOrderFromUrl])

  const updateParams = useCallback(
    (
      updates: Record<string, string | undefined>,
      resetPage = true,
    ) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams.toString())

        // Reset to page 1 if updating filters or search
        if (resetPage) {
          newParams.set('page', '1')
        }

        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === '') {
            newParams.delete(key)
          } else {
            newParams.set(key, value)
          }
        })

        const newUrl = newParams.toString()
        router.push(`?${newUrl}`)
      })
    },
    [searchParams, router],
  )

  const handleSortingChange = useCallback(
    (newSorting: SortingState[]) => {
      if (newSorting.length === 0) {
        updateParams({ sortBy: undefined, sortOrder: undefined }, false)
      } else {
        const [sort] = newSorting
        updateParams(
          {
            sortBy: sort.id,
            sortOrder: sort.desc ? 'desc' : 'asc',
          },
          false,
        )
      }
    },
    [updateParams],
  )

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      updateParams(
        {
          page: String(newPagination.pageIndex + 1),
          limit: String(newPagination.pageSize),
        },
        false,
      )
    },
    [updateParams],
  )

  return {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending: isPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  }
}
