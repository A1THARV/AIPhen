"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export async function addInstrumentToWatchlist(userId: string, instrumentId: string) {
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

    // Now add to watchlist
    const { data: watchlistItem, error } = await supabase
      .from("user_watchlist")
      .insert({
        user_id: userId,
        instrument_id: instrumentId,
      })
      .select()
      .single()

    if (error) throw error
    return watchlistItem
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    throw new Error("Failed to add instrument to watchlist")
  }
}

export async function getWatchlist(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })

    const { data: watchlist, error } = await supabase
      .from("user_watchlist")
      .select(`
        *,
        financial_instruments (*)
      `)
      .eq("user_id", userId)

    if (error) throw error
    return watchlist
  } catch (error) {
    console.error("Error getting watchlist:", error)
    throw new Error("Failed to get watchlist")
  }
}

export async function removeInstrumentFromWatchlist(userId: string, instrumentId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })

    const { error } = await supabase.from("user_watchlist").delete().match({
      user_id: userId,
      instrument_id: instrumentId,
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    throw new Error("Failed to remove instrument from watchlist")
  }
}
