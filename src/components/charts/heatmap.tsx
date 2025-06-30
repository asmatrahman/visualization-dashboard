"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useDashboard } from "@/contexts/dashboard-context"
import { formatNumber } from "@/lib/utils"

interface HeatmapProps {
  title: string
  xKey: "region" | "sector" | "pestle"
  yKey: "region" | "sector" | "pestle"
  valueKey: "intensity" | "likelihood" | "relevance"
}

export function Heatmap({ title, xKey, yKey, valueKey }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { filteredData } = useDashboard()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.min(rect.width, 800)
        const height = Math.round((width * 3) / 4)
        setDimensions({ width, height })
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return

    const margin = { top: 50, right: 30, bottom: 100, left: 100 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const dataMap = new Map()
    filteredData.forEach((d) => {
      const xVal = d[xKey]
      const yVal = d[yKey]
      if (xVal && yVal) {
        const key = `${xVal}-${yVal}`
        if (!dataMap.has(key)) {
          dataMap.set(key, { x: xVal, y: yVal, values: [] })
        }
        dataMap.get(key).values.push(d[valueKey])
      }
    })

    const processedData = Array.from(dataMap.values()).map((d) => ({
      x: d.x,
      y: d.y,
      value: d3.mean(d.values) || 0,
    }))

    const xValues = Array.from(new Set(processedData.map((d) => d.x))).sort()
    const yValues = Array.from(new Set(processedData.map((d) => d.y))).sort()

    const xScale = d3.scaleBand().domain(xValues).range([0, width]).padding(0.05)
    const yScale = d3.scaleBand().domain(yValues).range([height, 0]).padding(0.05)
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(processedData, (d) => d.value) || 0])

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

    g.selectAll(".cell")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => xScale(d.x) || 0)
      .attr("y", (d) => yScale(d.y) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.value))
      .style("stroke", "white")
      .style("stroke-width", 1)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9)
        tooltip
          .html(`${xKey}: ${d.x}<br/>${yKey}: ${d.y}<br/>${valueKey}: ${formatNumber(d.value)}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0)
      })

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .text(xKey.charAt(0).toUpperCase() + xKey.slice(1))

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yKey.charAt(0).toUpperCase() + yKey.slice(1))

    return () => {
      tooltip.remove()
    }
  }, [filteredData, xKey, yKey, valueKey, dimensions])

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div ref={containerRef} className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          className="chart-container"
          style={{ width: "100%", height: "auto", maxWidth: 800, aspectRatio: "4 / 3" }}
        ></svg>
      </div>
    </div>
  )
}
