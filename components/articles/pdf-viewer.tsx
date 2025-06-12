"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Check, Download, AlertCircle, Clock, BookOpen, X, Loader2 } from "lucide-react"
import type { Article } from "@/types/articles"
import { updateArticleProgress, getUserArticleProgressById } from "@/lib/articles-client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface PDFViewerProps {
  article: Article
}

export function PDFViewer({ article }: PDFViewerProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [sessionReadingTime, setSessionReadingTime] = useState(0)
  const [totalReadingTime, setTotalReadingTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  const [showAbout, setShowAbout] = useState(true)

  // Use refs to avoid dependency issues
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const userIdRef = useRef<string | null>(null)
  const sessionTimeRef = useRef<number>(0)
  const totalTimeRef = useRef<number>(0)
  const isCompletedRef = useRef<boolean>(false)
  const hasUnsavedChanges = useRef<boolean>(false)

  const supabase = createClientComponentClient()

  // Update refs when state changes
  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  useEffect(() => {
    sessionTimeRef.current = sessionReadingTime
  }, [sessionReadingTime])

  useEffect(() => {
    totalTimeRef.current = totalReadingTime
  }, [totalReadingTime])

  useEffect(() => {
    isCompletedRef.current = isCompleted
  }, [isCompleted])

  // Load user data and previous progress
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user?.id) {
          setUserId(session.user.id)
          userIdRef.current = session.user.id

          // Load previous progress
          const progress = await getUserArticleProgressById(session.user.id, article.id)
          if (progress) {
            setTotalReadingTime(progress.reading_time)
            totalTimeRef.current = progress.reading_time
            setIsCompleted(progress.completed)
            isCompletedRef.current = progress.completed
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [article.id])

  // Start session timer
  useEffect(() => {
    if (!userId || isLoading) return

    startTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const currentTime = Date.now()
      const sessionTime = Math.floor((currentTime - startTimeRef.current) / 1000)
      setSessionReadingTime(sessionTime)
      sessionTimeRef.current = sessionTime
      hasUnsavedChanges.current = true
    }, 1000)

    intervalRef.current = interval

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [userId, isLoading])

  // Save progress function
  const saveProgress = async () => {
    if (!userIdRef.current || sessionTimeRef.current < 5 || !hasUnsavedChanges.current) {
      return
    }

    try {
      const finalTotalTime = totalTimeRef.current + sessionTimeRef.current
      await updateArticleProgress(
        userIdRef.current,
        article.id,
        isCompletedRef.current,
        finalTotalTime,
        isCompletedRef.current ? 100 : Math.min(Math.floor(finalTotalTime / 60), 100),
      )

      setTotalReadingTime(finalTotalTime)
      totalTimeRef.current = finalTotalTime
      setSessionReadingTime(0)
      sessionTimeRef.current = 0
      startTimeRef.current = Date.now()
      hasUnsavedChanges.current = false
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  // Set up save handlers
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        saveProgress()
        e.preventDefault()
        e.returnValue = ""
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChanges.current) {
        saveProgress()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (hasUnsavedChanges.current) {
        saveProgress()
      }
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const handleMarkComplete = async () => {
    if (!userId) return

    setIsCompleted(true)
    isCompletedRef.current = true
    hasUnsavedChanges.current = true
    await saveProgress()
  }

  const getPdfViewerUrl = () => {
    const pdfUrl = encodeURIComponent(article["PDF Link"] || "")
    return `https://docs.google.com/gview?url=${pdfUrl}&embedded=true`
  }

  const handleIframeLoad = () => {
    setPdfLoading(false)
    setPdfError(false)
  }

  const handleIframeError = () => {
    setPdfLoading(false)
    setPdfError(true)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const currentTotalTime = totalReadingTime + sessionReadingTime

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finance-purple mx-auto mb-4"></div>
          <p className="text-white">Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{article["Module Name"]}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {article["No. of Chapters"]} chapters
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Session: {formatTime(sessionReadingTime)}
                </span>
                <span className="flex items-center gap-1">Total: {formatTime(currentTotalTime)}</span>
                {hasUnsavedChanges.current && <span className="text-yellow-400 text-xs">● Unsaved</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {!isCompleted && (
                <Button onClick={handleMarkComplete} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(article["PDF Link"], "_blank")}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>

              {hasUnsavedChanges.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveProgress}
                  className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/5"
                >
                  Save Progress
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer - Full Height */}
      <div className="h-[calc(100vh-80px)] relative">
        {/* PDF Loading Overlay */}
        {pdfLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading PDF...</span>
            </div>
          </div>
        )}

        {article["PDF Link"] && !pdfError ? (
          <iframe
            src={getPdfViewerUrl()}
            className="w-full h-full border-0"
            title={article["Module Name"]}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="fullscreen"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800">
            <AlertCircle className="h-16 w-16 text-yellow-500 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Unable to load PDF</h3>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              The PDF viewer encountered an issue. You can still access the document using the options below.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => window.open(article["PDF Link"], "_blank")}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = article["PDF Link"] || ""
                  link.download = `${article["Module Name"]}.pdf`
                  link.click()
                }}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dismissible Article Description */}
      {article.Description && showAbout && (
        <div className="fixed bottom-4 right-4 max-w-sm z-20">
          <Card className="glass-card border-white/10 p-4 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAbout(false)}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-white mb-2 pr-6">About this article</h3>
            <p className="text-sm text-gray-300 line-clamp-3">{article.Description}</p>
          </Card>
        </div>
      )}

      {/* Show About Button when dismissed */}
      {!showAbout && (
        <div className="fixed bottom-4 right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAbout(true)}
            className="border-white/10 text-white hover:bg-white/5"
          >
            About
          </Button>
        </div>
      )}
    </div>
  )
}
