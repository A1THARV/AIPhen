import Link from "next/link"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { getServerSupabaseClient } from "@/lib/supabase"
import { UserNav } from "./user-nav"

export async function Header() {
  const supabase = getServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("user_id", user?.id).single()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNav />
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">AIPhen</span>
          </Link>
        </div>
        <MainNav />
        <UserNav user={user} userProfile={userProfile} />
      </div>
    </header>
  )
}

