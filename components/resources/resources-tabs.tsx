"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  DollarSign,
  GraduationCap,
  LineChart,
  PlayCircle,
  FileText,
  ChevronRight,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Article } from "@/types/articles"

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

interface Video {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
}

interface ResourcesTabsProps {
  articles: Article[]
  videos: Video[]
}

export function ResourcesTabs({ articles, videos }: ResourcesTabsProps) {
  return (
    <Tabs defaultValue="articles">
      <TabsList className="mb-6 glass-card p-1 rounded-lg border border-white/10">
        <TabsTrigger value="articles" className="data-[state=active]:bg-finance-purple data-[state=active]:text-white">
          Articles
        </TabsTrigger>
        <TabsTrigger value="videos" className="data-[state=active]:bg-finance-purple data-[state=active]:text-white">
          Videos
        </TabsTrigger>
        <TabsTrigger value="courses" className="data-[state=active]:bg-finance-purple data-[state=active]:text-white">
          Courses
        </TabsTrigger>
        <TabsTrigger value="tools" className="data-[state=active]:bg-finance-purple data-[state=active]:text-white">
          Tools & Calculators
        </TabsTrigger>
      </TabsList>

      <TabsContent value="articles">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Card className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full glass-card">
                          <FileText className="h-5 w-5 text-finance-purple" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Financial Education</span>
                      </div>
                      <span className="text-xs text-muted-foreground glass-card px-2 py-1 rounded-full">
                        {article["No. of Chapters"] || 1} chapters
                      </span>
                    </div>
                    <CardTitle className="text-xl mt-2">{article["Module Name"]}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {article.Description ||
                        "Comprehensive financial education module covering essential concepts and practical applications."}
                    </CardDescription>
                    <Button variant="outline" className="w-full glass-card hover-float group mt-auto" asChild>
                      <Link href={`/resources/articles/${article.id}`}>
                        <FileText className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className="mr-1">Read Article</span>
                        <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="col-span-full">
              <Card className="glass-card glow-purple glass-highlight p-8 text-center">
                <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Articles Available</h3>
                <p className="text-muted-foreground">
                  Articles are being prepared. Check back soon for exciting financial learning content!
                </p>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </TabsContent>

      <TabsContent value="videos">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {videos.map((video) => (
            <motion.div key={video.id} variants={itemVariants}>
              <Card className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
                <div className="relative group">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full aspect-video object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-finance-purple/90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                      <PlayCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {video.description}
                  </CardDescription>
                  <Button variant="outline" className="w-full glass-card hover-float group mt-auto" asChild>
                    <Link href={`/resources/videos/${video.id}`}>
                      <PlayCircle className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="mr-1">Watch Video</span>
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>

      <TabsContent value="courses">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[
            {
              title: "Personal Finance Fundamentals",
              description:
                "A comprehensive course covering budgeting, saving, investing, and debt management for beginners.",
              lessons: 12,
              duration: "6 hours",
              level: "Beginner",
              icon: <GraduationCap className="h-5 w-5 text-finance-purple" />,
              progress: 25,
              id: 1,
            },
            {
              title: "Stock Market Investing Masterclass",
              description:
                "Learn advanced stock analysis techniques, portfolio management, and long-term investment strategies.",
              lessons: 18,
              duration: "10 hours",
              level: "Intermediate",
              icon: <LineChart className="h-5 w-5 text-finance-purple" />,
              progress: 0,
              id: 2,
            },
            {
              title: "Tax Planning for Maximum Savings",
              description: "Understand tax laws and implement strategies to legally minimize your tax burden.",
              lessons: 8,
              duration: "4 hours",
              level: "All Levels",
              icon: <DollarSign className="h-5 w-5 text-green-400" />,
              progress: 50,
              id: 3,
            },
            {
              title: "Retirement Planning Made Simple",
              description:
                "Comprehensive guide to planning for retirement, including investment strategies and income planning.",
              lessons: 10,
              duration: "5 hours",
              level: "All Levels",
              icon: <GraduationCap className="h-5 w-5 text-finance-purple" />,
              progress: 10,
              id: 4,
            },
          ].map((course, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-full glass-card">{course.icon}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs glass-card px-2 py-1 rounded-full">{course.level}</span>
                      <span className="text-xs glass-card px-2 py-1 rounded-full">{course.lessons} lessons</span>
                      <span className="text-xs glass-card px-2 py-1 rounded-full">{course.duration}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  {course.progress > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 glass-card rounded-full overflow-hidden">
                        <div
                          className="h-full bg-finance-purple rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {course.description}
                  </CardDescription>
                  <Button variant="outline" className="w-full glass-card hover-float group mt-auto" asChild>
                    <Link href={`/resources/courses/${course.id}`}>
                      <BookOpen className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="mr-1">{course.progress > 0 ? "Continue Course" : "Start Course"}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-8 text-center">
          <Button asChild className="bg-finance-purple hover:bg-finance-purple/80">
            <Link href="/resources/courses">
              <GraduationCap className="mr-2 h-4 w-4" />
              Browse All Courses
            </Link>
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="tools">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="md:col-span-3">
            <Card className="glass-card glow-purple glass-highlight hover-float">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient-heading">Financial Calculators</CardTitle>
                <CardDescription>
                  Use these interactive calculators to plan your financial future and make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-full glass-card">
                    <LineChart className="h-5 w-5 text-finance-purple" />
                  </div>
                  <CardTitle>SIP Calculator</CardTitle>
                </div>
                <CardDescription className="line-clamp-3">
                  Calculate the future value of your Systematic Investment Plan (SIP) based on monthly investment
                  amount, expected return rate, and time period.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="w-full glass-card hover-float group" asChild>
                  <Link href="/resources/tools/sip-calculator">
                    <Calculator className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <span className="mr-1">Use Calculator</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-full glass-card">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <CardTitle>EMI Calculator</CardTitle>
                </div>
                <CardDescription className="line-clamp-3">
                  Calculate your Equated Monthly Installment (EMI) for home loans, car loans, or personal loans based on
                  principal amount, interest rate, and loan tenure.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="w-full glass-card hover-float group" asChild>
                  <Link href="/resources/tools/emi-calculator">
                    <Calculator className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <span className="mr-1">Use Calculator</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-full glass-card">
                    <GraduationCap className="h-5 w-5 text-finance-purple" />
                  </div>
                  <CardTitle>Retirement Calculator</CardTitle>
                </div>
                <CardDescription className="line-clamp-3">
                  Plan for your retirement by calculating how much you need to save monthly to achieve your retirement
                  corpus goal.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" className="w-full glass-card hover-float group" asChild>
                  <Link href="/resources/tools/retirement-calculator">
                    <Calculator className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <span className="mr-1">Use Calculator</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}
