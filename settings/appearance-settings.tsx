"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Moon, Sun, Monitor } from "lucide-react"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [success, setSuccess] = useState<string | null>(null)

  const handleThemeChange = (value: string) => {
    setTheme(value)
    setSuccess("Theme updated successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Theme Preference</h3>

        <RadioGroup
          defaultValue={theme || "system"}
          onValueChange={handleThemeChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
              <Sun className="h-4 w-4" />
              Light
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
              <Moon className="h-4 w-4" />
              Dark
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
              <Monitor className="h-4 w-4" />
              System
            </Label>
          </div>
        </RadioGroup>
      </div>

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="pt-4">
        <h3 className="text-lg font-medium mb-4">Theme Preview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Light Theme</h4>
            <div className="bg-white dark:bg-white text-black p-3 rounded border">
              <p className="font-medium">Sample Content</p>
              <p className="text-sm text-gray-600">This is how content looks in light mode</p>
              <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                Button
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Dark Theme</h4>
            <div className="bg-gray-900 text-white p-3 rounded border">
              <p className="font-medium">Sample Content</p>
              <p className="text-sm text-gray-400">This is how content looks in dark mode</p>
              <Button size="sm" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white">
                Button
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

