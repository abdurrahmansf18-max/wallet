"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Briefcase, CreditCard, MoreHorizontal, Search, ShoppingBag, Utensils, Zap } from 'lucide-react'
import { useState, useEffect } from "react"
import { transactionApi, walletApi } from "@/lib/api"

export function RecentTransactions({ className }) {
	const [hoveredId, setHoveredId] = useState(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [transactions, setTransactions] = useState([])
	const [loading, setLoading] = useState(true)

	// Category icons mapping
	const categoryIcons = {
		Shopping: ShoppingBag,
		Income: Briefcase,
		Utilities: Zap,
		Food: Utensils,
		Entertainment: CreditCard,
	}

	// Category colors mapping
	const categoryColors = {
		Shopping: {
			bg: "bg-blue-100 dark:bg-blue-950/40",
			text: "text-blue-600 dark:text-blue-400",
			border: "border-blue-200 dark:border-blue-800/50",
		},
		Income: {
			bg: "bg-emerald-100 dark:bg-emerald-950/40",
			text: "text-emerald-600 dark:text-emerald-400",
			border: "border-emerald-200 dark:border-emerald-800/50",
		},
		Utilities: {
			bg: "bg-amber-100 dark:bg-amber-950/40",
			text: "text-amber-600 dark:text-amber-400",
			border: "border-amber-200 dark:border-amber-800/50",
		},
		Food: {
			bg: "bg-rose-100 dark:bg-rose-950/40",
			text: "text-rose-600 dark:text-rose-400",
			border: "border-rose-200 dark:border-rose-800/50",
		},
		Entertainment: {
			bg: "bg-violet-100 dark:bg-violet-950/40",
			text: "text-violet-600 dark:text-violet-400",
			border: "border-violet-200 dark:border-violet-800/50",
		},
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [txData, walletData] = await Promise.all([transactionApi.getAll({ limit: 50 }), walletApi.getAll()])

				const walletMap = {}
				walletData.forEach((w) => {
					walletMap[w.id] = w.name
				})

				const formatted = txData.map((t) => {
					// Normalize backend data
					const isExpense = t.type === "expense"
					const amount = isExpense ? -Math.abs(t.amount) : Math.abs(t.amount)

					// Basic date formatting
					const dateObj = new Date(t.date)
					const dateStr = dateObj.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
					const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

					return {
						id: t.id,
						description: t.description,
						amount: amount,
						date: `${dateStr}, ${timeStr}`,
						status: t.status,
						category: t.category,
						wallet: walletMap[t.wallet_id] || "Wallet",
					}
				})
				setTransactions(formatted)
			} catch (error) {
				console.error("Failed to fetch transactions", error)
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

	// Filter transactions based on search query
	const filteredTransactions = transactions.filter(
		(transaction) =>
			transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
			transaction.wallet.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<Card className={cn("overflow-hidden w-full max-w-full", className)}>
			<CardHeader className="pb-3 space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle className="text-xl md:text-2xl">Recent Transactions</CardTitle>
						<CardDescription className="text-sm md:text-base">
							Your latest financial activities across all wallets
						</CardDescription>
					</div>
					<div className="relative w-full sm:w-64 md:w-72 flex-shrink-0">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search transactions..."
							className="pl-9 h-9 w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y">
					{filteredTransactions.length > 0 ? (
						filteredTransactions.map((transaction) => {
							const isIncome = transaction.amount > 0
							const CategoryIcon = categoryIcons[transaction.category] || (isIncome ? ArrowUpRight : ArrowDownLeft)
							const categoryColor = categoryColors[transaction.category] || {
								bg: isIncome ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-rose-100 dark:bg-rose-950/40",
								text: isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
								border: isIncome
									? "border-emerald-200 dark:border-emerald-800/50"
									: "border-rose-200 dark:border-rose-800/50",
							}

							return (
								<motion.div
									key={transaction.id}
									className="relative"
									onHoverStart={() => setHoveredId(transaction.id)}
									onHoverEnd={() => setHoveredId(null)}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2 }}
								>
									<div
										className={cn(
											"p-3 sm:p-4 md:p-6 transition-all duration-200 relative",
											hoveredId === transaction.id ? "bg-muted/50" : "",
										)}
									>
										<div className="flex items-start sm:items-center gap-3 md:gap-4">
											{/* Transaction icon */}
											<div
												className={cn(
													"flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
													categoryColor.bg,
												)}
											>
												<CategoryIcon className={cn("h-4 w-4 sm:h-5 sm:w-5", categoryColor.text)} />
											</div>

											{/* Transaction details */}
											<div className="flex-grow min-w-0">
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 w-full">
													<div className="max-w-full">
														<div className="flex flex-wrap items-center gap-2">
															<h3 className="font-medium text-sm sm:text-base truncate max-w-[150px] xs:max-w-[200px] sm:max-w-full">
																{transaction.description}
															</h3>
															<Badge
																variant="outline"
																className={cn(
																	"text-xs font-normal hidden sm:inline-flex whitespace-nowrap",
																	categoryColor.border,
																)}
															>
																{transaction.category}
															</Badge>
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
															<span>{transaction.date}</span>
															<span className="hidden xs:inline">•</span>
															<span className="hidden xs:inline truncate max-w-[120px] sm:max-w-full">
																{transaction.wallet}
															</span>
														</div>
													</div>

													<div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
														<Badge
															variant="outline"
															className={cn("text-xs font-normal sm:hidden", categoryColor.border)}
														>
															{transaction.category}
														</Badge>

														<div
															className={cn(
																"font-medium whitespace-nowrap",
																isIncome
																	? "text-emerald-600 dark:text-emerald-400"
																	: "text-rose-600 dark:text-rose-400",
															)}
														>
															<div className="flex items-center">
																{isIncome ? (
																	<ArrowUpRight className="h-3 w-3 mr-1" />
																) : (
																	<ArrowDownLeft className="h-3 w-3 mr-1" />
																)}
																{formatCurrency(Math.abs(transaction.amount))}
															</div>
														</div>

														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
																	<MoreHorizontal className="h-4 w-4" />
																	<span className="sr-only">Open menu</span>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuItem>View Details</DropdownMenuItem>
																<DropdownMenuItem>Add to Category</DropdownMenuItem>
																<DropdownMenuItem>Download Receipt</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>
											</div>
										</div>

										{/* Hover indicator */}
										{hoveredId === transaction.id && (
											<motion.div
												className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "100%" }}
												transition={{ duration: 0.2 }}
											/>
										)}
									</div>
								</motion.div>
							)
						})
					) : (
						<div className="p-8 text-center text-muted-foreground">No transactions found matching your search.</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
