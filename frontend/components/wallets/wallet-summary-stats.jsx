"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, CreditCard, PiggyBank } from "lucide-react"

export function WalletSummaryStats({ 
	className, 
	totalBalance = 0, 
	income = 0, 
	expenses = 0, 
	savingsRate = 0,
	sparklines = {
		balance: [35, 60, 45, 50, 75, 65, 80],
		income: [40, 70, 65, 80, 60, 85, 90],
		expenses: [70, 50, 35, 45, 30, 40, 35],
		savings: [30, 40, 45, 50, 55, 60, 65]
	},
	trends = {
		balance: { value: "+0%", isUp: true },
		income: { value: "+0%", isUp: true },
		expenses: { value: "+0%", isUp: false },
		savings: { value: "+0%", isUp: true }
	}
}) {
	// Format currency
	const formatCurrency = (value, currency = "USD") => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}

	// Normalize sparkline data to percentages (0-100) for the UI bars
	const normalizeSparkline = (data) => {
		if (!data || !data.length) return Array(7).fill(0);
		const max = Math.max(...data, 1); // Avoid division by zero
		return data.map(val => Math.max(10, Math.floor((val / max) * 100))); // Min 10% height for visibility
	}

	// Dynamic stats array
	const stats = [
		{
			title: "Total Balance",
			value: totalBalance,
			change: trends.balance.value,
			trend: trends.balance.isUp ? "up" : "down",
			icon: CircleDollarSign,
			color: "from-violet-500 to-indigo-600",
			lightColor: "from-violet-50 to-indigo-50",
			darkColor: "from-violet-900/20 to-indigo-900/30",
			decoration: "radial",
			sparkline: normalizeSparkline(sparklines.balance),
		},
		{
			title: "Monthly Income",
			value: income,
			change: trends.income.value,
			trend: trends.income.isUp ? "up" : "down",
			icon: ArrowUpRight,
			color: "from-emerald-500 to-green-600",
			lightColor: "from-emerald-50 to-green-50",
			darkColor: "from-emerald-900/20 to-green-900/30",
			decoration: "dots",
			sparkline: normalizeSparkline(sparklines.income),
		},
		{
			title: "Monthly Expenses",
			value: expenses,
			change: trends.expenses.value,
			trend: trends.expenses.isUp ? "up" : "down",
			icon: CreditCard,
			color: "from-rose-500 to-red-600",
			lightColor: "from-rose-50 to-red-50",
			darkColor: "from-rose-900/20 to-red-900/30",
			decoration: "waves",
			sparkline: normalizeSparkline(sparklines.expenses),
		},
		{
			title: "Savings Rate",
			value: savingsRate,
			unit: "%",
			change: trends.savings.value,
			trend: trends.savings.isUp ? "up" : "down",
			icon: PiggyBank,
			color: "from-amber-500 to-orange-600",
			lightColor: "from-amber-50 to-orange-50",
			darkColor: "from-amber-900/20 to-orange-900/30",
			decoration: "circles",
			sparkline: normalizeSparkline(sparklines.savings),
		},
	]

	return (
		<div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
			{stats.map((stat, index) => {
				const Icon = stat.icon
				const isPositive = stat.trend === "up"

				return (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
						whileHover={{ y: -4, transition: { duration: 0.2 } }}
						className="group"
					>
						<Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
							{/* Decorative background pattern based on stat type */}
							<div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]">
								{stat.decoration === "radial" && (
									<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:12px_12px]"></div>
								)}
								{stat.decoration === "dots" && (
									<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:8px_8px]"></div>
								)}
								{stat.decoration === "waves" && (
									<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwYzQwIDQwIDQwIDQwIDgwIDQwczQwLTQwIDgwLTQwIDQwIDQwIDgwIDQwIDQwLTQwIDgwLTQwdjgwYy00MCAwLTQwIDQwLTgwIDQwcy00MC00MC04MC00MC00MCA0MC04MCA0MC00MC00MC04MC00MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')]"></div>
								)}
								{stat.decoration === "circles" && (
									<div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(0,0,0,0.1)_4px,transparent_4px)] bg-[length:24px_24px]"></div>
								)}
							</div>

							<CardContent className="p-5 sm:p-6">
								<div className="flex items-center justify-between">
									<div
										className={cn(
											"flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
											stat.title === "Total Balance" && "bg-violet-500/10 dark:bg-violet-500/20",
											stat.title === "Monthly Income" && "bg-emerald-500/10 dark:bg-emerald-500/20",
											stat.title === "Monthly Expenses" && "bg-rose-500/10 dark:bg-rose-500/20",
											stat.title === "Savings Rate" && "bg-amber-500/10 dark:bg-amber-500/20",
											"group-hover:shadow-md transition-all duration-300",
										)}
									>
										<Icon
											className={cn(
												"h-5 w-5 drop-shadow-sm",
												stat.title === "Total Balance" && "text-violet-600 dark:text-violet-400",
												stat.title === "Monthly Income" && "text-emerald-600 dark:text-emerald-400",
												stat.title === "Monthly Expenses" && "text-rose-600 dark:text-rose-400",
												stat.title === "Savings Rate" && "text-amber-600 dark:text-amber-400",
												"group-hover:scale-110 transition-transform duration-300",
											)}
										/>
									</div>
									<div
										className={cn(
											"flex items-center rounded-full px-3 py-1.5 text-xs font-medium",
											isPositive
												? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
												: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
											"shadow-sm",
										)}
									>
										{stat.change}
										{isPositive ? (
											<ArrowUpRight className="ml-1 h-3 w-3" />
										) : (
											<ArrowDownLeft className="ml-1 h-3 w-3" />
										)}
									</div>
								</div>

								<div className="mt-4">
									<div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
									<div className="mt-1 text-2xl font-bold tracking-tight">
										{stat.unit ? `${stat.value}${stat.unit}` : formatCurrency(stat.value)}
									</div>
								</div>

								{/* Mini sparkline chart */}
								<div className="mt-4 h-10">
									<div className="flex h-full items-end justify-between gap-0.5">
										{stat.sparkline.map((value, i) => (
											<motion.div
												key={i}
												className={cn(
													"w-full rounded-sm",
													stat.title === "Total Balance" && "bg-gradient-to-t from-violet-500 to-indigo-600",
													stat.title === "Monthly Income" && "bg-gradient-to-t from-emerald-500 to-green-600",
													stat.title === "Monthly Expenses" && "bg-gradient-to-t from-rose-500 to-red-600",
													stat.title === "Savings Rate" && "bg-gradient-to-t from-amber-500 to-orange-600",
												)}
												initial={{ height: 0 }}
												animate={{ height: `${value}%` }}
												transition={{
													duration: 0.6,
													delay: index * 0.1 + i * 0.05,
													ease: "easeOut",
												}}
											/>
										))}
									</div>
								</div>

								{/* Decorative accent */}
								<div
									className={cn(
										"absolute bottom-0 left-0 right-0 h-1",
										stat.title === "Total Balance" && "bg-violet-500 dark:bg-violet-600",
										stat.title === "Monthly Income" && "bg-emerald-500 dark:bg-emerald-600",
										stat.title === "Monthly Expenses" && "bg-rose-500 dark:bg-rose-600",
										stat.title === "Savings Rate" && "bg-amber-500 dark:bg-amber-600",
										"opacity-80 group-hover:opacity-100 transition-opacity",
									)}
								/>
							</CardContent>
						</Card>
					</motion.div>
				)
			})}
		</div>
	)
}
