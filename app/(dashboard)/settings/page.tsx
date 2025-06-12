import { getServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"

export default async function SettingsPage() {
  const supabase = getServerSupabaseClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-2 text-gradient-heading">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account settings and preferences</p>

      <Tabs defaultValue="account">
        <TabsList className="mb-8 glass-card">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="glass-card glow glow-purple glass-highlight hover-float">
            <CardHeader>
              <CardTitle className="text-gradient-heading">Account Settings</CardTitle>
              <CardDescription>Manage your account details and security</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettings user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card glow glow-purple glass-highlight hover-float">
            <CardHeader>
              <CardTitle className="text-gradient-heading">Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings userId={user?.id || ""} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="glass-card glow glow-purple glass-highlight hover-float">
            <CardHeader>
              <CardTitle className="text-gradient-heading">Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
