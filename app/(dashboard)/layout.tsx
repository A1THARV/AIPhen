import type React from "react"
import { Header } from "@/components/layout/header"
import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase-server"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = getSupabaseServer()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      for (const cookie of cookieStore.getAll()) {
        if (cookie.name.includes("supabase") || cookie.name.includes("auth")) {
          cookies().delete(cookie.name)
        }
      }
      redirect("/login")
    }
  } catch (error) {
    console.error("Error checking session in dashboard layout:", error)
    for (const cookie of cookieStore.getAll()) {
      if (cookie.name.includes("supabase") || cookie.name.includes("auth")) {
        cookies().delete(cookie.name)
      }
    }
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {" "}
      {/* Removed bg-black text-white, handled by body styles */}
      <Header />
      <main className="flex-1 relative">{children}</main>
    </div>
  )
}
