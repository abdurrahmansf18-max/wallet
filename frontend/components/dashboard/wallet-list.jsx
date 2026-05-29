"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
	ArrowDownLeft,
	ArrowUpRight,
	BarChart3,
	Briefcase,
	CreditCard,
	MoreHorizontal,
	PiggyBank,
	Plus,
	Wallet,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { walletApi, transactionApi } from "@/lib/api"

export function WalletList({ className }) {
	const [hoveredId, setHoveredId] = useState(null)

	const [wallets, setWallets] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [data, transactions] = await Promise.all([
					walletApi.getAll(),
					transactionApi.getAll({ limit: 1000 })
				])

				const colorPresets = [
					{
						color: "bg-blue-100 dark:bg-blue-950/40",
						textColor: "text-blue-600 dark:text-blue-400",
						borderColor: "border-blue-200 dark:border-blue-800/50",
						icon: PiggyBank,
					},
					{
						color: "bg-emerald-100 dark:bg-emerald-950/40",
						textColor: "text-emerald-600 dark:text-emerald-400",
						borderColor: "border-emerald-200 dark:border-emerald-800/50",
						icon: Wallet,
					},
					{
						color: "bg-amber-100 dark:bg-amber-950/40",
						textColor: "text-amber-600 dark:text-amber-400",
						borderColor: "border-amber-200 dark:border-amber-800/50",
						icon: Briefcase,
					},
					{
						color: "bg-violet-100 dark:bg-violet-950/40",
						textColor: "text-violet-600 dark:text-violet-400",
						borderColor: "border-violet-200 dark:border-violet-800/50",
						icon: BarChart3,
					},
				]

				const formatted = data.map((w, index) => {
					const preset = colorPresets[index % colorPresets.length]
					
					// Calculate real transaction count
					const walletTransactions = Array.isArray(transactions) 
						? transactions.filter(t => t.wallet_id === w.id) 
						: []

					// Calculate basic trend for this wallet
					let netFlow = 0
					walletTransactions.forEach(t => {
						const amount = Number(t.amount)
						if (t.type === 'income') netFlow += amount
						else if (t.type === 'expense') netFlow -= amount
					})
					// Estimate previous balance
					const previousBalance = Number(w.balance) - netFlow
					const change = previousBalance > 0 ? (netFlow / previousBalance) * 100 : 0
					
					return {
						id: w.id,
						name: w.name,
						balance: w.balance,
						currency: w.currency,
						type: w.type || "Savings",
						icon: preset.icon,
						color: preset.color,
						textColor: preset.textColor,
						borderColor: preset.borderColor,
						change: change,
						transactions: walletTransactions.length,
					}
				})
				setWallets(formatted)
			} catch (error) {
				console.error("Failed to fetch wallets", error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	// Format currency
	const formatCurrency = (value, currency = "USD") => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<div>
					<CardTitle className="text-xl">Your Wallets</CardTitle>
					<CardDescription>Manage your different accounts and budgets</CardDescription>
				</div>
				<Button size="sm" className="h-9" asChild>
					<Link href="/add-wallet">
						<Plus className="mr-2 h-4 w-4" />
						Add Wallet
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="p-0">
				<div className="grid grid-cols-1 divide-y">
					{wallets.map((wallet) => {
						const WalletIcon = wallet.icon
						const isPositive = wallet.change >= 0

						return (
							<motion.div
								key={wallet.id}
								className="relative"
								onHoverStart={() => setHoveredId(wallet.id)}
								onHoverEnd={() => setHoveredId(null)}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Link href={`/wallets/${wallet.id}`} className="block">
									<div
										className={cn(
											"p-3 sm:p-6 transition-all duration-200 relative overflow-hidden",
											hoveredId === wallet.id ? "bg-muted/50" : "",
										)}
									>
										{/* Background decoration */}
										<div
											className={cn(
												"absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full -mt-12 -mr-12 sm:-mt-16 sm:-mr-16 opacity-20 transition-opacity duration-300",
												wallet.color,
												hoveredId === wallet.id ? "opacity-30" : "opacity-10",
											)}
										/>

										<div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
											{/* Wallet icon and name for mobile */}
											<div className="flex items-center gap-3 sm:hidden">
												<div
													className={cn(
														"flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
														wallet.color,
													)}
												>
													<WalletIcon className={cn("h-5 w-5", wallet.textColor)} />
												</div>
												<div className="flex-grow min-w-0">
													<div className="flex items-center gap-2">
														<h3 className="font-medium text-base truncate">{wallet.name}</h3>
														<Badge variant="outline" className={cn("text-xs font-normal", wallet.borderColor)}>
															{wallet.type}
														</Badge>
													</div>
												</div>
											</div>

											{/* Wallet icon for desktop */}
											<div
												className={cn(
													"hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl items-center justify-center",
													wallet.color,
												)}
											>
												<WalletIcon className={cn("h-6 w-6", wallet.textColor)} />
											</div>

											{/* Wallet details */}
											<div className="flex-grow min-w-0">
												{/* Desktop name row */}
												<div className="hidden sm:flex items-center justify-between mb-1">
													<div className="flex items-center gap-2">
														<h3 className="font-medium text-base truncate">{wallet.name}</h3>
														<Badge variant="outline" className={cn("text-xs font-normal", wallet.borderColor)}>
															{wallet.type}
														</Badge>
													</div>

													<div className="flex items-center gap-2">
														<div
															className={cn(
																"flex items-center text-xs font-medium",
																isPositive
																	? "text-emerald-600 dark:text-emerald-400"
																	: "text-rose-600 dark:text-rose-400",
															)}
														>
															{isPositive ? (
																<ArrowUpRight className="h-3 w-3 mr-1" />
															) : (
																<ArrowDownLeft className="h-3 w-3 mr-1" />
															)}
															{isPositive ? "+" : ""}
															{wallet.change}%
														</div>

														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon" className="h-8 w-8">
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuSeparator />
																<DropdownMenuItem>
																	<ArrowUpRight className="h-4 w-4 mr-2" />
																	Transfer Money
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<CreditCard className="h-4 w-4 mr-2" />
																	View Transactions
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<BarChart3 className="h-4 w-4 mr-2" />
																	View Analytics
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>

												<div className="flex items-end justify-between">
													<div>
														<p className="text-xl sm:text-2xl font-semibold">
															{formatCurrency(wallet.balance, wallet.currency)}
														</p>
														<div className="flex items-center justify-between mt-1">
															<p className="text-xs text-muted-foreground">{wallet.transactions} recent transactions</p>

															{/* Mobile only change percentage */}
															<div
																className={cn(
																	"sm:hidden flex items-center text-xs font-medium",
																	isPositive
																		? "text-emerald-600 dark:text-emerald-400"
																		: "text-rose-600 dark:text-rose-400",
																)}
															>
																{isPositive ? (
																	<ArrowUpRight className="h-3 w-3 mr-1" />
																) : (
																	<ArrowDownLeft className="h-3 w-3 mr-1" />
																)}
																{isPositive ? "+" : ""}
																{wallet.change}%
															</div>
														</div>
													</div>

													{/* Mobile actions button */}
													<div className="sm:hidden">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon" className="h-8 w-8">
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuSeparator />
																<DropdownMenuItem>
																	<ArrowUpRight className="h-4 w-4 mr-2" />
																	Transfer Money
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<CreditCard className="h-4 w-4 mr-2" />
																	View Transactions
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<BarChart3 className="h-4 w-4 mr-2" />
																	View Analytics
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>

													{/* Mini chart placeholder - could be replaced with actual chart */}
													<div className="hidden sm:flex h-10 w-20 items-end gap-0.5">
														{[0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.7, 0.9].map((height, i) => (
															<div
																key={i}
																className={cn(
																	"w-1.5 rounded-t-sm transition-all duration-300",
																	isPositive ? "bg-emerald-500/40" : "bg-rose-500/40",
																	hoveredId === wallet.id ? "h-full" : "",
																)}
																style={{
																	height: hoveredId === wallet.id ? `${height * 100}%` : `${height * 60}%`,
																	transitionDelay: `${i * 30}ms`,
																}}
															/>
														))}
													</div>
												</div>
											</div>
										</div>

										{/* Hover indicator */}
										{hoveredId === wallet.id && (
											<motion.div
												className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "100%" }}
												transition={{ duration: 0.2 }}
											/>
										)}
									</div>
								</Link>
							</motion.div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
