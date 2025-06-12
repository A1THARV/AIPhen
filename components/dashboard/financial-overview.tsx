"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

export function FinancialOverview() {
  // Mock data for demonstration
  const portfolioData = [
    { name: "Stocks", value: 45, amount: 110250, color: "#a78bfa" },
    { name: "Mutual Funds", value: 30, amount: 73500, color: "#93c5fd" },
    { name: "Bonds", value: 15, amount: 36750, color: "#6ee7b7" },
    { name: "Cash", value: 10, amount: 24500, color: "#fcd34d" },
  ]

  const expenseData = [
    { category: "Housing", amount: 15000, percentage: 33, color: "#a78bfa" },
    { category: "Food", amount: 8000, percentage: 18, color: "#93c5fd" },
    { category: "Transportation", amount: 6000, percentage: 13, color: "#6ee7b7" },
    { category: "Entertainment", amount: 4000, percentage: 9, color: "#fcd34d" },
    { category: "Others", amount: 12230, percentage: 27, color: "#f87171" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Allocation - Primary card with purple glow */}
      <Card className="glass-card glow glow-purple glass-highlight hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-400" />
            <div>
              <CardTitle className="text-lg font-semibold text-white">Portfolio Allocation</CardTitle>
              <CardDescription className="text-white/60">Your investment distribution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white">₹2,45,000</div>
              <div className="flex items-center justify-center gap-1 text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+12.5% this month</span>
              </div>
            </div>

            <div className="space-y-3">
              {portfolioData.map((item, index) => (
                <div
                  key={item.name}
                  // Applied glass-card here, removed bg-white/5
                  className="flex items-center justify-between p-3 glass-card rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">₹{item.amount.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Expenses - Primary card with purple glow */}
      <Card className="glass-card glow glow-purple glass-highlight hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <div>
              <CardTitle className="text-lg font-semibold text-white">Monthly Expenses</CardTitle>
              <CardDescription className="text-white/60">Your spending breakdown</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white">₹45,230</div>
              <div className="flex items-center justify-center gap-1 text-red-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">-8.2% from last month</span>
              </div>
            </div>

            <div className="space-y-3">
              {expenseData.map((item, index) => (
                <div
                  key={item.category}
                  // Applied glass-card here, removed bg-white/5
                  className="flex items-center justify-between p-3 glass-card rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">₹{item.amount.toLocaleString()}</div>
                    <Badge className="bg-white/10 text-white text-xs border-0">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
