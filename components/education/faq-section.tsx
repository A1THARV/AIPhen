"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Tag, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const categories = [
    { value: "all", label: "All", icon: <Filter className="h-3 w-3" /> },
    { value: "basics", label: "Basics", icon: <Tag className="h-3 w-3" /> },
    { value: "strategy", label: "Strategy", icon: <Tag className="h-3 w-3" /> },
    { value: "tax", label: "Tax", icon: <Tag className="h-3 w-3" /> },
    { value: "mutual_funds", label: "Mutual Funds", icon: <Tag className="h-3 w-3" /> },
    { value: "stocks", label: "Stocks", icon: <Tag className="h-3 w-3" /> },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basics":
        return "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
      case "strategy":
        return "bg-green-500/20 text-green-300 hover:bg-green-500/30"
      case "tax":
        return "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
      case "mutual_funds":
        return "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
      case "stocks":
        return "bg-red-500/20 text-red-300 hover:bg-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find((cat) => cat.value === category)
    return categoryObj?.icon || <Tag className="h-3 w-3" />
  }

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-400" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription className="text-gray-400">Common financial questions and answers</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white/5 border-white/10 focus:border-blue-500/50 transition-colors"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap h-auto bg-white/5 p-1 rounded-lg border border-white/10">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1"
              >
                {category.icon}
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeCategory}>
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-2"
              value={expandedFaq || undefined}
              onValueChange={setExpandedFaq}
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-white/10 rounded-lg overflow-hidden mb-2 data-[state=open]:bg-white/5 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:text-blue-400 px-4 py-3 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-start gap-2">
                      <Badge className={`${getCategoryColor(faq.category)} flex items-center gap-1 mt-0.5`}>
                        {getCategoryIcon(faq.category)}
                        {faq.category}
                      </Badge>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 pt-0">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-gray-300 leading-relaxed pl-8 border-l border-white/10"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-6 text-gray-400 bg-white/5 rounded-lg border border-white/10 p-4">
                  {searchQuery ? (
                    <p>No FAQs found matching "{searchQuery}"</p>
                  ) : (
                    <p>No FAQs available for this category.</p>
                  )}
                </div>
              )}
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
