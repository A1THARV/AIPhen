"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Article } from "@/types/articles"

interface ArticleCardProps {
  article: Article
  isCompleted?: boolean
}

export function ArticleCard({ article, isCompleted = false }: ArticleCardProps) {
  return (
    <Card className="glass-card border-white/10 overflow-hidden hover:border-white/20 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
          {article["Module Name"]}
          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 line-clamp-3 mb-4">{article["Description"]}</p>
        <div className="flex items-center text-sm text-gray-500">
          <FileText className="h-4 w-4 mr-1" />
          <span>{article["No. of Chapters"]} chapters</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/resources/articles/${article.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {isCompleted ? "Review Article" : "Read Article"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
