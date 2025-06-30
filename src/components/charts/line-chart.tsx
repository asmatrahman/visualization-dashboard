"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { useDashboard } from "@/contexts/dashboard-context"
import { formatNumber, parseYear } from "@/lib/utils"

interface LineChartProps {
  title: string
  dataKey: "intensity" | "likelihood" | "relevance"
}

export function LineChart({ title, dataKey }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { filteredData } = useDashboard()

  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = 800 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const yearData = new Map()
    filteredData.forEach((d) => {
      const year = parseYear(d.end_year) || parseYear(d.start_year)
      if (year) {
        if (!yearData.has(year)) {
          yearData.set(year, [])
        }
        yearData.get(year).push(d[dataKey])
      }
    })

    const processedData = Array.from(yearData.entries())
      .map(([year, values]) => ({
        year,
        value: d3.mean(values) || 0,
      }))
      .sort((a, b) => a.year - b.year)

    if (processedData.length === 0) return

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(processedData, (d) => d.year) as [number, number])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.value) || 0])
      .range([height, 0])

    const line = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))

    g.append("g").call(d3.axisLeft(yScale))

    g.append("g")
      .attr("class", "chart-grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height)
          .tickFormat(() => ""),
      )

    g.append("g")
      .attr("class", "chart-grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => ""),
      )

    g.append("path").datum(processedData).attr("class", "chart-line").attr("d", line)

    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    g.selectAll(".dot")
      .data(processedData)
      .enter()
      .append("circle")
      .attr("class", "chart-scatter")
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9)
        tooltip
          .html(`Year: ${d.year}<br/>${dataKey}: ${formatNumber(d.value)}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0)
      })

    return () => {
      tooltip.remove()
    }
  }, [filteredData, dataKey])

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="chart-container"></svg>
      </div>
    </div>
  )
}
