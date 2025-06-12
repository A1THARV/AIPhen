import { getServerSupabaseClient } from "./supabase"
import type { UserInteraction } from "@/types/user"

// Create a user interaction
export async function createUserInteraction(interaction: Omit<UserInteraction, "id" | "created_at">) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.from("user_interactions").insert(interaction).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data as UserInteraction
}

// Get user interactions by user ID
export async function getUserInteractionsByUserId(userId: string, limit = 10) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_interactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return data as UserInteraction[]
}

// Delete user interaction
export async function deleteUserInteraction(interactionId: string) {
  const supabase = getServerSupabaseClient()

  const { error } = await supabase.from("user_interactions").delete().eq("id", interactionId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
