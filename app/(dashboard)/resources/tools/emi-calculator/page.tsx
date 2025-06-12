"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Calculator, Download, Info, PieChart } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [loanTenure, setLoanTenure] = useState(20)
  const [emi, setEmi] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [amortizationSchedule, setAmortizationSchedule] = useState<
    {
      year: number
      principalPaid: number
      interestPaid: number
      balance: number
    }[]
  >([])

  // Calculate EMI and related values
  useEffect(() => {
    const calculateEMI = () => {
      const p = loanAmount
      const r = interestRate / 12 / 100 // Monthly interest rate
      const n = loanTenure * 12 // Total number of months

      // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

      setEmi(emiValue)
      setTotalPayment(emiValue * n)
      setTotalInterest(emiValue * n - p)

      // Generate amortization schedule (yearly)
      const schedule = []
      let remainingBalance = p
      let yearlyPrincipal = 0
      let yearlyInterest = 0

      for (let month = 1; month <= n; month++) {
        const interestForMonth = remainingBalance * r
        const principalForMonth = emiValue - interestForMonth

        yearlyPrincipal += principalForMonth
        yearlyInterest += interestForMonth
        remainingBalance -= principalForMonth

        if (month % 12 === 0 || month === n) {
          schedule.push({
            year: Math.ceil(month / 12),
            principalPaid: yearlyPrincipal,
            interestPaid: yearlyInterest,
            balance: remainingBalance > 0 ? remainingBalance : 0,
          })

          yearlyPrincipal = 0
          yearlyInterest = 0
        }
      }

      setAmortizationSchedule(schedule)
    }

    calculateEMI()
  }, [loanAmount, interestRate, loanTenure])

  const handleLoanAmountChange = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setLoanAmount(numValue)
    } else if (value === "") {
      setLoanAmount(0)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
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
        <h1 className="text-3xl font-bold">EMI Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-black/50 backdrop-blur-sm border-white/10 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-400" />
              <CardTitle>Loan Details</CardTitle>
            </div>
            <CardDescription>Enter your loan details to calculate EMI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanAmount" className="text-sm font-medium">
                  Loan Amount (₹)
                </Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => handleLoanAmountChange(e.target.value)}
                  className="w-32 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[loanAmount]}
                min={100000}
                max={10000000}
                step={100000}
                onValueChange={(value) => setLoanAmount(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>₹1 Lakh</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label htmlFor="interestRate" className="text-sm font-medium">
                    Interest Rate (% p.a.)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-white/60" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Current rates: Home Loan: 7-9%, Car Loan: 8-12%, Personal Loan: 10-18%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-24 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[interestRate]}
                min={5}
                max={20}
                step={0.1}
                onValueChange={(value) => setInterestRate(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanTenure" className="text-sm font-medium">
                  Loan Tenure (Years)
                </Label>
                <Input
                  id="loanTenure"
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-24 h-8 text-right bg-white/5 border-white/10"
                />
              </div>
              <Slider
                value={[loanTenure]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setLoanTenure(value[0])}
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
                  Calculate EMI
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-sm border-white/10 lg:col-span-2" id="results">
          <CardHeader>
            <CardTitle>EMI Calculation Results</CardTitle>
            <CardDescription>
              Loan amount of {formatCurrency(loanAmount)} at {interestRate}% for {loanTenure} years
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Monthly EMI</div>
                <div className="text-2xl font-bold">{formatCurrency(emi)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Total Interest</div>
                <div className="text-2xl font-bold text-amber-500">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60 mb-1">Total Payment</div>
                <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalPayment)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-medium mb-4">Payment Breakdown</h3>
                <div className="relative h-64 w-64 mx-auto">
                  <PieChart className="h-full w-full text-white/20 absolute" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-400 h-full"
                        style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                      ></div>
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(totalInterest / totalPayment) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-medium">Total</div>
                      <div className="text-xl font-bold">{formatCurrency(totalPayment)}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                    <span className="text-sm">Principal ({Math.round((loanAmount / totalPayment) * 100)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                    <span className="text-sm">Interest ({Math.round((totalInterest / totalPayment) * 100)}%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-medium mb-4">Amortization Schedule</h3>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {amortizationSchedule.map((item) => (
                        <TableRow key={item.year}>
                          <TableCell>{item.year}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.principalPaid)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.interestPaid)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="border-white/10 hover:bg-white/10">
                <Download className="mr-2 h-4 w-4" />
                Download Amortization Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
