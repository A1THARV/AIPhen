"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { updateUserOnboarding } from "@/app/actions/onboarding"
import type { UserProfile } from "@/types/user"

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

interface ProfileFormProps {
  userProfile: UserProfile | null
}

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: userProfile?.first_name || "",
      last_name: userProfile?.last_name || "",
      risk_tolerance: (userProfile?.risk_tolerance as any) || "moderate",
      investment_goal: (userProfile?.investment_goal as any) || "balanced_growth",
      current_portfolio_value: userProfile?.current_portfolio_value?.toString() || "0",
      target_portfolio_value: userProfile?.target_portfolio_value?.toString() || "0",
      investment_horizon: (userProfile?.investment_horizon as any) || "medium_term",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userProfile) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updateUserOnboarding(userProfile.id, {
        ...userProfile,
        first_name: values.first_name,
        last_name: values.last_name,
        risk_tolerance: values.risk_tolerance,
        investment_goal: values.investment_goal,
        current_portfolio_value: Number.parseFloat(values.current_portfolio_value),
        target_portfolio_value: Number.parseFloat(values.target_portfolio_value),
        investment_horizon: values.investment_horizon,
      })

      setSuccess("Profile updated successfully")
    } catch (error: any) {
      setError(error.message || "An error occurred while updating your profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <FormField
          control={form.control}
          name="investment_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Goal</FormLabel>
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

        <FormField
          control={form.control}
          name="risk_tolerance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Tolerance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low - I prefer stable investments with minimal risk</SelectItem>
                  <SelectItem value="moderate">Moderate - I can accept some fluctuations for better returns</SelectItem>
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
              <FormLabel>Investment Time Horizon</FormLabel>
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
              <FormDescription>How long you plan to keep your money invested before needing it.</FormDescription>
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
          <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

