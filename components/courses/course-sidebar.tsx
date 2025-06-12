"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronDown, ChevronRight, FileText, Play, HelpCircle } from "lucide-react"
import { useProgress } from "./progress-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CourseSidebarProps {
  course: any
  currentModuleId: string
  currentLessonId: string
}

export function CourseSidebar({ course, currentModuleId, currentLessonId }: CourseSidebarProps) {
  const { isLessonComplete, getCourseProgress } = useProgress()
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [currentModuleId]: true,
  })

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold">Course Content</h3>
        <div className="flex items-center justify-between text-sm text-white/70 mt-1">
          <span>{course.modules.length} modules</span>
          <span>{getCourseProgress(course.id)}% complete</span>
        </div>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {course.modules.map((module: any) => {
          const isOpen = openModules[module.id]

          return (
            <div key={module.id} className="border-b border-white/10 last:border-b-0">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between p-4 rounded-none hover:bg-white/5",
                  module.id === currentModuleId && "bg-white/5",
                )}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-2 text-left">
                  <span className="font-medium">{module.title}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "transform rotate-180" : "")} />
              </Button>

              {isOpen && (
                <div className="bg-white/5">
                  {module.lessons.map((lesson: any) => {
                    const isComplete = isLessonComplete(course.id, lesson.id)
                    const isCurrent = lesson.id === currentLessonId

                    return (
                      <Link
                        key={lesson.id}
                        href={`/resources/courses/${course.id}?moduleId=${module.id}&lessonId=${lesson.id}`}
                        className={cn(
                          "flex items-center justify-between p-3 pl-6 text-sm border-l-2 hover:bg-white/5",
                          isCurrent ? "border-l-primary bg-white/10 font-medium" : "border-l-transparent text-white/80",
                          isComplete && "text-green-400",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0">{getLessonIcon(lesson.type)}</span>
                          <span className="line-clamp-1">{lesson.title}</span>
                        </div>
                        {isComplete && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
                        {!isComplete && isCurrent && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
