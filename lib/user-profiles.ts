import { getServerSupabaseClient } from "./supabase"
import type { UserProfile } from "@/types/user"

// Create a user profile
export async function createUserProfile(userProfile: Omit<UserProfile, "id" | "created_at" | "updated_at">) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.from("user_profiles").insert(userProfile).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data as UserProfile
}

// Get user profile by user ID
export async function getUserProfileByUserId(userId: string) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    throw new Error(error.message)
  }

  return data as UserProfile | null
}

// Update user profile
export async function updateUserProfile(profileId: string, profileData: Partial<UserProfile>) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ ...profileData, updated_at: new Date() })
    .eq("id", profileId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as UserProfile
}

// Delete user profile
export async function deleteUserProfile(profileId: string) {
  const supabase = getServerSupabaseClient()

  const { error } = await supabase.from("user_profiles").delete().eq("id", profileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
