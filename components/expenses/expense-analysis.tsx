"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"

type Expense = {
  id: string
  amount: string
  category: string
  description: string
  date: Date
}

interface ExpenseAnalysisProps {
  expenses: Expense[]
}

export function ExpenseAnalysis({ expenses }: ExpenseAnalysisProps) {
  const [timeframe, setTimeframe] = useState("month")
  const [categoryData, setCategoryData] = useState<{ category: string; amount: number }[]>([])
  const [topExpenses, setTopExpenses] = useState<Expense[]>([])
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    if (expenses.length === 0) return

    // Filter expenses based on timeframe
    const now = new Date()
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      if (timeframe === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return expenseDate >= oneWeekAgo
      } else if (timeframe === "month") {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return expenseDate >= oneMonthAgo
      } else if (timeframe === "year") {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        return expenseDate >= oneYearAgo
      }
      return true
    })

    // Calculate category totals
    const categories: Record<string, number> = {}
    filteredExpenses.forEach((expense) => {
      const amount = Number(expense.amount)
      if (categories[expense.category]) {
        categories[expense.category] += amount
      } else {
        categories[expense.category] = amount
      }
    })

    const categoryArray = Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)

    setCategoryData(categoryArray)

    // Get top expenses
    const sortedExpenses = [...filteredExpenses].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5)

    setTopExpenses(sortedExpenses)

    // Generate insights
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    const newInsights = []

    if (categoryArray.length > 0) {
      const topCategory = categoryArray[0]
      newInsights.push(
        `Your highest spending category is ${getCategoryLabel(topCategory.category)} at $${topCategory.amount.toFixed(2)} (${((topCategory.amount / totalSpent) * 100).toFixed(1)}% of total)`,
      )
    }

    if (filteredExpenses.length > 5) {
      const avgExpense = totalSpent / filteredExpenses.length
      newInsights.push(`Your average expense is $${avgExpense.toFixed(2)}`)
    }

    if (categoryArray.length > 1) {
      const secondCategory = categoryArray[1]
      newInsights.push(
        `Your second highest category is ${getCategoryLabel(secondCategory.category)} at $${secondCategory.amount.toFixed(2)}`,
      )
    }

    if (filteredExpenses.length > 0) {
      newInsights.push(`You've tracked ${filteredExpenses.length} expenses in this period`)
    }

    setInsights(newInsights)
  }, [expenses, timeframe])

  const categories = [
    { value: "housing", label: "Housing" },
    { value: "transportation", label: "Transportation" },
    { value: "food", label: "Food & Dining" },
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "healthcare", label: "Healthcare" },
    { value: "shopping", label: "Shopping" },
    { value: "personal", label: "Personal Care" },
    { value: "education", label: "Education" },
    { value: "travel", label: "Travel" },
    { value: "debt", label: "Debt Payments" },
    { value: "savings", label: "Savings & Investments" },
    { value: "gifts", label: "Gifts & Donations" },
    { value: "other", label: "Other" },
  ]

  const getCategoryLabel = (value: string) => {
    return categories.find((category) => category.value === value)?.label || value
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      housing: "bg-blue-500",
      transportation: "bg-green-500",
      food: "bg-yellow-500",
      utilities: "bg-purple-500",
      entertainment: "bg-pink-500",
      healthcare: "bg-red-500",
      shopping: "bg-indigo-500",
      personal: "bg-orange-500",
      education: "bg-cyan-500",
      travel: "bg-emerald-500",
      debt: "bg-rose-500",
      savings: "bg-lime-500",
      gifts: "bg-amber-500",
      other: "bg-gray-500",
    }

    return colors[category] || "bg-gray-500"
  }

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expense Analysis</CardTitle>
            <CardDescription className="text-gray-400">Understand your spending patterns</CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakdown">
          <TabsList className="mb-4 bg-white/5 border-white/10">
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="top">Top Expenses</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Total Spent</span>
                    </div>
                    <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Categories</span>
                    </div>
                    <div className="text-2xl font-bold">{categoryData.length}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {categoryData.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{getCategoryLabel(item.category)}</span>
                        <span>${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`${getCategoryColor(item.category)} h-2 rounded-full`}
                          style={{ width: `${(item.amount / totalSpent) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No expense data available</p>
                <p className="text-sm mt-1">Add expenses to see your spending breakdown</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="top">
            {topExpenses.length > 0 ? (
              <div className="space-y-3">
                {topExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-400">{getCategoryLabel(expense.category)}</p>
                    </div>
                    <div className="font-semibold">${Number(expense.amount).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No expense data available</p>
                <p className="text-sm mt-1">Add expenses to see your top spending</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights">
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="mt-0.5">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No insights available</p>
                <p className="text-sm mt-1">Add more expenses to generate insights</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
