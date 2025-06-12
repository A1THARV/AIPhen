"use client"

import type React from "react"
import { motion } from "framer-motion"
import { UserNav } from "./user-nav"
import type { User } from "@supabase/auth-helpers-nextjs"

interface HeaderClientProps {
  children: React.ReactNode
  user: User | null
  userProfile: any
}

export function HeaderClient({ children, user, userProfile }: HeaderClientProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10"
    >
      <div className="container flex h-16 items-center justify-between">
        {children}

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <UserNav user={user} userProfile={userProfile} />
        </motion.div>
      </div>
    </motion.header>
  )
}
