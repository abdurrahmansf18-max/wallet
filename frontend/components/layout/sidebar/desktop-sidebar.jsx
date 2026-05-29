"use client"

import navItems from "@/components/layout/navItems"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { HelpCircle, PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavigationItems } from "./navigation-items"
import { QuickActions } from "./quick-actions"
import { UserProfile } from "./user-profile"
import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"

export function DesktopSidebar({ isCollapsed, direction = "ltr" }) {
	const pathname = usePathname()
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
	const initials = userName
	                .split(" ")
	                .map((n) => n[0])
	                .join("")
	                .substring(0, 2)
	                .toUpperCase()

	const isActive = (path) => {
		if (path === "/" && pathname === "/") return true
		if (path !== "/" && pathname.startsWith(path)) return true
		return false
	}

	return (
		<TooltipProvider>
			<div
				className={cn(
					"fixed top-0 bottom-0 z-40 hidden md:flex h-screen flex-col border-r bg-card shadow-sm transition-all duration-300",
					isCollapsed ? "w-[70px]" : "w-[260px]",
					direction === "rtl" ? "right-0 border-l" : "left-0 border-r",
				)}
			>
				{/* Logo in Sidebar */}
				<div className="flex h-16 shrink-0 items-center border-b px-3 py-4">
					<Logo showText={!isCollapsed} />
				</div>

				<ScrollArea className="flex-1">
					{/* Main Navigation */}
					<div className="px-3 py-4">
						{!isCollapsed && <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">MAIN NAVIGATION</h2>}
						{isCollapsed ? (
							<div className="grid gap-1">
								{navItems.map((item) => (
									<Tooltip key={item.name} delayDuration={0}>
										<TooltipTrigger asChild>
											<Link
												href={item.href}
												className={cn(
													"flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
													isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground",
												)}
											>
												<item.icon className={cn("h-5 w-5", isActive(item.href) && "text-primary")} />
											</Link>
										</TooltipTrigger>
										<TooltipContent side={direction === "rtl" ? "left" : "right"}>{item.name}</TooltipContent>
									</Tooltip>
								))}
							</div>
						) : (
							<NavigationItems isCollapsed={isCollapsed} mobile={false} direction={direction} />
						)}
					</div>

					{/* Quick Actions Section */}
					{!isCollapsed ? (
						<div className="px-3 py-4">
							<h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">QUICK ACTIONS</h2>
							<QuickActions mobile={false} isCollapsed={isCollapsed} />
						</div>
					) : (
						<div className="px-3 py-4">
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<Button variant="outline" className="w-full p-2 justify-center" size="sm" asChild>
										<Link href="/add-wallet">
											<PlusCircle className="h-4 w-4" />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent side={direction === "rtl" ? "left" : "right"}>Add New Wallet</TooltipContent>
							</Tooltip>
							<div className="h-2"></div>
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<Button variant="outline" className="w-full p-2 justify-center" size="sm" asChild>
										<Link href="/help">
											<HelpCircle className="h-4 w-4" />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent side={direction === "rtl" ? "left" : "right"}>Help & Support</TooltipContent>
							</Tooltip>
						</div>
					)}
				</ScrollArea>

				{/* User Profile Section */}
				<div className="mt-auto border-t p-3">
					{isCollapsed ? (
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
									<Avatar className="h-10 w-10">
										{user?.profile_image_url && <AvatarImage src={user.profile_image_url} alt={userName} />}
										<AvatarFallback>{initials || "U"}</AvatarFallback>
									</Avatar>
								</Button>
							</TooltipTrigger>
							<TooltipContent side={direction === "rtl" ? "left" : "right"}>{userName}</TooltipContent>
						</Tooltip>
					) : (
						<UserProfile isCollapsed={isCollapsed} />
					)}
				</div>
			</div>
		</TooltipProvider>
	)
}
