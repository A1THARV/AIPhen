"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchMarketOverview, fetchIPOData } from "@/app/actions/indian-market-data"
import { ArrowDown, ArrowUp, RefreshCw, ExternalLink, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface MarketOverviewData {
  trending: {
    trending_stocks: {
      top_gainers: Array<{
        company_name: string
        price: string
        percent_change: string
        net_change: string
        volume: string
        overall_rating: string
      }>
      top_losers: Array<{
        company_name: string
        price: string
        percent_change: string
        net_change: string
        volume: string
        overall_rating: string
      }>
    }
  }
  mostActive: Array<{
    company: string
    price: number
    percent_change: number
    net_change: number
    volume: number
    overall_rating: string
  }>
  news: Array<{
    title: string
    summary: string
    url: string
    image_url: string
    source: string
    pub_date: string
  }>
  timestamp: string
}

export function IndianMarketOverview() {
  const [marketData, setMarketData] = useState<MarketOverviewData | null>(null)
  const [ipoData, setIpoData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [overview, ipo] = await Promise.all([fetchMarketOverview(), fetchIPOData()])
      setMarketData(overview)
      setIpoData(ipo)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching market data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  const getRatingColor = (rating: string) => {
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

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10">
        <div>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Live Market Data
          </CardTitle>
          <CardDescription className="text-gray-400">
            {lastUpdated ? `Last updated ${formatTimeAgo(lastUpdated)}` : "Fetching real-time data..."}
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading} className="border-white/10">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh data</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="trending">
          <TabsList className="mb-4 bg-white/5 border border-white/10">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="active">Most Active</TabsTrigger>
            <TabsTrigger value="news">Market News</TabsTrigger>
            <TabsTrigger value="ipo">IPOs</TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            {marketData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                    <ArrowUp className="h-4 w-4" />
                    Top Gainers
                  </h3>
                  <div className="space-y-2">
                    {marketData.trending.trending_stocks.top_gainers.slice(0, 3).map((stock, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{stock.company_name}</h4>
                            <Badge className={getRatingColor(stock.overall_rating)} variant="outline">
                              {stock.overall_rating}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">Vol: {Number.parseInt(stock.volume).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{Number.parseFloat(stock.price).toLocaleString()}</p>
                          <div className="flex items-center text-green-400 text-sm">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>+{stock.percent_change}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                    <ArrowDown className="h-4 w-4" />
                    Top Losers
                  </h3>
                  <div className="space-y-2">
                    {marketData.trending.trending_stocks.top_losers.slice(0, 3).map((stock, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{stock.company_name}</h4>
                            <Badge className={getRatingColor(stock.overall_rating)} variant="outline">
                              {stock.overall_rating}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">Vol: {Number.parseInt(stock.volume).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{Number.parseFloat(stock.price).toLocaleString()}</p>
                          <div className="flex items-center text-red-400 text-sm">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            <span>{stock.percent_change}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading trending stocks...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {marketData ? (
              <div className="space-y-2">
                {marketData.mostActive.slice(0, 5).map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{stock.company}</h4>
                        <Badge className={getRatingColor(stock.overall_rating)} variant="outline">
                          {stock.overall_rating}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">Vol: {stock.volume.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{stock.price.toLocaleString()}</p>
                      <div
                        className={`flex items-center text-sm ${
                          stock.percent_change >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {stock.percent_change >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        <span>
                          {stock.percent_change >= 0 ? "+" : ""}
                          {stock.percent_change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading most active stocks...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news">
            {marketData ? (
              <div className="space-y-3">
                {marketData.news.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          width={60}
                          height={40}
                          className="rounded object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                          <Link href={item.url} target="_blank" className="hover:text-purple-400 transition-colors">
                            {item.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">{item.summary}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{new Date(item.pub_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading market news...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ipo">
            {ipoData ? (
              <div className="space-y-3">
                {ipoData.upcoming.slice(0, 5).map((ipo: any, index: number) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
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
                            {new Date(ipo.listing_date).toLocaleDateString()}
                          </span>
                          <span>
                            ₹{ipo.min_price} - ₹{ipo.max_price}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={ipo.document_url} target="_blank">
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading IPO data...</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
