import { Skeleton } from "@/components/ui/skeleton"

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="container mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-1/3 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>

        {/* Search and Filters Skeleton */}
        <Skeleton className="h-24 w-full rounded-lg" />

        {/* Course Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  )
}
