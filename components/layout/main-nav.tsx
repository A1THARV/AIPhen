"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
      {navItems.map((item) => (
        <motion.div key={item.href} whileHover={{ y: -2 }}>
          <Link
            href={item.href}
            className={cn(
              "group relative px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href ? "text-white" : "text-gray-400 hover:text-white",
            )}
          >
            {item.name}
            {pathname === item.href && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-purple-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
        </motion.div>
      ))}
    </nav>
  )
}
