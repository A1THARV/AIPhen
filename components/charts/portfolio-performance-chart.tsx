"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"

interface PortfolioDataPoint {
  month: string
  value: number
  growth: number
  date: string
}

interface PortfolioPerformanceChartProps {
  data: PortfolioDataPoint[]
}

export function PortfolioPerformanceChart({ data }: PortfolioPerformanceChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Calculate chart dimensions and scaling
  const chartWidth = 800
  const chartHeight = 300
  const padding = { top: 40, right: 60, bottom: 60, left: 80 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Data processing
  const minValue = Math.min(...data.map((d) => d.value)) * 0.95
  const maxValue = Math.max(...data.map((d) => d.value)) * 1.05
  const valueRange = maxValue - minValue

  // Scale functions
  const xScale = (index: number) => (index / (data.length - 1)) * innerWidth
  const yScale = (value: number) => innerHeight - ((value - minValue) / valueRange) * innerHeight

  // Generate path for the main line
  const linePath = data
    .map((point, index) => {
      const x = xScale(index)
      const y = yScale(point.value)
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(" ")

  // Generate path for the area under the curve
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${innerHeight} L ${xScale(0)} ${innerHeight} Z`

  // Generate grid lines
  const gridLines = {
    horizontal: Array.from({ length: 6 }, (_, i) => {
      const y = (i / 5) * innerHeight
      const value = maxValue - (i / 5) * valueRange
      return { y, value }
    }),
    vertical: data.map((_, index) => ({
      x: xScale(index),
      label: data[index].month,
    })),
  }

  // Current stats
  const currentValue = data[data.length - 1]?.value || 0
  const initialValue = data[0]?.value || 0
  const totalGain = currentValue - initialValue
  const totalGainPercent = ((totalGain / initialValue) * 100).toFixed(1)
  const isPositive = totalGain >= 0

  return (
    <Card className="glass-card glow glow-purple glass-highlight hover-float">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-gradient-heading">Portfolio Performance Trend</CardTitle>
          <CardDescription>Monthly portfolio value progression with growth indicators</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass-card">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 Months
          </Button>
          <Button variant="outline" size="sm" className="glass-card">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <div className="relative h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 overflow-hidden">
            {/* Chart Statistics Overlay */}
            <div className="absolute top-4 right-4 glass-card p-4 rounded-lg z-10">
              <div className="text-xs text-muted-foreground mb-1">Current Value</div>
              <div className="text-xl font-bold text-white">₹{(currentValue / 1000).toFixed(0)}K</div>
              <div className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {totalGainPercent}% Total Return
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isPositive ? "+" : ""}₹{(totalGain / 1000).toFixed(0)}K gain
              </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredPoint !== null && (
              <div
                className="absolute glass-card p-3 rounded-lg pointer-events-none z-20 transition-all duration-200"
                style={{
                  left: `${padding.left + xScale(hoveredPoint) - 50}px`,
                  top: `${padding.top + yScale(data[hoveredPoint].value) - 80}px`,
                }}
              >
                <div className="text-xs text-muted-foreground">{data[hoveredPoint].month} 2024</div>
                <div className="text-lg font-bold text-white">₹{data[hoveredPoint].value.toLocaleString()}</div>
                <div className={`text-sm ${data[hoveredPoint].growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {data[hoveredPoint].growth >= 0 ? "+" : ""}
                  {data[hoveredPoint].growth.toFixed(1)}% growth
                </div>
              </div>
            )}

            {/* Main SVG Chart */}
            <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: "visible" }}>
              {/* Definitions for gradients and patterns */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9b87f5" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(155, 135, 245, 0.4)" />
                  <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
                  <stop offset="100%" stopColor="rgba(236, 72, 153, 0.05)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Chart area */}
              <g transform={`translate(${padding.left}, ${padding.top})`}>
                {/* Horizontal grid lines */}
                {gridLines.horizontal.map((line, index) => (
                  <g key={index}>
                    <line
                      x1={0}
                      y1={line.y}
                      x2={innerWidth}
                      y2={line.y}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      strokeDasharray="2,4"
                    />
                    <text x={-10} y={line.y + 4} textAnchor="end" className="fill-gray-400 text-xs">
                      ₹{(line.value / 1000).toFixed(0)}K
                    </text>
                  </g>
                ))}

                {/* Vertical grid lines */}
                {gridLines.vertical.map((line, index) => (
                  <g key={index}>
                    <line
                      x1={line.x}
                      y1={0}
                      x2={line.x}
                      y2={innerHeight}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    <text x={line.x} y={innerHeight + 20} textAnchor="middle" className="fill-gray-400 text-xs">
                      {line.label}
                    </text>
                  </g>
                ))}

                {/* Area under curve */}
                <path
                  d={areaPath}
                  fill="url(#areaGradient)"
                  className={`transition-all duration-1000 ${isAnimated ? "opacity-100" : "opacity-0"}`}
                />

                {/* Main line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  className={`transition-all duration-1000 ${isAnimated ? "opacity-100" : "opacity-0"}`}
                  style={{
                    strokeDasharray: isAnimated ? "none" : "1000",
                    strokeDashoffset: isAnimated ? "0" : "1000",
                  }}
                />

                {/* Data points */}
                {data.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={xScale(index)}
                      cy={yScale(point.value)}
                      r={hoveredPoint === index ? "6" : "4"}
                      fill="#9b87f5"
                      stroke="#fff"
                      strokeWidth="2"
                      className={`cursor-pointer transition-all duration-200 ${isAnimated ? "opacity-100" : "opacity-0"}`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                        filter: hoveredPoint === index ? "url(#glow)" : "none",
                      }}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Growth indicators */}
                    {index > 0 && (
                      <g
                        className={`transition-all duration-200 ${hoveredPoint === index ? "opacity-100" : "opacity-0"}`}
                      >
                        <rect
                          x={xScale(index) - 15}
                          y={yScale(point.value) - 25}
                          width="30"
                          height="15"
                          rx="7"
                          fill={point.growth >= 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)"}
                        />
                        <text
                          x={xScale(index)}
                          y={yScale(point.value) - 15}
                          textAnchor="middle"
                          className="fill-white text-xs font-medium"
                        >
                          {point.growth >= 0 ? "+" : ""}
                          {point.growth.toFixed(1)}%
                        </text>
                      </g>
                    )}
                  </g>
                ))}

                {/* Trend arrow */}
                <g className={`transition-all duration-1000 ${isAnimated ? "opacity-100" : "opacity-0"}`}>
                  <path
                    d={`M ${xScale(data.length - 2)} ${yScale(data[data.length - 2].value)} L ${xScale(data.length - 1)} ${yScale(data[data.length - 1].value)}`}
                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill={isPositive ? "#22c55e" : "#ef4444"} />
                    </marker>
                  </defs>
                </g>
              </g>
            </svg>

            {/* Performance indicator */}
            <div className="absolute bottom-4 left-4 glass-card p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${isPositive ? "text-green-400" : "text-red-400"}`} />
                <div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                  <div className={`text-sm font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    {isPositive ? "Outperforming" : "Underperforming"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
