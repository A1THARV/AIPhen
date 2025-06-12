"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewChartProps {
  symbol?: string
  interval?: string
  theme?: "light" | "dark"
}

export function TradingViewChart({ symbol = "NSE:NIFTY", interval = "D", theme = "dark" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = initializeWidget
    document.head.appendChild(script)
    scriptRef.current = script

    return () => {
      if (widgetRef.current) {
        // Clean up widget if it exists
        try {
          widgetRef.current = null
        } catch (error) {
          console.error("Error cleaning up TradingView widget:", error)
        }
      }

      // Safely remove script
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [])

  // Re-initialize widget when props change
  useEffect(() => {
    if (window.TradingView && containerRef.current) {
      if (widgetRef.current) {
        try {
          widgetRef.current = null
        } catch (error) {
          console.error("Error cleaning up TradingView widget:", error)
        }
      }
      initializeWidget()
    }
  }, [symbol, interval, theme])

  const initializeWidget = () => {
    if (!window.TradingView || !containerRef.current) return

    try {
      widgetRef.current = new window.TradingView.widget({
        container_id: containerRef.current.id,
        symbol: symbol,
        interval: interval,
        timezone: "Asia/Kolkata",
        theme: theme,
        style: "1",
        locale: "in",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650",
        width: "100%",
        height: "500",
        hide_side_toolbar: false,
        withdateranges: true,
        hide_volume: false,
      })
    } catch (error) {
      console.error("Error initializing TradingView widget:", error)
    }
  }

  return (
    <Card className="w-full bg-black/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle>Market Chart</CardTitle>
        <CardDescription>Real-time Indian market data powered by TradingView</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="heatmap">Market Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div id="tradingview-chart" ref={containerRef} className="w-full h-[500px]"></div>
          </TabsContent>
          <TabsContent value="heatmap">
            <div className="w-full h-[500px] flex items-center justify-center">
              <iframe
                src="https://s.tradingview.com/embed-widget/market-quotes/?locale=in&amp;symbolsGroups=%5B%7B%22name%22%3A%22Indices%22%2C%22originalName%22%3A%22Indices%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22NSE%3ANIFTY%22%2C%22displayName%22%3A%22NIFTY%2050%22%7D%2C%7B%22name%22%3A%22BSE%3ASENSEX%22%2C%22displayName%22%3A%22SENSEX%22%7D%2C%7B%22name%22%3A%22NSE%3ABANKNIFTY%22%2C%22displayName%22%3A%22BANK%20NIFTY%22%7D%2C%7B%22name%22%3A%22NSE%3ANIFTYNEXT50%22%2C%22displayName%22%3A%22NIFTY%20NEXT%2050%22%7D%5D%7D%2C%7B%22name%22%3A%22Stocks%22%2C%22originalName%22%3A%22Stocks%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22NSE%3ARELIANCE%22%2C%22displayName%22%3A%22RELIANCE%22%7D%2C%7B%22name%22%3A%22NSE%3ATCS%22%2C%22displayName%22%3A%22TCS%22%7D%2C%7B%22name%22%3A%22NSE%3AHDFCBANK%22%2C%22displayName%22%3A%22HDFC%20BANK%22%7D%2C%7B%22name%22%3A%22NSE%3AINFY%22%2C%22displayName%22%3A%22INFOSYS%22%7D%5D%7D%5D&amp;showSymbolLogo=true&amp;colorTheme=dark&amp;isTransparent=true&amp;largeChartUrl=https%3A%2F%2Fwww.tradingview.com%2Fchart%2F&amp;utm_source=www.tradingview.com&amp;utm_medium=widget_new&amp;utm_campaign=symbol-overview"
                style={{ width: "100%", height: "100%", border: "none" }}
              ></iframe>
            </div>
          </TabsContent>
          <TabsContent value="technical">
            <div className="w-full h-[500px] flex items-center justify-center">
              <iframe
                src="https://s.tradingview.com/embed-widget/technical-analysis/?locale=in&amp;symbol=NSE%3ANIFTY&amp;interval=1D&amp;colorTheme=dark&amp;isTransparent=true&amp;utm_source=www.tradingview.com&amp;utm_medium=widget_new&amp;utm_campaign=technical-analysis"
                style={{ width: "100%", height: "100%", border: "none" }}
              ></iframe>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
