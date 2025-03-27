import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface TrendingTopic {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  created_at: string
}

interface TrendingTopicsProps {
  topics: TrendingTopic[]
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Trending Topics</CardTitle>
          <CardDescription>Stay updated with the latest financial insights</CardDescription>
        </div>
        <TrendingUp className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <Link key={topic.id} href={`/education?topic=${encodeURIComponent(topic.title)}`} className="block">
                <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{topic.title}</h3>
                    <Badge variant="outline" className="ml-2">
                      {topic.category === "education" ? "Learn" : "News"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-muted-foreground">
              No trending topics available at the moment.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

