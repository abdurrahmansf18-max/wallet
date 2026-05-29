"use client"

import { useState, useEffect } from "react"
import { PanelLeft, Menu } from "lucide-react"
import { searchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ThemeConfig } from "@/components/theme/theme-config"
import { useThemeContext } from "@/components/theme/theme-provider"
import { SearchDialog } from "./search-dialog"
import { NotificationsMenu } from "./notifications-menu"
import { ProfileMenu } from "./profile-menu"
import { ThemeToggle } from "./theme-toggle"
import { AuthButtons } from "./auth-buttons"

export function VerticalHeader({ toggleSidebar, setMobileOpen }) {
  const { direction } = useThemeContext()
  const [isLoggedIn, setIsLoggedIn] = useState(true) // For demo purposes
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const results = await searchApi.globalSearch(searchQuery)
          setSearchResults(results)
        } catch (error) {
          console.error("Search failed:", error)
          setSearchResults([])
        }
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    setIsLoggedIn(false)
    window.location.href = "/auth/login"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card">
      <div className="container flex h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-full">
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle Button */}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 hidden md:flex">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Search Dialog */}
          <SearchDialog
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Appearance Settings */}
          <ThemeConfig />

          {isLoggedIn ? (
            <>
              {/* Notification Dropdown */}
              <NotificationsMenu />

              {/* Profile Dropdown */}
              <ProfileMenu handleLogout={handleLogout} />
            </>
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  )
}
