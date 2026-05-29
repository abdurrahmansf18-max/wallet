"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"

export function UserProfile({ mobile = false, isCollapsed }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user", error)
      }
    }
    fetchUser()
  }, [])

  const userName = user ? `${user.first_name} ${user.last_name || ""}`.trim() : "User"
  const userEmail = user?.email || ""
  const initials = userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()

  const handleLogout = (e) => {
    e.preventDefault()
    authApi.logout()
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-10 w-10">
        {user?.profile_image_url && <AvatarImage src={user.profile_image_url} alt={userName} />}
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
      {(!isCollapsed || mobile) && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>
      )}
      {(!isCollapsed || mobile) && (
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Log out</span>
        </Button>
      )}
    </div>
  )
}
