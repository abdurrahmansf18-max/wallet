"use client"

import { GoalsOverviewCards } from "@/components/goals/goals-overview-cards"
import { GoalsTabContent } from "@/components/goals/goals-tab-content"
import { Layout } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { BarChart3, Calendar, CheckCircle, Clock, Filter, PlusCircle, Search, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { goalApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
export default function GoalsPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [goals, setGoals] = useState([])
	const [loading, setLoading] = useState(true)
	const { toast } = useToast()

	useEffect(() => {
		fetchGoals()
	}, [])

	const fetchGoals = async () => {
		try {
			const data = await goalApi.getAll()
			// Transform data to match UI expectations
			const transformedGoals = data.map(goal => ({
				id: goal.id,
				name: goal.name,
				targetAmount: goal.target_amount,
				currentAmount: goal.current_amount,
				progress: (goal.current_amount / goal.target_amount) * 100,
				deadline: goal.target_date,
				status: goal.is_completed ? "completed" : (new Date(goal.target_date) < new Date() ? "overdue" : "on-track"),
				category: "Savings", // Default for now
				priority: "Medium", // Default for now
				walletId: goal.wallet_id,
				walletName: "Wallet " + goal.wallet_id?.slice(0, 4), // Placeholder
				notes: goal.description,
				contributions: [], // Placeholder
			}))
			setGoals(transformedGoals)
		} catch (error) {
			console.error("Failed to fetch goals:", error)
			toast({
				title: "Error",
				description: "Failed to load goals. Please try again.",
				variant: "destructive",
			})
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" }
		return new Date(dateString).toLocaleDateString(undefined, options)
	}

	const calculateTimeLeft = (deadline) => {
		const today = new Date()
		const targetDate = new Date(deadline)
		const timeLeft = targetDate - today

		// If deadline has passed
		if (timeLeft < 0) return "Deadline passed"

		const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

		if (daysLeft > 365) {
			const years = Math.floor(daysLeft / 365)
			return `${years} year${years > 1 ? "s" : ""} left`
		} else if (daysLeft > 30) {
			const months = Math.floor(daysLeft / 30)
			return `${months} month${months > 1 ? "s" : ""} left`
		} else {
			return `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
		}
	}

	// Get unique categories from goals
	const categories = ["all", ...new Set(goals.map((goal) => goal.category))]

	// Count goals by status
	const activeGoalsCount = goals.filter(
		(goal) => goal.status === "on-track" || goal.status === "at-risk" || goal.status === "behind",
	).length
	const completedGoalsCount = goals.filter((goal) => goal.status === "completed").length
	const upcomingGoalsCount = goals.filter((goal) => goal.status === "not-started").length

	// Calculate total progress
	const totalProgress =
		goals.length > 0
			? (goals.reduce((sum, goal) => sum + goal.currentAmount, 0) /
				goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) *
			100
			: 0

	// Calculate Insights dynamically
	const getInsights = () => {
		if (goals.length === 0) return null

		const activeGoals = goals.filter((g) => g.status !== "completed")
		if (activeGoals.length === 0) return null

		const highestTarget = [...activeGoals].sort((a, b) => b.targetAmount - a.targetAmount)[0]
		
		const upcoming = activeGoals.filter((g) => new Date(g.deadline) >= new Date())
		const nextDeadline = upcoming.length > 0 
			? upcoming.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0]
			: null

		const closest = [...activeGoals].sort((a, b) => b.progress - a.progress)[0]

		return { highestTarget, nextDeadline, closest }
	}
	const insights = getInsights()

	const formatCurrency = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)

	return (
		<Layout>
			<div>
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Financial Goals</h1>
						<p className="text-muted-foreground mt-1">Track and manage your savings goals</p>
					</div>
					<Button asChild size="sm" className="sm:self-start">
						<Link href="/goals/create">
							<PlusCircle className="mr-2 h-4 w-4" />
							New Goal
						</Link>
					</Button>
				</div>

				{/* Goals Overview */}
				<div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3 mb-6">
					<Card className="col-span-1 lg:col-span-2">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg font-medium">Overall Progress</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									${goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()} of $
									{goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
								</span>
								<span className="text-sm font-medium">{totalProgress.toFixed(1)}%</span>
							</div>
							<Progress value={totalProgress} max={100} className="h-2" />

								<TooltipProvider>
							<div className="grid grid-cols-3 gap-4 pt-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex flex-col items-center p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
												<Target className="h-5 w-5 text-blue-500 mb-1" />
												<span className="text-xs text-muted-foreground">Active</span>
												<span className="text-xl font-semibold">{activeGoalsCount}</span>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Active financial goals</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex flex-col items-center p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
												<CheckCircle className="h-5 w-5 text-green-500 mb-1" />
												<span className="text-xs text-muted-foreground">Completed</span>
												<span className="text-xl font-semibold">{completedGoalsCount}</span>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Completed financial goals</p>
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex flex-col items-center p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
												<Clock className="h-5 w-5 text-amber-500 mb-1" />
												<span className="text-xs text-muted-foreground">Upcoming</span>
												<span className="text-xl font-semibold">{upcomingGoalsCount}</span>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Upcoming financial goals</p>
										</TooltipContent>
									</Tooltip>
							</div>
								</TooltipProvider>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-lg font-medium">Goal Insights</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="mr-2 p-2 rounded-full bg-primary/10">
										<Target className="h-4 w-4 text-primary" />
									</div>
									<div>
										<div className="text-sm font-medium">Highest Priority</div>
										<div className="text-xs text-muted-foreground w-32 truncate">
											{insights?.highestTarget?.name || "No active goals"}
										</div>
									</div>
								</div>
								<Badge variant="outline">
									{insights?.highestTarget ? formatCurrency(insights.highestTarget.targetAmount) : "-"}
								</Badge>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="mr-2 p-2 rounded-full bg-primary/10">
										<Calendar className="h-4 w-4 text-primary" />
									</div>
									<div>
										<div className="text-sm font-medium">Next Deadline</div>
										<div className="text-xs text-muted-foreground w-32 truncate">
											{insights?.nextDeadline?.name || "No upcoming goals"}
										</div>
									</div>
								</div>
								<Badge variant="outline">
									{insights?.nextDeadline 
										? new Date(insights.nextDeadline.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
										: "-"}
								</Badge>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="mr-2 p-2 rounded-full bg-primary/10">
										<TrendingUp className="h-4 w-4 text-primary" />
									</div>
									<div>
										<div className="text-sm font-medium">Closest to Goal</div>
										<div className="text-xs text-muted-foreground w-32 truncate">
											{insights?.closest?.name || "No active goals"}
										</div>
									</div>
								</div>
								<Badge variant="outline">
									{insights?.closest ? `${insights.closest.progress.toFixed(1)}% / target` : "-"}
								</Badge>
							</div>

							<Button variant="outline" className="w-full mt-2" size="sm">
									<BarChart3 className="mr-2 h-4 w-4" />
									View Detailed Insights
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Search and Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search goals..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="icon">
							<Filter className="h-4 w-4" />
						</Button>
						<Select value={categoryFilter} onValueChange={setCategoryFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category === "all" ? "All Categories" : category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Goals Overview Cards */}
				<GoalsOverviewCards goals={goals} />

				{/* Main Content */}
				<div className="mt-6">
					<Tabs defaultValue="all">
						<TabsList className="flex">
							<TabsTrigger value="all">
								All Goals
								<Badge variant="secondary" className="ml-2">
									{goals.length}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="active">
								Active
								<Badge variant="secondary" className="ml-2">
									{activeGoalsCount}
								</Badge>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="all" className="mt-6">
							<GoalsTabContent
								goals={goals.filter(
									(goal) =>
										(categoryFilter === "all" || goal.category === categoryFilter) &&
										(goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
											goal.category.toLowerCase().includes(searchQuery.toLowerCase())),
								)}
								filter="all"
								calculateTimeLeft={calculateTimeLeft}
								formatDate={formatDate}
							/>
						</TabsContent>

						<TabsContent value="active" className="mt-6">
							<GoalsTabContent
								goals={goals.filter(
									(goal) =>
										(categoryFilter === "all" || goal.category === categoryFilter) &&
										(goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
											goal.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
										(goal.status === "on-track" || goal.status === "at-risk" || goal.status === "behind"),
								)}
								filter="active"
								calculateTimeLeft={calculateTimeLeft}
								formatDate={formatDate}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</Layout>
	)
}
