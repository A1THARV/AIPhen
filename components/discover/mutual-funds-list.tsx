"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Info, TrendingUp, TrendingDown, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { CachedMutualFund } from "@/lib/market-data-cache"

interface MutualFundsListProps {
  funds: CachedMutualFund[]
}

export function MutualFundsList({ funds }: MutualFundsListProps) {
  const [selectedFund, setSelectedFund] = useState<CachedMutualFund | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getRatingStars = (rating: string | null) => {
    if (!rating) return null

    const numRating = Number.parseFloat(rating)
    if (isNaN(numRating)) return null

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < numRating ? "text-yellow-400 fill-current" : "text-gray-400"}`} />
        ))}
      </div>
    )
  }

  const getFundTypeColor = (type: string | null) => {
    if (!type) return "bg-gray-500/20 text-gray-300 border-gray-500/30"

    const lowerType = type.toLowerCase()
    if (lowerType.includes("equity")) {
      if (lowerType.includes("large")) return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      if (lowerType.includes("mid")) return "bg-green-500/20 text-green-300 border-green-500/30"
      if (lowerType.includes("small")) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }

    if (lowerType.includes("debt") || lowerType.includes("bond")) {
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }

    if (lowerType.includes("hybrid")) {
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    }

    return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
  }

  if (funds.length === 0) {
    return (
      <Card className="glass-card glow glow-purple glass-highlight hover-float">
        <CardHeader>
          <CardTitle className="text-xl text-white">Mutual Funds</CardTitle>
          <CardDescription className="text-white/60">
            Explore top-performing mutual funds for your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/60">
            <div className="glass-card p-8 rounded-xl">
              <p className="text-lg mb-2">No mutual funds found</p>
              <p className="text-sm">Check back later for updates.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card glow glow-purple glass-highlight hover-float">
      <CardHeader>
        <CardTitle className="text-xl text-white">Mutual Funds</CardTitle>
        <CardDescription className="text-white/60">
          Explore top-performing mutual funds for your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className="glass-card p-4 rounded-xl transition-all duration-300 hover:bg-white/20 group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white text-lg">{fund.fund_name}</h3>
                    <Badge className={getFundTypeColor(fund.fund_type)}>{fund.fund_type || "Mixed"}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-white/80">NAV: ₹{fund.nav?.toFixed(2) || "N/A"}</p>
                    {fund.change_percent !== null && (
                      <span
                        className={`text-sm font-medium flex items-center ${
                          (fund.change_percent || 0) >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {(fund.change_percent || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(fund.change_percent || 0).toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">{getRatingStars(fund.rating)}</div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="glass-card hover-glow"
                        onClick={() => setSelectedFund(fund)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">{selectedFund?.fund_name}</DialogTitle>
                        <DialogDescription className="text-white/60">
                          {selectedFund?.fund_type || "Mutual Fund"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-white">NAV</h4>
                            <p className="text-sm text-white/60 mt-1">₹{selectedFund?.nav?.toFixed(2) || "N/A"}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Change</h4>
                            <p
                              className={`text-sm mt-1 ${
                                (selectedFund?.change_percent || 0) >= 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {(selectedFund?.change_percent || 0) >= 0 ? "+" : ""}
                              {selectedFund?.change_percent?.toFixed(2) || 0}%
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Fund Type</h4>
                          <Badge className={getFundTypeColor(selectedFund?.fund_type)}>
                            {selectedFund?.fund_type || "Mixed"}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Rating</h4>
                          <div className="mt-1">{getRatingStars(selectedFund?.rating)}</div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    className={`glass-card hover-glow ${
                      watchlist.includes(fund.id)
                        ? "text-red-400 border-red-500/30"
                        : "text-green-400 border-green-500/30"
                    }`}
                    onClick={() => toggleWatchlist(fund.id)}
                  >
                    {watchlist.includes(fund.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {watchlist.includes(fund.id) ? "Remove from watchlist" : "Add to watchlist"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
