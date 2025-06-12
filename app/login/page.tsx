"use client"
import { useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative">
      {/* Abstract gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 z-0"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 md:px-6 md:py-10 lg:gap-10 relative z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">AIPhen</h1>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
