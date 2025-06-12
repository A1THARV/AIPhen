export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  category: string
  instructor: string
  rating: number
  enrolledCount: number
  price: number
  isFree: boolean
  modules: CourseModule[]
  tags: string[]
  learningObjectives: string[]
  prerequisites: string[]
  createdAt: string
  updatedAt: string
}

export interface CourseModule {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  isLocked: boolean
  estimatedDuration: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  order: number
  type: "video" | "text" | "quiz" | "simulation" | "interactive"
  content: LessonContent
  isCompleted: boolean
  isLocked: boolean
  duration: string
  points: number
}

export interface LessonContent {
  type: "video" | "text" | "quiz" | "simulation" | "interactive"
  data: VideoContent | TextContent | QuizContent | SimulationContent | InteractiveContent
}

export interface VideoContent {
  videoId: string
  videoUrl: string
  transcript?: string
  annotations?: VideoAnnotation[]
  interactiveElements?: InteractiveVideoElement[]
}

export interface VideoAnnotation {
  id: string
  timestamp: number
  title: string
  description: string
  type: "info" | "quiz" | "resource"
}

export interface InteractiveVideoElement {
  id: string
  timestamp: number
  type: "quiz" | "poll" | "resource"
  content: any
}

export interface TextContent {
  content: string
  images?: string[]
  downloadableResources?: DownloadableResource[]
}

export interface QuizContent {
  questions: QuizQuestion[]
  passingScore: number
  timeLimit?: number
  allowRetries: boolean
  showCorrectAnswers: boolean
}

export interface QuizQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "fill-in-blank" | "drag-drop"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
}

export interface SimulationContent {
  type: "investment-calculator" | "portfolio-builder" | "trading-simulator"
  config: any
  instructions: string
  objectives: string[]
}

export interface InteractiveContent {
  type: "scenario" | "case-study" | "exercise"
  title: string
  description: string
  steps: InteractiveStep[]
}

export interface InteractiveStep {
  id: string
  title: string
  content: string
  action: "input" | "choice" | "calculation"
  validation: any
}

export interface DownloadableResource {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
}

export interface UserProgress {
  userId: string
  courseId: string
  completedLessons: string[]
  currentModule: string
  currentLesson: string
  totalPoints: number
  badges: Badge[]
  startedAt: string
  lastAccessedAt: string
  completionPercentage: number
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  category: "completion" | "streak" | "quiz" | "engagement"
}

export interface CourseEnrollment {
  userId: string
  courseId: string
  enrolledAt: string
  progress: UserProgress
}
