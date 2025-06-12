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
import type { FinancialInstrument } from "@/types/financial"

interface InstrumentListProps {
  instruments?: FinancialInstrument[]
  userId?: string
  watchlistIds?: string[]
}

export function InstrumentList({ instruments = [], userId = "", watchlistIds = [] }: InstrumentListProps) {
  const [selectedInstrument, setSelectedInstrument] = useState<FinancialInstrument | null>(null)
  const [localWatchlist, setLocalWatchlist] = useState<string[]>(watchlistIds || [])
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  // Mock data for demonstration
  const mockInstruments: FinancialInstrument[] = [
    {
      id: "1",
      name: "Reliance Industries Ltd",
      symbol: "RELIANCE",
      type: "stock",
      description:
        "India's largest private sector company with interests in petrochemicals, oil & gas, telecommunications and retail.",
      risk_level: "medium",
      min_investment: 2500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "SBI Bluechip Fund",
      symbol: "SBIBCF",
      type: "mutual_fund",
      description: "A large cap equity mutual fund that invests in blue chip companies.",
      risk_level: "medium",
      min_investment: 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Nifty 50 ETF",
      symbol: "NIFTY50",
      type: "etf",
      description: "Exchange traded fund that tracks the Nifty 50 index.",
      risk_level: "low",
      min_investment: 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Government Bond 2030",
      symbol: "GB2030",
      type: "bond",
      description: "Government of India bond with 7.5% coupon rate maturing in 2030.",
      risk_level: "very_low",
      min_investment: 10000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const displayInstruments = instruments.length > 0 ? instruments : mockInstruments

  const handleAddToWatchlist = async (instrumentId: string) => {
    if (!userId) {
      console.log("Please log in to add instruments to your watchlist")
      return
    }

    setIsLoading((prev) => ({ ...prev, [instrumentId]: true }))

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLocalWatchlist((prev) => [...prev, instrumentId])
      console.log("Added to watchlist")
    } catch (error) {
      console.error("Error adding to watchlist:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [instrumentId]: false }))
    }
  }

  const handleRemoveFromWatchlist = async (instrumentId: string) => {
    if (!userId) return

    setIsLoading((prev) => ({ ...prev, [instrumentId]: true }))

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLocalWatchlist((prev) => prev.filter((id) => id !== instrumentId))
      console.log("Removed from watchlist")
    } catch (error) {
      console.error("Error removing from watchlist:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [instrumentId]: false }))
    }
  }

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case "very_low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "medium-high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
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
    <Card className="glass-card glow glow-purple glass-highlight hover-float">
      <CardHeader>
        <CardTitle className="text-xl text-white">Investment Products</CardTitle>
        <CardDescription className="text-white/60">
          {displayInstruments.length} products found matching your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayInstruments.length > 0 ? (
          <div className="space-y-4">
            {displayInstruments.map((instrument) => (
              <div
                key={instrument.id}
                className="glass-card p-4 rounded-xl transition-all duration-300 hover:bg-white/20 group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{instrument.name}</h3>
                      <Badge className="bg-white/10 text-white border-white/20">{getTypeLabel(instrument.type)}</Badge>
                      <Badge className={getRiskColor(instrument.risk_level)}>
                        {instrument.risk_level?.replace("_", " ") || "Unknown Risk"}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-1">Symbol: {instrument.symbol}</p>
                    <p className="text-sm text-white/80">
                      Min Investment: ₹{instrument.min_investment?.toLocaleString("en-IN") || "N/A"}
                    </p>
                    {instrument.description && (
                      <p className="text-sm text-white/60 mt-2 line-clamp-2">{instrument.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="glass-card hover-glow"
                          onClick={() => setSelectedInstrument(instrument)}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">{selectedInstrument?.name}</DialogTitle>
                          <DialogDescription className="text-white/60">
                            {getTypeLabel(selectedInstrument?.type || "")} - {selectedInstrument?.symbol}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <h4 className="font-medium text-white">Description</h4>
                            <p className="text-sm text-white/60 mt-1">
                              {selectedInstrument?.description || "No description available."}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-white">Risk Level</h4>
                              <Badge className={getRiskColor(selectedInstrument?.risk_level || null)}>
                                {selectedInstrument?.risk_level?.replace("_", " ") || "Unknown Risk"}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium text-white">Minimum Investment</h4>
                              <p className="text-sm text-white/60 mt-1">
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
                        className="glass-card hover-glow text-red-400 border-red-500/30"
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
                        className="glass-card hover-glow text-green-400 border-green-500/30"
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
          <div className="text-center py-12 text-white/60">
            <div className="glass-card p-8 rounded-xl">
              <p className="text-lg mb-2">No investment products found</p>
              <p className="text-sm">Try adjusting your filters or search criteria.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
