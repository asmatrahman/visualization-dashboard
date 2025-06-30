"use client"

import { useState, useEffect } from "react"
import type { DataPoint } from "@/types"

export function useUniqueValues(field: keyof DataPoint) {
  const [values, setValues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/data/unique-values?field=${field}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch unique values")
        }

        setValues(result.values || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        console.error(`Error fetching unique values for ${field}:`, err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUniqueValues()
  }, [field])

  return { values, isLoading, error }
}
