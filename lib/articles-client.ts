import { getSupabaseBrowser, handleAuthError } from "./supabase-browser"
import type { UserArticleProgress } from "@/types/articles"

export async function getTotalArticlesCount(): Promise<number> {
  try {
    const supabase = getSupabaseBrowser()

    const { count, error } = await supabase.from("articles").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Error fetching articles count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getTotalArticlesCount:", error)
    await handleAuthError(error)
    return 0
  }
}

export async function getUserArticleProgress(userId: string): Promise<UserArticleProgress[]> {
  try {
    const supabase = getSupabaseBrowser()

    const { data, error } = await supabase.from("user_article_progress").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user article progress:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserArticleProgress:", error)
    await handleAuthError(error)
    return []
  }
}

export async function getUserArticleProgressById(
  userId: string,
  articleId: number,
): Promise<UserArticleProgress | null> {
  try {
    const supabase = getSupabaseBrowser()

    const { data, error } = await supabase
      .from("user_article_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("article_id", articleId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No record found, return null
        return null
      }
      console.error("Error fetching user article progress by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserArticleProgressById:", error)
    await handleAuthError(error)
    return null
  }
}

export async function updateArticleProgress(
  userId: string,
  articleId: number,
  timeSpent: number,
  isCompleted = false,
): Promise<boolean> {
  try {
    const supabase = getSupabaseBrowser()

    // First, try to get existing progress
    const existingProgress = await getUserArticleProgressById(userId, articleId)

    if (existingProgress) {
      // Update existing record
      const { error } = await supabase
        .from("user_article_progress")
        .update({
          time_spent: existingProgress.time_spent + timeSpent,
          is_completed: isCompleted || existingProgress.is_completed,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("article_id", articleId)

      if (error) {
        console.error("Error updating article progress:", error)
        return false
      }
    } else {
      // Create new record
      const { error } = await supabase.from("user_article_progress").insert({
        user_id: userId,
        article_id: articleId,
        time_spent: timeSpent,
        is_completed: isCompleted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error creating article progress:", error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in updateArticleProgress:", error)
    await handleAuthError(error)
    return false
  }
}
