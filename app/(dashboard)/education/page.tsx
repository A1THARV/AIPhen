import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EducationAI } from "@/components/education/education-ai"
import { FAQSection } from "@/components/education/faq-section"
import { Video, Calculator, FileText, Award, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function EducationPage() {
  // Updated learning paths to match actual article content
  const learningPaths = [
    {
      id: 1,
      "Module Name": "Introduction to Stock Markets",
      Description:
        "The stock market can play a pivotal role in ensuring your financial security. In this module, you will learn how to get started in the stock market, its fundamentals, how it functions, and the various intermediaries that appertain it.",
      "No. of Chapters": 15,
      category: "Financial Education",
    },
    {
      id: 2,
      "Module Name": "Technical Analysis",
      Description:
        "Technical Analysis (TA) helps in developing a point of view. In this module, we will discover the complex attributes, various patterns, indicators, and theories of TA that will help you as a trader to find upright trading opportunities in the market",
      "No. of Chapters": 22,
      category: "Financial Education",
    },
    {
      id: 3,
      "Module Name": "Fundamental Analysis",
      Description:
        "The Fundamental Analysis (FA) module explores Equity research by reading financial statements and annual reports, calculating and analyzing Financial Ratios, and evaluating the intrinsic value of a stock to find long-term investing opportunities.",
      "No. of Chapters": 16,
      category: "Financial Education",
    },
  ]

  const quickResources = [
    {
      title: "Video Tutorials",
      description: "Watch expert-led financial education videos",
      count: "50+ videos",
      icon: <Video className="h-5 w-5 text-red-400" />,
      href: "/resources?tab=videos",
    },
    {
      title: "Financial Calculators",
      description: "Use tools to plan your financial future",
      count: "8 calculators",
      icon: <Calculator className="h-5 w-5 text-orange-400" />,
      href: "/resources/tools/sip-calculator",
    },
    {
      title: "Articles & Guides",
      description: "Read in-depth articles on financial topics",
      count: "100+ articles",
      icon: <FileText className="h-5 w-5 text-cyan-400" />,
      href: "/resources?tab=articles",
    },
  ]

  // Sample FAQs for the FAQ section
  const faqs = [
    {
      id: "faq-1",
      question: "What is the difference between stocks and mutual funds?",
      answer:
        "Stocks represent ownership in a specific company, while mutual funds pool money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other securities. Mutual funds offer diversification and professional management, making them less risky than individual stocks.",
      category: "basics",
    },
    {
      id: "faq-2",
      question: "How do I start investing with a small amount of money?",
      answer:
        "You can start investing with small amounts through SIPs (Systematic Investment Plans) in mutual funds, which allow investments as low as ₹500 per month. You can also consider direct stock investing through discount brokers with zero brokerage fees, or use micro-investing apps that allow you to invest spare change.",
      category: "basics",
    },
    {
      id: "faq-3",
      question: "What tax benefits are available for investments in India?",
      answer:
        "Several tax benefits are available: ELSS mutual funds offer tax deductions up to ₹1.5 lakh under Section 80C, PPF and EPF contributions are tax-deductible and the returns are tax-free, and long-term capital gains on equity investments up to ₹1 lakh per year are tax-exempt.",
      category: "tax",
    },
    {
      id: "faq-4",
      question: "How should I diversify my investment portfolio?",
      answer:
        "A well-diversified portfolio should include a mix of asset classes like equity (stocks, equity mutual funds), debt (bonds, fixed deposits), gold, and real estate. The exact allocation depends on your risk tolerance, investment horizon, and financial goals. A common strategy is to subtract your age from 100 to determine the percentage allocation to equities.",
      category: "strategy",
    },
    {
      id: "faq-5",
      question: "What are the best mutual funds for beginners?",
      answer:
        "For beginners, index funds that track broad market indices like Nifty 50 or Sensex are excellent choices due to their low costs and simplicity. Balanced advantage funds or hybrid funds that invest in both equity and debt are also good options as they offer moderate risk with decent returns. Large-cap funds from reputable AMCs are another beginner-friendly option.",
      category: "mutual_funds",
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="container py-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-slide-up">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient-heading">Financial Education</h1>
            <p className="text-muted-foreground max-w-2xl">
              Learn, grow, and master your financial future with AI-powered education
            </p>
          </div>

          
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* AI Assistant - Center of Attention */}
          <div className="xl:col-span-2 animate-fade-in">
            <EducationAI />
          </div>

          {/* Quick Resources Sidebar */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="glass-card glow glow-purple glass-highlight hover-float">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Resources</CardTitle>
                <CardDescription className="text-white/60">Access learning materials instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickResources.map((resource, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full h-auto p-4 flex items-start gap-3 glass-card hover-glow group"
                    asChild
                  >
                    <Link href={resource.href}>
                      <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                        {resource.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-white">{resource.title}</h3>
                        <p className="text-sm text-white/60 mb-1">{resource.description}</p>
                        <Badge className="bg-white/10 text-white text-xs">{resource.count}</Badge>
                      </div>
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Paths - Using EXACT code provided */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Featured Learning Modules</h2>
            <Button variant="outline" className="glass-card hover-glow" asChild>
              <Link href="/resources?tab=articles">View All Articles</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((article, index) => (
              <Card key={index} className="glass-card glow-purple glass-highlight hover-float h-full flex flex-col">
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
                    <Link href={`/resources?tab=articles`}>
                      <FileText className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="mr-1">Read Article</span>
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <FAQSection faqs={faqs} />
        </div>
      </div>
    </div>
  )
}
