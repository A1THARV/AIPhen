import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users, Star, Share2 } from "lucide-react"

interface CourseHeaderProps {
  course: any
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Course Image */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg overflow-hidden flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-white/30" />
            </div>
          </div>

          {/* Course Info */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {course.category || "Personal Finance"}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {course.difficulty || "Beginner"}
              </Badge>
              {course.is_free && <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Free</Badge>}
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-white/70 mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="h-4 w-4" />
                <span>{course.estimated_duration || "4-6 hours"}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Users className="h-4 w-4" />
                <span>{course.enrolled_count || "1,234"} enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span>{course.rating || "4.8"} rating</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">Start Learning</Button>
              <Button variant="outline" className="border-white/10 hover:bg-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
