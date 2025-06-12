import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSupabaseClient } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PortfolioPerformanceChart } from "@/components/charts/portfolio-performance-chart"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  BookOpen,
  Target,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

export default async function AnalyticsPage() {
  const supabase = getServerSupabaseClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("user_id", user?.id).single()

  // Enhanced portfolio data with more realistic progression
  const portfolioData = [
    { month: "Jan", value: 100000, growth: 0, date: "2024-01-01" },
    { month: "Feb", value: 108500, growth: 8.5, date: "2024-02-01" },
    { month: "Mar", value: 106200, growth: -2.1, date: "2024-03-01" },
    { month: "Apr", value: 114800, growth: 8.1, date: "2024-04-01" },
    { month: "May", value: 122300, growth: 6.5, date: "2024-05-01" },
    { month: "Jun", value: 128900, growth: 5.4, date: "2024-06-01" },
    { month: "Jul", value: 135600, growth: 5.2, date: "2024-07-01" },
  ]

  // More realistic asset allocation
  const assetAllocation = [
    { name: "Large Cap Stocks", value: 35, amount: 47460, color: "#9b87f5" },
    { name: "Mid Cap Stocks", value: 20, amount: 27120, color: "#8b5cf6" },
    { name: "Mutual Funds", value: 25, amount: 33900, color: "#ec4899" },
    { name: "Bonds & FDs", value: 15, amount: 20340, color: "#10b981" },
    { name: "Cash & Liquid", value: 5, amount: 6780, color: "#f59e0b" },
  ]

  // Enhanced sector allocation with Indian market focus
  const sectorAllocation = [
    { name: "Information Technology", value: 28, amount: 37968, trend: "+12.5%" },
    { name: "Financial Services", value: 22, amount: 29832, trend: "+8.2%" },
    { name: "Healthcare & Pharma", value: 18, amount: 24408, trend: "+15.1%" },
    { name: "Consumer Goods", value: 12, amount: 16272, trend: "+5.8%" },
    { name: "Energy & Power", value: 10, amount: 13560, trend: "-2.3%" },
    { name: "Infrastructure", value: 6, amount: 8136, trend: "+18.7%" },
    { name: "Others", value: 4, amount: 5424, trend: "+3.2%" },
  ]

  // Enhanced performance metrics with more details
  const performanceMetrics = [
    {
      name: "Total Portfolio Value",
      value: "₹1,35,600",
      change: "+35.6% (₹35,600)",
      isPositive: true,
      icon: <DollarSign className="h-4 w-4" />,
      description: "Total investment value",
    },
    {
      name: "Monthly Return",
      value: "+5.2%",
      change: "vs +3.8% last month",
      isPositive: true,
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Current month performance",
    },
    {
      name: "Annual Return (CAGR)",
      value: "18.4%",
      change: "vs 12% market avg",
      isPositive: true,
      icon: <Target className="h-4 w-4" />,
      description: "Compound annual growth",
    },
    {
      name: "Risk Score",
      value: "Moderate",
      change: "Volatility: 16.2%",
      isPositive: true,
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Portfolio risk level",
    },
  ]

  // Enhanced monthly returns with more realistic data
  const monthlyReturns = [
    { month: "Jan 2024", return: 2.8, value: 102800, isPositive: true },
    { month: "Feb 2024", return: 5.5, value: 108500, isPositive: true },
    { month: "Mar 2024", return: -2.1, value: 106200, isPositive: false },
    { month: "Apr 2024", return: 8.1, value: 114800, isPositive: true },
    { month: "May 2024", return: 6.5, value: 122300, isPositive: true },
    { month: "Jun 2024", return: 5.4, value: 128900, isPositive: true },
    { month: "Jul 2024", return: 5.2, value: 135600, isPositive: true },
  ]

  // Calculate total portfolio value
  const totalValue = 135600
  const totalInvestment = 100000
  const totalGain = totalValue - totalInvestment
  const totalReturnPercent = ((totalGain / totalInvestment) * 100).toFixed(1)

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-heading">Portfolio Analytics</h1>
          <p className="text-muted-foreground">Track your investment performance and portfolio allocation</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Gain</div>
          <div className="text-2xl font-bold text-green-400">+₹{totalGain.toLocaleString()}</div>
          <div className="text-sm text-green-400">+{totalReturnPercent}%</div>
        </div>
      </div>

      {/* Enhanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric) => (
          <Card
            key={metric.name}
            className={`glass-card ${metric.isPositive ? "glow-green" : "glow-red"} glass-highlight hover-float`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-purple-400">{metric.icon}</div>
                  <span className="text-sm text-muted-foreground">{metric.name}</span>
                </div>
                <div className={`flex items-center ${metric.isPositive ? "text-green-400" : "text-red-400"}`}>
                  {metric.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.change}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Portfolio Performance Chart */}
      <div className="mb-8">
        <PortfolioPerformanceChart data={portfolioData} />
      </div>

      {/* Enhanced Asset and Sector Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card glow glow-purple glass-highlight hover-float">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-gradient-heading">Asset Allocation</CardTitle>
              <CardDescription>Diversified portfolio breakdown with amounts</CardDescription>
            </div>
            <PieChart className="h-5 w-5 text-finance-purple" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4 glass-card">
                <TabsTrigger value="chart" className="data-[state=active]:bg-finance-purple">
                  Visual
                </TabsTrigger>
                <TabsTrigger value="table" className="data-[state=active]:bg-finance-purple">
                  Details
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div className="h-[300px] flex items-center justify-center">
                  <div className="relative w-52 h-52">
                    {/* Enhanced pie chart with better segments */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {assetAllocation.map((asset, index) => {
                        const offset = assetAllocation.slice(0, index).reduce((sum, a) => sum + a.value, 0)
                        const circumference = 2 * Math.PI * 40
                        const strokeDasharray = `${(asset.value / 100) * circumference} ${circumference}`
                        const strokeDashoffset = -((offset / 100) * circumference)

                        return (
                          <circle
                            key={asset.name}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={asset.color}
                            strokeWidth="16"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-300 hover:stroke-width-18"
                          />
                        )
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                        <div className="text-xl font-bold">₹{(totalValue / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-green-400">+{totalReturnPercent}%</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {assetAllocation.map((asset) => (
                    <div key={asset.name} className="glass-card p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                          <span className="text-sm font-medium">{asset.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{asset.value}%</div>
                          <div className="text-xs text-muted-foreground">₹{asset.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="table">
                <div className="glass-card rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-3 text-left">Asset Class</th>
                        <th className="p-3 text-right">Allocation</th>
                        <th className="p-3 text-right">Value</th>
                        <th className="p-3 text-right">Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetAllocation.map((asset) => (
                        <tr key={asset.name} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                              {asset.name}
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium">{asset.value}%</td>
                          <td className="p-3 text-right">₹{asset.amount.toLocaleString()}</td>
                          <td className="p-3 text-right text-muted-foreground">
                            {asset.name.includes("Stock")
                              ? Math.floor(asset.amount / 2500)
                              : Math.floor(asset.amount / 1000)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="glass-card glow glow-purple glass-highlight hover-float">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-gradient-heading">Sector Performance</CardTitle>
              <CardDescription>Indian market sector allocation with trends</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-finance-purple" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4 glass-card">
                <TabsTrigger value="chart" className="data-[state=active]:bg-finance-purple">
                  Performance
                </TabsTrigger>
                <TabsTrigger value="table" className="data-[state=active]:bg-finance-purple">
                  Analysis
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div className="h-[300px] flex flex-col justify-center">
                  <div className="space-y-4">
                    {sectorAllocation.map((sector, index) => (
                      <div key={sector.name} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{sector.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{sector.value}%</span>
                            <span
                              className={`text-xs px-2 py-1 rounded glass-card ${
                                sector.trend.startsWith("+") ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {sector.trend}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="w-full glass-card rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-finance-purple to-purple-400 rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${(sector.value / 30) * 100}%`,
                                animationDelay: `${index * 100}ms`,
                              }}
                            ></div>
                          </div>
                          <div className="absolute right-2 top-0 bottom-0 flex items-center">
                            <span className="text-xs text-white/80">₹{(sector.amount / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="table">
                <div className="glass-card rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-3 text-left">Sector</th>
                        <th className="p-3 text-right">Weight</th>
                        <th className="p-3 text-right">Value</th>
                        <th className="p-3 text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectorAllocation.map((sector) => (
                        <tr key={sector.name} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-3 font-medium">{sector.name}</td>
                          <td className="p-3 text-right">{sector.value}%</td>
                          <td className="p-3 text-right">₹{sector.amount.toLocaleString()}</td>
                          <td
                            className={`p-3 text-right font-medium ${
                              sector.trend.startsWith("+") ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {sector.trend}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Monthly Returns and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card glow glow-purple glass-highlight hover-float">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-gradient-heading">Monthly Performance</CardTitle>
              <CardDescription>Detailed monthly returns with portfolio values</CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-finance-purple" />
          </CardHeader>
          <CardContent>
            <div className="glass-card rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-right">Return</th>
                    <th className="p-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReturns.map((item) => (
                    <tr key={item.month} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 font-medium">{item.month}</td>
                      <td
                        className={`p-3 text-right font-medium ${item.isPositive ? "text-green-400" : "text-red-400"}`}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {item.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          {item.return > 0 ? "+" : ""}
                          {item.return.toFixed(1)}%
                        </div>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">₹{item.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 glass-card rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Average Monthly Return</div>
              <div className="text-lg font-bold text-green-400">+4.5%</div>
              <div className="text-xs text-muted-foreground">Consistent growth trend</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card glow glow-purple glass-highlight hover-float">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-gradient-heading">Smart Recommendations</CardTitle>
              <CardDescription>AI-powered insights based on your portfolio</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-finance-purple" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-lg border-0 border-slate-500">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                  <div>
                    <h3 className="font-medium mb-1 text-green-400">Strong Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your portfolio is outperforming the market by 6.4%. Consider maintaining current allocation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-lg border-0 border-slate-500">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
                  <div>
                    <h3 className="font-medium mb-1 text-yellow-400">Rebalancing Opportunity</h3>
                    <p className="text-sm text-muted-foreground">
                      IT sector is overweight at 28%. Consider taking some profits and diversifying.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-lg border-0 border-slate-500">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                  <div>
                    <h3 className="font-medium mb-1 text-blue-400">Growth Opportunity</h3>
                    <p className="text-sm text-muted-foreground">
                      Infrastructure sector showing strong momentum (+18.7%). Consider increasing allocation.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full glass-card hover-float" asChild>
                <Link href="/education">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn Advanced Portfolio Strategies
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
