"use client"

import type React from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function YearRangeFilter() {
  const { filters, updateFilter } = useDashboard()

  const handleSliderChange = (value: number[]) => {
    updateFilter("endYearRange", [value[0], value[1]])
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Number.parseInt(e.target.value) || 2020
    updateFilter("endYearRange", [min, filters.endYearRange[1]])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number.parseInt(e.target.value) || 2025
    updateFilter("endYearRange", [filters.endYearRange[0], max])
  }

  return (
    <div className="space-y-4">
      <div className="px-2">
        <Slider
          value={filters.endYearRange}
          defaultValue={[2020, 2025]}
          onValueChange={handleSliderChange}
          max={2035}
          min={2015}
          step={1}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min-year" className="text-xs">
            Min Year
          </Label>
          <Input
            id="min-year"
            type="number"
            value={filters.endYearRange[0]}
            onChange={handleMinChange}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="max-year" className="text-xs">
            Max Year
          </Label>
          <Input
            id="max-year"
            type="number"
            value={filters.endYearRange[1]}
            onChange={handleMaxChange}
            className="h-8"
          />
        </div>
      </div>
    </div>
  )
}
