import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus } from "lucide-react"

interface UserInteraction {
  id: string
  user_id: string
  interaction_type: string
  content: string
  created_at: string
}

interface RecentInteractionsProps {
  interactions: UserInteraction[]
}

export function RecentInteractions({ interactions }: RecentInteractionsProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Recent Interactions</CardTitle>
            <CardDescription>Your recent conversations with the AI assistant</CardDescription>
          </div>
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {interactions.length > 0 ? (
          <div className="space-y-4">
            {interactions.map((interaction) => {
              const { query } = parseContent(interaction)
              const date = new Date(interaction.created_at).toLocaleDateString()

              return (
                <Link
                  key={interaction.id}
                  href={`/education?query=${encodeURIComponent(query)}`}
                  className="block border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium line-clamp-1">{query}</h3>
                    <span className="text-xs text-muted-foreground ml-2">{date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Click to continue this conversation</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent interactions</p>
            <p className="text-sm">Start a conversation with the AI assistant</p>
          </div>
        )}

        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/education">
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

