import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ArticlesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-3/4 bg-gray-800" />
        <Skeleton className="h-5 w-1/2 mt-2 bg-gray-800" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="glass-card border-white/10 overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-7 w-3/4 bg-gray-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-2/3 bg-gray-800 mb-4" />
                <Skeleton className="h-4 w-1/3 bg-gray-800" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-gray-800" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}
