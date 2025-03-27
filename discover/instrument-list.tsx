"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addInstrumentToWatchlist, removeInstrumentFromWatchlist } from "@/app/actions/watchlist"
import type { FinancialInstrument } from "@/types/financial"
import { toast } from "@/hooks/use-toast"

interface InstrumentListProps {
  instruments: FinancialInstrument[]
  userId: string
  watchlistIds: string[]
}

export function InstrumentList({ instruments, userId, watchlistIds }: InstrumentListProps) {
  const [selectedInstrument, setSelectedInstrument] = useState<FinancialInstrument | null>(null)
  const [localWatchlist, setLocalWatchlist] = useState<string[]>(watchlistIds)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const handleAddToWatchlist = async (instrumentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to add instruments to your watchlist",
        variant: "destructive",
      })
      return
    }

    setIsLoading((prev) => ({ ...prev, [instrumentId]: true }))

    try {
      await addInstrumentToWatchlist(userId, instrumentId)
      setLocalWatchlist((prev) => [...prev, instrumentId])
      toast({
        title: "Added to watchlist",
        description: "The instrument has been added to your watchlist",
      })
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to add instrument to watchlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [instrumentId]: false }))
    }
  }

  const handleRemoveFromWatchlist = async (instrumentId: string) => {
    if (!userId) return

    setIsLoading((prev) => ({ ...prev, [instrumentId]: true }))

    try {
      await removeInstrumentFromWatchlist(userId, instrumentId)
      setLocalWatchlist((prev) => prev.filter((id) => id !== instrumentId))
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Products</CardTitle>
        <CardDescription>{instruments.length} products found matching your criteria</CardDescription>
      </CardHeader>
      <CardContent>
        {instruments.length > 0 ? (
          <div className="space-y-4">
            {instruments.map((instrument) => (
              <div key={instrument.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{instrument.name}</h3>
                      <Badge variant="outline">{getTypeLabel(instrument.type)}</Badge>
                      <Badge className={getRiskColor(instrument.risk_level)}>
                        {instrument.risk_level?.replace("_", " ") || "Unknown Risk"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Symbol: {instrument.symbol}</p>
                    <p className="text-sm mt-2">
                      Min Investment: ₹{instrument.min_investment?.toLocaleString("en-IN") || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setSelectedInstrument(instrument)}>
                          <Info className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{selectedInstrument?.name}</DialogTitle>
                          <DialogDescription>
                            {getTypeLabel(selectedInstrument?.type || "")} - {selectedInstrument?.symbol}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <h4 className="font-medium">Description</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedInstrument?.description || "No description available."}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium">Risk Level</h4>
                              <Badge className={getRiskColor(selectedInstrument?.risk_level || null)}>
                                {selectedInstrument?.risk_level?.replace("_", " ") || "Unknown Risk"}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium">Minimum Investment</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                ₹{selectedInstrument?.min_investment?.toLocaleString("en-IN") || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {localWatchlist.includes(instrument.id) ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveFromWatchlist(instrument.id)}
                        disabled={isLoading[instrument.id]}
                      >
                        <EyeOff className="h-4 w-4" />
                        <span className="sr-only">Remove from watchlist</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToWatchlist(instrument.id)}
                        disabled={isLoading[instrument.id]}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Add to watchlist</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No investment products found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

