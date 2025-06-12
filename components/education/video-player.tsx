"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Bookmark, Play } from "lucide-react"
import Link from "next/link"

interface VideoPlayerProps {
  videoId: string
  title?: string
  description?: string
  thumbnail?: string
}

export function VideoPlayer({ videoId, title, description, thumbnail }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resources?tab=videos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Videos
            </Link>
          </Button>
        </div>
        {title && <CardTitle className="text-2xl mt-2">{title}</CardTitle>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-black/80 rounded-lg overflow-hidden relative">
          {!isPlaying && thumbnail ? (
            <div className="relative w-full h-full">
              <img
                src={thumbnail || "/placeholder.svg"}
                alt={title || "Video thumbnail"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
              </div>
            </div>
          ) : isLoaded ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? "1" : "0"}&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white/60">Loading video...</p>
            </div>
          )}
        </div>

        {description && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <CardDescription className="text-white/90 text-sm leading-relaxed">{description}</CardDescription>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="mr-2 h-4 w-4" />
              Dislike
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
