import { getServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/profile/profile-form"
import { WatchlistTable } from "@/components/profile/watchlist-table"
import { InteractionHistory } from "@/components/profile/interaction-history"

export default async function ProfilePage() {
  const supabase = getServerSupabaseClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("user_id", user?.id).single()

  // Fetch user watchlist
  const { data: watchlist } = await supabase
    .from("user_watchlist")
    .select(`
      *,
      financial_instruments (*)
    `)
    .eq("user_id", user?.id)

  // Fetch recent interactions
  const { data: interactions } = await supabase
    .from("user_interactions")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-2 text-gradient-heading">Your Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your profile and view your activity</p>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8 glass-card">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 gap-6">
            <Card className="glass-card glow glow-purple glass-highlight hover-float">
              <CardHeader>
                <CardTitle className="text-gradient-heading">Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm userProfile={userProfile} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="watchlist">
          <Card className="glass-card glow glow-purple glass-highlight hover-float">
            <CardHeader>
              <CardTitle className="text-gradient-heading">Your Watchlist</CardTitle>
              <CardDescription>Financial instruments you're tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <WatchlistTable watchlist={watchlist || []} userId={user?.id || ""} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="glass-card glow glow-purple glass-highlight hover-float">
            <CardHeader>
              <CardTitle className="text-gradient-heading">Activity History</CardTitle>
              <CardDescription>Your recent interactions with the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <InteractionHistory interactions={interactions || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
