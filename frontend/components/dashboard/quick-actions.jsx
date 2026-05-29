"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
	ArrowRightLeft,
	BarChart3,
	CreditCard,
	PlusCircle,
	Receipt,
	SendHorizontal,
	Smartphone,
	Wallet,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function QuickActions({ className }) {
	const [hoveredAction, setHoveredAction] = useState(null)

	const actions = [
		{
			title: "Add Money",
			href: "/wallets/add-money",
			icon: PlusCircle,
			description: "Deposit funds to your wallet",
			color: "from-emerald-500 to-teal-500",
			lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
			iconColor: "text-emerald-500 dark:text-emerald-400",
			hoverColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
		},
		{
			title: "Send Money",
			href: "/wallets/send-money",
			icon: SendHorizontal,
			description: "Transfer to friends or pay bills",
			color: "from-blue-500 to-indigo-500",
			lightColor: "bg-blue-50 dark:bg-blue-900/20",
			iconColor: "text-blue-500 dark:text-blue-400",
			hoverColor: "hover:border-blue-200 dark:hover:border-blue-800",
		},
		{
			title: "Pay Bills",
			href: "/bills/pay",
			icon: Receipt,
			description: "Pay your recurring expenses",
			color: "from-amber-500 to-orange-500",
			lightColor: "bg-amber-50 dark:bg-amber-900/20",
			iconColor: "text-amber-500 dark:text-amber-400",
			hoverColor: "hover:border-amber-200 dark:hover:border-amber-800",
		},
		{
			title: "Transfer",
			href: "/wallets/transfer",
			icon: ArrowRightLeft,
			description: "Move money between accounts",
			color: "from-violet-500 to-purple-500",
			lightColor: "bg-violet-50 dark:bg-violet-900/20",
			iconColor: "text-violet-500 dark:text-violet-400",
			hoverColor: "hover:border-violet-200 dark:hover:border-violet-800",
		},
		// {
		// 	title: "My Cards",
		// 	href: "/cards",
		// 	icon: CreditCard,
		// 	description: "Manage your payment cards",
		// 	color: "from-rose-500 to-pink-500",
		// 	lightColor: "bg-rose-50 dark:bg-rose-900/20",
		// 	iconColor: "text-rose-500 dark:text-rose-400",
		// 	hoverColor: "hover:border-rose-200 dark:hover:border-rose-800",
		// },
		{
			title: "My Wallets",
			href: "/wallets",
			icon: Wallet,
			description: "View and manage your wallets",
			color: "from-cyan-500 to-sky-500",
			lightColor: "bg-cyan-50 dark:bg-cyan-900/20",
			iconColor: "text-cyan-500 dark:text-cyan-400",
			hoverColor: "hover:border-cyan-200 dark:hover:border-cyan-800",
		},
		{
			title: "Repports",
			href: "/reports",
			icon: BarChart3,
			description: "View your spending patterns",
			color: "from-fuchsia-500 to-pink-500",
			lightColor: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
			iconColor: "text-fuchsia-500 dark:text-fuchsia-400",
			hoverColor: "hover:border-fuchsia-200 dark:hover:border-fuchsia-800",
		},
		// {
		// 	title: "Mobile Top-up",
		// 	href: "/mobile-topup",
		// 	icon: Smartphone,
		// 	description: "Recharge your mobile balance",
		// 	color: "from-lime-500 to-green-500",
		// 	lightColor: "bg-lime-50 dark:bg-lime-900/20",
		// 	iconColor: "text-lime-500 dark:text-lime-400",
		// 	hoverColor: "hover:border-lime-200 dark:hover:border-lime-800",
		// },
	]

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="pb-3">
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Common tasks and operations for your finances</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-3">
					{actions.map((action, index) => (
						<motion.div
							key={action.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							onHoverStart={() => setHoveredAction(action.title)}
							onHoverEnd={() => setHoveredAction(null)}
							className="relative"
						>
							<Link
								href={action.href}
								className={cn(
									"block h-full rounded-xl border border-border/40 bg-card p-3 transition-all duration-200",
									"hover:shadow-md hover:border-opacity-100",
									action.hoverColor,
									hoveredAction === action.title ? "shadow-md" : "",
								)}
							>
								{/* Background decoration */}
								<div className="absolute top-0 right-0 w-20 h-20 rounded-full -mt-10 -mr-10 opacity-10">
									<div className={cn("w-full h-full rounded-full", action.lightColor)}></div>
								</div>

								<div className="relative z-10 flex flex-col items-center text-center">
									<div
										className={cn("flex items-center justify-center w-12 h-12 rounded-full mb-3", action.lightColor)}
									>
										<action.icon className={cn("h-6 w-6", action.iconColor)} />
									</div>

									<h3 className="font-medium text-sm sm:text-base mb-1">{action.title}</h3>
									<p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
								</div>

								{/* Hover effect - gradient border */}
								{hoveredAction === action.title && (
									<motion.div
										className="absolute inset-0 rounded-xl z-0 pointer-events-none"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br opacity-10", action.color)}></div>
									</motion.div>
								)}
							</Link>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
