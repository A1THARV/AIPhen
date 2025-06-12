import { getServerSupabaseClient } from "./supabase"
import type { User } from "@/types/user"

// Create a new user
export async function createUser(email: string, password: string) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Get user by ID
export async function getUserById(userId: string) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    throw new Error(error.message)
  }

  return data as User
}

// Update user
export async function updateUser(userId: string, userData: Partial<User>) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase
    .from("users")
    .update({ ...userData, updated_at: new Date() })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as User
}

// Delete user
export async function deleteUser(userId: string) {
  const supabase = getServerSupabaseClient()

  const { error } = await supabase.from("users").delete().eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
