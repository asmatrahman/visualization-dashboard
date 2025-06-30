"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo } from "react"
import type { FilterState, DashboardContextType } from "@/types"
import { useData } from "@/hooks/use-data"

const defaultFilters: FilterState = {
  endYearRange: [2020, 2025],
  topics: [],
  sectors: [],
  regions: [],
  countries: [],
  cities: [],
  pestles: [],
  sources: [],
  publishedDateRange: [null, null],
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const { data, isLoading, error, refetch, initializeSampleData } = useData(filters)
  const filteredData = useMemo(() => data, [data])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const value: DashboardContextType = {
    data,
    filteredData,
    filters,
    updateFilter,
    resetFilters,
    isLoading,
    error,
    refetch,
    initializeSampleData,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
