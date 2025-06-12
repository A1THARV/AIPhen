"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type ProgressContextType = {
  isLessonComplete: (courseId: string, lessonId: string) => boolean
  markLessonComplete: (courseId: string, lessonId: string) => void
  getCourseProgress: (courseId: string) => number
}

const ProgressContext = createContext<ProgressContextType>({
  isLessonComplete: () => false,
  markLessonComplete: () => {},
  getCourseProgress: () => 0,
})

export function useProgress() {
  return useContext(ProgressContext)
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>({})

  // Load progress from localStorage on client side
  useEffect(() => {
    const savedProgress = localStorage.getItem("courseProgress")
    if (savedProgress) {
      try {
        setCompletedLessons(JSON.parse(savedProgress))
      } catch (e) {
        console.error("Error parsing saved progress:", e)
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    if (Object.keys(completedLessons).length > 0) {
      localStorage.setItem("courseProgress", JSON.stringify(completedLessons))
    }
  }, [completedLessons])

  const isLessonComplete = (courseId: string, lessonId: string) => {
    return completedLessons[courseId]?.includes(lessonId) || false
  }

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setCompletedLessons((prev) => {
      const courseLessons = prev[courseId] || []
      if (courseLessons.includes(lessonId)) {
        return prev
      }
      return {
        ...prev,
        [courseId]: [...courseLessons, lessonId],
      }
    })
  }

  const getCourseProgress = (courseId: string) => {
    // This is a placeholder - in a real app, you'd compare completed lessons to total lessons
    const completed = completedLessons[courseId]?.length || 0
    // Assuming 10 lessons per course for demo purposes
    return Math.min(Math.round((completed / 10) * 100), 100)
  }

  return (
    <ProgressContext.Provider value={{ isLessonComplete, markLessonComplete, getCourseProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}
