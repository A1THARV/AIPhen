export interface FinancialInstrument {
  id: string
  symbol: string
  name: string
  type: string
  description: string | null
  risk_level: string | null
  min_investment: number | null
  created_at: string
  updated_at: string
}

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  timestamp: string
}
