"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, PieChart, Target, Wallet } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const changeColor = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-gray-400",
  }[changeType]

  // Use green glow for positive data, red for negative, and purple for neutral
  const glowColor = {
    positive: "glow-green",
    negative: "glow-red",
    neutral: "glow-purple",
  }[changeType]

  const TrendIcon = changeType === "positive" ? TrendingUp : TrendingDown

  return (
    <Card className={`glass-card glow ${glowColor} glass-highlight hover-float`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
        <div className="text-purple-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className={`text-xs flex items-center gap-1 ${changeColor}`}>
          <TrendIcon className="h-3 w-3" />
          {change}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const stats = [
    {
      title: "Portfolio Value",
      value: "₹2,45,680",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: "Monthly Savings",
      value: "₹-5,240",
      change: "-5.2% from last month",
      changeType: "negative" as const,
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      title: "Investment Returns",
      value: "₹8,450",
      change: "+15.3% from last month",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "Goal Progress",
      value: "68%",
      change: "+5% from last month",
      changeType: "positive" as const,
      icon: <Target className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
