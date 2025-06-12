import { getArticles } from "@/lib/articles"
import { ArticleCard } from "@/components/articles/article-card"
import { getSupabaseServer } from "@/lib/supabase-server"

export default async function ArticlesPage() {
  const articles = await getArticles()
  const supabase = getSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // We'll implement progress tracking in a future update
  const userId = session?.user?.id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Financial Education Articles</h1>
        <p className="text-gray-400">Expand your financial knowledge with our comprehensive articles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No articles available at the moment.</p>
        </div>
      )}
    </div>
  )
}
