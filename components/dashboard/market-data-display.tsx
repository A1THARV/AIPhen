"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchIndianMarketData } from "@/app/actions/market-data-gemini"
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StockData {
  symbol: string
  name: string
  price: string
  change: string
  percentChange: string
}

interface MarketNews {
  title: string
  source: string
  date: string
  url?: string
}

interface MarketDataResponse {
  stocks: StockData[]
  news: MarketNews[]
  marketSummary: string
  timestamp: string
}

export function MarketDataDisplay() {
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchIndianMarketData()
      setMarketData(data)
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

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10">
        <div>
          <CardTitle className="text-lg font-heading">Indian Market Overview</CardTitle>
          <CardDescription className="text-gray-400">
            {lastUpdated ? `Last updated ${formatTimeAgo(lastUpdated)}` : "Fetching market data..."}
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading} className="border-white/10">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh data</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="stocks">
          <TabsList className="mb-4 bg-white/5 border border-white/10">
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="news">Market News</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="stocks">
            {marketData ? (
              <div className="space-y-2">
                {marketData.stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{stock.symbol}</h3>
                        <span className="text-xs text-gray-400">{stock.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">₹{stock.price}</span>
                      <div
                        className={`flex items-center ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {stock.change.startsWith("+") ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {stock.change} ({stock.percentChange})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading market data...</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news">
            {marketData ? (
              <div className="space-y-2">
                {marketData.news.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="font-medium mb-1">
                      {item.url ? (
                        <Link href={item.url} target="_blank" className="hover:text-purple-400 transition-colors">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.date}</span>
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

          <TabsContent value="summary">
            {marketData ? (
              <div className="p-4 rounded-lg bg-white/5">
                <p className="leading-relaxed">{marketData.marketSummary}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-gray-400">Loading market summary...</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
