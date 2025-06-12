"use server"

import { createUserInteraction } from "@/lib/user-interactions"
import { GoogleGenAI } from "@google/genai"

export async function getFinancialEducation(userId: string, query: string) {
  try {
    // Validate userId format (should be a valid UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      throw new Error("Invalid user ID format")
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("API key not configured")
    }

    // Try the new Google GenAI library first
    try {
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
        
        If the user asks about a specific stock or market index, include relevant information about that security and suggest they look at the TradingView chart that's displayed above our conversation. Focus on Indian markets like NIFTY, SENSEX, and major Indian stocks.
        
        Do not provide direct investment advice or recommendations for specific securities.
        Always include educational disclaimers where appropriate.
        
        If the user mentions a specific stock symbol (like RELIANCE, TCS, HDFCBANK), explain what the company does and mention some key financial metrics that investors should consider.
        
        Focus on personal finance education topics like:
        - Budgeting and expense tracking
        - Saving strategies
        - Debt management
        - Retirement planning (including PPF, NPS)
        - Investment basics (including mutual funds, stocks, bonds)
        - Understanding Indian financial markets
        - Tax planning in India (including 80C deductions)
        
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

      let aiResponse = ""
      for await (const chunk of response) {
        if (chunk.text) {
          aiResponse += chunk.text
        }
      }

      if (!aiResponse.trim()) {
        throw new Error("Empty response from AI assistant")
      }

      // Log the interaction only if we have a valid userId
      try {
        await createUserInteraction({
          user_id: userId,
          interaction_type: "ai_query",
          content: JSON.stringify({ query, response: aiResponse }),
        })
      } catch (interactionError) {
        // Log the error but don't fail the entire request
        console.error("Error logging user interaction:", interactionError)
      }

      return aiResponse
    } catch (newLibError) {
      console.error("New library failed, trying fallback:", newLibError)

      // Fallback to the old fetch method
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

      const enhancedPrompt = `
        You are a financial education assistant with expertise in Indian markets and personal finance. Provide educational information about financial concepts, investment products, and personal finance management specific to India.
        
        If the user asks about a specific stock or market index, include relevant information about that security and suggest they look at the TradingView chart that's displayed above our conversation. Focus on Indian markets like NIFTY, SENSEX, and major Indian stocks.
        
        Do not provide direct investment advice or recommendations for specific securities.
        Always include educational disclaimers where appropriate.
        
        If the user mentions a specific stock symbol (like RELIANCE, TCS, HDFCBANK), explain what the company does and mention some key financial metrics that investors should consider.
        
        Focus on personal finance education topics like:
        - Budgeting and expense tracking
        - Saving strategies
        - Debt management
        - Retirement planning (including PPF, NPS)
        - Investment basics (including mutual funds, stocks, bonds)
        - Understanding Indian financial markets
        - Tax planning in India (including 80C deductions)
        
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

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response from AI assistant")
      }

      const aiResponse = data.candidates[0].content.parts[0].text

      // Log the interaction only if we have a valid userId
      try {
        await createUserInteraction({
          user_id: userId,
          interaction_type: "ai_query",
          content: JSON.stringify({ query, response: aiResponse }),
        })
      } catch (interactionError) {
        // Log the error but don't fail the entire request
        console.error("Error logging user interaction:", interactionError)
      }

      return aiResponse
    }
  } catch (error) {
    console.error("Error getting financial education:", error)
    throw new Error("I'm having trouble processing your request right now. Please try again in a moment.")
  }
}
