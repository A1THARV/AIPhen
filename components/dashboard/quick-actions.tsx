import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, BarChart3, MessageSquare } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: MessageSquare,
      label: "Ask AI Assistant",
      description: "Get answers to your financial questions",
      href: "/education",
    },
    {
      icon: Search,
      label: "Discover Investments",
      description: "Explore financial instruments",
      href: "/discover",
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "Check your portfolio performance",
      href: "/analytics",
    },
    {
      icon: BookOpen,
      label: "Learn Basics",
      description: "Financial education resources",
      href: "/education?category=basics",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
        <CardDescription>Common tasks to get you started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {actions.map((action) => (
            <Button key={action.label} variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href={action.href}>
                <div className="flex items-start">
                  <action.icon className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
