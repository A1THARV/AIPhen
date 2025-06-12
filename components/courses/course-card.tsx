"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users, Star, Play } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface CourseCardProps {
  course: any
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="glass-card glow glow-purple glass-highlight hover-float overflow-hidden h-full">
        {/* Course Image/Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-white/30" />
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border">
              {course.difficulty || "Beginner"}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-white">{course.rating || 4.8}</span>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {course.description || "Learn essential financial concepts and strategies to build your wealth."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{course.estimated_duration || "4-6 hours"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <BookOpen className="h-4 w-4" />
                <span>{course.lesson_count || "10"} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span>{course.enrolled_count || "1,234"} enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Play className="h-4 w-4" />
                <span>{course.module_count || "3"} modules</span>
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/resources/courses/${course.id}`} className="block">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {course.is_free ? "Start Free Course" : `Enroll for ₹${course.price || 999}`}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
