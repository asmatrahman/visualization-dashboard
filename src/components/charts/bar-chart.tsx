"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { useDashboard } from "@/contexts/dashboard-context"
import type { ChartData } from "@/types"
import { formatNumber } from "@/lib/utils"

interface BarChartProps {
  title: string
  dataKey: "intensity" | "likelihood" | "relevance"
  groupBy?: "year" | "sector" | "region"
}

export function BarChart({ title, dataKey, groupBy = "year" }: BarChartProps) {
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


    const processedData: ChartData[] = []

    if (groupBy === "year") {
      const yearData = d3.rollup(
        filteredData,
        (v) => d3.mean(v, (d) => d[dataKey]) || 0,
        (d) => d.end_year || d.start_year,
      )
      yearData.forEach((value, key) => {
        if (key) {
          processedData.push({
            label: String(key),
            value: value,
          })
        }
      })
    } else if (groupBy === "sector") {
      const sectorData = d3.rollup(
        filteredData,
        (v) => d3.mean(v, (d) => d[dataKey]) || 0,
        (d) => d.sector,
      )
      sectorData.forEach((value, key) => {
        if (key) {
          processedData.push({
            label: key,
            value: value,
          })
        }
      })
    } else if (groupBy === "region") {
      const regionData = d3.rollup(
        filteredData,
        (v) => d3.mean(v, (d) => d[dataKey]) || 0,
        (d) => d.region,
      )
      regionData.forEach((value, key) => {
        if (key) {
          processedData.push({
            label: key,
            value: value,
          })
        }
      })
    }

    processedData.sort((a, b) => b.value - a.value)

    const xScale = d3
      .scaleBand()
      .domain(processedData.map((d) => d.label))
      .range([0, width])
      .padding(0.1)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.value) || 0])
      .range([height, 0])
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")

    g.append("g").call(d3.axisLeft(yScale))

    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    g.selectAll(".bar")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("class", "chart-bar")
      .attr("x", (d) => xScale(d.label) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => height - yScale(d.value))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9)
        tooltip
          .html(`${d.label}<br/>${dataKey}: ${formatNumber(d.value)}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0)
      })

    return () => {
      tooltip.remove()
    }
  }, [filteredData, dataKey, groupBy])

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="chart-container"></svg>
      </div>
    </div>
  )
}
