"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useDashboard } from "@/contexts/dashboard-context"
import { formatNumber } from "@/lib/utils"

interface RadialChartProps {
  title: string
  dataKey: "intensity" | "likelihood" | "relevance"
  groupBy?: "sector" | "region" | "topic"
}

export function RadialChart({ title, dataKey, groupBy = "sector" }: RadialChartProps) {
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
    const innerRadius = 60
    const outerRadius = Math.min(width, height) / 2 - 20

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`)

    const grouped = d3.rollup(
      filteredData,
      v => d3.mean(v, d => d[dataKey]) || 0,
      d => d[groupBy]
    )

    const data = Array.from(grouped, ([label, value]) => ({ label, value })).filter(d => d.label)

    const angleScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, 2 * Math.PI])
      .align(0)

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 1])
      .range([innerRadius, outerRadius])

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    g.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "#60a5fa")
      .attr("d", d => {
        const arcGen = d3.arc();
        return arcGen({
          innerRadius,
          outerRadius: radiusScale(d.value),
          startAngle: angleScale(d.label)!,
          endAngle: angleScale(d.label)! + angleScale.bandwidth(),
          padAngle: 0.02,
          padRadius: innerRadius
        } as any)
      })
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

    g.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", d => {
        const angle = angleScale(d.label)! + angleScale.bandwidth() / 2 - Math.PI / 2
        return Math.cos(angle) * (outerRadius + 15)
      })
      .attr("y", d => {
        const angle = angleScale(d.label)! + angleScale.bandwidth() / 2 - Math.PI / 2
        return Math.sin(angle) * (outerRadius + 15)
      })
      .text(d => d.label)
      .style("font-size", "10px")

    return () => {
      tooltip.remove()
    }
  }, [filteredData, dataKey, groupBy, dimensions])

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <svg ref={svgRef} className="chart-container" style={{ width: "100%", height: "auto", maxWidth: 400, aspectRatio: "1 / 1" }}></svg>
    </div>
  )
}