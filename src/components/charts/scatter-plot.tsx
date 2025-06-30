"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { useDashboard } from "@/contexts/dashboard-context"
import { formatNumber } from "@/lib/utils"

interface ScatterPlotProps {
  title: string
  xKey: "intensity" | "likelihood" | "relevance"
  yKey: "intensity" | "likelihood" | "relevance"
  sizeKey?: "intensity" | "likelihood" | "relevance"
}

export function ScatterPlot({ title, xKey, yKey, sizeKey }: ScatterPlotProps) {
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

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d[xKey]) as [number, number])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d[yKey]) as [number, number])
      .range([height, 0])

    const sizeScale = sizeKey
      ? d3
          .scaleLinear()
          .domain(d3.extent(filteredData, (d) => d[sizeKey]) as [number, number])
          .range([3, 15])
      : null

    const colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(Array.from(new Set(filteredData.map((d) => d.sector))))

    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale))

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

    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    g.selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d[xKey]))
      .attr("cy", (d) => yScale(d[yKey]))
      .attr("r", (d) => (sizeScale ? sizeScale(d[sizeKey!]) : 5))
      .style("fill", (d) => colorScale(d.sector))
      .style("opacity", 0.7)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9)
        tooltip
          .html(`
          ${d.title}<br/>
          ${xKey}: ${formatNumber(d[xKey])}<br/>
          ${yKey}: ${formatNumber(d[yKey])}<br/>
          Sector: ${d.sector}<br/>
          Country: ${d.country}
        `)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0)
      })

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yKey.charAt(0).toUpperCase() + yKey.slice(1))

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .text(xKey.charAt(0).toUpperCase() + xKey.slice(1))

    return () => {
      tooltip.remove()
    }
  }, [filteredData, xKey, yKey, sizeKey])

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="chart-container"></svg>
      </div>
    </div>
  )
}
