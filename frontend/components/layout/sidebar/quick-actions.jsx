"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Gift, HelpCircle, PlusCircle, Wallet, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { walletApi } from "@/lib/api"

export function QuickActions({ mobile, onItemClick, isCollapsed }) {
	const [walletCount, setWalletCount] = useState(0)

	useEffect(() => {
		const fetchWallets = async () => {
			try {
				const wallets = await walletApi.getAll()
				setWalletCount(wallets.length)
			} catch (error) {
				console.error("Failed to fetch wallets", error)
			}
		}
		fetchWallets()
	}, [])

	const actions = [
		{
			name: "Add New Wallet",
			href: "/add-wallet",
			icon: PlusCircle,
			variant: "default",
			highlight: true,
		},
		{
			name: "My Wallets",
			href: "/wallets",
			icon: Wallet,
			variant: "outline",
			badge: walletCount > 0 ? walletCount.toString() : null,
		},
		// {
		// 	name: "Rewards",
		// 	href: "/rewards",
		// 	icon: Gift,
		// 	variant: "outline",
		// 	badge: "New",
		// 	badgeVariant: "success",
		// },
		// {
		// 	name: "Help & Support",
		// 	href: "/help",
		// 	icon: HelpCircle,
		// 	variant: "outline",
		// },
	]

	return (
		<TooltipProvider>
			<div className="grid gap-2">
				{actions.map((action) =>
					isCollapsed && !mobile ? (
						<Tooltip key={action.href} delayDuration={0}>
							<TooltipTrigger asChild>
								<Button
									variant={action.variant}
									size="icon"
									className={cn(
										"h-9 w-9 rounded-md relative",
										action.highlight && "bg-primary hover:bg-primary/90 text-primary-foreground",
										action.variant === "outline" && "border-border/50 hover:bg-accent/50 hover:border-border",
									)}
									asChild
								>
									<Link href={action.href} onClick={onItemClick}>
										<action.icon className="h-4 w-4" />
										{action.badge && (
											<Badge
												variant={action.badgeVariant || "default"}
												className={cn(
													"absolute -top-1.5 -right-1.5 px-1 min-w-[18px] h-[18px] text-[10px] font-medium",
													action.badgeVariant === "success" && "bg-emerald-500 hover:bg-emerald-500/90",
												)}
											>
												{action.badge}
											</Badge>
										)}
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right" className="font-medium">
								{action.name}
							</TooltipContent>
						</Tooltip>
					) : (
						<Button
							key={action.href}
							variant={action.variant}
							size="sm"
							className={cn(
								"justify-start h-9 relative",
								action.highlight && "bg-primary hover:bg-primary/90 text-primary-foreground",
								action.variant === "outline" && "border-border/50 hover:bg-accent/50 hover:border-border",
							)}
							asChild
						>
							<Link href={action.href} onClick={onItemClick}>
								<action.icon className="h-4 w-4 mr-2 flex-shrink-0" />
								<span className="truncate">{action.name}</span>
								{action.badge && (
									<Badge
										variant={action.badgeVariant || "default"}
										className={cn(
											"ml-auto text-[10px] px-1 min-w-[18px] h-[18px]",
											action.badgeVariant === "success" && "bg-emerald-500 hover:bg-emerald-500/90",
										)}
									>
										{action.badge}
									</Badge>
								)}
							</Link>
						</Button>
					),
				)}

				<AdsBanner isCollapsed={isCollapsed} mobile={mobile} />
			</div>
		</TooltipProvider>
	)
}

function AdsBanner({ isCollapsed, mobile }) {
	return (
		<div
			className={cn(
				"mt-2 rounded-lg overflow-hidden border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10",
				isCollapsed && !mobile ? "p-2" : "p-3",
			)}
		>
			{isCollapsed && !mobile ? (
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<div className="flex flex-col items-center justify-center">
							<Zap className="h-5 w-5 text-primary mb-1" />
							<div className="w-full h-1 rounded-full bg-primary/20 overflow-hidden">
								<div className="w-2/3 h-full bg-primary"></div>
							</div>
						</div>
					</TooltipTrigger>
					<TooltipContent side="right" className="font-medium">
						Upgrade to Pro - 30% off
					</TooltipContent>
				</Tooltip>
			) : (
				<div className="space-y-2">
					<div className="flex items-center">
						<Zap className="h-4 w-4 text-primary mr-2" />
						<h4 className="font-medium text-sm">Upgrade to Pro</h4>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Get 30% off for the first 3 months</p>
						<div className="w-full h-1.5 rounded-full bg-primary/20 overflow-hidden">
							<div className="w-2/3 h-full bg-primary"></div>
						</div>
					</div>
					<Button size="sm" className="w-full h-8 mt-2 text-xs">
						Upgrade Now
					</Button>
				</div>
			)}
		</div>
	)
}
