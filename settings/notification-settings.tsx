"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface NotificationSettingsProps {
  userId: string
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Mock notification settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketUpdates: true,
    watchlistAlerts: true,
    educationalContent: true,
    promotionalEmails: false,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Mock API call to save notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Notification preferences saved successfully")
    } catch (error: any) {
      setError(error.message || "An error occurred while saving your preferences")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
          </div>
          <Switch checked={settings.emailNotifications} onCheckedChange={() => handleToggle("emailNotifications")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Market Updates</h3>
            <p className="text-sm text-muted-foreground">Receive updates about market movements and news</p>
          </div>
          <Switch checked={settings.marketUpdates} onCheckedChange={() => handleToggle("marketUpdates")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Watchlist Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Get notified about significant changes to items in your watchlist
            </p>
          </div>
          <Switch checked={settings.watchlistAlerts} onCheckedChange={() => handleToggle("watchlistAlerts")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Educational Content</h3>
            <p className="text-sm text-muted-foreground">Receive educational articles and resources about investing</p>
          </div>
          <Switch checked={settings.educationalContent} onCheckedChange={() => handleToggle("educationalContent")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Promotional Emails</h3>
            <p className="text-sm text-muted-foreground">Receive promotional offers and marketing communications</p>
          </div>
          <Switch checked={settings.promotionalEmails} onCheckedChange={() => handleToggle("promotionalEmails")} />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  )
}

