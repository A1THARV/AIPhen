import Link from "next/link"
import Image from "next/image"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { getSupabaseServer } from "@/lib/supabase-server"
import { HeaderClient } from "./header-client"

export async function Header() {
  const supabase = getSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("user_id", user?.id).single()

  return (
    <HeaderClient user={user} userProfile={userProfile}>
      <div className="flex items-center gap-6 mr-8 border-r border-white/10 pr-8">
        <MobileNav />
        <Link href="/dashboard" className="flex items-center gap-3 transition-all duration-300 hover:opacity-90">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              src="/images/aiphen-logo.png"
              alt="AIPhen Logo"
              width={40}
              height={40}
              className="object-contain filter brightness-0 invert"
              priority
            />
          </div>
          <span className="font-bold text-2xl font-heading">AIPhen</span>
        </Link>
      </div>

      <MainNav />
    </HeaderClient>
  )
}
