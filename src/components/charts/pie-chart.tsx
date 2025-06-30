"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useDashboard } from "@/contexts/dashboard-context"
import { formatNumber } from "@/lib/utils"

interface PieChartProps {
  title: string
  groupBy: "topic" | "sector" | "region" | "pestle"
}

export function PieChart({ title, groupBy }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { filteredData } = useDashboard()
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const size = Math.min(rect.width, 400)
        setDimensions({ width: size, height: size })
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return

    const { width, height } = dimensions
    const radius = Math.min(width, height) / 2

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`)

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    const dataCount = d3.rollup(
      filteredData,
      (v) => v.length,
      (d) => d[groupBy],
    )

    const processedData = Array.from(dataCount.entries())
      .map(([key, value]) => ({ label: key, value }))
      .filter((d) => d.label && d.label.trim() !== "")
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null)

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius - 10)

    const labelArc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    const arcs = g.selectAll(".arc").data(pie(processedData)).enter().append("g").attr("class", "arc")

    arcs
      .append("path")
      .attr("d", arc)
      .style("fill", (d, i) => color(i.toString()))
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1)
        tooltip.transition().duration(200).style("opacity", 0.9)
        tooltip
          .html(`${d.data.label}<br/>Count: ${formatNumber(d.data.value)}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.8)
        tooltip.transition().duration(500).style("opacity", 0)
      })

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => (d.data.value > processedData.reduce((sum, item) => sum + item.value, 0) * 0.05 ? d.data.label : ""))

    return () => {
      tooltip.remove()
    }
  }, [filteredData, groupBy, dimensions])

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <svg ref={svgRef} className="chart-container" style={{ width: "100%", height: "auto", maxWidth: 400, aspectRatio: "1 / 1" }}></svg>
    </div>
  )
}
