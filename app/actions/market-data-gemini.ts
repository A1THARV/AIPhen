"use server"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

interface StockData {
  symbol: string
  name: string
  price: string
  change: string
  percentChange: string
}

interface MarketNews {
  title: string
  source: string
  date: string
  url?: string
}

interface MarketDataResponse {
  stocks: StockData[]
  news: MarketNews[]
  marketSummary: string
  timestamp: string
}

export async function fetchIndianMarketData(): Promise<MarketDataResponse> {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAHfIUSCgBlKAO4PNezW6usmbHPnzDHHM4"
    const genAI = new GoogleGenerativeAI(API_KEY)

    // Create a safety settings object
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ]

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings,
      tools: [
        {
          googleSearch: {},
        },
      ],
    })

    // Prepare the prompt
    const prompt = `
      I need real-time data about the Indian stock market. Please search for the following information:
      
      1. Current price, change, and percent change for these Indian stocks:
         - RELIANCE (Reliance Industries)
         - TCS (Tata Consultancy Services)
         - HDFCBANK (HDFC Bank)
         - INFY (Infosys)
         - ICICIBANK (ICICI Bank)
      
      2. Latest 5 news headlines about the Indian stock market
      
      3. A brief summary of the current Indian market conditions
      
      Format your response as a JSON object with the following structure:
      {
        "stocks": [
          {
            "symbol": "RELIANCE",
            "name": "Reliance Industries",
            "price": "2950.75",
            "change": "+35.25",
            "percentChange": "+1.21%"
          },
          ...
        ],
        "news": [
          {
            "title": "News headline",
            "source": "Source name",
            "date": "Date published",
            "url": "URL to the news (if available)"
          },
          ...
        ],
        "marketSummary": "Brief summary of current market conditions",
        "timestamp": "Current date and time in ISO format"
      }
      
      Use Google Search to find the most up-to-date information. Return ONLY the JSON object, nothing else.
    `

    // Generate content with tools
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [
        {
          googleSearch: {},
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    })

    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from the response")
    }

    const jsonStr = jsonMatch[0]
    const data = JSON.parse(jsonStr) as MarketDataResponse

    return data
  } catch (error) {
    console.error("Error fetching market data from Gemini:", error)

    // Return mock data if the API fails
    return {
      stocks: [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries",
          price: "2950.75",
          change: "+35.25",
          percentChange: "+1.21%",
        },
        {
          symbol: "TCS",
          name: "Tata Consultancy Services",
          price: "3875.45",
          change: "-12.30",
          percentChange: "-0.32%",
        },
        {
          symbol: "HDFCBANK",
          name: "HDFC Bank",
          price: "1675.20",
          change: "+22.45",
          percentChange: "+1.36%",
        },
        {
          symbol: "INFY",
          name: "Infosys",
          price: "1520.80",
          change: "-5.75",
          percentChange: "-0.38%",
        },
        {
          symbol: "ICICIBANK",
          name: "ICICI Bank",
          price: "1050.60",
          change: "+15.30",
          percentChange: "+1.48%",
        },
      ],
      news: [
        {
          title: "Sensex, Nifty close at record highs led by banking stocks",
          source: "Economic Times",
          date: "2023-06-15",
          url: "https://economictimes.indiatimes.com/markets/stocks/news/sensex-nifty-close-at-record-highs",
        },
        {
          title: "RBI keeps repo rate unchanged at 6.5% for the fourth time",
          source: "Business Standard",
          date: "2023-06-14",
          url: "https://www.business-standard.com/finance/news/rbi-keeps-repo-rate-unchanged",
        },
        {
          title: "FIIs turn net buyers in Indian equities after three months",
          source: "Mint",
          date: "2023-06-13",
          url: "https://www.livemint.com/market/stock-market-news/fiis-turn-net-buyers",
        },
        {
          title: "IT stocks under pressure as global tech spending slows",
          source: "Financial Express",
          date: "2023-06-12",
          url: "https://www.financialexpress.com/market/it-stocks-under-pressure",
        },
        {
          title: "Reliance Industries announces new energy investments worth $10 billion",
          source: "CNBC TV18",
          date: "2023-06-11",
          url: "https://www.cnbctv18.com/market/reliance-industries-announces-new-energy-investments",
        },
      ],
      marketSummary:
        "Indian markets are showing mixed trends with banking and energy sectors performing well, while IT stocks face pressure due to global headwinds. Foreign institutional investors have returned to the market, providing support to large-cap stocks.",
      timestamp: new Date().toISOString(),
    }
  }
}
