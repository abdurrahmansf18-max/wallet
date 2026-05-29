"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Car, GraduationCap, Home, MoreHorizontal, Plane, PlusCircle, Target } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { goalApi } from "@/lib/api"

export function FinancialGoals({ className }) {
	const [hoveredGoal, setHoveredGoal] = useState(null)
	const [goals, setGoals] = useState([])
	const [loading, setLoading] = useState(true)

	// Fetch goals on component mount
	useEffect(() => {
		const fetchGoals = async () => {
			try {
				const data = await goalApi.getAll()
				// Transform data if needed, or just set it
				// Backend likely returns: { id, name, target_amount, current_amount, deadline, ... }
				// We map it to component structure
				const formattedGoals = Array.isArray(data) ? data.map(g => ({
					id: g.id,
					name: g.name,
					target: Number(g.target_amount),
					current: Number(g.current_amount),
					deadline: g.deadline,
					icon: Target, // Default icon, could be dynamic based on name/category
					progress: Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100))
				})) : []
				
				setGoals(formattedGoals)
			} catch (error) {
				console.error("Failed to fetch goals:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchGoals()
	}, [])

	// Format currency
	const formatCurrency = (value, currency = "USD") => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value)
	}

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="flex flex-row items-center justify-between pb-3">
				<div>
					<CardTitle className="text-xl">Financial Goals</CardTitle>
					<CardDescription>Track your progress towards your financial targets</CardDescription>
				</div>
				<Link href="/goals/create">
					<Button size="sm" className="h-9 gap-1">
						<PlusCircle className="h-4 w-4" />
						Add Goal
					</Button></Link>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{loading ? (
						<div className="text-center py-4 text-muted-foreground">Loading goals...</div>
					) : goals.length > 0 ? (
						goals.map((goal, index) => {
							const Icon = goal.icon
							const deadline = goal.deadline ? new Date(goal.deadline).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							}) : "No deadline"

							return (
								<motion.div
									key={goal.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: index * 0.1 }}
									onHoverStart={() => setHoveredGoal(goal.id)}
									onHoverEnd={() => setHoveredGoal(null)}
								>
									<div
									className={cn(
										"rounded-lg border border-border/40 p-4 transition-all duration-200",
										hoveredGoal === goal.id ? "bg-muted/50" : "",
									)}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<Icon className="h-5 w-5 text-primary" />
											</div>
											<div>
												<div className="font-medium">{goal.name}</div>
												<div className="text-sm text-muted-foreground">Target: {formatCurrency(goal.target)}</div>
											</div>
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Edit Goal</DropdownMenuItem>
												<DropdownMenuItem>Add Funds</DropdownMenuItem>
												<DropdownMenuItem>View Details</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									<div className="mt-4">
										<div className="mb-1 flex items-center justify-between text-sm">
											<span>
												{formatCurrency(goal.current)} of {formatCurrency(goal.target)}
											</span>
											<Badge 
												className={cn(
													"h-5 px-2 py-0 text-[10px] font-medium",
													goal.progress >= 75 ? "bg-emerald-500 hover:bg-emerald-600" : 
													goal.progress >= 50 ? "bg-blue-500 hover:bg-blue-600" : 
													"bg-secondary text-secondary-foreground"
												)}
											>
												{goal.progress}%
											</Badge>
										</div>
										<Progress
											value={goal.progress}
											className="h-2"
											indicatorClassName={
												goal.progress >= 75 ? "bg-emerald-500" : goal.progress >= 50 ? "bg-blue-500" : "bg-primary"
											}
										/>
									</div>

									<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
										<span>Deadline: {deadline}</span>
										<span>{formatCurrency(goal.target - goal.current)} remaining</span>
									</div>
								</div>
							</motion.div>
						)
					})
				) : (
					<div className="text-center py-8 text-muted-foreground">
						No goals found. Create one to get started!
					</div>
				)}
				</div>
			</CardContent>
		</Card>
	)
}
