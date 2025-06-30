"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface RadarChartProps {
  title: string
  data: Array<{ [key: string]: number | string }>
  keys: string[]
  labelKey: string 
}

export function RadarChart({ title, data, keys, labelKey }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const size = 400
  const margin = 60

  useEffect(() => {
    if (!svgRef.current || !data.length) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("width", size).attr("height", size).attr("viewBox", `0 0 ${size} ${size}`)

    const radius = (size - margin * 2) / 2
    const center = size / 2
    const angleSlice = (2 * Math.PI) / keys.length

    const maxValue = d3.max(data.flatMap(d => keys.map(k => +d[k] || 0))) || 1

    const levels = 5
    for (let level = 1; level <= levels; level++) {
      const r = (radius * level) / levels
      svg.append("circle")
        .attr("cx", center)
        .attr("cy", center)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2")
    }

    keys.forEach((key, i) => {
      const angle = i * angleSlice - Math.PI / 2
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      svg.append("line")
        .attr("x1", center)
        .attr("y1", center)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#888")
      svg.append("text")
        .attr("x", center + (radius + 16) * Math.cos(angle))
        .attr("y", center + (radius + 16) * Math.sin(angle))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .text(key.charAt(0).toUpperCase() + key.slice(1))
    })

    data.forEach((d, idx) => {
      const points = keys.map((key, i) => {
        const value = +d[key] || 0
        const angle = i * angleSlice - Math.PI / 2
        const r = (value / maxValue) * radius
        return [center + r * Math.cos(angle), center + r * Math.sin(angle)]
      })
      svg.append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", d3.schemeCategory10[idx % 10])
        .attr("fill-opacity", 0.3)
        .attr("stroke", d3.schemeCategory10[idx % 10])
        .attr("stroke-width", 2)
    })

    data.forEach((d, idx) => {
      svg.append("text")
        .attr("x", 20)
        .attr("y", 30 + idx * 20)
        .attr("fill", d3.schemeCategory10[idx % 10])
        .style("font-size", "13px")
        .text(d[labelKey]?.toString() || `Series ${idx + 1}`)
    })
  }, [data, keys, labelKey])

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <svg ref={svgRef} style={{ width: "100%", height: "auto", maxWidth: 400, aspectRatio: "1 / 1" }}></svg>
    </div>
  )
}
