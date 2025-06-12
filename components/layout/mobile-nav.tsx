"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Discover",
    href: "/discover",
  },
  {
    name: "Education",
    href: "/education",
  },
  {
    name: "Analytics",
    href: "/analytics",
  },
  {
    name: "Resources",
    href: "/resources",
  },
  {
    name: "Expenses",
    href: "/expenses",
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="glass-nav pr-0 sm:max-w-xs">
        <Link href="/dashboard" className="flex items-center gap-2 px-7 mb-10" onClick={() => setOpen(false)}>
          <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative font-bold text-white">AI</span>
          </div>
          <span className="font-bold text-xl">AIPhen</span>
        </Link>
        <div className="flex flex-col space-y-3 px-7">
          <AnimatePresence>
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center text-lg font-medium transition-colors",
                    pathname === item.href ? "text-white" : "text-muted-foreground hover:text-white",
                  )}
                >
                  <div className="relative py-1.5">
                    {item.name}
                    {pathname === item.href && (
                      <motion.span
                        layoutId="mobile-nav-indicator"
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
}
