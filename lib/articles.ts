import { getSupabaseServerAdmin } from "./supabase-server-admin"
import type { Article } from "@/types/articles"

// Get all articles (server-side)
export async function getArticles(): Promise<Article[]> {
  try {
    const supabase = getSupabaseServerAdmin()
    const { data, error } = await supabase.from("articles").select("*")

    if (error) {
      console.error("Error fetching articles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getArticles:", error)
    return []
  }
}

// Get single article by ID
export async function getArticleById(id: number): Promise<Article | null> {
  try {
    const supabase = getSupabaseServerAdmin()
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching article:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getArticleById:", error)
    return null
  }
}
