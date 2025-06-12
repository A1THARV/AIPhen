"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, BarChart2, Shield, Zap, TrendingUp, Award, Users } from "lucide-react"
import { BeamsBackground } from "@/components/ui/beams-background"
import { FeatureCard } from "@/components/ui/feature-card"
import { GradientPathCard } from "@/components/ui/gradient-path-card"
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee"
import { StarBorder } from "@/components/ui/star-border"

export default function Home() {
  const features = [
    {
      icon: BarChart2,
      title: "Interactive Market Education",
      description:
        "Master financial concepts through hands-on simulations, real market data analysis, and AI-powered insights that adapt to your learning pace.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Market Insights",
      description:
        "Access live market data with AI-powered analysis, trend predictions, and personalized investment recommendations based on your risk profile.",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Zap,
      title: "Smart Expense Tracking",
      description:
        "Automated expense categorization with intelligent spending analysis, budget optimization, and personalized saving recommendations.",
      color: "from-yellow-500/20 to-orange-500/20",
    },
    {
      icon: Shield,
      title: "Financial Health Score",
      description:
        "Comprehensive financial assessment with detailed breakdown, improvement roadmap, and milestone tracking for your financial goals.",
      color: "from-red-500/20 to-pink-500/20",
    },
    {
      icon: Award,
      title: "AI Financial Advisor",
      description:
        "24/7 personalized guidance with contextual advice, goal-based planning, and adaptive strategies that evolve with your financial journey.",
      color: "from-purple-500/20 to-violet-500/20",
    },
    {
      icon: Users,
      title: "Goal Achievement System",
      description:
        "Set, track, and achieve financial milestones with AI-powered progress monitoring, adaptive strategies, and celebration of wins.",
      color: "from-indigo-500/20 to-blue-500/20",
    },
  ]

  const pathSteps = [
    {
      step: "01",
      title: "Learn & Understand",
      description:
        "Master financial concepts through AI-powered interactive lessons, real-world simulations, and personalized learning paths that adapt to your pace.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "Track & Analyze",
      description:
        "Monitor your financial health with intelligent tracking, automated insights, and comprehensive analysis that reveals hidden patterns in your spending.",
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Invest & Grow",
      description:
        "Apply your knowledge with confidence using AI-guided investment strategies, risk assessment, and portfolio optimization tailored to your goals.",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const testimonials = [
    {
      author: {
        name: "Sarah Chen",
        handle: "@sarahfinance",
        avatar: "/placeholder.svg?height=150&width=150",
      },
      text: "AIPhen transformed my relationship with money. I went from financial anxiety to confidently managing a diversified portfolio worth $50K+. The AI explanations made complex concepts finally click.",
    },
    {
      author: {
        name: "Michael Rodriguez",
        handle: "@miketech",
        avatar: "/placeholder.svg?height=150&width=150",
      },
      text: "The AI explanations are incredible. Complex financial concepts finally make sense. I'm now investing with confidence and seeing real returns. Best financial education platform I've used.",
    },
    {
      author: {
        name: "Emma Thompson",
        handle: "@emmahealthcare",
        avatar: "/placeholder.svg?height=150&width=150",
      },
      text: "Best financial education platform I've used. The personalized guidance helped me save $2,000 monthly and start building wealth. The expense tracking feature is a game-changer.",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidinvests",
        avatar: "/placeholder.svg?height=150&width=150",
      },
      text: "As a financial advisor, I recommend AIPhen to all my clients. The AI-powered insights and educational content are top-notch. It's like having a personal finance coach 24/7.",
    },
    {
      author: {
        name: "Lisa Wang",
        handle: "@lisastartup",
        avatar: "/placeholder.svg?height=150&width=150",
      },
      text: "Running a startup, I needed to understand finances better. AIPhen's interactive lessons and real-time market data helped me make informed decisions about our company's investments.",
    },
    {
      author: {
        name: "James Miller",
        handle: "@jamesretires",
        avatar: "/placeholder.svg?height=150&width=150",
      },
      text: "Planning for retirement seemed overwhelming until I found AIPhen. The goal achievement system and AI advisor helped me create a solid retirement strategy. I'm on track to retire early!",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="fixed w-full bg-black/90 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                src="/images/aiphen-logo.png"
                alt="AIPhen Logo"
                width={40}
                height={40}
                className="object-contain filter brightness-0 invert"
                priority
              />
            </div>
            <span className="font-bold text-xl tracking-tight">AIPhen</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Button className="bg-white text-black hover:bg-white/90 font-medium" asChild>
              <Link href="/login?tab=register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Beams Background */}
      <BeamsBackground className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 font-medium text-sm">
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <span>AI-Powered Financial Education</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight">
                <span className="text-white/90">Master Your</span>
                <br />
                <span className="text-white/60 font-light">Financial Future</span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
                Transform your relationship with money through AI-powered education, real-time market insights, and
                personalized financial guidance.
              </p>
            </div>

            {/* CTA Buttons with Star Border */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <StarBorder as="div" color="rgba(255, 255, 255, 1)" speed="2s" className="bg-black">
                <Link
                  href="/login?tab=register"
                  className="flex items-center justify-center gap-2 text-[16px] font-medium text-white/80"
                >
                  Get Started
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </StarBorder>
              <Button
                variant="ghost"
                size="lg"
                className="text-white/60 hover:text-white/80 font-medium px-8 py-3 text-base transition-all duration-300 hover:bg-transparent"
                asChild
              >
                <Link href="#how-it-works">Watch Demo</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>10,000+ active learners</span>
              </div>
            </div>
          </div>
        </div>
      </BeamsBackground>

      {/* Features Section with Grid Cards */}
      <section id="features" className="py-32 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white/90">Everything You Need to Succeed</h2>
            <p className="text-xl text-white/50 leading-relaxed font-light">
              Comprehensive tools and insights to transform your financial knowledge into real wealth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} className="cursor-pointer" />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Gradient Cards */}
      <section id="how-it-works" className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white/90">Your Path to Financial Mastery</h2>
            <p className="text-xl text-white/50 leading-relaxed font-light">
              A proven 3-step system that transforms financial novices into confident investors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pathSteps.map((step, index) => (
              <GradientPathCard key={index} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Marquee */}
      <TestimonialsSection
        title="Trusted by Financial Learners Worldwide"
        description="Join thousands of people who are already transforming their financial future with AIPhen"
        testimonials={testimonials}
        className="bg-black"
      />

      {/* CTA Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_60%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-3xl font-medium text-white/80">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto leading-relaxed">
              Join thousands of learners who are already building wealth with AI-powered financial education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <StarBorder as="div" color="rgba(147, 51, 234, 0.5)" speed="4s" className="bg-black">
                <Link
                  href="/login?tab=register"
                  className="flex items-center justify-center gap-2 text-xs font-medium text-white/80"
                >
                  Start Learning Free
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </StarBorder>
              <div className="text-xs text-white/40">No credit card required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white/70 py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/images/aiphen-logo.png"
                    alt="AIPhen Logo"
                    width={32}
                    height={32}
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <span className="font-bold text-xl text-white">AIPhen</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering financial literacy through AI-powered education and personalized guidance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-sm text-center">
            <p>© {new Date().getFullYear()} AIPhen. All rights reserved. Built with ❤️ for financial empowerment.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
