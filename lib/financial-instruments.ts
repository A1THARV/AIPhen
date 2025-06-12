import { getServerSupabaseClient } from "./supabase"
import type { FinancialInstrument } from "@/types/financial"

// Create a financial instrument
export async function createFinancialInstrument(
  instrument: Omit<FinancialInstrument, "id" | "created_at" | "updated_at">,
) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.from("financial_instruments").insert(instrument).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data as FinancialInstrument
}

// Get all financial instruments with optional filtering
export async function getFinancialInstruments(filters?: Partial<FinancialInstrument>) {
  const supabase = getServerSupabaseClient()

  let query = supabase.from("financial_instruments").select("*")

  // Apply filters if provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value)
      }
    })
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data as FinancialInstrument[]
}

// Get financial instrument by ID
export async function getFinancialInstrumentById(instrumentId: string) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase.from("financial_instruments").select("*").eq("id", instrumentId).single()

  if (error) {
    throw new Error(error.message)
  }

  return data as FinancialInstrument
}

// Update financial instrument
export async function updateFinancialInstrument(instrumentId: string, instrumentData: Partial<FinancialInstrument>) {
  const supabase = getServerSupabaseClient()

  const { data, error } = await supabase
    .from("financial_instruments")
    .update({ ...instrumentData, updated_at: new Date() })
    .eq("id", instrumentId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as FinancialInstrument
}

// Delete financial instrument
export async function deleteFinancialInstrument(instrumentId: string) {
  const supabase = getServerSupabaseClient()

  const { error } = await supabase.from("financial_instruments").delete().eq("id", instrumentId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
