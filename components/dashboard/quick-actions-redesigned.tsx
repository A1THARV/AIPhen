"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, BarChart3, MessageSquare, Zap, Target, Calculator } from "lucide-react"
import { motion } from "framer-motion"

export function QuickActions() {
  const actions = [
    {
      icon: MessageSquare,
      label: "AI Assistant",
      description: "Get financial advice",
      href: "/education",
      featured: true,
    },
    {
      icon: Search,
      label: "Discover",
      description: "Explore investments",
      href: "/discover",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      description: "View performance",
      href: "/analytics",
    },
    {
      icon: BookOpen,
      label: "Learn",
      description: "Financial education",
      href: "/education?category=basics",
    },
    {
      icon: Calculator,
      label: "Calculators",
      description: "Financial tools",
      href: "/resources/tools/sip-calculator",
    },
    {
      icon: Target,
      label: "Goals",
      description: "Set targets",
      href: "/dashboard",
    },
  ]

  return (
    <Card className="glass-card glow glow-purple glass-highlight hover-float">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-400" />
          <div>
            <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Access your most-used features</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-center gap-2 glass-card glow glow-purple hover:bg-white/20 transition-colors w-full ${
                  action.featured ? "ring-1 ring-purple-500/30" : ""
                }`}
                asChild
              >
                <Link href={action.href}>
                  <div className="p-2 rounded-lg bg-white/5">
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-white text-sm">{action.label}</div>
                    <div className="text-xs text-gray-400">{action.description}</div>
                  </div>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
