"use client"

import { Suspense } from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { ScatterPlot } from "@/components/charts/scatter-plot"
import { PieChart } from "@/components/charts/pie-chart"
import { Heatmap } from "@/components/charts/heatmap"
import { formatNumber } from "@/lib/utils"
import { RadialChart } from "../charts/radial-chart"

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-80 w-full" />
      </CardContent>
    </Card>
  )
}

function StatsCard({ title, value, description }: { title: string; value: string; description: string}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardContent() {
  const { filteredData, isLoading, data } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="hidden lg:block">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  const totalRecords = filteredData.length
  const avgIntensity =
    filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.intensity, 0) / filteredData.length).toFixed(2) : '0'
  const avgLikelihood =
    filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.likelihood, 0) / filteredData.length).toFixed(2) : '0'
  const avgRelevance =
    filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.relevance, 0) / filteredData.length).toFixed(2) : '0'

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="hidden lg:block">
        <h2 className="text-3xl font-bold tracking-tight">Visualization Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Records" value={formatNumber(totalRecords)} description="Filtered data points"/>
        <StatsCard title="Avg Intensity" value={avgIntensity} description="Average intensity score" />
        <StatsCard title="Avg Likelihood" value={avgLikelihood} description="Average likelihood score" />
        <StatsCard title="Avg Relevance" value={avgRelevance} description="Average relevance score" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <BarChart title="Intensity by Year" dataKey="intensity" groupBy="year" />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <RadialChart title="Likelihood Trend Over Time" dataKey="likelihood" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <LineChart title="Likelihood Trend Over Time" dataKey="likelihood" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <ScatterPlot title="Relevance vs Likelihood" xKey="likelihood" yKey="relevance" sizeKey="intensity" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <PieChart title="Distribution by Topic" groupBy="topic" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <BarChart title="Intensity by Sector" dataKey="intensity" groupBy="sector" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<ChartSkeleton />}>
              <PieChart title="Distribution by Region" groupBy="region" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap - Full Width */}
      <Card>
        <CardContent className="p-6 ">
          <Suspense fallback={<ChartSkeleton />}>
            <Heatmap title="Intensity Heatmap: Region vs Sector" xKey="region" yKey="sector" valueKey="intensity" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
