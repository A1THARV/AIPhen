import { getCourseById } from "@/lib/courses"
import { CourseHeader } from "@/components/courses/course-header"
import { CourseSidebar } from "@/components/courses/course-sidebar"
import { CourseContent } from "@/components/courses/course-content"
import { ProgressProvider } from "@/components/courses/progress-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CoursePageProps {
  params: {
    courseId: string
  }
  searchParams: {
    moduleId?: string
    lessonId?: string
  }
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const course = await getCourseById(params.courseId)

  if (!course) {
    return notFound()
  }

  // Handle case where course exists but has no modules
  if (!course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <CourseHeader course={course} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Course Content Coming Soon</h2>
            <p className="text-white/70 mb-6">
              We're currently preparing the content for this course. Check back soon for exciting lessons!
            </p>
            <Link href="/resources/courses">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Default to first module and lesson if not specified
  const firstModule = course.modules[0]
  const firstLesson = firstModule?.lessons?.[0]

  const currentModuleId = searchParams.moduleId || firstModule?.id
  const currentLessonId = searchParams.lessonId || firstLesson?.id

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <CourseHeader course={course} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="lg:sticky lg:top-24">
                <CourseSidebar course={course} currentModuleId={currentModuleId} currentLessonId={currentLessonId} />
              </div>
            </div>
            <div className="lg:w-3/4">
              <CourseContent course={course} currentModuleId={currentModuleId} currentLessonId={currentLessonId} />
            </div>
          </div>
        </div>
      </div>
    </ProgressProvider>
  )
}
