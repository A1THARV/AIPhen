"use server"

import type { MarketData } from "@/types/financial"

export async function fetchMarketData(symbol: string): Promise<MarketData> {
  try {
    // For NIFTY and SENSEX, we'll use a different approach
    if (symbol.includes("NIFTY") || symbol.includes("SENSEX")) {
      return await fetchIndianIndexData(symbol)
    }

    // For individual stocks
    const apiKey = "4vWWuhxc9qmFdpbGeW9SrFyC"
    const url = "https://www.searchapi.io/api/v1/search"

    // Ensure we're using the correct format for Indian stocks
    const formattedSymbol = symbol.includes(":") ? symbol : `${symbol}:NSE`

    const params = {
      engine: "google_finance",
      q: formattedSymbol,
      api_key: apiKey,
    }

    // Construct URL with query parameters
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = `${url}?${queryString}`

    // Fetch data with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(fullUrl, {
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.json_url) {
      throw new Error("No JSON URL returned from API")
    }

    // Fetch the actual financial data from json_url
    const jsonResponse = await fetch(data.json_url, { next: { revalidate: 300 } })

    if (!jsonResponse.ok) {
      throw new Error(`JSON URL responded with status: ${jsonResponse.status}`)
    }

    const financialData = await jsonResponse.json()

    // Extract relevant data
    const summary = financialData.summary

    if (!summary) {
      throw new Error("No summary data found in API response")
    }

    return {
      symbol: summary.stock || formattedSymbol,
      price: summary.price || 0,
      change: summary.price_change?.amount || 0,
      changePercent: summary.price_change?.percentage || 0,
      volume: financialData.graph?.[0]?.volume || 0,
      marketCap: financialData.knowledge_graph?.stats?.find((stat: any) => stat.label === "Market cap")?.value || null,
      timestamp: summary.date || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching market data:", error)
    // Return mock data if API fails
    return getMockMarketData(symbol)
  }
}

// Function to fetch Indian index data
async function fetchIndianIndexData(symbol: string): Promise<MarketData> {
  try {
    // For Indian indices, we'll use a different API
    // This is a placeholder - in a real implementation, you would use a specific API for Indian indices
    const indexSymbol = symbol.split(":")[0]

    // For now, we'll use mock data
    return getMockMarketData(indexSymbol)

    // In a real implementation, you would use something like:
    /*
    const response = await fetch(`https://api.example.com/indices/india/${indexSymbol}`, {
      next: { revalidate: 300 }
    })
    const data = await response.json()
    
    return {
      symbol: indexSymbol,
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: data.volume,
      timestamp: data.timestamp || new Date().toISOString(),
    }
    */
  } catch (error) {
    console.error("Error fetching Indian index data:", error)
    return getMockMarketData(symbol)
  }
}

// Mock data function for when API fails
function getMockMarketData(symbol: string): MarketData {
  // Extract the base symbol without exchange
  const baseSymbol = symbol.split(":")[0]

  const mockData: Record<string, MarketData> = {
    NIFTY_50: {
      symbol: "NIFTY_50",
      price: 23350.4,
      change: 159.75,
      changePercent: 0.6888552,
      volume: 0,
      timestamp: new Date().toISOString(),
    },
    SENSEX: {
      symbol: "SENSEX",
      price: 76905.51,
      change: 557.4453,
      changePercent: 0.7301368,
      volume: 0,
      timestamp: new Date().toISOString(),
    },
    RELIANCE: {
      symbol: "RELIANCE",
      price: 2950.75,
      change: 35.25,
      changePercent: 1.21,
      volume: 3245678,
      timestamp: new Date().toISOString(),
    },
    TCS: {
      symbol: "TCS",
      price: 3875.45,
      change: -12.3,
      changePercent: -0.32,
      volume: 1234567,
      timestamp: new Date().toISOString(),
    },
    HDFCBANK: {
      symbol: "HDFCBANK",
      price: 1675.2,
      change: 22.45,
      changePercent: 1.36,
      volume: 2345678,
      timestamp: new Date().toISOString(),
    },
    INFY: {
      symbol: "INFY",
      price: 1520.8,
      change: -5.75,
      changePercent: -0.38,
      volume: 1876543,
      timestamp: new Date().toISOString(),
    },
    HINDUNILVR: {
      symbol: "HINDUNILVR",
      price: 2450.6,
      change: 15.3,
      changePercent: 0.63,
      volume: 987654,
      timestamp: new Date().toISOString(),
    },
  }

  // Return the specific mock data or a generic one if symbol not found
  return (
    mockData[baseSymbol] || {
      symbol: baseSymbol,
      price: 1000.0,
      change: 10.0,
      changePercent: 1.0,
      volume: 1000000,
      timestamp: new Date().toISOString(),
    }
  )
}
