"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Database, TrendingUp, Calendar, AlertCircle, CheckCircle, Clock, Activity } from "lucide-react"
import { getAPIUsageStats } from "@/lib/market-data-cache"
import { manualRefreshMarketData } from "@/app/actions/market-data-scheduler"

interface APIUsage {
  total_calls_this_month: number
  calls_by_type: Record<string, number>
  last_refresh_dates: Record<string, string>
}

interface RefreshResult {
  success: boolean
  records?: number
  error?: string | null
}

export default function MarketDataAdminPage() {
  const [apiUsage, setApiUsage] = useState<APIUsage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshStatus, setRefreshStatus] = useState<Record<string, RefreshResult>>({})
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({})

  const dataTypes = [
    { key: "trending", label: "Trending Stocks", icon: TrendingUp },
    { key: "active", label: "Most Active", icon: Activity },
    { key: "news", label: "Market News", icon: Calendar },
    { key: "ipo", label: "IPO Data", icon: Database },
    { key: "mutual_funds", label: "Mutual Funds", icon: RefreshCw },
  ]

  const fetchUsageStats = async () => {
    setIsLoading(true)
    try {
      const stats = await getAPIUsageStats()
      setApiUsage(stats)
    } catch (error) {
      console.error("Error fetching API usage stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async (dataType: string) => {
    setIsRefreshing((prev) => ({ ...prev, [dataType]: true }))

    try {
      const result = await manualRefreshMarketData(dataType)
      setRefreshStatus((prev) => ({
        ...prev,
        [dataType]: {
          success: true,
          records: result.records,
          error: null,
        },
      }))

      // Refresh usage stats after successful update
      setTimeout(fetchUsageStats, 1000)
    } catch (error) {
      setRefreshStatus((prev) => ({
        ...prev,
        [dataType]: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    } finally {
      setIsRefreshing((prev) => ({ ...prev, [dataType]: false }))
    }
  }

  const handleRefreshAll = async () => {
    const allTypes = dataTypes.map((dt) => dt.key)

    // Set all as refreshing
    const refreshingState = allTypes.reduce((acc, type) => ({ ...acc, [type]: true }), {})
    setIsRefreshing(refreshingState)

    try {
      const result = await manualRefreshMarketData()

      // Update status for all types
      const statusUpdate = Object.entries(result).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            success: value.success,
            records: value.records,
            error: value.error,
          },
        }),
        {},
      )

      setRefreshStatus(statusUpdate)

      // Refresh usage stats
      setTimeout(fetchUsageStats, 1000)
    } catch (error) {
      console.error("Error refreshing all data:", error)
    } finally {
      // Clear all refreshing states
      setIsRefreshing({})
    }
  }

  const formatTimeAgo = (dateString: string) => {
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

  const getUsageColor = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100
    if (percentage < 50) return "text-green-400"
    if (percentage < 80) return "text-yellow-400"
    return "text-red-400"
  }

  useEffect(() => {
    fetchUsageStats()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Data Administration</h1>
          <p className="text-gray-400 mt-2">Manage API usage and refresh market data cache</p>
        </div>
        <Button onClick={handleRefreshAll} disabled={Object.values(isRefreshing).some(Boolean)} size="lg">
          <RefreshCw className={`h-4 w-4 mr-2 ${Object.values(isRefreshing).some(Boolean) ? "animate-spin" : ""}`} />
          Refresh All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Usage Overview */}
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-400" />
              API Usage
            </CardTitle>
            <CardDescription>Monthly quota tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {apiUsage ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Calls</span>
                    <span className={`text-sm font-bold ${getUsageColor(apiUsage.total_calls_this_month, 500)}`}>
                      {apiUsage.total_calls_this_month}/500
                    </span>
                  </div>
                  <Progress value={(apiUsage.total_calls_this_month / 500) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Calls by Type</h4>
                  {Object.entries(apiUsage.calls_by_type).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{type.replace("_", " ")}</span>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 bg-gray-700 rounded"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Freshness */}
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Data Freshness
            </CardTitle>
            <CardDescription>Last refresh timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            {apiUsage ? (
              <div className="space-y-3">
                {dataTypes.map(({ key, label, icon: Icon }) => {
                  const lastRefresh = apiUsage.last_refresh_dates[key]
                  const status = refreshStatus[key]

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {status?.success === true && <CheckCircle className="h-3 w-3 text-green-400" />}
                        {status?.success === false && <AlertCircle className="h-3 w-3 text-red-400" />}
                        <span className="text-xs text-gray-400">
                          {lastRefresh ? formatTimeAgo(lastRefresh) : "Never"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-400" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manual data refresh controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataTypes.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefresh(key)}
                  disabled={isRefreshing[key]}
                  className="w-full justify-start border-white/10"
                >
                  <Icon className={`h-4 w-4 mr-2 ${isRefreshing[key] ? "animate-spin" : ""}`} />
                  {isRefreshing[key] ? "Refreshing..." : `Refresh ${label}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status */}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle>Refresh Status Details</CardTitle>
          <CardDescription>Detailed information about recent refresh operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataTypes.map(({ key, label, icon: Icon }) => {
              const status = refreshStatus[key]
              const isCurrentlyRefreshing = isRefreshing[key]

              return (
                <div key={key} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-sm">{label}</span>
                  </div>

                  {isCurrentlyRefreshing ? (
                    <div className="flex items-center gap-2 text-blue-400">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span className="text-xs">Refreshing...</span>
                    </div>
                  ) : status ? (
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${status.success ? "text-green-400" : "text-red-400"}`}>
                        {status.success ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        <span className="text-xs">{status.success ? "Success" : "Failed"}</span>
                      </div>

                      {status.success && status.records && (
                        <p className="text-xs text-gray-400">{status.records} records updated</p>
                      )}

                      {!status.success && status.error && (
                        <p className="text-xs text-red-400 break-words">{status.error}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No recent activity</span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
