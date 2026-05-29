"use client"

import { BudgetCalendar } from "@/components/budget/budget-calendar"
import { BudgetCategoriesTab } from "@/components/budget/budget-categories-tab"
import { BudgetGoals } from "@/components/budget/budget-goals"
import { BudgetOverviewCards } from "@/components/budget/budget-overview-cards"
import { BudgetTransactionsTab } from "@/components/budget/budget-transactions-tab"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Calendar, Download, Menu, PlusCircle, Share2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { budgetApi, transactionApi } from "@/lib/api"
import { format } from "date-fns"

export default function BudgetPage() {
	const [activeMonth, setActiveMonth] = useState("current")
	const [activeTab, setActiveTab] = useState("categories")
	const [isMobile, setIsMobile] = useState(false)
	const [loading, setLoading] = useState(true)

	// State for data
	const [categories, setCategories] = useState([])
	const [recentTransactions, setRecentTransactions] = useState([])
	const [rawTransactions, setRawTransactions] = useState([])
	const [budgetSummary, setBudgetSummary] = useState({
		totalBudget: 0,
		spent: 0,
		remaining: 0,
		percentUsed: 0,
		daysLeft: 0,
	})

	// Check if screen is mobile size
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 640)
		}
		checkIsMobile()
		window.addEventListener("resize", checkIsMobile)
		return () => window.removeEventListener("resize", checkIsMobile)
	}, [])

	// Fetch data
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				// 1. Fetch Budgets
				const budgets = await budgetApi.getAll()
				
				// Transform budgets to category view model
				const processedCategories = budgets.map((b) => {
					const budgetAmount = Number(b.amount)
					const spentAmount = Number(b.spent)
					const percentUsed = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
					
					let status = "on-track"
					if (percentUsed >= 100) status = "exceeded"
					else if (percentUsed >= 85) status = "warning"

					return {
						id: b.id,
						name: b.category,
						budgeted: budgetAmount,
						spent: spentAmount,
						remaining: budgetAmount - spentAmount,
						percentUsed: parseFloat(percentUsed.toFixed(2)),
						status: status,
					}
				})
				setCategories(processedCategories)

				// 2. Calculate Summary
				const totalBudget = processedCategories.reduce((sum, c) => sum + c.budgeted, 0)
				const totalSpent = processedCategories.reduce((sum, c) => sum + c.spent, 0)
				const today = new Date()
				const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
				const daysLeft = endOfMonth.getDate() - today.getDate()

				setBudgetSummary({
					totalBudget,
					spent: totalSpent,
					remaining: totalBudget - totalSpent,
					percentUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
					daysLeft,
				})

				// 3. Fetch Recent Transactions
				const txs = await transactionApi.getAll({ limit: 100 })
				setRawTransactions(txs)
				
				// Map to display format and filter for expenses (assuming + is income, - is expense logic or just category check)
				// Since we don't have 'type' property clearly in all API responses yet, we'll just show them all or infer.
				// For budget page, usually we show expenses. 
				// The wallet module implied negative for expenses if using 'amount' signed, or maybe 'type'.
				// Checking previous Transaction helper: it has 'type' in schema.
				const recentExpenses = txs
					.filter(t => t.type === 'expense')
					.slice(0, 5)
					.map(t => ({
						id: t.id,
						description: t.description || "Untitled Transaction",
						amount: Number(t.amount),
						date: format(new Date(t.date), "MMM d, yyyy"), // e.g. Apr 15, 2023
						category: t.category,
					}))
				
				setRecentTransactions(recentExpenses)

			} catch (error) {
				console.error("Failed to load budget data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<Layout>
			<div className="px-2 sm:px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="mb-4 md:mb-6 lg:mb-8 flex flex-col gap-2 md:gap-3 lg:gap-4"
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
						<div>
							<h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">Budget Management</h1>
							<p className="text-xs md:text-sm text-muted-foreground mt-1">Track and manage your monthly spending.</p>
						</div>

						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
							{/* Month selector */}
							<div className="flex items-center gap-2 w-full sm:w-auto">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<Select defaultValue={activeMonth} onValueChange={setActiveMonth}>
									<SelectTrigger className="w-full sm:w-[180px] h-9 text-xs sm:text-sm">
										<SelectValue placeholder="Select month" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="current">Current Month</SelectItem>
										{/* Future: Add dynamic month list */}
									</SelectContent>
								</Select>
							</div>

							{/* Action buttons */}
							{isMobile ? (
								<div className="flex justify-between w-full">
									<Button asChild size="sm" className="flex-1 mr-2 h-9 text-xs">
										<Link href="/budget/create">
											<PlusCircle className="mr-1 h-3 w-3" />
											New
										</Link>
									</Button>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="sm" className="h-9">
												<Menu className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<Download className="h-4 w-4 mr-2" />
												Export Budget
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Share2 className="h-4 w-4 mr-2" />
												Share Budget
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							) : (
								<div className="flex gap-2 w-full sm:w-auto">
									<Button variant="outline" size="sm" className="h-9">
										<Download className="h-4 w-4 mr-1.5 sm:mr-2" />
										<span className="text-xs sm:text-sm">Export</span>
									</Button>
									<Button variant="outline" size="sm" className="h-9">
										<Share2 className="h-4 w-4 mr-1.5 sm:mr-2" />
										<span className="text-xs sm:text-sm">Share</span>
									</Button>
									<Button asChild size="sm" className="h-9">
										<Link href="/budget/create">
											<PlusCircle className="mr-1.5 sm:mr-2 h-4 w-4" />
											<span className="text-xs sm:text-sm">New Budget</span>
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</motion.div>

				{/* Budget Overview */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					<BudgetOverviewCards budgetSummary={budgetSummary} />
				</motion.div>

				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="mt-4 sm:mt-8"
				>
					<Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
						<div className="overflow-x-auto pb-2">
							<TabsList className="w-full sm:w-auto">
								<TabsTrigger value="categories" className="text-xs sm:text-sm">
									Budget Categories
								</TabsTrigger>
								<TabsTrigger value="transactions" className="text-xs sm:text-sm">
									Transactions
								</TabsTrigger>
								<TabsTrigger value="goals" className="text-xs sm:text-sm">
									Goals
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="categories" className="mt-4 sm:mt-6">
							<div className="space-y-4 sm:space-y-5">
								<div className="md:col-span-1">
									<BudgetCategoriesTab categories={categories} />
								</div>
								<div>
									<BudgetCalendar transactions={rawTransactions} />
								</div>
							</div>
						</TabsContent>

						<TabsContent value="transactions" className="mt-4 sm:mt-6">
							<BudgetTransactionsTab transactions={recentTransactions} />
						</TabsContent>

						<TabsContent value="goals" className="mt-4 sm:mt-6">
							<BudgetGoals />
						</TabsContent>
					</Tabs>
				</motion.div>
			</div>
		</Layout>
	)
}
