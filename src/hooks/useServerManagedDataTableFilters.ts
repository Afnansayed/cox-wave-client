import { useCallback, useMemo } from 'react'
import { ReadonlyURLSearchParams } from 'next/navigation'

export interface DataTableFilterDefinition {
  id: string
  type: 'single-select' | 'multi-select' | 'range'
}

export interface DataTableFilterValues {
  [key: string]: string | string[] | { min?: number; max?: number } | undefined
}

export const serverManagedFilter = {
  single: (id: string): DataTableFilterDefinition => ({
    id,
    type: 'single-select',
  }),
  multi: (id: string): DataTableFilterDefinition => ({
    id,
    type: 'multi-select',
  }),
  range: (id: string): DataTableFilterDefinition => ({
    id,
    type: 'range',
  }),
}

export function useServerManagedDataTableFilters({
  searchParams,
  definitions,
  updateParams,
}: {
  searchParams: ReadonlyURLSearchParams
  definitions: DataTableFilterDefinition[]
  updateParams: (updates: Record<string, string | undefined>, resetPage?: boolean) => void
}) {
  const filterValues = useMemo<DataTableFilterValues>(() => {
    const values: DataTableFilterValues = {}

    definitions.forEach((def) => {
      if (def.type === 'single-select') {
        values[def.id] = searchParams.get(def.id) || undefined
      } else if (def.type === 'multi-select') {
        const multiValues = searchParams.getAll(def.id)
        values[def.id] = multiValues.length > 0 ? multiValues : undefined
      } else if (def.type === 'range') {
        const minKey = `${def.id}[gte]`
        const maxKey = `${def.id}[lte]`
        const min = searchParams.get(minKey)
        const max = searchParams.get(maxKey)

        if (min || max) {
          values[def.id] = {
            min: min ? parseFloat(min) : undefined,
            max: max ? parseFloat(max) : undefined,
          }
        }
      }
    })

    return values
  }, [searchParams, definitions])

  const handleFilterChange = useCallback(
    (filterId: string, value: string | string[] | { min?: number; max?: number } | null) => {
      const updates: Record<string, string | undefined> = {}

      const def = definitions.find((d) => d.id === filterId)
      if (!def) return

      if (value === null) {
        // Clear the filter
        if (def.type === 'single-select') {
          updates[filterId] = undefined
        } else if (def.type === 'multi-select') {
          // For multi-select, we need to remove all instances
          searchParams.getAll(filterId).forEach(() => {
            updates[filterId] = undefined
          })
        } else if (def.type === 'range') {
          updates[`${filterId}[gte]`] = undefined
          updates[`${filterId}[lte]`] = undefined
        }
      } else if (def.type === 'single-select') {
        updates[filterId] = typeof value === 'string' ? value : undefined
      } else if (def.type === 'multi-select' && Array.isArray(value)) {
        // Clear existing values first, then we'll add new ones via the updateParams
        // This is a bit tricky - we need to rebuild the query params
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete(filterId)
        value.forEach((v) => {
          newParams.append(filterId, v)
        })

        const newUrl = `?${newParams.toString()}`
        // We'll handle this specially in updateParams
        Object.keys(Object.fromEntries(newParams)).forEach((key) => {
          if (key === filterId) {
            const vals = newParams.getAll(key)
            // This is tricky - updateParams uses Record<string, string>
            // So we need a different approach for multi-select
          }
        })

        // For now, handle multi-select specially by rebuilding the full query string
        updates[filterId] = value.join(',') // Temporary workaround
      } else if (def.type === 'range' && typeof value === 'object' && !Array.isArray(value)) {
        if (value.min !== undefined) {
          updates[`${filterId}[gte]`] = String(value.min)
        } else {
          updates[`${filterId}[gte]`] = undefined
        }
        if (value.max !== undefined) {
          updates[`${filterId}[lte]`] = String(value.max)
        } else {
          updates[`${filterId}[lte]`] = undefined
        }
      }

      updateParams(updates)
    },
    [definitions, searchParams, updateParams],
  )

  const clearAllFilters = useCallback(() => {
    const updates: Record<string, string | undefined> = {}

    definitions.forEach((def) => {
      if (def.type === 'range') {
        updates[`${def.id}[gte]`] = undefined
        updates[`${def.id}[lte]`] = undefined
      } else {
        updates[def.id] = undefined
      }
    })

    updateParams(updates)
  }, [definitions, updateParams])

  return {
    filterValues,
    handleFilterChange,
    clearAllFilters,
  }
}
