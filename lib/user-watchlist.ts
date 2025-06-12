import { getServerSupabaseClient } from "./supabase"
import type { UserWatchlistItem } from "@/types/user"

// Add an instrument to user's watchlist
export async function addToWatchlist(userId: string, instrumentId: string) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_watchlist")
    .insert({
      user_id: userId,
      instrument_id: instrumentId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as UserWatchlistItem
}

// Get user's watchlist
export async function getUserWatchlist(userId: string) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_watchlist")
    .select(`
      *,
      financial_instruments (*)
    `)
    .eq("user_id", userId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Remove an instrument from user's watchlist
export async function removeFromWatchlist(userId: string, instrumentId: string) {
  const supabase = getServerSupabaseClient()

  const { error } = await supabase.from("user_watchlist").delete().match({
    user_id: userId,
    instrument_id: instrumentId,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}
