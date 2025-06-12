import { type NextRequest, NextResponse } from "next/server"
import { refreshAllMarketData, refreshSpecificMarketData } from "@/app/actions/market-data-scheduler"

export async function POST(request: NextRequest) {
  try {
    // Verify authorization - only use server-side secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!authHeader || !cronSecret) {
      console.error("❌ Missing authorization or cron secret")
      return NextResponse.json({ error: "Missing credentials" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    if (token !== cronSecret) {
      console.error("❌ Invalid cron secret")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Parse request body for specific data type refresh
    let dataType = null
    try {
      const body = await request.json()
      dataType = body?.dataType
    } catch {
      // No body or invalid JSON, refresh all data
    }

    console.log(`🚀 Starting market data refresh${dataType ? ` for ${dataType}` : " (all data)"}...`)

    // Execute the refresh
    const result = dataType ? await refreshSpecificMarketData(dataType) : await refreshAllMarketData()

    if (result.success) {
      console.log("✅ Market data refresh completed successfully")
      return NextResponse.json({
        success: true,
        message: result.message,
        ...result,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.warn("⚠️ Market data refresh completed with some failures")
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          ...result,
          timestamp: new Date().toISOString(),
        },
        { status: 207 },
      ) // 207 Multi-Status for partial success
    }
  } catch (error) {
    console.error("❌ Market data refresh failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ready",
    endpoint: "Market data refresh API",
    methods: ["POST"],
    timestamp: new Date().toISOString(),
  })
}
