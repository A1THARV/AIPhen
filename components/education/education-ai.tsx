"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, TrendingUp, BookOpen, DollarSign, Sparkles, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChartIcon as Bar } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface EducationAIProps {
  initialQuery?: string
}

export function EducationAI({ initialQuery = "" }: EducationAIProps) {
  const [query, setQuery] = useState(initialQuery)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      handleSubmit()
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: query }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const assistantMessage: Message = { role: "assistant", content: data.response }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setQuery("")
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const suggestedQueries = [
    { text: "What is SIP and how does it work?", icon: <TrendingUp className="h-4 w-4" /> },
    { text: "Explain P/E ratio and how to use it", icon: <Bar className="h-4 w-4" /> },
    { text: "How to start investing with ₹1000?", icon: <DollarSign className="h-4 w-4" /> },
    { text: "What are mutual funds vs ETFs?", icon: <BookOpen className="h-4 w-4" /> },
  ]

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Card className="glass-card glow glow-purple glass-highlight hover-float h-[600px] flex flex-col">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-xl text-white">AI Financial Assistant</CardTitle>
            <CardDescription className="text-white/60">
              Ask me anything about finance, investments, and market analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Welcome to your AI Financial Assistant!</h3>
                  <p className="text-white/60 text-sm">
                    I can help you understand investments, analyze stocks, explain financial concepts, and more.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestedQueries.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestedQuery(suggestion.text)}
                      className="p-3 text-left glass-card hover-glow group"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                          {suggestion.icon}
                        </div>
                        <span className="text-white/80 group-hover:text-white transition-colors">
                          {suggestion.text}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback className="bg-purple-600 text-white text-xs">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-purple-600 text-white ml-auto" : "glass-card text-white"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-white/90">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-2 space-y-1 text-white/90">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-2 space-y-1 text-white/90">{children}</ol>
                            ),
                            li: ({ children }) => <li className="text-sm text-white/90">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            code: ({ children }) => (
                              <code className="bg-black/30 px-1 py-0.5 rounded text-xs text-purple-300">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">U</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-purple-600 text-white text-xs">AI</AvatarFallback>
                </Avatar>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-sm text-white/60">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/10 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex gap-2 w-full"
        >
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about investments, stocks, financial planning..."
            className="flex-1 glass-card text-white placeholder:text-white/50 border-white/20 focus:border-purple-500/50 transition-colors"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
