"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, BarChart, BarChart3, BarChart4 } from "lucide-react"
import { useState } from "react"
import {
	Bar,
	CartesianGrid,
	Legend,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

export function BudgetComparison({ className }) {
	const [comparisonPeriod, setComparisonPeriod] = useState("previous-month")

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value)
	}

	// Mock data for budget comparison
	const comparisonData = {
		"previous-month": {
			current: {
				month: "April",
				year: 2023,
				totalBudget: 3500,
				totalSpent: 2150,
				categories: [
					{ name: "Housing", budgeted: 1200, spent: 1200 },
					{ name: "Groceries", budgeted: 500, spent: 385 },
					{ name: "Dining Out", budgeted: 300, spent: 275 },
					{ name: "Transportation", budgeted: 200, spent: 110 },
					{ name: "Entertainment", budgeted: 150, spent: 180 },
				],
			},
			previous: {
				month: "March",
				year: 2023,
				totalBudget: 3300,
				totalSpent: 2450,
				categories: [
					{ name: "Housing", budgeted: 1200, spent: 1200 },
					{ name: "Groceries", budgeted: 450, spent: 420 },
					{ name: "Dining Out", budgeted: 250, spent: 310 },
					{ name: "Transportation", budgeted: 200, spent: 180 },
					{ name: "Entertainment", budgeted: 120, spent: 140 },
				],
			},
		},
		"same-month-last-year": {
			current: {
				month: "April",
				year: 2023,
				totalBudget: 3500,
				totalSpent: 2150,
				categories: [
					{ name: "Housing", budgeted: 1200, spent: 1200 },
					{ name: "Groceries", budgeted: 500, spent: 385 },
					{ name: "Dining Out", budgeted: 300, spent: 275 },
					{ name: "Transportation", budgeted: 200, spent: 110 },
					{ name: "Entertainment", budgeted: 150, spent: 180 },
				],
			},
			previous: {
				month: "April",
				year: 2022,
				totalBudget: 3000,
				totalSpent: 2800,
				categories: [
					{ name: "Housing", budgeted: 1100, spent: 1100 },
					{ name: "Groceries", budgeted: 400, spent: 450 },
					{ name: "Dining Out", budgeted: 200, spent: 350 },
					{ name: "Transportation", budgeted: 180, spent: 200 },
					{ name: "Entertainment", budgeted: 100, spent: 180 },
				],
			},
		},
	}

	const selectedComparison = comparisonData[comparisonPeriod]
	const currentPeriod = selectedComparison.current
	const previousPeriod = selectedComparison.previous

	// Calculate percentage change
	const calculateChange = (current, previous) => {
		if (previous === 0) return 100
		return ((current - previous) / previous) * 100
	}

	// Prepare data for chart
	const chartData = currentPeriod.categories.map((category, index) => {
		const previousCategory = previousPeriod.categories[index]
		return {
			name: category.name,
			current: category.spent,
			previous: previousCategory.spent,
		}
	})

	// Custom tooltip for chart
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-background border border-border rounded-lg p-3 shadow-md">
					<p className="font-medium mb-1">{label}</p>
					<p className="text-sm text-muted-foreground">
						{currentPeriod.month} {currentPeriod.year}: {formatCurrency(payload[0].value)}
					</p>
					<p className="text-sm text-muted-foreground">
						{previousPeriod.month} {previousPeriod.year}: {formatCurrency(payload[1].value)}
					</p>
					<p className="text-sm font-medium mt-1">Difference: {formatCurrency(payload[0].value - payload[1].value)}</p>
				</div>
			)
		}
		return null
	}

	return (
		<Card className={cn("border-border/40 overflow-hidden", className)}>
			<CardHeader className="pb-3">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle>Budget Comparison</CardTitle>
						<CardDescription>Compare your current budget with previous periods.</CardDescription>
					</div>
					<Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
						<SelectTrigger className="w-full sm:w-[220px]">
							<SelectValue placeholder="Select comparison period" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="previous-month">Previous Month</SelectItem>
							<SelectItem value="same-month-last-year">Same Month Last Year</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Summary comparison */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							key={`total-budget-${comparisonPeriod}`}
						>
							<div className="rounded-lg border border-border/40 p-4">
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
									<Badge variant="outline" className="font-normal">
										{calculateChange(currentPeriod.totalBudget, previousPeriod.totalBudget) >= 0 ? "+" : ""}
										{calculateChange(currentPeriod.totalBudget, previousPeriod.totalBudget).toFixed(1)}%
									</Badge>
								</div>
								<div className="flex items-end justify-between">
									<div>
										<div className="text-2xl font-semibold">{formatCurrency(currentPeriod.totalBudget)}</div>
										<div className="text-xs text-muted-foreground">vs {formatCurrency(previousPeriod.totalBudget)}</div>
									</div>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
										<BarChart className="h-4 w-4 text-primary" />
									</div>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							key={`total-spent-${comparisonPeriod}`}
						>
							<div className="rounded-lg border border-border/40 p-4">
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
									<Badge
										variant={
											calculateChange(currentPeriod.totalSpent, previousPeriod.totalSpent) < 0
												? "success"
												: "destructive"
										}
										className="font-normal"
									>
										{calculateChange(currentPeriod.totalSpent, previousPeriod.totalSpent) >= 0 ? "+" : ""}
										{calculateChange(currentPeriod.totalSpent, previousPeriod.totalSpent).toFixed(1)}%
									</Badge>
								</div>
								<div className="flex items-end justify-between">
									<div>
										<div className="text-2xl font-semibold">{formatCurrency(currentPeriod.totalSpent)}</div>
										<div className="text-xs text-muted-foreground">vs {formatCurrency(previousPeriod.totalSpent)}</div>
									</div>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
										<BarChart3 className="h-4 w-4 text-primary" />
									</div>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: 0.2 }}
							key={`savings-${comparisonPeriod}`}
						>
							<div className="rounded-lg border border-border/40 p-4">
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-sm font-medium text-muted-foreground">Savings</h3>
									<Badge
										variant={
											calculateChange(
												currentPeriod.totalBudget - currentPeriod.totalSpent,
												previousPeriod.totalBudget - previousPeriod.totalSpent,
											) > 0
												? "success"
												: "destructive"
										}
										className="font-normal"
									>
										{calculateChange(
											currentPeriod.totalBudget - currentPeriod.totalSpent,
											previousPeriod.totalBudget - previousPeriod.totalSpent,
										) >= 0
											? "+"
											: ""}
										{calculateChange(
											currentPeriod.totalBudget - currentPeriod.totalSpent,
											previousPeriod.totalBudget - previousPeriod.totalSpent,
										).toFixed(1)}
										%
									</Badge>
								</div>
								<div className="flex items-end justify-between">
									<div>
										<div className="text-2xl font-semibold">
											{formatCurrency(currentPeriod.totalBudget - currentPeriod.totalSpent)}
										</div>
										<div className="text-xs text-muted-foreground">
											vs {formatCurrency(previousPeriod.totalBudget - previousPeriod.totalSpent)}
										</div>
									</div>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
										<BarChart4 className="h-4 w-4 text-primary" />
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Category comparison chart */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: 0.3 }}
						key={`chart-${comparisonPeriod}`}
						className="mt-6"
					>
						<div className="rounded-lg border border-border/40 p-4">
							<h3 className="text-sm font-medium mb-4">Category Comparison</h3>
							<div className="h-[300px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<RechartsBarChart
										data={chartData}
										margin={{
											top: 20,
											right: 30,
											left: 20,
											bottom: 5,
										}}
									>
										<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
										<XAxis dataKey="name" />
										<YAxis tickFormatter={(value) => `$${value}`} />
										<Tooltip content={<CustomTooltip />} />
										<Legend />
										<Bar
											name={`${currentPeriod.month} ${currentPeriod.year}`}
											dataKey="current"
											fill="hsl(var(--primary))"
											radius={[4, 4, 0, 0]}
										/>
										<Bar
											name={`${previousPeriod.month} ${previousPeriod.year}`}
											dataKey="previous"
											fill="hsl(var(--muted))"
											radius={[4, 4, 0, 0]}
										/>
									</RechartsBarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</motion.div>

					{/* Category details */}
					<div className="rounded-lg border border-border/40 overflow-hidden">
						<div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-muted/50">
							<div className="col-span-4">Category</div>
							<div className="col-span-3 text-right">Current</div>
							<div className="col-span-3 text-right">Previous</div>
							<div className="col-span-2 text-right">Change</div>
						</div>

						<div className="divide-y">
							{currentPeriod.categories.map((category, index) => {
								const previousCategory = previousPeriod.categories[index]
								const change = calculateChange(category.spent, previousCategory.spent)
								const isPositive = change >= 0

								return (
									<motion.div
										key={category.name}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2, delay: index * 0.05 }}
									>
										<div className="grid grid-cols-12 gap-4 p-4 items-center">
											<div className="col-span-4 font-medium">{category.name}</div>
											<div className="col-span-3 text-right">{formatCurrency(category.spent)}</div>
											<div className="col-span-3 text-right">{formatCurrency(previousCategory.spent)}</div>
											<div className="col-span-2 text-right flex items-center justify-end">
												<div
													className={cn(
														"flex items-center",
														category.name === "Housing"
															? "text-muted-foreground"
															: isPositive
																? "text-destructive"
																: "text-emerald-600",
													)}
												>
													{isPositive ? (
														<ArrowUpRight className="h-3 w-3 mr-1" />
													) : (
														<ArrowDownRight className="h-3 w-3 mr-1" />
													)}
													{Math.abs(change).toFixed(1)}%
												</div>
											</div>
										</div>
									</motion.div>
								)
							})}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
