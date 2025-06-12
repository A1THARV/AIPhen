"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import type { UserProfile } from "@/types/user"

export async function completeUserOnboarding(
  userId: string,
  profileData: Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">,
) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })

    // First, check if the user exists in the users table
    const { data: userExists } = await supabase.from("users").select("id").eq("id", userId).single()

    // If user doesn't exist in the users table, create a record
    if (!userExists) {
      // Get user details from auth
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Insert user into users table
      await supabase.from("users").insert({
        id: userId,
        email: user.email,
        password_hash: "auth_managed", // We don't store the actual password hash
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    // Check if user profile already exists
    const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("user_id", userId).single()

    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from("user_profiles")
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProfile.id)
        .select()
        .single()

      if (error) throw error
      return updatedProfile
    } else {
      // Create new profile
      const { data: newProfile, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return newProfile
    }
  } catch (error) {
    console.error("Error completing user onboarding:", error)
    throw new Error("Failed to complete user onboarding")
  }
}

export async function updateUserOnboarding(profileId: string, profileData: Partial<UserProfile>) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })

    const { data: updatedProfile, error } = await supabase
      .from("user_profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .select()
      .single()

    if (error) throw error
    return updatedProfile
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }
}
