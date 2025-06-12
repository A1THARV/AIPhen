import { getArticleById } from "@/lib/articles"
import { PDFViewer } from "@/components/articles/pdf-viewer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ArticlePageProps {
  params: {
    articleId: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const articleId = Number.parseInt(params.articleId, 10)
  if (isNaN(articleId)) {
    return notFound()
  }

  const article = await getArticleById(articleId)

  if (!article) {
    return notFound()
  }

  return (
    <div className="relative">
      {/* Back Button - Floating */}
      <div className="fixed top-20 left-4 z-20">
        <Link href="/resources">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white hover:bg-white/5 backdrop-blur-sm bg-black/50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
      </div>

      {/* PDF Viewer - Full Screen */}
      <PDFViewer article={article} />
    </div>
  )
}
