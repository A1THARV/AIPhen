"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowDown,
  ArrowUp,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Calendar,
  Activity,
  Clock,
  AlertTriangle,
  Settings,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { triggerManualRefresh } from "@/app/actions/manual-refresh"
import {
  getCachedTrendingStocks,
  getCachedMostActiveStocks,
  getCachedMarketNews,
  getCachedIPOData,
  getAPIUsageStats,
  checkTablesExist,
  type CachedTrendingStock,
  type CachedMostActiveStock,
  type CachedMarketNews,
  type CachedIPOData,
} from "@/lib/market-data-cache"

interface MarketData {
  trending: {
    top_gainers: CachedTrendingStock[]
    top_losers: CachedTrendingStock[]
    last_updated: string | null
    tablesNotExist?: boolean
  }
  mostActive: {
    stocks: CachedMostActiveStock[]
    last_updated: string | null
    tablesNotExist?: boolean
  }
  news: {
    news: CachedMarketNews[]
    last_updated: string | null
    tablesNotExist?: boolean
  }
  ipo: {
    ipos: CachedIPOData[]
    last_updated: string | null
    tablesNotExist?: boolean
  }
}

interface APIUsage {
  total_calls_this_month: number
  calls_by_type: Record<string, number>
  last_refresh_dates: Record<string, string>
  tablesNotExist?: boolean
}

export function LiveMarketOverview() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [apiUsage, setApiUsage] = useState<APIUsage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tablesExist, setTablesExist] = useState<boolean | null>(null)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email === "atrv@test.com") {
        setIsAdmin(true)
      }
    }

    checkAdmin()
  }, [supabase])

  const checkSetup = async () => {
    try {
      const result = await checkTablesExist()
      setTablesExist(result.allTablesExist)

      if (!result.allTablesExist) {
        setSetupError("Database tables are not set up. Please run the setup script first.")
      } else {
        setSetupError(null)
      }
    } catch (error) {
      console.error("Error checking setup:", error)
      setSetupError("Unable to check database setup")
    }
  }

  const fetchCachedData = async () => {
    setIsLoading(true)
    try {
      const [trending, mostActive, news, ipo, usage] = await Promise.all([
        getCachedTrendingStocks(),
        getCachedMostActiveStocks(),
        getCachedMarketNews(),
        getCachedIPOData(),
        getAPIUsageStats(),
      ])

      // Check if any tables don't exist
      const anyTablesNotExist =
        trending.tablesNotExist ||
        mostActive.tablesNotExist ||
        news.tablesNotExist ||
        ipo.tablesNotExist ||
        usage.tablesNotExist

      if (anyTablesNotExist) {
        setTablesExist(false)
        setSetupError("Database tables are not set up. Please run the setup script first.")
      } else {
        setTablesExist(true)
        setSetupError(null)
      }

      setMarketData({
        trending,
        mostActive,
        news,
        ipo,
      })
      setApiUsage(usage)
    } catch (error) {
      console.error("Error fetching cached market data:", error)
      setSetupError("Error fetching market data. Please check your database setup.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      const result = await triggerManualRefresh()

      if (result.success) {
        console.log("✅ Manual refresh completed successfully")
        // Wait a moment then refresh the cached data
        setTimeout(() => {
          fetchCachedData()
        }, 3000)
      } else {
        console.error("❌ Manual refresh failed:", result.error || result.message)
      }
    } catch (error) {
      console.error("Error triggering manual refresh:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkSetup()
    fetchCachedData()
    // Refresh cached data every 10 minutes
    const intervalId = setInterval(fetchCachedData, 10 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Unknown"

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getRatingColor = (rating: string | null) => {
    if (!rating) return "bg-gray-500/20 text-gray-400 border-gray-500/30"

    switch (rating.toLowerCase()) {
      case "bullish":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "bearish":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "neutral":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getDataFreshness = (lastUpdated: string | null) => {
    if (!lastUpdated) return { color: "text-red-400", text: "No data" }

    const date = new Date(lastUpdated)
    const now = new Date()
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffHours < 6) return { color: "text-green-400", text: "Fresh" }
    if (diffHours < 24) return { color: "text-yellow-400", text: "Recent" }
    return { color: "text-red-400", text: "Stale" }
  }

  // Show setup error if tables don't exist
  if (tablesExist === false || setupError) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Setup Required
          </CardTitle>
          <CardDescription className="text-gray-400">
            Database tables need to be created before market data can be cached
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              {setupError || "Database tables are not set up. Please run the setup script first."}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Setup Instructions:</h4>
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>
                Run the <code className="bg-gray-800 px-2 py-1 rounded text-xs">create-market-data-tables.sql</code>{" "}
                script
              </li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={checkSetup} className="border-white/10">
              <RefreshCw className="h-3 w-3 mr-1" />
              Check Setup
            </Button>
            <Button variant="outline" size="sm" asChild className="border-white/10">
              <Link href="/admin/market-data">
                <Settings className="h-3 w-3 mr-1" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10">
        <div>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Live Market Data
          </CardTitle>
          <CardDescription className="text-gray-400 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Real-time market insights and analysis
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="border-white/10 text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCachedData}
            disabled={isLoading}
            className="border-white/10"
          >
            <TrendingUp className={`h-4 w-4 ${isLoading ? "animate-pulse" : ""}`} />
            <span className="sr-only">Reload cached data</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="trending">
          <TabsList className="mb-4 bg-white/5 border border-white/10">
            <TabsTrigger value="trending" className="text-xs">
              Trending
              {marketData?.trending.last_updated && (
                <span className={`ml-1 ${getDataFreshness(marketData.trending.last_updated).color}`}>•</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              Most Active
              {marketData?.mostActive.last_updated && (
                <span className={`ml-1 ${getDataFreshness(marketData.mostActive.last_updated).color}`}>•</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs">
              News
              {marketData?.news.last_updated && (
                <span className={`ml-1 ${getDataFreshness(marketData.news.last_updated).color}`}>•</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ipo" className="text-xs">
              IPOs
              {marketData?.ipo.last_updated && (
                <span className={`ml-1 ${getDataFreshness(marketData.ipo.last_updated).color}`}>•</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            {marketData?.trending ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-green-400 flex items-center gap-2">
                    <ArrowUp className="h-4 w-4" />
                    Top Gainers
                  </h3>
                  <span className="text-xs text-gray-500">
                    Updated {formatTimeAgo(marketData.trending.last_updated)}
                  </span>
                </div>
                <div className="space-y-2">
                  {marketData.trending.top_gainers.length > 0 ? (
                    marketData.trending.top_gainers.slice(0, 3).map((stock) => (
                      <div
                        key={stock.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{stock.company_name}</h4>
                            <Badge className={getRatingColor(stock.overall_rating)} variant="outline">
                              {stock.overall_rating || "N/A"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">
                            Vol: {stock.volume ? Number(stock.volume).toLocaleString() : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{stock.price ? Number(stock.price).toLocaleString() : "N/A"}</p>
                          <div className="flex items-center text-green-400 text-sm">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>+{stock.percent_change || 0}%</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No trending stocks data available</p>
                      <p className="text-xs">Try refreshing to load data</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-red-400 flex items-center gap-2">
                    <ArrowDown className="h-4 w-4" />
                    Top Losers
                  </h3>
                </div>
                <div className="space-y-2">
                  {marketData.trending.top_losers.length > 0 ? (
                    marketData.trending.top_losers.slice(0, 3).map((stock) => (
                      <div
                        key={stock.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{stock.company_name}</h4>
                            <Badge className={getRatingColor(stock.overall_rating)} variant="outline">
                              {stock.overall_rating || "N/A"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">
                            Vol: {stock.volume ? Number(stock.volume).toLocaleString() : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{stock.price ? Number(stock.price).toLocaleString() : "N/A"}</p>
                          <div className="flex items-center text-red-400 text-sm">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            <span>{stock.percent_change || 0}%</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No trending stocks data available</p>
                      <p className="text-xs">Try refreshing to load data</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading cached trending stocks...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {marketData?.mostActive ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Most Active Stocks</span>
                  <span className="text-xs text-gray-500">
                    Updated {formatTimeAgo(marketData.mostActive.last_updated)}
                  </span>
                </div>
                {marketData.mostActive.stocks.length > 0 ? (
                  marketData.mostActive.stocks.slice(0, 5).map((stock) => (
                    <div
                      key={stock.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{stock.company}</h4>
                          <Badge className={getRatingColor(stock.overall_rating)} variant="outline">
                            {stock.overall_rating || "N/A"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Vol: {stock.volume ? Number(stock.volume).toLocaleString() : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{stock.price ? Number(stock.price).toLocaleString() : "N/A"}</p>
                        <div
                          className={`flex items-center text-sm ${
                            (stock.percent_change || 0) >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {(stock.percent_change || 0) >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          <span>
                            {(stock.percent_change || 0) >= 0 ? "+" : ""}
                            {(stock.percent_change || 0).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No most active stocks data available</p>
                    <p className="text-xs">Try refreshing to load data</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading cached most active stocks...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news">
            {marketData?.news ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Latest Market News</span>
                  <span className="text-xs text-gray-500">Updated {formatTimeAgo(marketData.news.last_updated)}</span>
                </div>
                {marketData.news.news.length > 0 ? (
                  marketData.news.news.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.image_url || "/placeholder.svg?height=40&width=60"}
                            alt={item.title}
                            width={60}
                            height={40}
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {item.url ? (
                              <Link href={item.url} target="_blank" className="hover:text-purple-400 transition-colors">
                                {item.title}
                              </Link>
                            ) : (
                              item.title
                            )}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{item.summary}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{item.pub_date ? new Date(item.pub_date).toLocaleDateString() : "Unknown date"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No market news available</p>
                    <p className="text-xs">Try refreshing to load data</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading cached market news...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ipo">
            {marketData?.ipo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Upcoming IPOs</span>
                  <span className="text-xs text-gray-500">Updated {formatTimeAgo(marketData.ipo.last_updated)}</span>
                </div>
                {marketData.ipo.ipos.length > 0 ? (
                  marketData.ipo.ipos.slice(0, 5).map((ipo) => (
                    <div key={ipo.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{ipo.name}</h4>
                            {ipo.is_sme && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30"
                              >
                                SME
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{ipo.additional_text}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {ipo.listing_date ? new Date(ipo.listing_date).toLocaleDateString() : "TBA"}
                            </span>
                            <span>
                              ₹{ipo.min_price || "TBA"} - ₹{ipo.max_price || "TBA"}
                            </span>
                          </div>
                        </div>
                        {ipo.document_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={ipo.document_url} target="_blank">
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No IPO data available</p>
                    <p className="text-xs">Try refreshing to load data</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading cached IPO data...</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
