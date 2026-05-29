import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Target, TrendingUp, Wallet } from "lucide-react"

export function GoalsOverviewCards({ goals }) {
	// Calculate total saved and target amounts
	const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
	const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
	const percentComplete = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

	// Find the next upcoming deadline
	const upcomingGoals = goals
		.filter((goal) => goal.status !== "completed")
		.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

	const nextDeadline =
		upcomingGoals.length > 0
			? new Date(upcomingGoals[0].deadline).toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
			})
			: "None"

	// Calculate completed goals
	const completedGoals = goals.filter((g) => g.status === "completed").length

	return (
		<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
			<Card className="overflow-hidden transition-all hover:shadow-md">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-medium text-sm text-muted-foreground">Total Goals</h3>
						<div className="bg-primary/10 p-2 rounded-full">
							<Target className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="flex items-baseline">
						<div className="text-3xl font-bold">{goals.length}</div>
						<div className="ml-2 text-sm text-muted-foreground">{completedGoals} completed</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all hover:shadow-md">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-medium text-sm text-muted-foreground">Total Target</h3>
						<div className="bg-primary/10 p-2 rounded-full">
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="text-3xl font-bold">${totalTarget.toLocaleString()}</div>
					<div className="mt-2 text-sm text-muted-foreground">
						${(totalTarget / goals.length).toFixed(0).toLocaleString()} avg per goal
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all hover:shadow-md">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-medium text-sm text-muted-foreground">Saved So Far</h3>
						<div className="bg-primary/10 p-2 rounded-full">
							<Wallet className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="text-3xl font-bold">${totalSaved.toLocaleString()}</div>
					<div className="mt-4">
						<Progress value={percentComplete} className="h-2" />
						<div className="mt-2 text-sm text-muted-foreground">{percentComplete.toFixed(0)}% of target</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all hover:shadow-md">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-medium text-sm text-muted-foreground">Next Deadline</h3>
						<div className="bg-primary/10 p-2 rounded-full">
							<Clock className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="text-3xl font-bold">{nextDeadline}</div>
					{upcomingGoals.length > 0 && (
						<div className="mt-2 text-sm text-muted-foreground">
							{upcomingGoals[0].name} ({upcomingGoals[0].progress}% complete)
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
