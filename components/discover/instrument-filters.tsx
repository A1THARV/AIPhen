"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, SlidersHorizontal, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const stockFormSchema = z.object({
  type: z.string().optional(),
  risk_level: z.string().optional(),
  min_investment: z.string().optional(),
  max_investment: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
})

const mutualFundFormSchema = z.object({
  fund_type: z.string().optional(),
  min_rating: z.string().optional(),
  min_return: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
})

export function InstrumentFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("filterType") || "stocks"

  const stockForm = useForm<z.infer<typeof stockFormSchema>>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      type: searchParams.get("type") || "",
      risk_level: searchParams.get("risk") || "",
      min_investment: searchParams.get("min") || "",
      max_investment: searchParams.get("max") || "",
      sort: searchParams.get("sort") || "name:asc",
      search: searchParams.get("search") || "",
    },
  })

  const mutualFundForm = useForm<z.infer<typeof mutualFundFormSchema>>({
    resolver: zodResolver(mutualFundFormSchema),
    defaultValues: {
      fund_type: searchParams.get("fund_type") || "",
      min_rating: searchParams.get("min_rating") || "",
      min_return: searchParams.get("min_return") || "",
      sort: searchParams.get("mf_sort") || "name:asc",
      search: searchParams.get("search") || "",
    },
  })

  function onSubmitStocks(values: z.infer<typeof stockFormSchema>) {
    const params = new URLSearchParams()
    params.set("filterType", "stocks")

    if (values.type) params.set("type", values.type)
    if (values.risk_level) params.set("risk", values.risk_level)
    if (values.min_investment) params.set("min", values.min_investment)
    if (values.max_investment) params.set("max", values.max_investment)
    if (values.sort) params.set("sort", values.sort)
    if (values.search) params.set("search", values.search)

    router.push(`/discover?${params.toString()}`)
  }

  function onSubmitMutualFunds(values: z.infer<typeof mutualFundFormSchema>) {
    const params = new URLSearchParams()
    params.set("filterType", "mutual-funds")

    if (values.fund_type) params.set("fund_type", values.fund_type)
    if (values.min_rating) params.set("min_rating", values.min_rating)
    if (values.min_return) params.set("min_return", values.min_return)
    if (values.sort) params.set("mf_sort", values.sort)
    if (values.search) params.set("search", values.search)

    router.push(`/discover?${params.toString()}`)
  }

  function resetFilters(type: string) {
    if (type === "stocks") {
      stockForm.reset({
        type: "",
        risk_level: "",
        min_investment: "",
        max_investment: "",
        sort: "name:asc",
        search: "",
      })
      router.push("/discover")
    } else {
      mutualFundForm.reset({
        fund_type: "",
        min_rating: "",
        min_return: "",
        sort: "name:asc",
        search: "",
      })
      router.push("/discover")
    }
  }

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("filterType", value)
    router.push(`/discover?${params.toString()}`)
  }

  return (
    <Card className={`glass-card ${Object.keys(searchParams).length === 0 ? "glow-purple" : ""}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-lg font-heading">Investment Filters</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="glass-card w-full mb-6">
            <TabsTrigger value="stocks" className="flex-1">
              Stocks
            </TabsTrigger>
            <TabsTrigger value="mutual-funds" className="flex-1">
              Mutual Funds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stocks">
            <Form {...stockForm}>
              <form onSubmit={stockForm.handleSubmit(onSubmitStocks)} className="space-y-5">
                {/* Search field */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stocks by name or symbol..."
                    className="pl-10 glass-card border-white/10"
                    {...stockForm.register("search")}
                  />
                </div>

                <FormField
                  control={stockForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Instrument Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="stock">Stocks</SelectItem>
                          <SelectItem value="etf">ETFs</SelectItem>
                          <SelectItem value="bond">Bonds</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={stockForm.control}
                  name="risk_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Risk Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Any Risk Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="any">Any Risk Level</SelectItem>
                          <SelectItem value="very_low">Very Low</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="medium-high">Medium-High</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={stockForm.control}
                    name="min_investment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Min Investment (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stockForm.control}
                    name="max_investment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Max Investment (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Any" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={stockForm.control}
                  name="sort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Sort By</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Sort by Name (A-Z)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="name:asc">Name (A-Z)</SelectItem>
                          <SelectItem value="name:desc">Name (Z-A)</SelectItem>
                          <SelectItem value="min_investment:asc">Min Investment (Low to High)</SelectItem>
                          <SelectItem value="min_investment:desc">Min Investment (High to Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/10 hover:bg-white/10"
                    onClick={() => resetFilters("stocks")}
                  >
                    Reset Filters
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="mutual-funds">
            <Form {...mutualFundForm}>
              <form onSubmit={mutualFundForm.handleSubmit(onSubmitMutualFunds)} className="space-y-5">
                {/* Search field */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search mutual funds by name..."
                    className="pl-10 glass-card border-white/10"
                    {...mutualFundForm.register("search")}
                  />
                </div>

                <FormField
                  control={mutualFundForm.control}
                  name="fund_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Fund Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="All Fund Types" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="all">All Fund Types</SelectItem>
                          <SelectItem value="equity_large">Equity - Large Cap</SelectItem>
                          <SelectItem value="equity_mid">Equity - Mid Cap</SelectItem>
                          <SelectItem value="equity_small">Equity - Small Cap</SelectItem>
                          <SelectItem value="hybrid">Hybrid Funds</SelectItem>
                          <SelectItem value="debt">Debt Funds</SelectItem>
                          <SelectItem value="index">Index Funds</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={mutualFundForm.control}
                  name="min_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Minimum Rating</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Any Rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="any">Any Rating</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="2">2+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={mutualFundForm.control}
                  name="min_return"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Minimum 1-Year Return (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Any" {...field} className="bg-white/5 border-white/10" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={mutualFundForm.control}
                  name="sort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Sort By</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Sort by Name (A-Z)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-white/10">
                          <SelectItem value="name:asc">Name (A-Z)</SelectItem>
                          <SelectItem value="name:desc">Name (Z-A)</SelectItem>
                          <SelectItem value="nav:asc">NAV (Low to High)</SelectItem>
                          <SelectItem value="nav:desc">NAV (High to Low)</SelectItem>
                          <SelectItem value="return:desc">Return (High to Low)</SelectItem>
                          <SelectItem value="rating:desc">Rating (High to Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/10 hover:bg-white/10"
                    onClick={() => resetFilters("mutual-funds")}
                  >
                    Reset Filters
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
