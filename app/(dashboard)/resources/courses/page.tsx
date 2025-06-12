import { getCourses, seedCourses } from "@/lib/courses"
import { CourseCard } from "@/components/courses/course-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function CoursesPage() {
  let courses = await getCourses()

  // If no courses exist, seed the database
  if (!courses || courses.length === 0) {
    console.log("No courses found, attempting to seed database...")
    const seedResult = await seedCourses()
    if (seedResult.success) {
      // Fetch courses again after seeding
      courses = await getCourses()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Financial Education Courses</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Master your finances with our comprehensive courses designed for every skill level
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/50 backdrop-blur-sm border-white/10">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{courses?.length || 0}</div>
              <div className="text-white/70">Courses Available</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 backdrop-blur-sm border-white/10">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">10,000+</div>
              <div className="text-white/70">Students Enrolled</div>
            </CardContent>
          </Card>
          <Card className="bg-black/50 backdrop-blur-sm border-white/10">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-white/70">Hours of Content</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Card className="bg-black/50 backdrop-blur-sm border-white/10 p-8 text-center">
            <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Courses Available</h2>
            <p className="text-white/70 mb-6">
              We're currently preparing our course content. Check back soon for exciting financial education courses!
            </p>
            <Link href="/resources/courses/seed">
              <Button className="bg-blue-600 hover:bg-blue-700">Initialize Course Database</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
