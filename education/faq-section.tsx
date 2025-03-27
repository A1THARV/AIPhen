"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

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

  const categories = [
    { value: "all", label: "All" },
    { value: "basics", label: "Basics" },
    { value: "strategy", label: "Strategy" },
    { value: "tax", label: "Tax" },
    { value: "mutual_funds", label: "Mutual Funds" },
    { value: "stocks", label: "Stocks" },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-400" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription>Common financial questions and answers</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white/5 border-white/10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap h-auto bg-white/5">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="data-[state=active]:bg-blue-600">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeCategory}>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-blue-400">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-white/70 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-6 text-white/60">
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

