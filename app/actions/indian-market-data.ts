"use server"

// Types for IndianAPI responses
interface IPOData {
  upcoming: Array<{
    symbol: string
    name: string
    status: string
    is_sme: boolean
    additional_text: string
    min_price: number
    max_price: number
    issue_price: number | null
    listing_gains: number | null
    listing_price: number | null
    bidding_start_date: string
    bidding_end_date: string | null
    listing_date: string
    lot_size: number | null
    document_url: string
  }>
}

interface NewsData {
  title: string
  summary: string
  url: string
  image_url: string
  pub_date: string
  source: string
  topics: string[]
}

interface StockData {
  companyName: string
  industry: string
  currentPrice: {
    BSE: string
    NSE: string
  }
  companyProfile: {
    companyDescription: string
    mgIndustry: string
  }
}

interface TrendingStock {
  ticker_id: string
  company_name: string
  price: string
  percent_change: string
  net_change: string
  bid: string
  ask: string
  high: string
  low: string
  open: string
  volume: string
  date: string
  time: string
  close: string
  overall_rating: string
  short_term_trends: string
  long_term_trends: string
  year_low: string
  year_high: string
  ric: string
}

interface TrendingData {
  trending_stocks: {
    top_gainers: TrendingStock[]
    top_losers: TrendingStock[]
  }
}

interface MostActiveStock {
  ticker: string
  company: string
  price: number
  percent_change: number
  net_change: number
  bid: number
  ask: number
  high: number
  low: number
  open: number
  volume: number
  close: number
  overall_rating: string
  short_term_trend: string
  long_term_trend: string
  "52_week_low": number
  "52_week_high": number
}

interface MutualFund {
  fund_name: string
  latest_nav: number
  percentage_change: number
  asset_size: number
  "1_month_return": number
  "3_month_return": number
  "6_month_return": number
  "1_year_return": number
  "3_year_return": number
  "5_year_return": number | null
  star_rating: number | null
}

const API_BASE_URL = "https://stock.indianapi.in"
const API_KEY = process.env.INDIAN_API_KEY || "your-api-key-here"

const headers = {
  "X-Api-Key": API_KEY,
  "Content-Type": "application/json",
}

// Fetch IPO data
export async function fetchIPOData(): Promise<IPOData> {
  try {
    const response = await fetch(`${API_BASE_URL}/ipo`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`IPO API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching IPO data:", error)
    // Return mock data as fallback
    return {
      upcoming: [
        {
          symbol: "EXAMPLE",
          name: "Example Company Ltd",
          status: "upcoming",
          is_sme: false,
          additional_text: "Bid starts soon",
          min_price: 100,
          max_price: 120,
          issue_price: null,
          listing_gains: null,
          listing_price: null,
          bidding_start_date: "2025-06-15",
          bidding_end_date: null,
          listing_date: "2025-06-20",
          lot_size: 100,
          document_url: "#",
        },
      ],
    }
  }
}

// Fetch market news
export async function fetchMarketNews(): Promise<NewsData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      headers,
      next: { revalidate: 900 }, // Cache for 15 minutes
    })

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching market news:", error)
    // Return mock data as fallback
    return [
      {
        title: "Market Update: Indian Stocks Show Mixed Performance",
        summary:
          "Indian stock markets showed mixed performance today with banking stocks leading gains while IT stocks faced pressure.",
        url: "#",
        image_url: "/placeholder.svg?height=200&width=400",
        pub_date: new Date().toISOString(),
        source: "Market News",
        topics: ["Market Update"],
      },
    ]
  }
}

// Fetch specific stock data
export async function fetchStockData(stockName: string): Promise<StockData> {
  try {
    const response = await fetch(`${API_BASE_URL}/stock?name=${encodeURIComponent(stockName)}`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Stock API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching stock data for ${stockName}:`, error)
    // Return mock data as fallback
    return {
      companyName: stockName,
      industry: "Unknown",
      currentPrice: {
        BSE: "1000.00",
        NSE: "1000.00",
      },
      companyProfile: {
        companyDescription: "Company information not available",
        mgIndustry: "Unknown",
      },
    }
  }
}

// Fetch trending stocks
export async function fetchTrendingStocks(): Promise<TrendingData> {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Trending API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching trending stocks:", error)
    // Return mock data as fallback
    return {
      trending_stocks: {
        top_gainers: [
          {
            ticker_id: "S0001",
            company_name: "Sample Gainer Ltd",
            price: "1500.00",
            percent_change: "5.25",
            net_change: "75.00",
            bid: "1500.00",
            ask: "1501.00",
            high: "1520.00",
            low: "1425.00",
            open: "1425.00",
            volume: "1000000",
            date: new Date().toISOString().split("T")[0],
            time: "15:30:00",
            close: "1425.00",
            overall_rating: "Bullish",
            short_term_trends: "Bullish",
            long_term_trends: "Bullish",
            year_low: "1000.00",
            year_high: "1600.00",
            ric: "SAMPLE.NS",
          },
        ],
        top_losers: [
          {
            ticker_id: "S0002",
            company_name: "Sample Loser Ltd",
            price: "800.00",
            percent_change: "-3.25",
            net_change: "-27.00",
            bid: "799.00",
            ask: "800.00",
            high: "830.00",
            low: "795.00",
            open: "827.00",
            volume: "800000",
            date: new Date().toISOString().split("T")[0],
            time: "15:30:00",
            close: "827.00",
            overall_rating: "Bearish",
            short_term_trends: "Bearish",
            long_term_trends: "Neutral",
            year_low: "650.00",
            year_high: "950.00",
            ric: "SAMPLE2.NS",
          },
        ],
      },
    }
  }
}

// Fetch most active NSE stocks
export async function fetchMostActiveStocks(): Promise<MostActiveStock[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/NSE_most_active`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Most Active API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching most active stocks:", error)
    // Return mock data as fallback
    return [
      {
        ticker: "SAMPLE.NS",
        company: "Sample Active Company",
        price: 1200.5,
        percent_change: 2.5,
        net_change: 30.0,
        bid: 1200.0,
        ask: 1200.5,
        high: 1220.0,
        low: 1180.0,
        open: 1190.0,
        volume: 5000000,
        close: 1170.5,
        overall_rating: "Bullish",
        short_term_trend: "Bullish",
        long_term_trend: "Bullish",
        "52_week_low": 900.0,
        "52_week_high": 1300.0,
      },
    ]
  }
}

// Fetch mutual funds data
export async function fetchMutualFunds(): Promise<Record<string, Record<string, MutualFund[]>>> {
  try {
    const response = await fetch(`${API_BASE_URL}/mutual_funds`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Mutual Funds API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching mutual funds:", error)
    // Return mock data as fallback
    return {
      Equity: {
        "Large Cap": [
          {
            fund_name: "Sample Large Cap Fund",
            latest_nav: 150.25,
            percentage_change: 1.2,
            asset_size: 5000.0,
            "1_month_return": 2.5,
            "3_month_return": 8.2,
            "6_month_return": 15.8,
            "1_year_return": 22.5,
            "3_year_return": 18.2,
            "5_year_return": 16.8,
            star_rating: 4,
          },
        ],
      },
    }
  }
}

// Combined market overview function
export async function fetchMarketOverview() {
  try {
    const [trendingData, mostActiveData, newsData] = await Promise.all([
      fetchTrendingStocks(),
      fetchMostActiveStocks(),
      fetchMarketNews(),
    ])

    return {
      trending: trendingData,
      mostActive: mostActiveData.slice(0, 10), // Top 10 most active
      news: newsData.slice(0, 5), // Top 5 news items
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching market overview:", error)
    throw error
  }
}
