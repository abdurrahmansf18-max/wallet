"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
	ArrowUpRight,
	BarChart3,
	CircleDollarSign,
	CreditCard,
	DollarSign,
	Euro,
	PoundSterling
} from "lucide-react"
import { useState, useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { walletApi } from "@/lib/api"

export function WalletByCurrency({ className }) {
	const [activeIndex, setActiveIndex] = useState(null)
	const [isHovering, setIsHovering] = useState(false)

	// Format currency
	const formatCurrency = (value, currency = "USD") => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}

	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)

	const currencyConfig = {
		USD: { color: "#3b82f6", icon: DollarSign },
		EUR: { color: "#10b981", icon: Euro },
		GBP: { color: "#8b5cf6", icon: PoundSterling },
		TRY: { color: "#ef4444", icon: CircleDollarSign },
		DEFAULT: { color: "#9ca3af", icon: CircleDollarSign },
	}

	useEffect(() => {
		const fetchWallets = async () => {
			try {
				const wallets = await walletApi.getAll()
				const groups = {}

				if (Array.isArray(wallets)) {
					wallets.forEach((w) => {
						const curr = w.currency || "USD"
						groups[curr] = (groups[curr] || 0) + Number(w.balance)
					})
				}

				const chartData = Object.entries(groups)
					.map(([name, value]) => {
						const config = currencyConfig[name] || currencyConfig.DEFAULT
						return {
							name,
							value,
							color: config.color,
							icon: config.icon,
						}
					})
					.sort((a, b) => b.value - a.value)

				setData(chartData)
			} catch (error) {
				console.error("Failed to fetch wallets for currency breakdown:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchWallets()
	}, [])

	const total = data.reduce((sum, item) => sum + item.value, 0)

	return (
		<Card
			className={cn(
				"overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 transition-all duration-300",
				isHovering ? "shadow-lg" : "shadow-md",
				className,
			)}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<motion.div
							initial={{ rotate: -10, scale: 0.9 }}
							animate={{ rotate: isHovering ? 0 : -10, scale: isHovering ? 1.05 : 1 }}
							transition={{ duration: 0.3 }}
							className="rounded-full bg-primary/10 p-2 text-primary"
						>
							<CreditCard className="h-5 w-5" />
						</motion.div>
						<CardTitle className="text-xl font-semibold">Wallets by Currency</CardTitle>
					</div>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.3 }}
						className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary"
					>
						<DollarSign className="h-4 w-4" />
						<span className="font-medium">{formatCurrency(total)}</span>
					</motion.div>
				</div>
				<CardDescription>Distribution of your funds across different currencies</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium text-muted-foreground">Portfolio Distribution</span>
					</div>
					<Badge variant="outline" className="bg-background/80">
						{data.length} currencies
					</Badge>
				</div>

				<div className="grid w-full gap-3">
					{data.map((currency, index) => {
						const percentage = ((currency.value / total) * 100).toFixed(1)
						const Icon = currency.icon

						return (
							<motion.div
								key={currency.name}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<div
									className={cn(
										"group relative flex flex-col rounded-xl border p-4 transition-all duration-200",
										activeIndex === index
											? "border-primary/30 bg-primary/5 shadow-sm"
											: "border-border/40 hover:border-primary/20 hover:bg-muted/30",
									)}
									onMouseEnter={() => setActiveIndex(index)}
									onMouseLeave={() => setActiveIndex(null)}
								>
									<div className="mb-2 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className="flex h-8 w-8 items-center justify-center rounded-full"
												style={{ backgroundColor: `${currency.color}20` }}
											>
												<Icon className="h-4 w-4" style={{ color: currency.color }} />
											</div>
											<span className="font-medium">{currency.name}</span>
										</div>
										<div className="text-right">
											<div className="font-semibold">{formatCurrency(currency.value)}</div>
										</div>
									</div>

									<div className="mt-1 flex items-center gap-2">
										<Progress
											value={Number.parseFloat(percentage)}
											className="h-2"
											indicatorClassName={cn(
												"transition-all duration-300",
												activeIndex === index ? "opacity-100" : "opacity-70",
											)}
											style={{
												backgroundColor: `${currency.color}20`,
												"--tw-progress-fill": currency.color,
											}}
										/>
										<span className="min-w-10 text-right text-xs font-medium text-muted-foreground">{percentage}%</span>
									</div>

									<AnimatePresence>
										{activeIndex === index && (
											<motion.div
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												className="absolute -right-2 -top-2 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md"
											>
												<ArrowUpRight className="h-3.5 w-3.5" />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</motion.div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
