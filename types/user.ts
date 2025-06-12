export interface User {
  id: string
  email: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  risk_tolerance: string | null
  investment_goal: string | null
  current_portfolio_value: number | null
  target_portfolio_value: number | null
  investment_horizon: string | null
  created_at: string
  updated_at: string
}

export interface UserInteraction {
  id: string
  user_id: string
  interaction_type: string
  content: string
  created_at: string
}

export interface UserWatchlistItem {
  id: string
  user_id: string
  instrument_id: string
  created_at: string
}
