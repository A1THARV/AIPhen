"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, Home, Menu, Search, Settings, User, X } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/education",
      label: "Education",
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
      href: "/discover",
      label: "Discover",
      icon: Search,
      active: pathname === "/discover",
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
              <span className="font-bold">AIPhen</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "default" : "ghost"}
                className={cn(
                  "justify-start",
                  route.active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
                asChild
              >
                <Link href={route.href} onClick={() => setOpen(false)}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

