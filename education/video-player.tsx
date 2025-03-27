"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Bookmark } from "lucide-react"
import Link from "next/link"

interface VideoPlayerProps {
  videoId: string
  title?: string
  description?: string
}

export function VideoPlayer({ videoId, title, description }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10">
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
        <div className="aspect-video w-full bg-black/80 rounded-lg overflow-hidden">
          {isLoaded ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
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

        {description && <CardDescription className="text-white/70">{description}</CardDescription>}

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

