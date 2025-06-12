import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Eye, Plus } from "lucide-react"

interface WatchlistItem {
  id: string
  user_id: string
  instrument_id: string
  created_at: string
  financial_instruments: {
    id: string
    symbol: string
    name: string
    type: string
  }
}

interface WatchlistOverviewProps {
  watchlist: WatchlistItem[]
}

export function WatchlistOverview({ watchlist }: WatchlistOverviewProps) {
  // Mock price data for demo
  const getPriceData = (symbol: string) => {
    const mockData: Record<string, { price: number; change: number; changePercent: number }> = {
      RELIANCE: { price: 2950.75, change: 35.25, changePercent: 1.21 },
      TCS: { price: 3875.45, change: -12.3, changePercent: -0.32 },
      HDFCBANK: { price: 1675.2, change: 22.45, changePercent: 1.36 },
      INFY: { price: 1520.8, change: -5.75, changePercent: -0.38 },
      HINDUNILVR: { price: 2450.6, change: 15.3, changePercent: 0.63 },
    }

    return mockData[symbol] || { price: 1000, change: 10, changePercent: 1.0 }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-400" />
          <div>
            <CardTitle className="text-lg font-heading">Watchlist</CardTitle>
            <CardDescription className="text-gray-400">Track your favorite investments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {watchlist.length > 0 ? (
          <div className="space-y-3">
            {watchlist.map((item) => {
              const { symbol, name } = item.financial_instruments
              const { price, changePercent } = getPriceData(symbol)

              return (
                <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div>
                    <div className="font-medium">{symbol}</div>
                    <div className="text-xs text-gray-400">{name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{price.toLocaleString("en-IN")}</div>
                    <div
                      className={`text-xs flex items-center justify-end ${changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {changePercent >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p>Your watchlist is empty</p>
            <p className="text-sm">Add instruments to track them here</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" asChild>
          <Link href="/discover">
            <Plus className="mr-2 h-4 w-4" />
            Add to Watchlist
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
