"use client"

import { useState, useEffect } from "react"
import { useThemeContext } from "@/components/theme/theme-provider"
import { MobileSidebar } from "./mobile-sidebar"
import { DesktopSidebar } from "./desktop-sidebar"

export function Sidebar({
  isCollapsed: propIsCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  isHorizontalLayout = false,
}) {
  const { direction } = useThemeContext()
  const [isMobile, setIsMobile] = useState(false)
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(propIsCollapsed)

  // Use either the prop or internal state based on what's provided
  const isCollapsed = setIsCollapsed ? propIsCollapsed : internalIsCollapsed
  const updateIsCollapsed = setIsCollapsed || setInternalIsCollapsed

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const isMobileView = width < 768
      setIsMobile(isMobileView)

      // Handle mobile view
      if (isMobileView && !isMobileOpen) {
        updateIsCollapsed(true)
      }
      // Handle medium screens (768px to 1024px) - collapse sidebar
      else if (width >= 768 && width <= 1024) {
        updateIsCollapsed(true)
      }
      // Handle larger screens - expand sidebar
      else if (width > 1024) {
        updateIsCollapsed(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [updateIsCollapsed, isMobileOpen, setIsCollapsed])

  // Render mobile sidebar or horizontal layout
  if (isMobile || isHorizontalLayout) {
    return <MobileSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} direction={direction} />
  }

  // Render desktop sidebar
  return <DesktopSidebar isCollapsed={isCollapsed} direction={direction} />
}
