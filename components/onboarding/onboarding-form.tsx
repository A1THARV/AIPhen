"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { completeUserOnboarding } from "@/app/actions/onboarding"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"

const formSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  risk_tolerance: z.enum(["low", "moderate", "high"]),
  investment_goal: z.enum(["wealth_preservation", "balanced_growth", "aggressive_growth", "retirement", "education"]),
  current_portfolio_value: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Please enter a valid amount" }),
  target_portfolio_value: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Please enter a valid amount" }),
  investment_horizon: z.enum(["short_term", "medium_term", "long_term"]),
})

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  // Get user session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseBrowser()
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        // No session, redirect to login
        window.location.href = "/login"
      } else {
        setUserId(data.session.user.id)
      }
    }

    checkSession()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      risk_tolerance: "moderate",
      investment_goal: "balanced_growth",
      current_portfolio_value: "0",
      target_portfolio_value: "0",
      investment_horizon: "medium_term",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (step < 3) {
      setStep(step + 1)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!userId) {
        throw new Error("User not authenticated")
      }

      await completeUserOnboarding(userId, {
        first_name: values.first_name,
        last_name: values.last_name,
        risk_tolerance: values.risk_tolerance,
        investment_goal: values.investment_goal,
        current_portfolio_value: Number.parseFloat(values.current_portfolio_value),
        target_portfolio_value: Number.parseFloat(values.target_portfolio_value),
        investment_horizon: values.investment_horizon,
      })

      // Use window.location for a hard redirect
      window.location.href = "/dashboard"
    } catch (error: any) {
      setError(error.message || "An error occurred during onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-10 rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div className={`h-2 w-10 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div className={`h-2 w-10 rounded-full ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold">
            {step === 1 && "Personal Information"}
            {step === 2 && "Investment Goals"}
            {step === 3 && "Risk Profile"}
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="investment_goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your primary investment goal?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your investment goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wealth_preservation">Wealth Preservation</SelectItem>
                          <SelectItem value="balanced_growth">Balanced Growth</SelectItem>
                          <SelectItem value="aggressive_growth">Aggressive Growth</SelectItem>
                          <SelectItem value="retirement">Retirement Planning</SelectItem>
                          <SelectItem value="education">Education Funding</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us understand what you're trying to achieve with your investments.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="current_portfolio_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Portfolio Value (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1000" {...field} />
                        </FormControl>
                        <FormDescription>Your current investment amount across all assets.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="target_portfolio_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Portfolio Value (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1000" {...field} />
                        </FormControl>
                        <FormDescription>Your target investment amount to achieve.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="risk_tolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your risk tolerance?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your risk tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low - I prefer stable investments with minimal risk</SelectItem>
                          <SelectItem value="moderate">
                            Moderate - I can accept some fluctuations for better returns
                          </SelectItem>
                          <SelectItem value="high">
                            High - I'm comfortable with significant fluctuations for potentially higher returns
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us understand how much market volatility you're comfortable with.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investment_horizon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your investment time horizon?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your investment horizon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short_term">Short Term (Less than 3 years)</SelectItem>
                          <SelectItem value="medium_term">Medium Term (3-7 years)</SelectItem>
                          <SelectItem value="long_term">Long Term (More than 7 years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How long you plan to keep your money invested before needing it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={goBack}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              <Button type="submit" disabled={isLoading}>
                {step < 3 ? (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    Complete
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
