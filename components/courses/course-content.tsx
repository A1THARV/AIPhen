"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { useProgress } from "./progress-provider"
import { motion } from "framer-motion"
import Link from "next/link"

interface CourseContentProps {
  course: any
  currentModuleId: string
  currentLessonId: string
}

export function CourseContent({ course, currentModuleId, currentLessonId }: CourseContentProps) {
  const { markLessonComplete, isLessonComplete } = useProgress()
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)

  // Find current module and lesson
  const currentModule = course.modules.find((module: any) => module.id === currentModuleId)
  const currentLesson = currentModule?.lessons?.find((lesson: any) => lesson.id === currentLessonId)

  if (!currentModule || !currentLesson) {
    return (
      <Card className="bg-black/50 backdrop-blur-sm border-white/10 p-6 text-center">
        <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Lesson Not Found</h2>
        <p className="text-white/70 mb-6">The requested lesson could not be found.</p>
        <Link href={`/resources/courses/${course.id}`}>
          <Button className="bg-blue-600 hover:bg-blue-700">Return to Course</Button>
        </Link>
      </Card>
    )
  }

  // Find next and previous lessons
  const currentModuleIndex = course.modules.findIndex((module: any) => module.id === currentModuleId)
  const currentLessonIndex = currentModule.lessons.findIndex((lesson: any) => lesson.id === currentLessonId)

  let nextLesson = null
  let nextModule = null
  let prevLesson = null
  let prevModule = null

  // Next lesson logic
  if (currentLessonIndex < currentModule.lessons.length - 1) {
    // Next lesson in same module
    nextLesson = currentModule.lessons[currentLessonIndex + 1]
    nextModule = currentModule
  } else if (currentModuleIndex < course.modules.length - 1) {
    // First lesson in next module
    nextModule = course.modules[currentModuleIndex + 1]
    nextLesson = nextModule.lessons?.[0]
  }

  // Previous lesson logic
  if (currentLessonIndex > 0) {
    // Previous lesson in same module
    prevLesson = currentModule.lessons[currentLessonIndex - 1]
    prevModule = currentModule
  } else if (currentModuleIndex > 0) {
    // Last lesson in previous module
    prevModule = course.modules[currentModuleIndex - 1]
    prevLesson = prevModule.lessons?.[prevModule.lessons.length - 1]
  }

  const handleComplete = () => {
    markLessonComplete(course.id, currentLessonId)
    setShowCompletionMessage(true)
    setTimeout(() => setShowCompletionMessage(false), 3000)
  }

  const isComplete = isLessonComplete(course.id, currentLessonId)

  return (
    <div className="space-y-6">
      <Card className="bg-black/50 backdrop-blur-sm border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
        <p className="text-white/70 mb-6">{currentLesson.description}</p>

        {/* Lesson Content */}
        <div className="prose prose-invert max-w-none mb-6">
          {currentLesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          ) : (
            <p>This lesson content is being prepared. Check back soon!</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-8 border-t border-white/10 pt-6">
          <div>
            {prevLesson && prevModule && (
              <Button variant="outline" asChild>
                <Link
                  href={`/resources/courses/${course.id}?moduleId=${prevModule.id}&lessonId=${prevLesson.id}`}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Lesson
                </Link>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {!isComplete && (
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
            )}
            {isComplete && (
              <span className="text-green-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Completed
              </span>
            )}
            {nextLesson && nextModule && (
              <Button asChild>
                <Link
                  href={`/resources/courses/${course.id}?moduleId=${nextModule.id}&lessonId=${nextLesson.id}`}
                  className="flex items-center gap-2"
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {showCompletionMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3"
        >
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Lesson completed!</p>
            <p className="text-sm text-white/80">+10 points earned</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
