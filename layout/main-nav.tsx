"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, Home, Settings, User, DollarSign } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/education",
      label: "Learn",
      icon: BookOpen,
      active: pathname === "/education",
    },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
      active: pathname === "/resources",
    },
    {
      href: "/expenses",
      label: "Expenses",
      icon: DollarSign,
      active: pathname === "/expenses",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "default" : "ghost"}
            size="sm"
            className={cn(
              "justify-start",
              route.active ? "bg-white text-black" : "text-white/70 hover:text-white hover:bg-white/10",
            )}
            asChild
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}

