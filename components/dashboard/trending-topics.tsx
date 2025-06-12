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
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <div>
            <CardTitle className="text-lg font-heading">Trending Topics</CardTitle>
            <CardDescription className="text-gray-400">Stay updated with the latest financial insights</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <Link key={topic.id} href={`/education?topic=${encodeURIComponent(topic.title)}`} className="block">
                <div className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{topic.title}</h3>
                    <Badge variant="outline" className="ml-2 border-white/10">
                      {topic.category === "education" ? "Learn" : "News"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{topic.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-gray-400">No trending topics available at the moment.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
