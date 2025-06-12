"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Calculator, Download, Info } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SIPCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [timePeriod, setTimePeriod] = useState(10)
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [estimatedReturns, setEstimatedReturns] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [chartData, setChartData] = useState<{ investment: number; returns: number }[]>([])

  // Calculate SIP returns
  useEffect(() => {
    const calculateSIP = () => {
      const monthlyRate = expectedReturn / 12 / 100
      const months = timePeriod * 12
      const totalInvestmentAmount = monthlyInvestment * months

      // Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
      const futureValue =
        monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)

      setTotalInvestment(totalInvestmentAmount)
      setTotalValue(futureValue)
      setEstimatedReturns(futureValue - totalInvestmentAmount)

      // Generate chart data for each year
      const chartDataPoints = []
      for (let year = 1; year <= timePeriod; year++) {
        const yearlyMonths = year * 12
        const yearlyInvestment = monthlyInvestment * yearlyMonths
        const yearlyValue =
          monthlyInvestment * ((Math.pow(1 + monthlyRate, yearlyMonths) - 1) / monthlyRate) * (1 + monthlyRate)
        chartDataPoints.push({
          investment: yearlyInvestment,
          returns: yearlyValue - yearlyInvestment,
        })
      }
      setChartData(chartDataPoints)
    }

    calculateSIP()
  }, [monthlyInvestment, expectedReturn, timePeriod])

  const handleMonthlyInvestmentChange = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setMonthlyInvestment(numValue)
    } else if (value === "") {
      setMonthlyInvestment(0)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getMaxBarHeight = () => {
    if (chartData.length === 0) return 0
    const maxValue = Math.max(...chartData.map((d) => d.investment + d.returns))
    return maxValue
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/resources?tab=tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">SIP Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-black/50 backdrop-blur-sm border-white/10 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-400" />
              <CardTitle>Input Parameters</CardTitle>
            </div>
            <CardDescription>Adjust the values to calculate your SIP returns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyInvestment" className="text-sm font-medium">
                  Monthly Investment (₹)
                </Label>
                <Input
                  id="monthlyInvestment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => handleMonthlyInvestmentChange(e.target.value)}
                  className="w-24 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[monthlyInvestment]}
                min={500}
                max={100000}
                step={500}
                onValueChange={(value) => setMonthlyInvestment(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>₹500</span>
                <span>₹100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label htmlFor="expectedReturn" className="text-sm font-medium">
                    Expected Return (% p.a.)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-white/60" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Historical average returns: Equity: 12-15%, Debt: 6-8%, Hybrid: 9-11%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="expectedReturn"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-24 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[expectedReturn]}
                min={1}
                max={30}
                step={0.5}
                onValueChange={(value) => setExpectedReturn(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="timePeriod" className="text-sm font-medium">
                  Time Period (Years)
                </Label>
                <Input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-24 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[timePeriod]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setTimePeriod(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>1 year</span>
                <span>30 years</span>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full" asChild>
                <Link href="#results">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-sm border-white/10 lg:col-span-2" id="results">
          <CardHeader>
            <CardTitle>SIP Calculator Results</CardTitle>
            <CardDescription>
              Estimated returns for a monthly investment of {formatCurrency(monthlyInvestment)} for {timePeriod} years
              at {expectedReturn}% p.a.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Total Investment</div>
                <div className="text-2xl font-bold">{formatCurrency(totalInvestment)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Estimated Returns</div>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(estimatedReturns)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalValue)}</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Year-wise Growth</h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                    <span>Investment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>Returns</span>
                  </div>
                </div>
              </div>

              <div className="h-64 flex items-end gap-1">
                {chartData.map((data, index) => {
                  const maxHeight = getMaxBarHeight()
                  const investmentHeight = (data.investment / maxHeight) * 100
                  const returnsHeight = (data.returns / maxHeight) * 100

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center justify-end h-56">
                        <div className="w-full bg-green-500 rounded-t-sm" style={{ height: `${returnsHeight}%` }}></div>
                        <div
                          className="w-full bg-blue-400 rounded-b-sm"
                          style={{ height: `${investmentHeight}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-2">{index + 1}</div>
                    </div>
                  )
                })}
              </div>
              <div className="text-center text-xs text-white/60 mt-2">Years</div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="border-white/10 hover:bg-white/10">
                <Download className="mr-2 h-4 w-4" />
                Download Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
