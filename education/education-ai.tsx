"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFinancialEducation } from "@/app/actions/ai-assistant"
import { Loader2, Send, Search, BarChart2, TrendingUp, BookOpen, DollarSign } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface EducationAIProps {
  userId: string
  initialQuery?: string
}

export function EducationAI({ userId, initialQuery = "" }: EducationAIProps) {
  const [query, setQuery] = useState(initialQuery)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      handleSubmit()
    }
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: query }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await getFinancialEducation(userId, query)
      const assistantMessage: Message = { role: "assistant", content: response }
      setMessages((prev) => [...prev, assistantMessage])

      // Check if the query contains a stock symbol
      const symbolMatch = query.match(/\b([A-Z]{2,})\b/)
      if (symbolMatch && symbolMatch[1]) {
        const symbol = symbolMatch[1]
        // Update URL with the symbol parameter
        const params = new URLSearchParams(searchParams.toString())
        params.set("symbol", `NSE:${symbol}`)
        router.push(`/education?${params.toString()}`)
      }
    } catch (error) {
      console.error("Error getting financial education:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setQuery("")
      // Focus the input field after submission
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const suggestedQueries = [
    { text: "What is SIP and how does it work?", icon: <TrendingUp className="h-4 w-4" /> },
    { text: "Explain P/E ratio and how to use it", icon: <BarChart2 className="h-4 w-4" /> },
    { text: "How do mutual funds work in India?", icon: <Search className="h-4 w-4" /> },
    { text: "What is RELIANCE stock outlook?", icon: <TrendingUp className="h-4 w-4" /> },
    { text: "How to save tax in India?", icon: <DollarSign className="h-4 w-4" /> },
    { text: "Explain NIFTY and SENSEX", icon: <BarChart2 className="h-4 w-4" /> },
    { text: "Best investment options for beginners", icon: <BookOpen className="h-4 w-4" /> },
    { text: "How to create an emergency fund?", icon: <DollarSign className="h-4 w-4" /> },
  ]

  return (
    <Card className="h-[calc(100vh-30rem)] bg-black/50 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          AI Financial Assistant
        </CardTitle>
        <CardDescription>Ask any financial question and get educational insights about Indian markets</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-4 text-white/70">
                <p>Ask me anything about Indian finance and investments</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-3 text-left border-white/10 hover:bg-white/10"
                    onClick={() => {
                      setQuery(query.text)
                      setTimeout(() => handleSubmit(), 100)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {query.icon}
                      <span>{query.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-white"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-white/10 text-white">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p>Thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex w-full gap-2"
        >
          <Input
            ref={inputRef}
            placeholder="Ask a financial question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button type="submit" disabled={isLoading || !query.trim()} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

