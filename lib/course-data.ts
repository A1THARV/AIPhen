import type { Course } from "@/types/course"

export const sampleCourses: Course[] = [
  {
    id: "personal-finance-fundamentals",
    title: "Personal Finance Fundamentals",
    description: "A comprehensive course covering budgeting, saving, investing, and debt management for beginners.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "6 hours",
    level: "Beginner",
    category: "Personal Finance",
    instructor: "Dr. Priya Sharma",
    rating: 4.8,
    enrolledCount: 1250,
    price: 0,
    isFree: true,
    tags: ["budgeting", "saving", "investing", "debt management"],
    learningObjectives: [
      "Create and maintain a personal budget",
      "Understand different types of savings accounts",
      "Learn basic investment principles",
      "Develop strategies for debt management",
    ],
    prerequisites: ["Basic math skills", "Understanding of income and expenses"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    modules: [
      {
        id: "module-1",
        title: "Introduction to Personal Finance",
        description: "Learn the basics of personal finance and why it matters",
        order: 1,
        isLocked: false,
        estimatedDuration: "1.5 hours",
        lessons: [
          {
            id: "lesson-1-1",
            title: "What is Personal Finance?",
            description: "Understanding the fundamentals of personal finance",
            order: 1,
            type: "video",
            isCompleted: false,
            isLocked: false,
            duration: "15 minutes",
            points: 10,
            content: {
              type: "video",
              data: {
                videoId: "4XZIv4__sQA",
                videoUrl: "https://www.youtube.com/watch?v=4XZIv4__sQA",
                transcript: "Personal finance is the management of your money...",
                annotations: [
                  {
                    id: "ann-1",
                    timestamp: 120,
                    title: "Key Concept: Budgeting",
                    description: "Budgeting is the foundation of personal finance",
                    type: "info",
                  },
                ],
              },
            },
          },
          {
            id: "lesson-1-2",
            title: "Setting Financial Goals",
            description: "Learn how to set SMART financial goals",
            order: 2,
            type: "text",
            isCompleted: false,
            isLocked: false,
            duration: "20 minutes",
            points: 15,
            content: {
              type: "text",
              data: {
                content: `# Setting Financial Goals

Financial goals are the foundation of a successful financial plan. They give you direction and help you make informed decisions about your money.

## Types of Financial Goals

### Short-term Goals (1 year or less)
- Building an emergency fund
- Paying off credit card debt
- Saving for a vacation

### Medium-term Goals (1-5 years)
- Saving for a car down payment
- Building a larger emergency fund
- Paying off student loans

### Long-term Goals (5+ years)
- Saving for retirement
- Buying a home
- Children's education fund

## SMART Goals Framework

Make your financial goals **SMART**:
- **Specific**: Clearly defined
- **Measurable**: Quantifiable
- **Achievable**: Realistic
- **Relevant**: Important to you
- **Time-bound**: Has a deadline

### Example of a SMART Financial Goal
Instead of "I want to save money," try:
"I will save ₹50,000 for an emergency fund by December 31st, 2024, by setting aside ₹4,200 each month."`,
                downloadableResources: [
                  {
                    id: "resource-1",
                    title: "Goal Setting Worksheet",
                    description: "A printable worksheet to help you set your financial goals",
                    fileUrl: "/resources/goal-setting-worksheet.pdf",
                    fileType: "PDF",
                    fileSize: "2.5 MB",
                  },
                ],
              },
            },
          },
          {
            id: "lesson-1-3",
            title: "Knowledge Check: Financial Basics",
            description: "Test your understanding of personal finance basics",
            order: 3,
            type: "quiz",
            isCompleted: false,
            isLocked: false,
            duration: "10 minutes",
            points: 25,
            content: {
              type: "quiz",
              data: {
                passingScore: 70,
                timeLimit: 600,
                allowRetries: true,
                showCorrectAnswers: true,
                questions: [
                  {
                    id: "q1",
                    type: "multiple-choice",
                    question: "What is the recommended size for an emergency fund?",
                    options: [
                      "1-2 months of expenses",
                      "3-6 months of expenses",
                      "12 months of expenses",
                      "No emergency fund needed",
                    ],
                    correctAnswer: "3-6 months of expenses",
                    explanation:
                      "Financial experts recommend having 3-6 months of living expenses saved for emergencies.",
                    points: 10,
                  },
                  {
                    id: "q2",
                    type: "true-false",
                    question: "You should invest all your money in stocks for maximum returns.",
                    options: ["True", "False"],
                    correctAnswer: "False",
                    explanation:
                      "Diversification is key. You should spread your investments across different asset classes to manage risk.",
                    points: 10,
                  },
                  {
                    id: "q3",
                    type: "fill-in-blank",
                    question:
                      "The SMART goal framework stands for Specific, Measurable, Achievable, _____, and Time-bound.",
                    correctAnswer: "Relevant",
                    explanation: "SMART goals must be Relevant to your personal situation and values.",
                    points: 5,
                  },
                ],
              },
            },
          },
        ],
      },
      {
        id: "module-2",
        title: "Budgeting and Expense Tracking",
        description: "Master the art of budgeting and tracking your expenses",
        order: 2,
        isLocked: false,
        estimatedDuration: "2 hours",
        lessons: [
          {
            id: "lesson-2-1",
            title: "Creating Your First Budget",
            description: "Step-by-step guide to creating a personal budget",
            order: 1,
            type: "interactive",
            isCompleted: false,
            isLocked: false,
            duration: "30 minutes",
            points: 20,
            content: {
              type: "interactive",
              data: {
                type: "exercise",
                title: "Budget Builder Exercise",
                description: "Create your personal budget using our interactive tool",
                steps: [
                  {
                    id: "step-1",
                    title: "Calculate Monthly Income",
                    content: "Enter your monthly income from all sources",
                    action: "input",
                    validation: { type: "number", min: 0 },
                  },
                  {
                    id: "step-2",
                    title: "List Fixed Expenses",
                    content: "Enter your fixed monthly expenses (rent, utilities, etc.)",
                    action: "input",
                    validation: { type: "number", min: 0 },
                  },
                  {
                    id: "step-3",
                    title: "Estimate Variable Expenses",
                    content: "Estimate your variable expenses (food, entertainment, etc.)",
                    action: "input",
                    validation: { type: "number", min: 0 },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: "stock-market-investing",
    title: "Stock Market Investing Masterclass",
    description: "Learn advanced stock analysis techniques, portfolio management, and long-term investment strategies.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "10 hours",
    level: "Intermediate",
    category: "Investing",
    instructor: "Rajesh Kumar",
    rating: 4.9,
    enrolledCount: 850,
    price: 2999,
    isFree: false,
    tags: ["stocks", "investing", "portfolio", "analysis"],
    learningObjectives: [
      "Analyze stocks using fundamental and technical analysis",
      "Build a diversified investment portfolio",
      "Understand market trends and cycles",
      "Develop a long-term investment strategy",
    ],
    prerequisites: ["Basic understanding of financial markets", "Completed Personal Finance Fundamentals"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-25",
    modules: [
      {
        id: "module-1",
        title: "Stock Market Fundamentals",
        description: "Understanding how the stock market works",
        order: 1,
        isLocked: false,
        estimatedDuration: "2.5 hours",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Introduction to Stock Markets",
            description: "Learn the basics of stock markets and how they operate",
            order: 1,
            type: "video",
            isCompleted: false,
            isLocked: false,
            duration: "25 minutes",
            points: 15,
            content: {
              type: "video",
              data: {
                videoId: "HNPbY6fSeo8",
                videoUrl: "https://www.youtube.com/watch?v=HNPbY6fSeo8",
                transcript: "The stock market is a platform where shares of companies are traded...",
              },
            },
          },
        ],
      },
    ],
  },
]

export function getCourseById(courseId: string): Course | undefined {
  return sampleCourses.find((course) => course.id === courseId)
}

export function getCoursesByCategory(category: string): Course[] {
  return sampleCourses.filter((course) => course.category === category)
}

export function getAllCourses(): Course[] {
  return sampleCourses
}
