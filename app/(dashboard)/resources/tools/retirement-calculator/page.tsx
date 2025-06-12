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
import { Progress } from "@/components/ui/progress"

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [lifeExpectancy, setLifeExpectancy] = useState(85)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [monthlyContribution, setMonthlyContribution] = useState(10000)
  const [preRetirementReturn, setPreRetirementReturn] = useState(12)
  const [postRetirementReturn, setPostRetirementReturn] = useState(7)
  const [inflationRate, setInflationRate] = useState(6)
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)

  const [retirementCorpus, setRetirementCorpus] = useState(0)
  const [monthlyRetirementIncome, setMonthlyRetirementIncome] = useState(0)
  const [corpusDepletion, setCorpusDepletion] = useState(0)
  const [requiredMonthlyContribution, setRequiredMonthlyContribution] = useState(0)
  const [chartData, setChartData] = useState<{ age: number; corpus: number }[]>([])

  // Calculate retirement values
  useEffect(() => {
    const calculateRetirement = () => {
      // Years until retirement
      const yearsToRetirement = retirementAge - currentAge

      // Years in retirement
      const yearsInRetirement = lifeExpectancy - retirementAge

      // Calculate future value of current savings at retirement
      const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + preRetirementReturn / 100, yearsToRetirement)

      // Calculate future value of monthly contributions at retirement
      const monthlyRate = preRetirementReturn / 100 / 12
      const months = yearsToRetirement * 12
      const futureValueOfContributions =
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)

      // Total retirement corpus
      const totalRetirementCorpus = futureValueOfCurrentSavings + futureValueOfContributions

      // Calculate monthly expenses at retirement (adjusted for inflation)
      const inflationAdjustedExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)

      // Calculate sustainable monthly withdrawal during retirement
      // Using the 4% rule as a starting point, adjusted for post-retirement returns
      const withdrawalRate = (postRetirementReturn - inflationRate) / 100 / 12
      const sustainableMonthlyWithdrawal = totalRetirementCorpus * withdrawalRate

      // Calculate corpus depletion age
      let remainingCorpus = totalRetirementCorpus
      let age = retirementAge

      while (remainingCorpus > 0 && age <= 120) {
        // Monthly interest earned
        const monthlyInterest = remainingCorpus * (postRetirementReturn / 100 / 12)

        // Monthly withdrawal (adjusted for inflation each year)
        const yearsSinceRetirement = age - retirementAge
        const inflationFactor = Math.pow(1 + inflationRate / 100, yearsSinceRetirement)
        const monthlyWithdrawal = monthlyExpenses * inflationFactor

        // Update remaining corpus
        remainingCorpus = remainingCorpus + monthlyInterest - monthlyWithdrawal

        // If corpus depleted, break
        if (remainingCorpus <= 0) {
          break
        }

        // Increment age
        age += 1 / 12 // Increment by one month
      }

      // Calculate required monthly contribution to meet retirement needs
      const requiredCorpus = inflationAdjustedExpenses * 12 * yearsInRetirement
      const shortfall = Math.max(0, requiredCorpus - futureValueOfCurrentSavings)
      const requiredContribution =
        shortfall / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) / (1 + monthlyRate)

      // Generate chart data
      const chartDataPoints = []
      let simulatedCorpus = currentSavings

      // Pre-retirement phase
      for (let age = currentAge; age <= retirementAge; age++) {
        // Annual return
        const annualReturn = simulatedCorpus * (preRetirementReturn / 100)

        // Annual contribution
        const annualContribution = monthlyContribution * 12

        // Update corpus
        simulatedCorpus = simulatedCorpus + annualReturn + annualContribution

        chartDataPoints.push({
          age,
          corpus: simulatedCorpus,
        })
      }

      // Post-retirement phase
      let postRetirementCorpus = simulatedCorpus
      for (let age = retirementAge + 1; age <= Math.min(age, lifeExpectancy); age++) {
        // Annual return
        const annualReturn = postRetirementCorpus * (postRetirementReturn / 100)

        // Annual withdrawal (adjusted for inflation)
        const yearsSinceRetirement = age - retirementAge
        const inflationFactor = Math.pow(1 + inflationRate / 100, yearsSinceRetirement)
        const annualWithdrawal = monthlyExpenses * 12 * inflationFactor

        // Update corpus
        postRetirementCorpus = postRetirementCorpus + annualReturn - annualWithdrawal

        // If corpus depleted, break
        if (postRetirementCorpus <= 0) {
          postRetirementCorpus = 0
          chartDataPoints.push({
            age,
            corpus: postRetirementCorpus,
          })
          break
        }

        chartDataPoints.push({
          age,
          corpus: postRetirementCorpus,
        })
      }

      setRetirementCorpus(totalRetirementCorpus)
      setMonthlyRetirementIncome(sustainableMonthlyWithdrawal)
      setCorpusDepletion(Math.min(age, 120))
      setRequiredMonthlyContribution(requiredContribution)
      setChartData(chartDataPoints)
    }

    calculateRetirement()
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    preRetirementReturn,
    postRetirementReturn,
    inflationRate,
    monthlyExpenses,
  ])

  const handleCurrentSavingsChange = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setCurrentSavings(numValue)
    } else if (value === "") {
      setCurrentSavings(0)
    }
  }

  const handleMonthlyContributionChange = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setMonthlyContribution(numValue)
    } else if (value === "") {
      setMonthlyContribution(0)
    }
  }

  const handleMonthlyExpensesChange = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setMonthlyExpenses(numValue)
    } else if (value === "") {
      setMonthlyExpenses(0)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getMaxCorpus = () => {
    if (chartData.length === 0) return 0
    return Math.max(...chartData.map((d) => d.corpus))
  }

  const getRetirementProgress = () => {
    const yearsToRetirement = retirementAge - currentAge
    const totalYears = retirementAge - 20 // Assuming working life starts at 20
    return Math.min(100, Math.max(0, 100 - (yearsToRetirement / totalYears) * 100))
  }

  const getCorpusProgress = () => {
    if (requiredMonthlyContribution <= 0) return 100
    return Math.min(100, Math.max(0, (monthlyContribution / requiredMonthlyContribution) * 100))
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
        <h1 className="text-3xl font-bold">Retirement Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-black/50 backdrop-blur-sm border-white/10 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-400" />
              <CardTitle>Retirement Planning</CardTitle>
            </div>
            <CardDescription>Enter your details to plan for retirement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentAge" className="text-sm font-medium">
                  Current Age
                </Label>
                <div className="flex items-center">
                  <Input
                    id="currentAge"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="h-8 bg-white/5 border-white/10"
                  />
                  <span className="ml-2 text-sm">years</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retirementAge" className="text-sm font-medium">
                  Retirement Age
                </Label>
                <div className="flex items-center">
                  <Input
                    id="retirementAge"
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="h-8 bg-white/5 border-white/10"
                  />
                  <span className="ml-2 text-sm">years</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeExpectancy" className="text-sm font-medium">
                Life Expectancy
              </Label>
              <div className="flex items-center">
                <Input
                  id="lifeExpectancy"
                  type="number"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  className="h-8 bg-white/5 border-white/10"
                />
                <span className="ml-2 text-sm">years</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentSavings" className="text-sm font-medium">
                  Current Savings (₹)
                </Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => handleCurrentSavingsChange(e.target.value)}
                  className="w-32 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[currentSavings]}
                min={0}
                max={10000000}
                step={100000}
                onValueChange={(value) => setCurrentSavings(value[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyContribution" className="text-sm font-medium">
                  Monthly Contribution (₹)
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => handleMonthlyContributionChange(e.target.value)}
                  className="w-32 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[monthlyContribution]}
                min={1000}
                max={100000}
                step={1000}
                onValueChange={(value) => setMonthlyContribution(value[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyExpenses" className="text-sm font-medium">
                  Monthly Expenses (₹)
                </Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => handleMonthlyExpensesChange(e.target.value)}
                  className="w-32 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[monthlyExpenses]}
                min={10000}
                max={200000}
                step={5000}
                onValueChange={(value) => setMonthlyExpenses(value[0])}
                className="py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="preRetirementReturn" className="text-sm font-medium">
                    Pre-Retirement Return (%)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-white/60" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Expected annual return on investments before retirement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="preRetirementReturn"
                  type="number"
                  value={preRetirementReturn}
                  onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
                  className="h-8 bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="postRetirementReturn" className="text-sm font-medium">
                    Post-Retirement Return (%)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-white/60" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Expected annual return on investments after retirement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="postRetirementReturn"
                  type="number"
                  value={postRetirementReturn}
                  onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
                  className="h-8 bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="inflationRate" className="text-sm font-medium">
                  Inflation Rate (%)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-white/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Expected annual inflation rate</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="inflationRate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="h-8 bg-white/5 border-white/10"
              />
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
            <CardTitle>Retirement Planning Results</CardTitle>
            <CardDescription>Based on your inputs, here's your retirement financial outlook</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Retirement Corpus</div>
                <div className="text-2xl font-bold">{formatCurrency(retirementCorpus)}</div>
                <div className="text-xs text-white/60 mt-1">At age {retirementAge}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Monthly Retirement Income</div>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(monthlyRetirementIncome)}</div>
                <div className="text-xs text-white/60 mt-1">Sustainable withdrawal</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Corpus Depletion Age</div>
                <div className="text-2xl font-bold text-amber-500">{Math.round(corpusDepletion)} years</div>
                <div className="text-xs text-white/60 mt-1">
                  {corpusDepletion > lifeExpectancy
                    ? "Your corpus will outlive you"
                    : "Your corpus will deplete before life expectancy"}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Required Monthly Contribution</div>
                <div className="text-2xl font-bold text-blue-400">{formatCurrency(requiredMonthlyContribution)}</div>
                <div className="text-xs text-white/60 mt-1">To meet retirement needs</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-medium mb-4">Retirement Progress</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Years to Retirement</span>
                      <span>{retirementAge - currentAge} years</span>
                    </div>
                    <Progress value={getRetirementProgress()} className="h-2" />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Career Start</span>
                      <span>Retirement</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contribution Progress</span>
                      <span>{Math.round(getCorpusProgress())}%</span>
                    </div>
                    <Progress value={getCorpusProgress()} className="h-2" />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Current: {formatCurrency(monthlyContribution)}</span>
                      <span>Required: {formatCurrency(requiredMonthlyContribution)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-medium mb-4">Retirement Corpus Growth</h3>
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-end">
                    {chartData.map((data, index) => {
                      const maxCorpus = getMaxCorpus()
                      const height = (data.corpus / maxCorpus) * 100
                      const isRetirementAge = data.age === retirementAge

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end">
                          <div
                            className={`w-full ${isRetirementAge ? "bg-amber-500" : "bg-blue-400"}`}
                            style={{ height: `${height}%` }}
                          ></div>
                          {index % 5 === 0 && <div className="text-xs mt-2">{data.age}</div>}
                        </div>
                      )
                    })}
                  </div>
                  {/* Retirement age line */}
                  <div
                    className="absolute border-l-2 border-amber-500 h-full"
                    style={{
                      left: `${((retirementAge - currentAge) / (chartData.length > 0 ? chartData[chartData.length - 1].age - currentAge : 1)) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-center text-xs text-white/60 mt-2">Age</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="border-white/10 hover:bg-white/10">
                <Download className="mr-2 h-4 w-4" />
                Download Retirement Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
