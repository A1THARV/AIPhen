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
import { Filter, SlidersHorizontal } from "lucide-react"

const formSchema = z.object({
  type: z.string().optional(),
  risk_level: z.string().optional(),
  min_investment: z.string().optional(),
  max_investment: z.string().optional(),
  sort: z.string().optional(),
})

export function InstrumentFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: searchParams.get("type") || "",
      risk_level: searchParams.get("risk") || "",
      min_investment: searchParams.get("min") || "",
      max_investment: searchParams.get("max") || "",
      sort: searchParams.get("sort") || "name:asc",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (values.type) params.set("type", values.type)
    if (values.risk_level) params.set("risk", values.risk_level)
    if (values.min_investment) params.set("min", values.min_investment)
    if (values.max_investment) params.set("max", values.max_investment)
    if (values.sort) params.set("sort", values.sort)

    router.push(`/discover?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      type: "",
      risk_level: "",
      min_investment: "",
      max_investment: "",
      sort: "name:asc",
    })
    router.push("/discover")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrument Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="stock">Stocks</SelectItem>
                      <SelectItem value="mutual_fund">Mutual Funds</SelectItem>
                      <SelectItem value="etf">ETFs</SelectItem>
                      <SelectItem value="bond">Bonds</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="risk_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Risk Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                control={form.control}
                name="min_investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Investment (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Investment (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Any" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort By</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by Name (A-Z)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              <Button type="submit" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

