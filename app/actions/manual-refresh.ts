"use server"

import { refreshAllMarketData, refreshSpecificMarketData } from "./market-data-scheduler"

export async function triggerManualRefresh(dataType?: string) {
  try {
    console.log(`🚀 Starting manual market data refresh${dataType ? ` for ${dataType}` : " (all data)"}...`)

    // Execute the refresh
    const result = dataType ? await refreshSpecificMarketData(dataType) : await refreshAllMarketData()

    if (result.success) {
      console.log("✅ Manual market data refresh completed successfully")
      return {
        success: true,
        message: result.message,
        ...result,
        timestamp: new Date().toISOString(),
      }
    } else {
      console.warn("⚠️ Manual market data refresh completed with some failures")
      return {
        success: false,
        message: result.message,
        ...result,
        timestamp: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error("❌ Manual market data refresh failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }
  }
}
