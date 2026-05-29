"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
	Calendar,
	DollarSign,
	Info,
	PiggyBank,
	Wallet
} from "lucide-react"
import { useState } from "react"

export function BudgetOverviewCards({ budgetSummary }) {
	const [hoveredCard, setHoveredCard] = useState(null)

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value)
	}

	const getProgressColor = (percentUsed) => {
		if (percentUsed >= 90) return "bg-destructive"
		if (percentUsed >= 75) return "bg-amber-500"
		return "bg-emerald-500"
	}

	const getBudgetHealth = (percentUsed, daysLeft) => {
		// Calculate expected percentage based on days left in month
		// Assuming 30 days in a month for simplicity
		const daysInMonth = 30
		const daysElapsed = daysInMonth - daysLeft
		const expectedPercentage = (daysElapsed / daysInMonth) * 100

		// If spending percentage is significantly higher than expected, health is poor
		if (percentUsed > expectedPercentage + 15)
			return { status: "Poor", color: "text-destructive", bgColor: "bg-destructive/10" }
		// If spending percentage is slightly higher than expected, health is fair
		if (percentUsed > expectedPercentage + 5)
			return { status: "Fair", color: "text-amber-500", bgColor: "bg-amber-500/10" }
		// Otherwise, health is good
		return { status: "Good", color: "text-emerald-500", bgColor: "bg-emerald-500/10" }
	}

	const budgetHealth = getBudgetHealth(budgetSummary.percentUsed, budgetSummary.daysLeft)

	const cards = [
		{
			id: "budget",
			title: "Total Budget",
			value: budgetSummary.totalBudget,
			description: "Monthly allocation",
			icon: Wallet,
			color: "bg-primary/10",
			textColor: "text-primary",
			trend: {
				value: "+5.8%",
				label: "vs last month",
				direction: "up",
			},
		},
		{
			id: "spent",
			title: "Spent So Far",
			value: budgetSummary.spent,
			description: `${budgetSummary.percentUsed.toFixed(1)}% of total budget`,
			icon: DollarSign,
			color: "bg-blue-100 dark:bg-blue-950/40",
			textColor: "text-blue-600 dark:text-blue-400",
			trend: {
				value: "+12.3%",
				label: "spending rate",
				direction: "up",
			},
		},
		{
			id: "remaining",
			title: "Remaining",
			value: budgetSummary.remaining,
			description: `${budgetSummary.daysLeft} days left in month`,
			icon: PiggyBank,
			color: "bg-emerald-100 dark:bg-emerald-950/40",
			textColor: "text-emerald-600 dark:text-emerald-400",
			trend: {
				value: budgetSummary.remaining > budgetSummary.totalBudget * 0.25 ? "Healthy" : "Low",
				label: "current status",
				direction: budgetSummary.remaining > budgetSummary.totalBudget * 0.25 ? "up" : "down",
			},
		},
		{
			id: "health",
			title: "Budget Health",
			value: budgetHealth.status,
			description: "Based on spending rate",
			icon: Calendar,
			color: "bg-amber-100 dark:bg-amber-950/40",
			textColor: "text-amber-600 dark:text-amber-400",
			customContent: true,
			trend: {
				value: "On Track",
				label: "projection",
				direction: "up",
			},
		},
	]

	if (!budgetSummary) {
		return (
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className="overflow-hidden border-border/40">
						<CardContent className="p-5">
							<div className="animate-pulse flex space-x-4">
								<div className="rounded-full bg-muted h-10 w-10"></div>
								<div className="flex-1 space-y-4 py-1">
									<div className="h-4 bg-muted rounded w-3/4"></div>
									<div className="h-8 bg-muted rounded w-1/2"></div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card, index) => (
				<motion.div
					key={card.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: index * 0.1 }}
					onHoverStart={() => setHoveredCard(card.id)}
					onHoverEnd={() => setHoveredCard(null)}
				>
					<Card
						className={cn(
							"overflow-hidden border-border/40 transition-all duration-300 h-full",
							hoveredCard === card.id ? "shadow-md border-border/80" : "",
							card.id === "health" ? budgetHealth.bgColor : "",
						)}
					>
						<CardContent className="p-0">
							<div className="p-5 relative">
								{/* Background decoration */}
								<div className="absolute top-0 right-0 w-24 h-24 rounded-full -mt-8 -mr-8 opacity-10 bg-gradient-to-br from-primary to-primary/50"></div>

								{/* Header with icon and trend */}
								<div className="flex items-center justify-between mb-3 relative z-10">
									<div className="flex items-center gap-3">
										<div className={cn("flex h-10 w-10 items-center justify-center rounded-full", card.color)}>
											<card.icon className={cn("h-5 w-5", card.textColor)} />
										</div>
										<h3 className="text-sm font-medium">{card.title}</h3>
									</div>
								</div>

								{/* Main content */}
								<div className="space-y-1 relative z-10">
									<div
										className={cn("text-3xl font-semibold", card.id === "health" ? budgetHealth.color : "text-foreground")}
									>
										{card.id === "health" ? budgetHealth.status : formatCurrency(card.value)}
									</div>
									{card.description && (
										<p className="text-xs text-muted-foreground flex items-center gap-1">
											{card.description}
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Info className="h-3 w-3 text-muted-foreground/70 cursor-help" />
													</TooltipTrigger>
													<TooltipContent>
														<p>
															{card.id === "budget" && "Your total budget allocation for this month"}
															{card.id === "spent" && "Total amount spent from your budget so far"}
															{card.id === "remaining" && "Amount remaining in your budget for this month"}
															{card.id === "health" && "Overall health of your budget based on spending patterns"}
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</p>
									)}
								</div>

								{/* Progress bar for health */}
								<div className="mt-3 relative z-10">
									<Progress
										value={budgetSummary.percentUsed}
										max={100}
										className="h-2"
										indicatorClassName={getProgressColor(budgetSummary.percentUsed)}
									/>
									<div className="flex justify-between mt-1 text-xs text-muted-foreground">
										<span>0%</span>
										<span>50%</span>
										<span>100%</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	)
}
