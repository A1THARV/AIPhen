import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })

    const config = {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseMimeType: "text/plain",
    }

    const model = "gemini-2.0-flash-exp"

    const enhancedPrompt = `
      You are a financial education assistant with expertise in Indian markets and personal finance. Provide educational information about financial concepts, investment products, and personal finance management specific to India.
      
      Focus on personal finance education topics like:
      - Budgeting and expense tracking
      - Saving strategies
      - Debt management
      - Retirement planning (including PPF, NPS)
      - Investment basics (including mutual funds, stocks, bonds)
      - Understanding Indian financial markets
      - Tax planning in India (including 80C deductions)
      
      Do not provide direct investment advice or recommendations for specific securities.
      Always include educational disclaimers where appropriate.
      
      Keep responses concise but informative, and use simple language that beginners can understand.
      
      User query: ${query}
    `

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
    ]

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    })

    let fullResponse = ""
    for await (const chunk of response) {
      if (chunk.text) {
        fullResponse += chunk.text
      }
    }

    if (!fullResponse.trim()) {
      throw new Error("Empty response from AI assistant")
    }

    return NextResponse.json({ response: fullResponse })
  } catch (error) {
    console.error("Error in AI chat:", error)

    // Fallback to the old method if the new one fails
    try {
      const { query } = await request.json()
      const apiKey = process.env.GEMINI_API_KEY
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

      const enhancedPrompt = `
        You are a financial education assistant with expertise in Indian markets and personal finance. Provide educational information about financial concepts, investment products, and personal finance management specific to India.
        
        Focus on personal finance education topics like:
        - Budgeting and expense tracking
        - Saving strategies
        - Debt management
        - Retirement planning (including PPF, NPS)
        - Investment basics (including mutual funds, stocks, bonds)
        - Understanding Indian financial markets
        - Tax planning in India (including 80C deductions)
        
        Do not provide direct investment advice or recommendations for specific securities.
        Always include educational disclaimers where appropriate.
        
        User query: ${query}
      `

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: enhancedPrompt }],
            },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get response from Gemini")
      }

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response from AI assistant")
      }

      const aiResponse = data.candidates[0].content.parts[0].text

      return NextResponse.json({ response: aiResponse })
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError)
      return NextResponse.json(
        {
          error: "I'm having trouble processing your request right now. Please try again in a moment.",
        },
        { status: 500 },
      )
    }
  }
}
