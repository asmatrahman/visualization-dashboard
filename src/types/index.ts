export interface DataPoint {
  end_year: number | string
  intensity: number
  likelihood: number
  relevance: number
  start_year: number | string
  country: string
  region: string
  city: string
  sector: string
  topic: string
  pestle: string
  source: string
  insight: string
  title: string
  url: string
  published: string
  added: string
}

export interface FilterState {
  endYearRange: [number, number]
  topics: string[]
  sectors: string[]
  regions: string[]
  countries: string[]
  cities: string[]
  pestles: string[]
  sources: string[]
  publishedDateRange: [Date | null, Date | null]
}

export interface ChartData {
  label: string
  value: number
  category?: string
  x?: number
  y?: number
  size?: number
  color?: string
}

export interface DashboardContextType {
  data: DataPoint[]
  filteredData: DataPoint[]
  filters: FilterState
  updateFilter: (key: keyof FilterState, value: any) => void
  resetFilters: () => void
  isLoading: boolean
  error?: string | null
  refetch?: () => Promise<void>
  initializeSampleData?: () => Promise<void>
}
