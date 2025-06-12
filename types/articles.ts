export interface Article {
  id: number
  "No. of Chapters": number
  "Module Name": string
  Description?: string
  "PDF Link"?: string
}

export interface ArticleProgress {
  progress_id: string
  user_id: string
  article_id: number
  completed: boolean
  reading_time: number
  completion_percentage: number
  last_read_at: string
  created_at: string
  updated_at: string
}
