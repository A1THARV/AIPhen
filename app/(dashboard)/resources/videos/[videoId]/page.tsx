import { VideoPlayer } from "@/components/education/video-player"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, PlayCircle } from "lucide-react"
import Link from "next/link"

interface VideoData {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  relatedVideos: {
    id: string
    title: string
    thumbnail: string
    duration: string
  }[]
}

// This would normally come from a database or API
const getVideoData = (videoId: string): VideoData => {
  const videoDatabase: Record<string, VideoData> = {
    "3UF0ymVdYLA": {
      id: "3UF0ymVdYLA",
      title: "Stock Market for Beginners",
      description:
        "This Hindi video serves as an introduction for anyone interested in stock market investing. It addresses common beginner questions like the risks involved, potential earnings, how much money is needed to start, how to open a Demat account, whether the market is like a casino, and how share prices fluctuate. It also touches upon career opportunities in the stock market.",
      duration: "15:24",
      thumbnail: "https://i.ytimg.com/vi/3UF0ymVdYLA/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "rsFBpGUAZWA",
          title: "What is Mutual Funds?",
          thumbnail: "https://i.ytimg.com/vi/rsFBpGUAZWA/maxresdefault.jpg",
          duration: "12:08",
        },
        {
          id: "HNPbY6fSeo8",
          title: "Stock Market Investing for Beginners",
          thumbnail: "https://i.ytimg.com/vi/HNPbY6fSeo8/maxresdefault.jpg",
          duration: "18:45",
        },
        {
          id: "4XZIv4__sQA",
          title: "Financial Literacy",
          thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
          duration: "10:32",
        },
      ],
    },
    rsFBpGUAZWA: {
      id: "rsFBpGUAZWA",
      title: "What is Mutual Funds?",
      description:
        "This video explains the concept of mutual funds for beginners in Hindi. It covers how mutual funds work, the structure involving sponsors, trusts, and Asset Management Companies (AMCs), how units are allocated to investors, and the role of SEBI (Securities and Exchange Board of India) in regulating them. It compares the complexity of starting a mutual fund versus a Portfolio Management Service (PMS).",
      duration: "12:08",
      thumbnail: "https://i.ytimg.com/vi/rsFBpGUAZWA/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "3UF0ymVdYLA",
          title: "Stock Market for Beginners",
          thumbnail: "https://i.ytimg.com/vi/3UF0ymVdYLA/maxresdefault.jpg",
          duration: "15:24",
        },
        {
          id: "HNPbY6fSeo8",
          title: "Stock Market Investing for Beginners",
          thumbnail: "https://i.ytimg.com/vi/HNPbY6fSeo8/maxresdefault.jpg",
          duration: "18:45",
        },
        {
          id: "g-hir-4WzfU",
          title: "What is Emergency Funds",
          thumbnail: "https://i.ytimg.com/vi/g-hir-4WzfU/maxresdefault.jpg",
          duration: "09:15",
        },
      ],
    },
    HNPbY6fSeo8: {
      id: "HNPbY6fSeo8",
      title: "Stock Market Investing for Beginners",
      description:
        "This video offers a detailed guide for beginners on stock market investing. It focuses on the basics, including analyzing stocks, understanding valuation, and making buy decisions. It uses Hindustan Unilever Limited (HUL) as a simple example to explain concepts like market capitalization and Price-to-Earnings (P/E) ratio analysis. The goal is to simplify investing for newcomers.",
      duration: "18:45",
      thumbnail: "https://i.ytimg.com/vi/HNPbY6fSeo8/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "3UF0ymVdYLA",
          title: "Stock Market for Beginners",
          thumbnail: "https://i.ytimg.com/vi/3UF0ymVdYLA/maxresdefault.jpg",
          duration: "15:24",
        },
        {
          id: "rsFBpGUAZWA",
          title: "What is Mutual Funds?",
          thumbnail: "https://i.ytimg.com/vi/rsFBpGUAZWA/maxresdefault.jpg",
          duration: "12:08",
        },
        {
          id: "Zj3ZArkn1sI",
          title: "How to Invest in Your 20s",
          thumbnail: "https://i.ytimg.com/vi/Zj3ZArkn1sI/maxresdefault.jpg",
          duration: "14:53",
        },
      ],
    },
    "4XZIv4__sQA": {
      id: "4XZIv4__sQA",
      title: "Financial Literacy",
      description:
        "This video acts as a beginner's guide to financial literacy, defining it as the knowledge and skills needed for smart personal finance decisions. It covers fundamental concepts like earning income (different types), saving, investing, spending wisely, and understanding credit. The video emphasizes that financial literacy is crucial for managing money effectively, building wealth regardless of income level, and achieving financial goals.",
      duration: "10:32",
      thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "WN9Mks1s4tM",
          title: "Top 10 Financial Concepts You Must Know",
          thumbnail: "https://i.ytimg.com/vi/WN9Mks1s4tM/maxresdefault.jpg",
          duration: "16:37",
        },
        {
          id: "GvVJKFyS0WI",
          title: "7 Steps To Master Your Money",
          thumbnail: "https://i.ytimg.com/vi/GvVJKFyS0WI/maxresdefault.jpg",
          duration: "13:21",
        },
        {
          id: "-FP7IVNN4bI",
          title: "13 Hacks to Save Your Money",
          thumbnail: "https://i.ytimg.com/vi/-FP7IVNN4bI/maxresdefault.jpg",
          duration: "11:45",
        },
      ],
    },
    rYQgy8QDEBI: {
      id: "rYQgy8QDEBI",
      title: "How Cryptocurrency Actually Works",
      description:
        "This video explains the fundamentals of cryptocurrency. It clarifies that cryptocurrencies are entirely digital assets, not physical coins. Key concepts covered include the decentralized nature of crypto, the use of a public ledger (like blockchain) to record all transactions, and the security provided by cryptography. It contrasts this system with traditional banking and touches upon different types of cryptocurrencies like Bitcoin and Ethereum.",
      duration: "14:20",
      thumbnail: "https://i.ytimg.com/vi/rYQgy8QDEBI/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "4XZIv4__sQA",
          title: "Financial Literacy",
          thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
          duration: "10:32",
        },
        {
          id: "WN9Mks1s4tM",
          title: "Top 10 Financial Concepts You Must Know",
          thumbnail: "https://i.ytimg.com/vi/WN9Mks1s4tM/maxresdefault.jpg",
          duration: "16:37",
        },
        {
          id: "HNPbY6fSeo8",
          title: "Stock Market Investing for Beginners",
          thumbnail: "https://i.ytimg.com/vi/HNPbY6fSeo8/maxresdefault.jpg",
          duration: "18:45",
        },
      ],
    },
    "g-hir-4WzfU": {
      id: "g-hir-4WzfU",
      title: "What is Emergency Funds",
      description:
        "This video explains the concept of an emergency fund - money set aside to cover unexpected financial emergencies and living expenses. It covers why emergency funds are important, how much you should save (typically 3-6 months of expenses), where to keep your emergency fund, and how to build it up over time. The video emphasizes that having this financial safety net is a crucial first step in building financial security.",
      duration: "09:15",
      thumbnail: "https://i.ytimg.com/vi/g-hir-4WzfU/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "-FP7IVNN4bI",
          title: "13 Hacks to Save Your Money",
          thumbnail: "https://i.ytimg.com/vi/-FP7IVNN4bI/maxresdefault.jpg",
          duration: "11:45",
        },
        {
          id: "GvVJKFyS0WI",
          title: "7 Steps To Master Your Money",
          thumbnail: "https://i.ytimg.com/vi/GvVJKFyS0WI/maxresdefault.jpg",
          duration: "13:21",
        },
        {
          id: "Zj3ZArkn1sI",
          title: "How to Invest in Your 20s",
          thumbnail: "https://i.ytimg.com/vi/Zj3ZArkn1sI/maxresdefault.jpg",
          duration: "14:53",
        },
      ],
    },
    Zj3ZArkn1sI: {
      id: "Zj3ZArkn1sI",
      title: "How to Invest in Your 20s",
      description:
        "This video offers guidance tailored to young adults in their 20s on starting their investment journey. It covers why starting early is beneficial (compound interest), different investment options suitable for young investors (stocks, mutual funds, ETFs), strategies for long-term growth, and managing risk. The video emphasizes that your 20s are the perfect time to build financial habits that will benefit you for decades to come.",
      duration: "14:53",
      thumbnail: "https://i.ytimg.com/vi/Zj3ZArkn1sI/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "HNPbY6fSeo8",
          title: "Stock Market Investing for Beginners",
          thumbnail: "https://i.ytimg.com/vi/HNPbY6fSeo8/maxresdefault.jpg",
          duration: "18:45",
        },
        {
          id: "rsFBpGUAZWA",
          title: "What is Mutual Funds?",
          thumbnail: "https://i.ytimg.com/vi/rsFBpGUAZWA/maxresdefault.jpg",
          duration: "12:08",
        },
        {
          id: "g-hir-4WzfU",
          title: "What is Emergency Funds",
          thumbnail: "https://i.ytimg.com/vi/g-hir-4WzfU/maxresdefault.jpg",
          duration: "09:15",
        },
      ],
    },
    "-FP7IVNN4bI": {
      id: "-FP7IVNN4bI",
      title: "13 Hacks to Save Your Money",
      description:
        "This video presents thirteen practical tips, tricks, and strategies designed to help viewers reduce their expenses and save more money effectively. It likely covers areas like budgeting, reducing unnecessary expenses, smart shopping techniques, automating savings, and avoiding common money traps. The video aims to provide actionable advice that viewers can implement immediately to improve their financial situation.",
      duration: "11:45",
      thumbnail: "https://i.ytimg.com/vi/-FP7IVNN4bI/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "g-hir-4WzfU",
          title: "What is Emergency Funds",
          thumbnail: "https://i.ytimg.com/vi/g-hir-4WzfU/maxresdefault.jpg",
          duration: "09:15",
        },
        {
          id: "GvVJKFyS0WI",
          title: "7 Steps To Master Your Money",
          thumbnail: "https://i.ytimg.com/vi/GvVJKFyS0WI/maxresdefault.jpg",
          duration: "13:21",
        },
        {
          id: "4XZIv4__sQA",
          title: "Financial Literacy",
          thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
          duration: "10:32",
        },
      ],
    },
    WN9Mks1s4tM: {
      id: "WN9Mks1s4tM",
      title: "Top 10 Financial Concepts You Must Know",
      description:
        "This video explains ten essential financial concepts that are fundamental to understanding personal finance and making informed financial decisions. These likely include concepts like compound interest, inflation, diversification, asset allocation, risk management, tax efficiency, debt management, emergency funds, retirement planning, and budgeting. Understanding these core concepts provides a solid foundation for financial literacy.",
      duration: "16:37",
      thumbnail: "https://i.ytimg.com/vi/WN9Mks1s4tM/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "4XZIv4__sQA",
          title: "Financial Literacy",
          thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
          duration: "10:32",
        },
        {
          id: "GvVJKFyS0WI",
          title: "7 Steps To Master Your Money",
          thumbnail: "https://i.ytimg.com/vi/GvVJKFyS0WI/maxresdefault.jpg",
          duration: "13:21",
        },
        {
          id: "rYQgy8QDEBI",
          title: "How Cryptocurrency Actually Works",
          thumbnail: "https://i.ytimg.com/vi/rYQgy8QDEBI/maxresdefault.jpg",
          duration: "14:20",
        },
      ],
    },
    GvVJKFyS0WI: {
      id: "GvVJKFyS0WI",
      title: "7 Steps To Master Your Money",
      description:
        "This video outlines a seven-step process designed to help viewers gain control over their finances. It likely covers aspects like creating a budget, building an emergency fund, paying off debt, saving for retirement, investing wisely, protecting your assets with insurance, and estate planning. The video provides a structured approach to financial management that can help viewers achieve financial freedom.",
      duration: "13:21",
      thumbnail: "https://i.ytimg.com/vi/GvVJKFyS0WI/maxresdefault.jpg",
      relatedVideos: [
        {
          id: "WN9Mks1s4tM",
          title: "Top 10 Financial Concepts You Must Know",
          thumbnail: "https://i.ytimg.com/vi/WN9Mks1s4tM/maxresdefault.jpg",
          duration: "16:37",
        },
        {
          id: "-FP7IVNN4bI",
          title: "13 Hacks to Save Your Money",
          thumbnail: "https://i.ytimg.com/vi/-FP7IVNN4bI/maxresdefault.jpg",
          duration: "11:45",
        },
        {
          id: "4XZIv4__sQA",
          title: "Financial Literacy",
          thumbnail: "https://i.ytimg.com/vi/4XZIv4__sQA/maxresdefault.jpg",
          duration: "10:32",
        },
      ],
    },
  }

  return (
    videoDatabase[videoId] || {
      id: videoId,
      title: "Financial Education Video",
      description: "Learn about personal finance and investing with our educational videos.",
      duration: "10:00",
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      relatedVideos: [],
    }
  )
}

export default function VideoPage({ params }: { params: { videoId: string } }) {
  const videoData = getVideoData(params.videoId)

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer
            videoId={videoData.id}
            title={videoData.title}
            description={videoData.description}
            thumbnail={videoData.thumbnail}
          />

          <Card className="mt-6 bg-black/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/resources?tab=articles"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="font-medium">Related Articles</h3>
                    <p className="text-sm text-white/70">Read in-depth articles on this topic</p>
                  </div>
                </Link>
                <Link
                  href="/resources?tab=courses"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <div>
                    <h3 className="font-medium">Full Courses</h3>
                    <p className="text-sm text-white/70">Take a comprehensive course</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-black/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Related Videos</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {videoData.relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/resources/videos/${video.id}`}
                    className="flex items-start gap-3 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 text-xs rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                      <div className="flex items-center mt-1">
                        <PlayCircle className="h-3 w-3 text-white/60 mr-1" />
                        <span className="text-xs text-white/60">Watch now</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
