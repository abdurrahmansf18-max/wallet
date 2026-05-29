"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, BarChart3, Briefcase, MoreHorizontal, PiggyBank, Wallet } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function WalletCard({ wallet }) {
	const [isHovered, setIsHovered] = useState(false)

	// Format currency
	const formatCurrency = (value, currency = "USD") => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffTime = Math.abs(now - date)
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

		if (diffDays === 0) {
			return "Today"
		} else if (diffDays === 1) {
			return "Yesterday"
		} else if (diffDays < 7) {
			return `${diffDays} days ago`
		} else {
			return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
		}
	}

	// Get icon based on wallet type
	const getWalletIcon = (type) => {
		switch (type) {
			case "Savings":
				return PiggyBank
			case "Budget":
				return Wallet
			case "Investment":
				return BarChart3
			default:
				return Briefcase
		}
	}

	// Get color scheme based on wallet type
	const getWalletColors = (type) => {
		switch (type) {
			case "Savings":
				return {
					bg: "bg-blue-100 dark:bg-blue-950/40",
					text: "text-blue-600 dark:text-blue-400",
					border: "border-blue-200 dark:border-blue-800/50",
					gradient: "from-blue-500 to-indigo-500",
				}
			case "Budget":
				return {
					bg: "bg-amber-100 dark:bg-amber-950/40",
					text: "text-amber-600 dark:text-amber-400",
					border: "border-amber-200 dark:border-amber-800/50",
					gradient: "from-amber-500 to-orange-500",
				}
			case "Investment":
				return {
					bg: "bg-emerald-100 dark:bg-emerald-950/40",
					text: "text-emerald-600 dark:text-emerald-400",
					border: "border-emerald-200 dark:border-emerald-800/50",
					gradient: "from-emerald-500 to-teal-500",
				}
			default:
				return {
					bg: "bg-violet-100 dark:bg-violet-950/40",
					text: "text-violet-600 dark:text-violet-400",
					border: "border-violet-200 dark:border-violet-800/50",
					gradient: "from-violet-500 to-purple-500",
				}
		}
	}

	const WalletIcon = getWalletIcon(wallet.type)
	const colors = getWalletColors(wallet.type)

	// Mock data for chart
	const chartData = [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.7, 0.9]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
		>
			<Card
				className={cn(
					"h-full overflow-hidden border-border/40 transition-all duration-300",
					isHovered ? "shadow-md" : "",
				)}
			>
				<Link href={`/wallets/${wallet.id}`} className="block h-full">
					<CardContent className="p-0">
						{/* Card header with gradient */}
						<div className={cn("bg-gradient-to-r p-4 sm:p-5", colors.gradient)}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
										<WalletIcon className="h-5 w-5 text-white" />
									</div>
									<div>
										<h3 className="font-medium text-white">{wallet.name}</h3>
										<Badge variant="outline" className="mt-1 border-white/30 text-xs font-normal text-white/90">
											{wallet.type}
										</Badge>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>View Details</DropdownMenuItem>
										<DropdownMenuItem>Edit Wallet</DropdownMenuItem>
										<DropdownMenuItem>Transfer Money</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Card body */}
						<div className="p-4 sm:p-5">
							<div className="mb-4">
								<div className="text-sm text-muted-foreground">Balance</div>
								<div className="mt-1 text-2xl font-semibold sm:text-3xl">{formatCurrency(wallet.balance)}</div>
							</div>

							<div className="flex items-end justify-between">
								<div className="text-xs text-muted-foreground">Last updated: {formatDate(wallet.lastUpdated)}</div>

								{/* Mini chart */}
								<div className="flex h-10 w-20 items-end gap-0.5">
									{chartData.map((height, i) => (
										<div
											key={i}
											className={cn("w-1.5 rounded-t-sm transition-all duration-300", colors.bg)}
											style={{
												height: isHovered ? `${height * 100}%` : `${height * 60}%`,
												transitionDelay: `${i * 30}ms`,
											}}
										/>
									))}
								</div>
							</div>

							{/* Quick actions that appear on hover */}
							<motion.div
								className="mt-4 flex items-center justify-between"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
								transition={{ duration: 0.2 }}
							>
								<div className="flex items-center gap-2">
									<div className={cn("flex h-6 w-6 items-center justify-center rounded-full", colors.bg)}>
										<ArrowUpRight className={cn("h-3 w-3", colors.text)} />
									</div>
									<div className={cn("flex h-6 w-6 items-center justify-center rounded-full", colors.bg)}>
										<ArrowDownLeft className={cn("h-3 w-3", colors.text)} />
									</div>
								</div>
								<div className="text-xs font-medium text-muted-foreground">Click to view details</div>
							</motion.div>
						</div>
					</CardContent>
				</Link>
			</Card>
		</motion.div>
	)
}
