"use client"
import { useDashboard } from "@/contexts/dashboard-context"
import { useUniqueValues } from "@/hooks/use-unique-values"
import { YearRangeFilter } from "./year-range-filter"
import { MultiSelectFilter } from "./multi-select-filter"
import { CheckboxFilter } from "./checkbox-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RotateCcw, Database, AlertCircle } from "lucide-react"

export function FilterSidebar() {
  const { filters, resetFilters, updateFilter, error } = useDashboard()

  const { values: uniqueTopics, isLoading: topicsLoading } = useUniqueValues("topic")
  const { values: uniqueSectors, isLoading: sectorsLoading } = useUniqueValues("sector")
  const { values: uniqueRegions, isLoading: regionsLoading } = useUniqueValues("region")
  const { values: uniqueCountries, isLoading: countriesLoading } = useUniqueValues("country")
  const { values: uniqueCities, isLoading: citiesLoading } = useUniqueValues("city")
  const { values: uniquePestles, isLoading: pestlesLoading } = useUniqueValues("pestle")
  const { values: uniqueSources, isLoading: sourcesLoading } = useUniqueValues("source")

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters} className="h-8 px-2 bg-transparent">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div>
          <h3 className="text-sm font-medium mb-3">Year Range</h3>
          <YearRangeFilter />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Topics</h3>
          <MultiSelectFilter
            options={uniqueTopics}
            selected={filters.topics}
            onChange={(value) => updateFilter("topics", value)}
            placeholder="Select topics..."
            isLoading={topicsLoading}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Sectors</h3>
          <MultiSelectFilter
            options={uniqueSectors}
            selected={filters.sectors}
            onChange={(value) => updateFilter("sectors", value)}
            placeholder="Select sectors..."
            isLoading={sectorsLoading}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Regions</h3>
          <MultiSelectFilter
            options={uniqueRegions}
            selected={filters.regions}
            onChange={(value) => updateFilter("regions", value)}
            placeholder="Select regions..."
            isLoading={regionsLoading}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Countries</h3>
          <MultiSelectFilter
            options={uniqueCountries}
            selected={filters.countries}
            onChange={(value) => updateFilter("countries", value)}
            placeholder="Select countries..."
            isLoading={countriesLoading}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Cities</h3>
          <MultiSelectFilter
            options={uniqueCities}
            selected={filters.cities}
            onChange={(value) => updateFilter("cities", value)}
            placeholder="Select cities..."
            searchable
            isLoading={citiesLoading}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">PESTLE Analysis</h3>
          <CheckboxFilter
            options={uniquePestles}
            selected={filters.pestles}
            onChange={(value) => updateFilter("pestles", value)}
            isLoading={pestlesLoading}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Sources</h3>
          <MultiSelectFilter
            options={uniqueSources}
            selected={filters.sources}
            onChange={(value) => updateFilter("sources", value)}
            placeholder="Select sources..."
            isLoading={sourcesLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
