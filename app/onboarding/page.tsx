import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to AIPhen</h1>
        <p className="text-center text-muted-foreground mb-8">
          Let's get to know you better to personalize your financial journey
        </p>
        <OnboardingForm />
      </div>
    </div>
  )
}
