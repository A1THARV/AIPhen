import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)

        // Clear any potentially corrupted cookies
        const response = NextResponse.redirect(new URL("/login?error=auth", request.url))

        // Clear auth cookies
        response.cookies.delete("sb-access-token")
        response.cookies.delete("sb-refresh-token")

        return response
      }

      if (data.user) {
        // Check if user exists in users table
        const { data: userExists } = await supabase.from("users").select("id").eq("id", data.user.id).single()

        // If user doesn't exist in the users table, create a record and redirect to onboarding
        if (!userExists) {
          try {
            await supabase.from("users").insert({
              id: data.user.id,
              email: data.user.email,
              password_hash: "auth_managed", // We don't store the actual password hash
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            // For new users, redirect to onboarding
            return NextResponse.redirect(new URL("/onboarding", request.url))
          } catch (err) {
            console.error("Error creating user record:", err)
          }
        }
      }
    } catch (error) {
      console.error("Error in auth callback:", error)

      // Clear any potentially corrupted cookies and redirect
      const response = NextResponse.redirect(new URL("/login?error=auth", request.url))

      // Clear auth cookies
      response.cookies.delete("sb-access-token")
      response.cookies.delete("sb-refresh-token")

      return response
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
