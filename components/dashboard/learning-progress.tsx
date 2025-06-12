"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, Clock, ArrowRight, Trophy, Target } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { getUserArticleProgress, getTotalArticlesCount } from "@/lib/articles-client"
import type { ArticleProgress } from "@/types/articles"

export function LearningProgress() {
  const [userId, setUserId] = useState<string | null>(null)
  const [progress, setProgress] = useState<ArticleProgress[]>([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user?.id) {
          setUserId(session.user.id)

          // Get user progress
          const userProgress = await getUserArticleProgress(session.user.id)
          setProgress(userProgress)

          // Get total articles count
          const count = await getTotalArticlesCount()
          setTotalArticles(count)
        }
      } catch (error) {
        console.error("Error loading progress:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProgress()
  }, [])

  // Calculate real stats
  const completedArticles = progress.filter((p) => p.completed).length
  const totalReadingTime = progress.reduce((sum, p) => sum + p.reading_time, 0)
  const progressPercentage = totalArticles > 0 ? (completedArticles / totalArticles) * 100 : 0

  // Calculate reading streak (simplified - articles read in consecutive days)
  const getReadingStreak = () => {
    const today = new Date()
    const recentProgress = progress
      .filter((p) => p.last_read_at)
      .sort((a, b) => new Date(b.last_read_at!).getTime() - new Date(a.last_read_at!).getTime())

    let streak = 0
    const readDates = new Set()

    for (const p of recentProgress) {
      const readDate = new Date(p.last_read_at!).toDateString()
      readDates.add(readDate)
    }

    // Simple streak calculation - count unique days in last 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      if (readDates.has(checkDate.toDateString())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  }

  const currentStreak = getReadingStreak()

  // Calculate points (simplified scoring)
  const pointsEarned = completedArticles * 100 + Math.floor(totalReadingTime / 60) * 10

  // Calculate level based on points
  const level = Math.floor(pointsEarned / 500) + 1

  // Daily goals based on real activity
  const today = new Date().toDateString()
  const todayProgress = progress.filter((p) => p.last_read_at && new Date(p.last_read_at).toDateString() === today)

  const dailyGoals = [
    {
      title: "Read an article",
      description: `You've read ${todayProgress.length} article${todayProgress.length !== 1 ? "s" : ""} today`,
      completed: todayProgress.length > 0,
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Complete an article",
      description: `You've completed ${todayProgress.filter((p) => p.completed).length} article${
        todayProgress.filter((p) => p.completed).length !== 1 ? "s" : ""
      } today`,
      completed: todayProgress.filter((p) => p.completed).length > 0,
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      title: "Read for 30 minutes",
      description: `You've read for ${Math.floor(
        todayProgress.reduce((sum, p) => sum + p.reading_time, 0) / 60,
      )} minutes today`,
      completed: todayProgress.reduce((sum, p) => sum + p.reading_time, 0) >= 1800, // 30 minutes
      icon: <Clock className="h-4 w-4" />,
    },
  ]

  // Recent achievements based on real progress
  const recentAchievements = [
    ...(completedArticles >= 1 ? [{ title: "First Article", icon: "🎯", date: "Recently" }] : []),
    ...(completedArticles >= 5 ? [{ title: "Knowledge Seeker", icon: "📚", date: "Recently" }] : []),
    ...(currentStreak >= 3 ? [{ title: "Reading Streak", icon: "🔥", date: "Recently" }] : []),
    ...(totalReadingTime >= 3600 ? [{ title: "Hour Reader", icon: "⏰", date: "Recently" }] : []),
    ...(level >= 3 ? [{ title: "Level Up", icon: "🚀", date: "Recently" }] : []),
  ].slice(0, 3) // Show only 3 most recent

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-card glow glow-purple glass-highlight hover-float">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-400" />
            <div>
              <CardTitle className="text-lg font-heading">Learning Journey</CardTitle>
              <CardDescription className="text-gray-400">Loading your progress...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-2 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card glow glow-purple glass-highlight hover-float">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-400" />
          <div>
            <CardTitle className="text-lg font-heading">Learning Journey</CardTitle>
            <CardDescription className="text-gray-400">Track your progress and achievements</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-white">Article Progress</h3>
              <p className="text-sm text-gray-400">
                {completedArticles} of {totalArticles} articles completed
              </p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300">Level {level}</Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-3" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{progressPercentage.toFixed(0)}% Complete</span>
            <span className="text-purple-400 font-medium">{pointsEarned} points</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Total reading: {formatTime(totalReadingTime)}</span>
            <span>{currentStreak} day streak</span>
          </div>
        </div>

        {/* Daily Goals */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-white">Daily Goals</h3>
            <Badge className="bg-purple-500/20 text-purple-300">
              {dailyGoals.filter((goal) => goal.completed).length}/{dailyGoals.length} Complete
            </Badge>
          </div>

          {dailyGoals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg glass-card ${goal.completed ? "bg-green-500/10" : ""}`}
            >
              <div
                className={`mt-0.5 p-1 rounded-full ${
                  goal.completed ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400"
                }`}
              >
                {goal.completed ? <CheckCircle className="h-4 w-4" /> : goal.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-white">{goal.title}</h4>
                <p className="text-xs text-gray-400">{goal.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-white">Recent Achievements</h3>
            <div className="space-y-2">
              {recentAchievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 glass-card rounded-lg"
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-white">{achievement.title}</h4>
                    <p className="text-xs text-gray-400">{achievement.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 group" asChild>
            <Link href="/resources/articles">
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="mr-1">Continue Reading</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </Button>

          <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 group" asChild>
            <Link href="/resources">
              <Target className="mr-2 h-4 w-4" />
              <span className="mr-1">Browse Resources</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
