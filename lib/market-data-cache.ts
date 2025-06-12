import { getSupabaseClient } from "@/lib/supabase"

export interface CachedTrendingStock {
  id: string
  company_name: string
  price: number | null
  percent_change: number | null
  volume: string | null
  overall_rating: string | null
  stock_type: "gainer" | "loser"
  created_at: string
}

export interface CachedMostActiveStock {
  id: string
  company: string
  price: number | null
  percent_change: number | null
  volume: string | null
  overall_rating: string | null
  created_at: string
}

export interface CachedMarketNews {
  id: string
  title: string
  summary: string | null
  url: string | null
  image_url: string | null
  source: string | null
  pub_date: string | null
  created_at: string
}

export interface CachedIPOData {
  id: string
  name: string
  listing_date: string | null
  min_price: number | null
  max_price: number | null
  is_sme: boolean
  additional_text: string | null
  document_url: string | null
  created_at: string
}

export interface CachedMutualFund {
  id: string
  fund_name: string
  nav: number | null
  change_percent: number | null
  fund_type: string | null
  rating: string | null
  created_at: string
}

// Helper function to safely parse numbers
function safeParseFloat(value: any): number | null {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number.parseFloat(String(value).replace(/[,%]/g, ""))
  return Number.isNaN(parsed) ? null : parsed
}

// Helper function to safely parse integers
function safeParseInt(value: any): number | null {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number.parseInt(String(value).replace(/[,%]/g, ""))
  return Number.isNaN(parsed) ? null : parsed
}

// Check if tables exist
export async function checkTablesExist() {
  try {
    const supabase = getSupabaseClient()

    const tables = [
      "cached_trending_stocks",
      "cached_most_active_stocks",
      "cached_market_news",
      "cached_ipo_data",
      "cached_mutual_funds",
      "api_usage_logs",
    ]

    const tableStatus: Record<string, boolean> = {}

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("id").limit(1)
        tableStatus[table] = !error
      } catch (error) {
        tableStatus[table] = false
      }
    }

    const allTablesExist = Object.values(tableStatus).every((exists) => exists)

    return {
      success: true,
      allTablesExist,
      tableStatus,
    }
  } catch (error) {
    console.error("Error checking table existence:", error)
    return {
      success: false,
      allTablesExist: false,
      tableStatus: {},
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Get cached trending stocks
export async function getCachedTrendingStocks() {
  try {
    const supabase = getSupabaseClient()

    const { data: topGainers, error: gainersError } = await supabase
      .from("cached_trending_stocks")
      .select("*")
      .eq("stock_type", "gainer")
      .order("percent_change", { ascending: false })
      .limit(10)

    if (gainersError) {
      if (gainersError.message?.includes("does not exist")) {
        return {
          top_gainers: [],
          top_losers: [],
          last_updated: null,
          tablesNotExist: true,
        }
      }
      throw gainersError
    }

    const { data: topLosers, error: losersError } = await supabase
      .from("cached_trending_stocks")
      .select("*")
      .eq("stock_type", "loser")
      .order("percent_change", { ascending: true })
      .limit(10)

    if (losersError) {
      if (losersError.message?.includes("does not exist")) {
        return {
          top_gainers: [],
          top_losers: [],
          last_updated: null,
          tablesNotExist: true,
        }
      }
      throw losersError
    }

    // Get last updated timestamp
    const { data: lastUpdated } = await supabase
      .from("cached_trending_stocks")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return {
      top_gainers: topGainers || [],
      top_losers: topLosers || [],
      last_updated: lastUpdated?.created_at || null,
      tablesNotExist: false,
    }
  } catch (error) {
    console.error("Error fetching cached trending stocks:", error)
    return {
      top_gainers: [],
      top_losers: [],
      last_updated: null,
      tablesNotExist: false,
    }
  }
}

// Get cached most active stocks
export async function getCachedMostActiveStocks() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("cached_most_active_stocks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      if (error.message?.includes("does not exist")) {
        return {
          stocks: [],
          last_updated: null,
          tablesNotExist: true,
        }
      }
      throw error
    }

    // Get last updated timestamp
    const { data: lastUpdated } = await supabase
      .from("cached_most_active_stocks")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return {
      stocks: data || [],
      last_updated: lastUpdated?.created_at || null,
      tablesNotExist: false,
    }
  } catch (error) {
    console.error("Error fetching cached most active stocks:", error)
    return {
      stocks: [],
      last_updated: null,
      tablesNotExist: false,
    }
  }
}

// Get cached market news
export async function getCachedMarketNews() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("cached_market_news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      if (error.message?.includes("does not exist")) {
        return {
          news: [],
          last_updated: null,
          tablesNotExist: true,
        }
      }
      throw error
    }

    // Get last updated timestamp
    const { data: lastUpdated } = await supabase
      .from("cached_market_news")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return {
      news: data || [],
      last_updated: lastUpdated?.created_at || null,
      tablesNotExist: false,
    }
  } catch (error) {
    console.error("Error fetching cached market news:", error)
    return {
      news: [],
      last_updated: null,
      tablesNotExist: false,
    }
  }
}

// Get cached IPO data
export async function getCachedIPOData() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("cached_ipo_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      if (error.message?.includes("does not exist")) {
        return {
          ipos: [],
          last_updated: null,
          tablesNotExist: true,
        }
      }
      throw error
    }

    // Get last updated timestamp
    const { data: lastUpdated } = await supabase
      .from("cached_ipo_data")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return {
      ipos: data || [],
      last_updated: lastUpdated?.created_at || null,
      tablesNotExist: false,
    }
  } catch (error) {
    console.error("Error fetching cached IPO data:", error)
    return {
      ipos: [],
      last_updated: null,
      tablesNotExist: false,
    }
  }
}

// Get cached mutual funds
export async function getCachedMutualFunds() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("cached_mutual_funds")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      if (error.message?.includes("does not exist")) {
        return {
          funds: [],
          last_updated: null,
          tablesNotExist: true,
        }
      }
      throw error
    }

    // Get last updated timestamp
    const { data: lastUpdated } = await supabase
      .from("cached_mutual_funds")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return {
      funds: data || [],
      last_updated: lastUpdated?.created_at || null,
      tablesNotExist: false,
    }
  } catch (error) {
    console.error("Error fetching cached mutual funds:", error)
    return {
      funds: [],
      last_updated: null,
      tablesNotExist: false,
    }
  }
}

// Get API usage statistics
export async function getAPIUsageStats() {
  try {
    const supabase = getSupabaseClient()

    // Get current month's usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from("api_usage_logs")
      .select("*")
      .gte("created_at", startOfMonth.toISOString())

    if (error) {
      if (error.message?.includes("does not exist")) {
        return {
          total_calls_this_month: 0,
          calls_by_type: {},
          last_refresh_dates: {},
          tablesNotExist: true,
        }
      }
      throw error
    }

    const logs = data || []
    const totalCalls = logs.length

    // Group by endpoint type
    const callsByType = logs.reduce((acc: Record<string, number>, log: any) => {
      acc[log.endpoint_type] = (acc[log.endpoint_type] || 0) + 1
      return acc
    }, {})

    // Get last refresh dates by type
    const lastRefreshDates: Record<string, string> = {}
    const uniqueTypes = [...new Set(logs.map((log: any) => log.endpoint_type))]

    for (const type of uniqueTypes) {
      const latestLog = logs
        .filter((log: any) => log.endpoint_type === type)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

      if (latestLog) {
        lastRefreshDates[type] = latestLog.created_at
      }
    }

    return {
      total_calls_this_month: totalCalls,
      calls_by_type: callsByType,
      last_refresh_dates: lastRefreshDates,
      tablesNotExist: false,
    }
  } catch (error) {
    console.error("Error fetching API usage stats:", error)
    return {
      total_calls_this_month: 0,
      calls_by_type: {},
      last_refresh_dates: {},
      tablesNotExist: false,
    }
  }
}

// Store trending stocks data with proper cleanup
export async function storeTrendingStocks(gainers: any[], losers: any[]) {
  try {
    const supabase = getSupabaseClient()

    console.log(`📊 Storing trending stocks: ${gainers.length} gainers, ${losers.length} losers`)

    // Clear ALL existing data first
    const { error: deleteError } = await supabase
      .from("cached_trending_stocks")
      .delete()
      .gte("created_at", "1900-01-01")

    if (deleteError) {
      console.error("Error clearing existing trending stocks:", deleteError)
    } else {
      console.log("✅ Cleared existing trending stocks data")
    }

    // Prepare gainers data
    const gainersData = gainers.map((stock) => ({
      company_name: stock.company_name || stock.companyName || stock.name || "Unknown",
      price: safeParseFloat(stock.price || stock.ltp || stock.lastPrice),
      percent_change: safeParseFloat(stock.percent_change || stock.percentChange || stock.pChange),
      volume: String(stock.volume || stock.totalTradedVolume || "0"),
      overall_rating: stock.overall_rating || stock.overallRating || null,
      stock_type: "gainer" as const,
    }))

    // Prepare losers data
    const losersData = losers.map((stock) => ({
      company_name: stock.company_name || stock.companyName || stock.name || "Unknown",
      price: safeParseFloat(stock.price || stock.ltp || stock.lastPrice),
      percent_change: safeParseFloat(stock.percent_change || stock.percentChange || stock.pChange),
      volume: String(stock.volume || stock.totalTradedVolume || "0"),
      overall_rating: stock.overall_rating || stock.overallRating || null,
      stock_type: "loser" as const,
    }))

    // Insert new data
    const allData = [...gainersData, ...losersData]
    if (allData.length > 0) {
      const { error: insertError } = await supabase.from("cached_trending_stocks").insert(allData)

      if (insertError) {
        console.error("Error inserting trending stocks:", insertError)
        throw insertError
      }

      console.log(`✅ Successfully stored ${allData.length} trending stocks`)
    }

    return { success: true, records: allData.length }
  } catch (error) {
    console.error("Error storing trending stocks:", error)
    return { success: false, error }
  }
}

// Store most active stocks data with proper cleanup
export async function storeMostActiveStocks(stocks: any[]) {
  try {
    const supabase = getSupabaseClient()

    console.log(`📊 Storing most active stocks: ${stocks.length} stocks`)
    console.log("Sample stock data:", stocks[0])

    // Clear ALL existing data first
    const { error: deleteError } = await supabase
      .from("cached_most_active_stocks")
      .delete()
      .gte("created_at", "1900-01-01")

    if (deleteError) {
      console.error("Error clearing existing most active stocks:", deleteError)
    } else {
      console.log("✅ Cleared existing most active stocks data")
    }

    // Prepare stocks data with flexible field mapping
    const stocksData = stocks.map((stock) => ({
      company:
        stock.company ||
        stock.companyName ||
        stock.name ||
        stock.symbol ||
        stock.ticker ||
        stock.shortName ||
        "Unknown",
      price: safeParseFloat(
        stock.price || stock.ltp || stock.lastPrice || stock.close || stock.currentPrice || stock.regularMarketPrice,
      ),
      percent_change: safeParseFloat(
        stock.percent_change ||
          stock.percentChange ||
          stock.pChange ||
          stock.changePercent ||
          stock.regularMarketChangePercent,
      ),
      volume: String(
        stock.volume ||
          stock.totalTradedVolume ||
          stock.regularMarketVolume ||
          stock.totalVolume ||
          stock.dayVolume ||
          "0",
      ),
      overall_rating: stock.overall_rating || stock.overallRating || stock.rating || null,
    }))

    // Filter out invalid entries
    const validStocksData = stocksData.filter((stock) => stock.company !== "Unknown")

    if (validStocksData.length > 0) {
      const { error: insertError } = await supabase.from("cached_most_active_stocks").insert(validStocksData)

      if (insertError) {
        console.error("Error inserting most active stocks:", insertError)
        throw insertError
      }

      console.log(`✅ Successfully stored ${validStocksData.length} most active stocks`)
    } else {
      console.warn("⚠️ No valid most active stocks data to store")
    }

    return { success: true, records: validStocksData.length }
  } catch (error) {
    console.error("Error storing most active stocks:", error)
    return { success: false, error }
  }
}

// Store market news data with proper cleanup
export async function storeMarketNews(news: any[]) {
  try {
    const supabase = getSupabaseClient()

    console.log(`📊 Storing market news: ${news.length} articles`)
    console.log("Sample news data:", news[0])

    // Clear ALL existing data first
    const { error: deleteError } = await supabase.from("cached_market_news").delete().gte("created_at", "1900-01-01")

    if (deleteError) {
      console.error("Error clearing existing market news:", deleteError)
    } else {
      console.log("✅ Cleared existing market news data")
    }

    // Prepare news data with flexible field mapping
    const newsData = news.map((item) => ({
      title: item.title || item.headline || item.name || "Untitled",
      summary:
        item.summary || item.description || item.content || item.snippet || item.abstract || item.excerpt || null,
      url: item.url || item.link || item.href || item.source_url || null,
      image_url:
        item.image_url || item.imageUrl || item.urlToImage || item.image || item.thumbnail || item.photo || null,
      source:
        item.source || item.sourceName || item.publisher || item.author || item.publication || item.provider || null,
      pub_date: item.pub_date || item.pubDate || item.publishedAt || item.published || item.date || null,
    }))

    // Filter out invalid entries
    const validNewsData = newsData.filter((item) => item.title !== "Untitled")

    if (validNewsData.length > 0) {
      const { error: insertError } = await supabase.from("cached_market_news").insert(validNewsData)

      if (insertError) {
        console.error("Error inserting market news:", insertError)
        throw insertError
      }

      console.log(`✅ Successfully stored ${validNewsData.length} news articles`)
    } else {
      console.warn("⚠️ No valid market news data to store")
    }

    return { success: true, records: validNewsData.length }
  } catch (error) {
    console.error("Error storing market news:", error)
    return {
      success: false,
      error,
    }
  }
}

// Store IPO data with proper cleanup
export async function storeIPOData(ipos: any[]) {
  try {
    const supabase = getSupabaseClient()

    console.log(`📊 Storing IPO data: ${ipos.length} IPOs`)

    // Clear ALL existing data first
    const { error: deleteError } = await supabase.from("cached_ipo_data").delete().gte("created_at", "1900-01-01")

    if (deleteError) {
      console.error("Error clearing existing IPO data:", deleteError)
    } else {
      console.log("✅ Cleared existing IPO data")
    }

    const ipoData = ipos.map((ipo) => ({
      name: ipo.name || ipo.companyName || ipo.company || "Unknown",
      listing_date: ipo.listing_date || ipo.listingDate || ipo.date || null,
      min_price: safeParseFloat(ipo.min_price || ipo.minPrice || ipo.priceMin),
      max_price: safeParseFloat(ipo.max_price || ipo.maxPrice || ipo.priceMax),
      is_sme: Boolean(ipo.is_sme || ipo.isSME || ipo.sme),
      additional_text: ipo.additional_text || ipo.additionalText || ipo.description || null,
      document_url: ipo.document_url || ipo.documentUrl || ipo.prospectus || null,
    }))

    const validIpoData = ipoData.filter((ipo) => ipo.name !== "Unknown")

    if (validIpoData.length > 0) {
      const { error: insertError } = await supabase.from("cached_ipo_data").insert(validIpoData)

      if (insertError) {
        console.error("Error inserting IPO data:", insertError)
        throw insertError
      }

      console.log(`✅ Successfully stored ${validIpoData.length} IPOs`)
    }

    return { success: true, records: validIpoData.length }
  } catch (error) {
    console.error("Error storing IPO data:", error)
    return { success: false, error }
  }
}

// Store mutual funds data with proper cleanup
export async function storeMutualFunds(funds: any[]) {
  try {
    const supabase = getSupabaseClient()

    console.log(`📊 Storing mutual funds: ${funds.length} funds`)

    // Clear ALL existing data first
    const { error: deleteError } = await supabase.from("cached_mutual_funds").delete().gte("created_at", "1900-01-01")

    if (deleteError) {
      console.error("Error clearing existing mutual funds:", deleteError)
    } else {
      console.log("✅ Cleared existing mutual funds data")
    }

    const fundsData = funds.map((fund) => ({
      fund_name: fund.fund_name || fund.fundName || fund.name || fund.schemeName || "Unknown",
      nav: safeParseFloat(fund.nav || fund.NAV || fund.netAssetValue || fund.latest_nav),
      change_percent: safeParseFloat(
        fund.change_percent || fund.changePercent || fund.percentage_change || fund.percentageChange,
      ),
      fund_type: fund.fund_type || fund.fundType || fund.category || fund.subcategory || fund.schemeCategory || null,
      rating: fund.rating || fund.starRating || fund.morningstarRating || null,
    }))

    const validFundsData = fundsData.filter((fund) => fund.fund_name !== "Unknown")

    if (validFundsData.length > 0) {
      const { error: insertError } = await supabase.from("cached_mutual_funds").insert(validFundsData)

      if (insertError) {
        console.error("Error inserting mutual funds:", insertError)
        throw insertError
      }

      console.log(`✅ Successfully stored ${validFundsData.length} mutual funds`)
    }

    return { success: true, records: validFundsData.length }
  } catch (error) {
    console.error("Error storing mutual funds:", error)
    return { success: false, error }
  }
}

// Log API usage
export async function logAPIUsage(endpointType: string, success: boolean, responseData?: any) {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("api_usage_logs").insert({
      endpoint_type: endpointType,
      success,
      response_size: responseData ? JSON.stringify(responseData).length : 0,
      error_message: success ? null : String(responseData || "Unknown error"),
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error logging API usage:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error logging API usage:", error)
    return { success: false, error }
  }
}
