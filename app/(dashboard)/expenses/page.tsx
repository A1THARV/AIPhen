"use client"

import { useState, useEffect } from "react"
import { ExpenseTracker } from "@/components/expenses/expense-tracker"
import { ExpenseAnalysis } from "@/components/expenses/expense-analysis"

type Expense = {
  id: string
  amount: string
  category: string
  description: string
  date: Date
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses)
        // Convert string dates back to Date objects
        const expensesWithDates = parsedExpenses.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        }))
        setExpenses(expensesWithDates)
      } catch (error) {
        console.error("Error loading expenses:", error)
      }
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-2 text-gradient-heading">Expense Tracker</h1>
      <p className="text-muted-foreground mb-8">Track and analyze your spending habits</p>

      <div className="grid grid-cols-1 gap-8">
        <ExpenseTracker expenses={expenses} setExpenses={setExpenses} />
        <ExpenseAnalysis expenses={expenses} />
      </div>
    </div>
  )
}
