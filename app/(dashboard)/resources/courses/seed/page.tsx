import { seedCourses } from "@/lib/seed-courses"
import { Button } from "@/components/ui/button"
import { CheckCircle, Database, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SeedCoursesPage() {
  try {
    await seedCourses()

    // Redirect back to courses page after seeding
    redirect("/resources/courses")
  } catch (error) {
    console.error("Error seeding courses:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-md w-full text-center">
        <Database className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Seeding Database</h1>
        <p className="text-white/70 mb-6">
          Creating sample courses, modules, and lessons for your financial education platform...
        </p>
        <div className="flex items-center justify-center gap-2 text-green-400 mb-6">
          <CheckCircle className="h-5 w-5" />
          <span>Database seeded successfully!</span>
        </div>
        <Link href="/resources/courses">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Courses
          </Button>
        </Link>
      </div>
    </div>
  )
}
