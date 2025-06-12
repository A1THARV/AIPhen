"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchMarketData } from "@/app/actions/market-data"
import type { MarketData } from "@/types/financial"
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MarketOverview() {
  const [marketData, setMarketData] = useState<Record<string, MarketData | null>>({
    NIFTY_50: null,
    SENSEX: null,
    RELIANCE: null,
    TCS: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const results = await Promise.all([
          fetchMarketData("NIFTY_50:INDEXNSE"),
          fetchMarketData("SENSEX:INDEXBOM"),
          fetchMarketData("RELIANCE:NSE"),
          fetchMarketData("TCS:NSE"),
        ])

        setMarketData({
          NIFTY_50: results[0],
          SENSEX: results[1],
          RELIANCE: results[2],
          TCS: results[3],
        })
      } catch (error) {
        console.error("Error fetching market data:", error)
        // Use mock data for demo purposes
        setMarketData({
          NIFTY_50: {
            symbol: "NIFTY_50",
            price: 23350.4,
            change: 159.75,
            changePercent: 0.6888552,
            volume: 0,
            timestamp: new Date().toISOString(),
          },
          SENSEX: {
            symbol: "SENSEX",
            price: 76905.51,
            change: 557.4453,
            changePercent: 0.7301368,
            volume: 0,
            timestamp: new Date().toISOString(),
          },
          RELIANCE: {
            symbol: "RELIANCE",
            price: 2950.75,
            change: 35.25,
            changePercent: 1.21,
            volume: 3245678,
            timestamp: new Date().toISOString(),
          },
          TCS: {
            symbol: "TCS",
            price: 3875.45,
            change: -12.3,
            changePercent: -0.32,
            volume: 1234567,
            timestamp: new Date().toISOString(),
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Market Overview</CardTitle>
          <CardDescription>Latest market trends and indices</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/education">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Charts
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indices">
          <TabsList className="mb-4">
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
          </TabsList>
          <TabsContent value="indices">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["NIFTY_50", "SENSEX"].map((symbol) => {
                const data = marketData[symbol]
                return (
                  <div key={symbol} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{symbol.replace("_", " ")}</h3>
                        <p className="text-2xl font-bold">{isLoading ? "—" : data?.price.toLocaleString("en-IN")}</p>
                      </div>
                      {!isLoading && data && (
                        <div
                          className={`flex items-center ${data.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {data.changePercent >= 0 ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-medium">{data.changePercent.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isLoading ? "Loading..." : `Last updated: ${new Date(data?.timestamp || "").toLocaleString()}`}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary" asChild>
                      <Link href={`/education?symbol=${symbol}:INDEXNSE`}>View Chart</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
          <TabsContent value="stocks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["RELIANCE", "TCS"].map((symbol) => {
                const data = marketData[symbol]
                return (
                  <div key={symbol} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{symbol}</h3>
                        <p className="text-2xl font-bold">₹{isLoading ? "—" : data?.price.toLocaleString("en-IN")}</p>
                      </div>
                      {!isLoading && data && (
                        <div
                          className={`flex items-center ${data.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {data.changePercent >= 0 ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-medium">{data.changePercent.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{isLoading ? "Loading..." : `Vol: ${data?.volume.toLocaleString("en-IN")}`}</span>
                      <span>{isLoading ? "" : `Change: ₹${data?.change.toFixed(2)}`}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary" asChild>
                      <Link href={`/education?symbol=NSE:${symbol}`}>View Chart</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
