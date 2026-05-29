"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import navItems from "@/components/layout/navItems"

export function NavigationLinks() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="hidden md:flex md:items-center md:gap-5 md:text-sm md:font-medium md:ml-6 overflow-x-auto">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-1 transition-colors hover:text-foreground/80 whitespace-nowrap",
            isActive(item.href) ? "text-foreground font-semibold" : "text-foreground/60",
          )}
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}
