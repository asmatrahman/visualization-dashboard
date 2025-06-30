"use client"

import { useState, useEffect, useCallback } from "react"
import type { DataPoint, FilterState } from "@/types"

interface UseDataReturn {
  data: DataPoint[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  initializeSampleData: () => Promise<void>
}

export function useData(filters: FilterState): UseDataReturn {
  const [data, setData] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buildQueryParams = useCallback((filters: FilterState) => {
    const params = new URLSearchParams()

    // Year range
    if (filters.endYearRange) {
      params.set("minYear", filters.endYearRange[0].toString())
      params.set("maxYear", filters.endYearRange[1].toString())
    }

    // Array filters
    if (filters.topics.length > 0) {
      params.set("topics", filters.topics.join(","))
    }

    if (filters.sectors.length > 0) {
      params.set("sectors", filters.sectors.join(","))
    }

    if (filters.regions.length > 0) {
      params.set("regions", filters.regions.join(","))
    }

    if (filters.countries.length > 0) {
      params.set("countries", filters.countries.join(","))
    }

    if (filters.cities.length > 0) {
      params.set("cities", filters.cities.join(","))
    }

    if (filters.pestles.length > 0) {
      params.set("pestles", filters.pestles.join(","))
    }

    if (filters.sources.length > 0) {
      params.set("sources", filters.sources.join(","))
    }

    return params.toString()
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = buildQueryParams(filters)
      const response = await fetch(`/api/data?${queryParams}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch data")
      }

      setData(result.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [filters, buildQueryParams])

  const initializeSampleData = useCallback(async () => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to initialize sample data")
      }

      // Refetch data after initialization
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize sample data"
      setError(errorMessage)
      console.error("Error initializing sample data:", err)
    }
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    initializeSampleData,
  }
}
