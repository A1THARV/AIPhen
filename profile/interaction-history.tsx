"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Eye } from "lucide-react"
import Link from "next/link"

interface UserInteraction {
  id: string
  user_id: string
  interaction_type: string
  content: string
  created_at: string
}

interface InteractionHistoryProps {
  interactions: UserInteraction[]
}

export function InteractionHistory({ interactions }: InteractionHistoryProps) {
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null)

  // Parse the content JSON for AI queries
  const parseContent = (interaction: UserInteraction) => {
    if (interaction.interaction_type === "ai_query") {
      try {
        const content = JSON.parse(interaction.content)
        return {
          query: content.query,
          response: content.response,
        }
      } catch (error) {
        return {
          query: "Error parsing query",
          response: "Error parsing response",
        }
      }
    }
    return { query: interaction.content, response: "" }
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "ai_query":
        return <MessageSquare className="h-4 w-4" />
      case "search":
        return <Search className="h-4 w-4" />
      case "view":
        return <Eye className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case "ai_query":
        return "AI Conversation"
      case "search":
        return "Search"
      case "view":
        return "View"
      default:
        return type.replace("_", " ")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      {interactions.length > 0 ? (
        <div className="space-y-4">
          {interactions.map((interaction) => {
            const { query, response } = parseContent(interaction)
            const isExpanded = expandedInteraction === interaction.id

            return (
              <div key={interaction.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getInteractionIcon(interaction.interaction_type)}
                      {getInteractionLabel(interaction.interaction_type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(interaction.created_at)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedInteraction(isExpanded ? null : interaction.id)}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </Button>
                </div>

                <div className="mb-2">
                  <h3 className="font-medium">{query}</h3>
                </div>

                {isExpanded && response && (
                  <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                    <p className="whitespace-pre-line">{response}</p>
                  </div>
                )}

                {interaction.interaction_type === "ai_query" && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/education?query=${encodeURIComponent(query)}`}>Continue Conversation</Link>
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No activity history found</p>
          <p className="text-sm mt-2">Your interactions with the platform will appear here</p>
        </div>
      )}
    </div>
  )
}

