"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

interface AccountSettingsProps {
  user: User | null
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)

  const supabase = getSupabaseClient()

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || "",
    },
  })

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      })

      if (error) throw error

      setPasswordSuccess("Password updated successfully")
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      setPasswordError(error.message || "An error occurred while updating your password")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsEmailLoading(true)
    setEmailError(null)
    setEmailSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        email: values.email,
      })

      if (error) throw error

      setEmailSuccess("Email update confirmation sent to your new email address")
    } catch (error: any) {
      setEmailError(error.message || "An error occurred while updating your email")
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Email Address</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Update your email address. A confirmation will be sent to your new email.
        </p>

        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {emailError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{emailError}</AlertDescription>
              </Alert>
            )}

            {emailSuccess && (
              <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{emailSuccess}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isEmailLoading}>
              {isEmailLoading ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure.</p>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>Password must be at least 8 characters long.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isPasswordLoading}>
              {isPasswordLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

