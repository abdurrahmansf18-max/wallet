"use client"

import { GoalContributionHistory } from "@/components/goals/goal-contribution-history"
import { GoalMilestones } from "@/components/goals/goal-milestones"
import { GoalProjection } from "@/components/goals/goal-projection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { AlertTriangle, Clock, Edit, PlusCircle, Target, Trash2, Wallet } from "lucide-react"
import Link from "next/link"

export function GoalDetails({ goal, formatDate, calculateTimeLeft, onDelete, onContribute }) {
	const isMobile = useIsMobile()

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-500"
			case "on-track":
				return "bg-primary"
			case "at-risk":
				return "bg-yellow-500"
			case "behind":
				return "bg-destructive"
			case "not-started":
				return "bg-gray-300"
			default:
				return "bg-primary"
		}
	}

	const getStatusBadge = (status) => {
		switch (status) {
			case "completed":
				return <Badge variant="success">Completed</Badge>
			case "on-track":
				return <Badge variant="default">On Track</Badge>
			case "at-risk":
				return <Badge variant="warning">At Risk</Badge>
			case "behind":
				return <Badge variant="destructive">Behind</Badge>
			case "not-started":
				return <Badge variant="outline">Not Started</Badge>
			default:
				return <Badge variant="default">On Track</Badge>
		}
	}

	// Calculate monthly contribution needed
	const calculateMonthlyContribution = () => {
		if (goal.status === "completed") return 0

		const today = new Date()
		const deadline = new Date(goal.deadline)
		const monthsLeft = (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth())

		if (monthsLeft <= 0) return goal.targetAmount - goal.currentAmount

		return (goal.targetAmount - goal.currentAmount) / monthsLeft
	}

	const monthlyContribution = calculateMonthlyContribution()

	return (
		<div className="space-y-4 sm:space-y-6">
			<Card>
				<CardHeader className="pb-3 sm:pb-6">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
						<div>
							<CardTitle className="text-xl sm:text-2xl">{goal.name}</CardTitle>
							<CardDescription className="flex items-center gap-1 mt-1">
								<Target className="h-3 w-3 sm:h-4 sm:w-4" />
								{goal.category} • {goal.priority} Priority
							</CardDescription>
						</div>
						<div className="flex items-center gap-2 self-end sm:self-auto">
							{getStatusBadge(goal.status)}
							<Button variant="outline" size="icon" asChild className="h-8 w-8 sm:h-9 sm:w-9">
								<Link href={`/goals/${goal.id}/edit`}>
									<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
									<span className="sr-only">Edit</span>
								</Link>
							</Button>
							<Button variant="outline" size="icon" onClick={() => onDelete(goal.id)} className="h-8 w-8 sm:h-9 sm:w-9">
								<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="sr-only">Delete</span>
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 sm:space-y-6">
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-xs sm:text-sm text-muted-foreground">Progress</span>
							<span className="text-xs sm:text-sm font-medium">{goal.progress.toFixed(1)}%</span>
						</div>
						<Progress value={goal.progress} max={100} className={`h-2 sm:h-3 ${getStatusColor(goal.status)}`} />
					</div>

					<div className="grid grid-cols-2 gap-3 sm:gap-6">
						<Card>
							<CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
								<CardTitle className="text-xs sm:text-sm font-medium">Current Amount</CardTitle>
							</CardHeader>
							<CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
								<div className="text-lg sm:text-2xl font-semibold">${goal.currentAmount.toLocaleString()}</div>
								<p className="text-[10px] sm:text-xs text-muted-foreground">
									{goal.contributions.length} contribution{goal.contributions.length !== 1 ? "s" : ""}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
								<CardTitle className="text-xs sm:text-sm font-medium">Target Amount</CardTitle>
							</CardHeader>
							<CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
								<div className="text-lg sm:text-2xl font-semibold">${goal.targetAmount.toLocaleString()}</div>
								<p className="text-[10px] sm:text-xs text-muted-foreground">
									${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:gap-4">
						<div className="flex items-center p-3 sm:p-4 rounded-lg border">
							<div className="mr-3 sm:mr-4 p-1.5 sm:p-2 rounded-full bg-primary/10">
								<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
							</div>
							<div>
								<div className="text-xs sm:text-sm font-medium">Timeline</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									{goal.status === "completed"
										? `Completed on ${formatDate(goal.deadline)}`
										: calculateTimeLeft(goal.deadline)}
								</div>
							</div>
						</div>

						<div className="flex items-center p-3 sm:p-4 rounded-lg border">
							<div className="mr-3 sm:mr-4 p-1.5 sm:p-2 rounded-full bg-primary/10">
								<Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
							</div>
							<div>
								<div className="text-xs sm:text-sm font-medium">Linked Wallet</div>
								<div className="text-xs sm:text-sm text-muted-foreground">{goal.walletName}</div>
							</div>
						</div>

						<div className="flex items-center p-3 sm:p-4 rounded-lg border">
							<div className="mr-3 sm:mr-4 p-1.5 sm:p-2 rounded-full bg-primary/10">
								<AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
							</div>
							<div>
								<div className="text-xs sm:text-sm font-medium">Monthly Need</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									{goal.status === "completed" ? "Goal completed" : `$${monthlyContribution.toFixed(2)}/month`}
								</div>
							</div>
						</div>
					</div>

					{goal.notes && (
						<div className="p-3 sm:p-4 rounded-lg border">
							<h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Notes</h3>
							<p className="text-xs sm:text-sm text-muted-foreground">{goal.notes}</p>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button
						className="w-full text-xs sm:text-sm py-2 sm:py-3"
						disabled={goal.status === "completed"}
						onClick={() => onContribute(goal.id)}
					>
						<PlusCircle className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
						Add Contribution
					</Button>
				</CardFooter>
			</Card>

			<Tabs defaultValue="history" className="w-full">
				<TabsList className="grid w-full grid-cols-3 h-auto">
					<TabsTrigger value="history" className="text-[10px] sm:text-sm py-1.5 sm:py-2 px-1 sm:px-2">
						{isMobile ? "History" : "Contribution History"}
					</TabsTrigger>
					<TabsTrigger value="milestones" className="text-[10px] sm:text-sm py-1.5 sm:py-2 px-1 sm:px-2">
						Milestones
					</TabsTrigger>
					<TabsTrigger value="projection" className="text-[10px] sm:text-sm py-1.5 sm:py-2 px-1 sm:px-2">
						Projection
					</TabsTrigger>
				</TabsList>
				<TabsContent value="history" className="mt-3 sm:mt-4">
					<GoalContributionHistory goal={goal} formatDate={formatDate} />
				</TabsContent>
				<TabsContent value="milestones" className="mt-3 sm:mt-4">
					<GoalMilestones goal={goal} formatDate={formatDate} />
				</TabsContent>
				<TabsContent value="projection" className="mt-3 sm:mt-4">
					<GoalProjection goal={goal} formatDate={formatDate} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
