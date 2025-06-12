import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InstrumentFilters } from "@/components/discover/instrument-filters"
import { InstrumentList } from "@/components/discover/instrument-list"
import { MutualFundsList } from "@/components/discover/mutual-funds-list"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Filter, Star, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCachedMutualFunds } from "@/lib/market-data-cache"
import { Input } from "@/components/ui/input"

export default async function DiscoverPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  // Check if filters have been applied
  const hasAppliedFilters = Object.keys(searchParams).length > 0

  // Fetch mutual funds data directly from the database
  const { funds: mutualFunds } = await getCachedMutualFunds()

  const marketHighlights = [
    {
      title: "Top Gainers",
      value: "RELIANCE",
      change: "+5.2%",
      price: "₹2,456",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      isPositive: true,
    },
    {
      title: "Most Active",
      value: "TCS",
      change: "+2.1%",
      price: "₹3,234",
      icon: <BarChart3 className="h-5 w-5 text-finance-purple" />,
      isPositive: true,
    },
    {
      title: "Top Losers",
      value: "HDFC",
      change: "-3.8%",
      price: "₹1,567",
      icon: <TrendingDown className="h-5 w-5 text-red-400" />,
      isPositive: false,
    },
    {
      title: "Market Cap",
      value: "₹2.8L Cr",
      change: "+1.2%",
      price: "Total",
      icon: <DollarSign className="h-5 w-5 text-finance-purple" />,
      isPositive: true,
    },
  ]

  const featuredInstruments = [
    {
      name: "Reliance Industries",
      symbol: "RELIANCE",
      price: "₹2,456.75",
      change: "+5.2%",
      volume: "2.3M",
      rating: 4.5,
      category: "Large Cap",
      isPositive: true,
    },
    {
      name: "Tata Consultancy Services",
      symbol: "TCS",
      price: "₹3,234.20",
      change: "+2.1%",
      volume: "1.8M",
      rating: 4.8,
      category: "Large Cap",
      isPositive: true,
    },
    {
      name: "HDFC Bank",
      symbol: "HDFCBANK",
      price: "₹1,567.30",
      change: "-1.5%",
      volume: "3.1M",
      rating: 4.3,
      category: "Banking",
      isPositive: false,
    },
  ]

  return (
    <div className="container py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient-heading">Discover Investments</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore and analyze investment opportunities with AI-powered insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for stocks, mutual funds, ETFs..."
          className="pl-10 py-6 text-lg glass-card border-white/10 focus:border-purple-500/50 transition-colors"
        />
      </div>

      {/* Market Highlights - Always show */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketHighlights.map((highlight, index) => (
          <Card
            key={index}
            className={`glass-card ${highlight.isPositive ? "glow-green" : "glow-red"} glass-highlight hover-float`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{highlight.title}</p>
                  <p className="text-xl font-bold">{highlight.value}</p>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-medium ${highlight.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                    >
                      {highlight.change}
                    </span>
                    <span className="text-sm text-muted-foreground">{highlight.price}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl glass-card">{highlight.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Filters Sidebar - Only show on the side */}
        <div>
          <Card className="glass-card glow-purple glass-highlight sticky top-20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-lg font-heading">Investment Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <InstrumentFilters />
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="xl:col-span-3 space-y-6">
          {/* Featured Instruments - Primary Card with Purple Glow */}
          <Card className="glass-card glow-purple glass-highlight hover-float">
            <CardHeader>
              <CardTitle className="text-xl text-gradient-heading">Featured Instruments</CardTitle>
              <CardDescription>Top-rated investment opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredInstruments.map((instrument, index) => (
                <div key={index} className="glass-card p-4 rounded-xl hover-float group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl glass-card group-hover:bg-white/20 transition-colors">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{instrument.name}</h3>
                        <p className="text-sm text-muted-foreground">{instrument.symbol}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="glass-card text-xs">{instrument.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground">{instrument.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{instrument.price}</div>
                      <div
                        className={`text-sm font-medium ${instrument.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {instrument.change}
                      </div>
                      <div className="text-xs text-muted-foreground">Vol: {instrument.volume}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Investment Types Tabs */}
          <Tabs defaultValue="stocks" className="w-full">
            <TabsList className="glass-card w-full mb-6">
              <TabsTrigger value="stocks" className="flex-1">
                Stocks
              </TabsTrigger>
              <TabsTrigger value="mutual-funds" className="flex-1">
                Mutual Funds
              </TabsTrigger>
              <TabsTrigger value="etfs" className="flex-1">
                ETFs
              </TabsTrigger>
              <TabsTrigger value="bonds" className="flex-1">
                Bonds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stocks">
              <InstrumentList />
            </TabsContent>

            <TabsContent value="mutual-funds">
              <MutualFundsList funds={mutualFunds} />
            </TabsContent>

            <TabsContent value="etfs">
              <Card className="glass-card glow glow-purple glass-highlight hover-float">
                <CardHeader>
                  <CardTitle className="text-xl text-white">ETFs</CardTitle>
                  <CardDescription className="text-white/60">
                    Exchange-Traded Funds for diversified investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-white/60">
                    <div className="glass-card p-8 rounded-xl">
                      <p className="text-lg mb-2">ETF data coming soon</p>
                      <p className="text-sm">We're working on adding ETF data to our platform.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bonds">
              <Card className="glass-card glow glow-purple glass-highlight hover-float">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Bonds</CardTitle>
                  <CardDescription className="text-white/60">
                    Fixed income securities for stable returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-white/60">
                    <div className="glass-card p-8 rounded-xl">
                      <p className="text-lg mb-2">Bond data coming soon</p>
                      <p className="text-sm">We're working on adding bond data to our platform.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
