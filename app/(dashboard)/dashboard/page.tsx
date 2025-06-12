import { getServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  LineChart,
  Award,
  CheckCircle,
  Target,
  Plus,
  Zap,
  BarChart3,
  PieChart,
} from "lucide-react"
import { LiveMarketOverview } from "@/components/dashboard/live-market-overview"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions-redesigned"
import { FinancialOverview } from "@/components/dashboard/financial-overview"
import { LearningProgress } from "@/components/dashboard/learning-progress"

export default async function DashboardPage() {
  const supabase = getServerSupabaseClient()

  // Fetch user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("user_id", user?.id).single()

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 py-4 space-y-6 overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-slide-up">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
              Welcome back, {userProfile?.first_name || "Investor"}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Your personal finance education platform with AI-powered insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            
            
          </div>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Market Data & Financial Overview */}
          <div className="xl:col-span-2 space-y-8">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <LiveMarketOverview />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <FinancialOverview />
            </div>
          </div>

          {/* Right Column - Learning Progress & Quick Actions */}
          <div className="space-y-8">
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <LearningProgress />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <QuickActions />
            </div>
          </div>
        </div>

        {/* Bottom Section - Goals & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Goals - Primary card with purple glow */}
          <Card
            className="glass-card glow glow-purple glass-highlight hover-float animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Financial Goals</CardTitle>
                <CardDescription className="text-white/60">
                  Track your progress towards financial milestones
                </CardDescription>
              </div>
              <Button size="sm" className="glass-card hover-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "Emergency Fund",
                  current: 15000,
                  target: 50000,
                  icon: <DollarSign className="h-5 w-5 text-green-400" />,
                  color: "bg-green-500",
                },
                {
                  title: "Investment Portfolio",
                  current: 75000,
                  target: 100000,
                  icon: <LineChart className="h-5 w-5 text-blue-400" />,
                  color: "bg-blue-500",
                },
                {
                  title: "Retirement Savings",
                  current: 25000,
                  target: 500000,
                  icon: <Target className="h-5 w-5 text-purple-400" />,
                  color: "bg-purple-500",
                },
              ].map((goal, index) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div key={index} className="glass-card p-4 rounded-xl hover:bg-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${goal.color}/20`}>{goal.icon}</div>
                        <div>
                          <h3 className="font-medium text-white">{goal.title}</h3>
                          <p className="text-sm text-white/60">
                            ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-white/10 text-white">{progress.toFixed(0)}%</Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* AI Insights - Primary card with purple glow */}
          <Card
            className="glass-card glow glow-purple glass-highlight hover-float animate-fade-in"
            style={{ animationDelay: "1.2s" }}
          >
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                AI Insights
              </CardTitle>
              <CardDescription className="text-white/60">Personalized recommendations for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Optimize Your Portfolio",
                  description: "Consider rebalancing your investments to reduce risk by 15%",
                  action: "View Recommendations",
                  icon: <PieChart className="h-5 w-5 text-blue-400" />,
                  priority: "high",
                },
                {
                  title: "Expense Analysis",
                  description: "You've spent 23% more on dining out this month",
                  action: "Track Expenses",
                  icon: <BarChart3 className="h-5 w-5 text-orange-400" />,
                  priority: "medium",
                },
                {
                  title: "Learning Opportunity",
                  description: "Complete 2 more lessons to unlock advanced trading strategies",
                  action: "Continue Learning",
                  icon: <BookOpen className="h-5 w-5 text-green-400" />,
                  priority: "low",
                },
              ].map((insight, index) => (
                <div
                  key={index}
                  className="glass-card p-4 rounded-xl hover:bg-white/20 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">{insight.title}</h3>
                        <Badge
                          className={`text-xs ${
                            insight.priority === "high"
                              ? "bg-red-500/20 text-red-300"
                              : insight.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{insight.description}</p>
                      <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                        {insight.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
