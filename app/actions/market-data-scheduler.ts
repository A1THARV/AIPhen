"use server"

import {
  fetchTrendingStocks,
  fetchMostActiveStocks,
  fetchMarketNews,
  fetchIPOData,
  fetchMutualFunds,
} from "./indian-market-data"
import {
  storeTrendingStocks,
  storeMostActiveStocks,
  storeMarketNews,
  storeIPOData,
  storeMutualFunds,
  logAPIUsage,
} from "@/lib/market-data-cache"

// Helper functions to extract data from different API response structures
function extractTrendingData(data: any) {
  console.log("Raw trending data structure:", JSON.stringify(data, null, 2))

  // Handle different possible structures
  let gainers = []
  let losers = []

  if (data?.trending_stocks) {
    gainers = data.trending_stocks.top_gainers || []
    losers = data.trending_stocks.top_losers || []
  } else if (data?.top_gainers || data?.top_losers) {
    gainers = data.top_gainers || []
    losers = data.top_losers || []
  } else if (Array.isArray(data)) {
    // If data is an array, try to separate gainers and losers
    gainers = data.filter((stock) => (stock.percent_change || stock.percentChange || 0) > 0)
    losers = data.filter((stock) => (stock.percent_change || stock.percentChange || 0) < 0)
  } else if (data?.data) {
    const stockData = data.data
    if (stockData.top_gainers || stockData.top_losers) {
      gainers = stockData.top_gainers || []
      losers = stockData.top_losers || []
    } else if (Array.isArray(stockData)) {
      gainers = stockData.filter((stock) => (stock.percent_change || stock.percentChange || 0) > 0)
      losers = stockData.filter((stock) => (stock.percent_change || stock.percentChange || 0) < 0)
    }
  }

  console.log(`Extracted: ${gainers.length} gainers, ${losers.length} losers`)
  return { gainers, losers }
}

function extractMostActiveData(data: any) {
  console.log("Raw most active data structure:", JSON.stringify(data, null, 2))

  let stocks = []

  // Try different possible structures
  if (data?.most_active_stocks) {
    stocks = data.most_active_stocks
  } else if (data?.stocks) {
    stocks = data.stocks
  } else if (data?.data) {
    if (Array.isArray(data.data)) {
      stocks = data.data
    } else if (data.data.stocks) {
      stocks = data.data.stocks
    } else if (data.data.most_active) {
      stocks = data.data.most_active
    }
  } else if (Array.isArray(data)) {
    stocks = data
  } else if (data?.results) {
    stocks = data.results
  }

  console.log(`Extracted: ${stocks.length} most active stocks`)
  return stocks
}

function extractNewsData(data: any) {
  console.log("Raw news data structure:", JSON.stringify(data, null, 2))

  let news = []

  // Try different possible structures
  if (data?.news) {
    news = data.news
  } else if (data?.articles) {
    news = data.articles
  } else if (data?.data) {
    if (Array.isArray(data.data)) {
      news = data.data
    } else if (data.data.news) {
      news = data.data.news
    } else if (data.data.articles) {
      news = data.data.articles
    }
  } else if (Array.isArray(data)) {
    news = data
  } else if (data?.results) {
    news = data.results
  }

  console.log(`Extracted: ${news.length} news articles`)
  return news
}

function extractIPOData(data: any) {
  console.log("Raw IPO data structure:", JSON.stringify(data, null, 2))

  let ipos = []

  if (data?.upcoming) {
    ipos = data.upcoming
  } else if (data?.ipos) {
    ipos = data.ipos
  } else if (data?.data) {
    if (Array.isArray(data.data)) {
      ipos = data.data
    } else if (data.data.upcoming) {
      ipos = data.data.upcoming
    } else if (data.data.ipos) {
      ipos = data.data.ipos
    }
  } else if (Array.isArray(data)) {
    ipos = data
  }

  console.log(`Extracted: ${ipos.length} IPOs`)
  return ipos
}

function extractMutualFundsData(data: any) {
  console.log("Raw mutual funds data structure:", JSON.stringify(data, null, 2))

  const funds = []

  if (data && typeof data === "object") {
    // Handle nested structure like { "Equity": { "Large Cap": [...] } }
    for (const [category, subcategories] of Object.entries(data)) {
      if (typeof subcategories === "object" && subcategories !== null) {
        for (const [subcategory, fundsList] of Object.entries(subcategories)) {
          if (Array.isArray(fundsList)) {
            for (const fund of fundsList) {
              funds.push({
                ...fund,
                category,
                subcategory,
              })
            }
          }
        }
      }
    }
  }

  // If no nested structure found, try other formats
  if (funds.length === 0) {
    if (data?.funds) {
      funds.push(...data.funds)
    } else if (data?.data && Array.isArray(data.data)) {
      funds.push(...data.data)
    } else if (Array.isArray(data)) {
      funds.push(...data)
    }
  }

  console.log(`Extracted: ${funds.length} mutual funds`)
  return funds
}

// Refresh all market data using existing API functions
export async function refreshAllMarketData() {
  const results = {
    trending: { success: false, error: null as any, records: 0 },
    mostActive: { success: false, error: null as any, records: 0 },
    news: { success: false, error: null as any, records: 0 },
    ipo: { success: false, error: null as any, records: 0 },
    mutualFunds: { success: false, error: null as any, records: 0 },
  }

  let totalApiCalls = 0

  // 1. Refresh trending stocks
  try {
    console.log("🔄 Fetching trending stocks...")
    const trendingData = await fetchTrendingStocks()
    totalApiCalls++

    const { gainers, losers } = extractTrendingData(trendingData)

    if (gainers.length > 0 || losers.length > 0) {
      const storeResult = await storeTrendingStocks(gainers, losers)
      results.trending = {
        success: storeResult.success,
        error: storeResult.success ? null : "Failed to store data",
        records: storeResult.records || 0,
      }

      await logAPIUsage("trending-stocks", true, { gainers: gainers.length, losers: losers.length })
      console.log(`✅ Trending stocks updated: ${gainers.length} gainers, ${losers.length} losers`)
    } else {
      results.trending = { success: false, error: "No trending data received", records: 0 }
      await logAPIUsage("trending-stocks", false, "No data received")
    }
  } catch (error) {
    results.trending = { success: false, error: error instanceof Error ? error.message : "Unknown error", records: 0 }
    await logAPIUsage("trending-stocks", false, error instanceof Error ? error.message : "Unknown error")
    console.error("❌ Failed to update trending stocks:", error)
  }

  // Small delay between API calls
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 2. Refresh most active stocks
  try {
    console.log("🔄 Fetching most active stocks...")
    const activeData = await fetchMostActiveStocks()
    totalApiCalls++

    const stocks = extractMostActiveData(activeData)

    if (stocks.length > 0) {
      const storeResult = await storeMostActiveStocks(stocks)
      results.mostActive = {
        success: storeResult.success,
        error: storeResult.success ? null : "Failed to store data",
        records: storeResult.records || 0,
      }

      await logAPIUsage("most-active-stocks", true, { stocks: stocks.length })
      console.log(`✅ Most active stocks updated: ${stocks.length} stocks`)
    } else {
      results.mostActive = { success: false, error: "No active stocks data received", records: 0 }
      await logAPIUsage("most-active-stocks", false, "No data received")
      console.log("⚠️ No most active stocks data found in API response")
    }
  } catch (error) {
    results.mostActive = { success: false, error: error instanceof Error ? error.message : "Unknown error", records: 0 }
    await logAPIUsage("most-active-stocks", false, error instanceof Error ? error.message : "Unknown error")
    console.error("❌ Failed to update most active stocks:", error)
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 3. Refresh market news
  try {
    console.log("🔄 Fetching market news...")
    const newsData = await fetchMarketNews()
    totalApiCalls++

    const news = extractNewsData(newsData)

    if (news.length > 0) {
      const storeResult = await storeMarketNews(news)
      results.news = {
        success: storeResult.success,
        error: storeResult.success ? null : "Failed to store data",
        records: storeResult.records || 0,
      }

      await logAPIUsage("market-news", true, { articles: news.length })
      console.log(`✅ Market news updated: ${news.length} articles`)
    } else {
      results.news = { success: false, error: "No news data received", records: 0 }
      await logAPIUsage("market-news", false, "No data received")
      console.log("⚠️ No market news data found in API response")
    }
  } catch (error) {
    results.news = { success: false, error: error instanceof Error ? error.message : "Unknown error", records: 0 }
    await logAPIUsage("market-news", false, error instanceof Error ? error.message : "Unknown error")
    console.error("❌ Failed to update market news:", error)
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 4. Refresh IPO data
  try {
    console.log("🔄 Fetching IPO data...")
    const ipoData = await fetchIPOData()
    totalApiCalls++

    const ipos = extractIPOData(ipoData)

    if (ipos.length > 0) {
      const storeResult = await storeIPOData(ipos)
      results.ipo = {
        success: storeResult.success,
        error: storeResult.success ? null : "Failed to store data",
        records: storeResult.records || 0,
      }

      await logAPIUsage("ipo-data", true, { ipos: ipos.length })
      console.log(`✅ IPO data updated: ${ipos.length} IPOs`)
    } else {
      results.ipo = { success: false, error: "No IPO data received", records: 0 }
      await logAPIUsage("ipo-data", false, "No data received")
    }
  } catch (error) {
    results.ipo = { success: false, error: error instanceof Error ? error.message : "Unknown error", records: 0 }
    await logAPIUsage("ipo-data", false, error instanceof Error ? error.message : "Unknown error")
    console.error("❌ Failed to update IPO data:", error)
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 5. Refresh mutual funds data
  try {
    console.log("🔄 Fetching mutual funds...")
    const fundsData = await fetchMutualFunds()
    totalApiCalls++

    const funds = extractMutualFundsData(fundsData)

    if (funds.length > 0) {
      const storeResult = await storeMutualFunds(funds)
      results.mutualFunds = {
        success: storeResult.success,
        error: storeResult.success ? null : "Failed to store data",
        records: storeResult.records || 0,
      }

      await logAPIUsage("mutual-funds", true, { funds: funds.length })
      console.log(`✅ Mutual funds updated: ${funds.length} funds`)
    } else {
      results.mutualFunds = { success: false, error: "No mutual funds data received", records: 0 }
      await logAPIUsage("mutual-funds", false, "No data received")
    }
  } catch (error) {
    results.mutualFunds = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      records: 0,
    }
    await logAPIUsage("mutual-funds", false, error instanceof Error ? error.message : "Unknown error")
    console.error("❌ Failed to update mutual funds:", error)
  }

  const successCount = Object.values(results).filter((r) => r.success).length
  const totalCount = Object.keys(results).length
  const totalRecords = Object.values(results).reduce((sum, r) => sum + r.records, 0)

  console.log(`📊 Market data refresh completed:`)
  console.log(`   ✅ ${successCount}/${totalCount} data sources successful`)
  console.log(`   📈 ${totalRecords} total records updated`)
  console.log(`   🔗 ${totalApiCalls} API calls used`)

  return {
    success: successCount > 0,
    message: `Refreshed ${successCount}/${totalCount} data sources (${totalRecords} records)`,
    results,
    apiCalls: totalApiCalls,
    totalRecords,
  }
}

// Refresh specific data type
export async function refreshSpecificMarketData(dataType: string) {
  console.log(`🔄 Manual refresh for: ${dataType}`)

  try {
    switch (dataType) {
      case "trending":
        const trendingData = await fetchTrendingStocks()
        const { gainers, losers } = extractTrendingData(trendingData)
        const trendingResult = await storeTrendingStocks(gainers, losers)
        await logAPIUsage("trending-stocks", true, { gainers: gainers.length, losers: losers.length })
        return { success: true, message: `Updated ${gainers.length + losers.length} trending stocks` }

      case "active":
        const activeData = await fetchMostActiveStocks()
        const stocks = extractMostActiveData(activeData)
        const activeResult = await storeMostActiveStocks(stocks)
        await logAPIUsage("most-active-stocks", true, { stocks: stocks.length })
        return { success: true, message: `Updated ${stocks.length} most active stocks` }

      case "news":
        const newsData = await fetchMarketNews()
        const news = extractNewsData(newsData)
        const newsResult = await storeMarketNews(news)
        await logAPIUsage("market-news", true, { articles: news.length })
        return { success: true, message: `Updated ${news.length} news articles` }

      case "ipo":
        const ipoData = await fetchIPOData()
        const ipos = extractIPOData(ipoData)
        const ipoResult = await storeIPOData(ipos)
        await logAPIUsage("ipo-data", true, { ipos: ipos.length })
        return { success: true, message: `Updated ${ipos.length} IPOs` }

      case "mutual":
        const fundsData = await fetchMutualFunds()
        const funds = extractMutualFundsData(fundsData)
        const fundsResult = await storeMutualFunds(funds)
        await logAPIUsage("mutual-funds", true, { funds: funds.length })
        return { success: true, message: `Updated ${funds.length} mutual funds` }

      default:
        return await refreshAllMarketData()
    }
  } catch (error) {
    console.error(`❌ Failed to refresh ${dataType}:`, error)
    await logAPIUsage(dataType, false, error instanceof Error ? error.message : "Unknown error")
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Manual refresh function for admin interface
export async function manualRefreshMarketData(dataType?: string) {
  console.log(`🔄 Manual refresh initiated${dataType ? ` for: ${dataType}` : " for all data"}`)

  try {
    if (dataType && dataType !== "all") {
      return await refreshSpecificMarketData(dataType)
    } else {
      return await refreshAllMarketData()
    }
  } catch (error) {
    console.error("❌ Manual refresh failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      results: {},
      apiCalls: 0,
      totalRecords: 0,
    }
  }
}

// Get current API usage statistics
export async function getAPIUsageStats() {
  try {
    const { getAPIUsageStats } = await import("@/lib/market-data-cache")
    return await getAPIUsageStats()
  } catch (error) {
    console.error("Error getting API usage stats:", error)
    return {
      total_calls_this_month: 0,
      calls_by_type: {},
      last_refresh_dates: {},
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
