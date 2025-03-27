"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EyeOff } from "lucide-react"
import { removeInstrumentFromWatchlist } from "@/app/actions/watchlist"
import { toast } from "@/hooks/use-toast"

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
    risk_level: string | null
    min_investment: number | null
  }
}

interface WatchlistTableProps {
  watchlist: WatchlistItem[]
  userId: string
}

export function WatchlistTable({ watchlist, userId }: WatchlistTableProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [localWatchlist, setLocalWatchlist] = useState<WatchlistItem[]>(watchlist)

  const handleRemoveFromWatchlist = async (instrumentId: string) => {
    if (!userId) return

    setIsLoading((prev) => ({ ...prev, [instrumentId]: true }))

    try {
      await removeInstrumentFromWatchlist(userId, instrumentId)
      setLocalWatchlist((prev) => prev.filter((item) => item.instrument_id !== instrumentId))
      toast({
        title: "Removed from watchlist",
        description: "The instrument has been removed from your watchlist",
      })
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove instrument from watchlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [instrumentId]: false }))
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stock":
        return "Stock"
      case "mutual_fund":
        return "Mutual Fund"
      case "etf":
        return "ETF"
      case "bond":
        return "Bond"
      default:
        return type
    }
  }

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case "very_low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "medium-high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div>
      {localWatchlist.length > 0 ? (
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Risk Level</th>
                <th className="p-3 text-right">Min Investment</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localWatchlist.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.financial_instruments.name}</td>
                  <td className="p-3">{item.financial_instruments.symbol}</td>
                  <td className="p-3">
                    <Badge variant="outline">{getTypeLabel(item.financial_instruments.type)}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getRiskColor(item.financial_instruments.risk_level)}>
                      {item.financial_instruments.risk_level?.replace("_", " ") || "Unknown"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    ₹{item.financial_instruments.min_investment?.toLocaleString("en-IN") || "N/A"}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromWatchlist(item.instrument_id)}
                      disabled={isLoading[item.instrument_id]}
                    >
                      <EyeOff className="h-4 w-4" />
                      <span className="sr-only">Remove from watchlist</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Your watchlist is empty</p>
          <p className="text-sm mt-2">Add instruments from the Discover page to track them here</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/discover">Browse Instruments</a>
          </Button>
        </div>
      )}
    </div>
  )
}

