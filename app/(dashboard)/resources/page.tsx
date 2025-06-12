import { getArticles } from "@/lib/articles"
import { ResourcesTabs } from "@/components/resources/resources-tabs"

// Get real YouTube video data
const getVideos = () => {
  return [
    {
      id: "3UF0ymVdYLA",
      title: "Stock Market for Beginners",
      description: "Learn the basics of how the stock market works and how to start investing.",
      duration: "15:24",
      thumbnail: "https://i.ytimg.com/vi/3UF0ymVdYLA/maxresdefault.jpg",
    },
    {
      id: "rsFBpGUAZWA",
      title: "What is Mutual Funds?",
      description: "Understand how mutual funds work and why they're a popular investment choice.",
      duration: "12:08",
      thumbnail: "https://i.ytimg.com/vi/rsFBpGUAZWA/maxresdefault.jpg",
    },
    {
      id: "HNPbY6fSeo8",
      title: "Stock Market Investing for Beginners",
      description: "A detailed guide on analyzing stocks and making informed investment decisions.",
      duration: "18:45",
      thumbnail: "https://i.ytimg.com/vi/HNPbY6fSeo8/maxresdefault.jpg",
    },
    {
      id: "4XZIv4__sQA",
      title: "Financial Literacy",
      description: "Learn the essential knowledge and skills for making smart financial decisions.",
      duration: "10:32",
      thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
    },
    {
      id: "rYQgy8QDEBI",
      title: "How Cryptocurrency Actually Works",
      description: "Understand the fundamentals of cryptocurrency and blockchain technology.",
      duration: "14:20",
      thumbnail: "https://i.ytimg.com/vi/rYQgy8QDEBI/maxresdefault.jpg",
    },
    {
      id: "g-hir-4WzfU",
      title: "What is Emergency Funds",
      description: "Learn why emergency funds are crucial and how to build one effectively.",
      duration: "09:15",
      thumbnail: "https://i.ytimg.com/vi/g-hir-4WzfU/maxresdefault.jpg",
    },
  ]
}

export default async function ResourcesPage() {
  // Fetch articles server-side
  const articles = await getArticles()
  const videos = getVideos()

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gradient-heading">Financial Education Resources</h1>
        <p className="text-muted-foreground">Comprehensive learning materials to improve your financial literacy</p>
      </div>

      <ResourcesTabs articles={articles} videos={videos} />
    </div>
  )
}
