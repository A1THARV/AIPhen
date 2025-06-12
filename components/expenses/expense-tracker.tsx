"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
})

type Expense = z.infer<typeof formSchema> & { id: string }

interface ExpenseTrackerProps {
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
}

export function ExpenseTracker({ expenses, setExpenses }: ExpenseTrackerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Add expense to the list
      const newExpense: Expense = {
        ...values,
        id: crypto.randomUUID(),
      }

      setExpenses((prev) => [...prev, newExpense])
      setSuccess("Expense added successfully")

      // Reset form
      form.reset({
        amount: "",
        category: "",
        description: "",
        date: new Date(),
      })
    } catch (error: any) {
      setError(error.message || "An error occurred while adding the expense")
    } finally {
      setIsLoading(false)
    }
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    setSuccess("Expense deleted successfully")
  }

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

  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card glow glow-purple glass-highlight hover-float">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription className="text-gray-400">Track your spending by adding expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a description" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white/5 border-white/10",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert variant="default" className="bg-green-900/50 text-green-300 border-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="glass-card glow glow-purple glass-highlight hover-float">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription className="text-gray-400">Total: ${totalExpenses.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg glass-card transition-all duration-300 hover:bg-white/20"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{getCategoryLabel(expense.category)}</span>
                      <span>•</span>
                      <span>{format(expense.date, "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">${Number(expense.amount).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-900/20"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No expenses yet</p>
                <p className="text-sm mt-1">Add your first expense to start tracking</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
