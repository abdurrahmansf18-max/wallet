import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Calendar, CheckCircle2, Clock, Target, Wallet } from "lucide-react"
import Link from "next/link"

export function GoalCard({ goal, calculateTimeLeft, formatDate }) {
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

	return (
		<Card className="h-full overflow-hidden transition-all hover:shadow-md group">
			<CardHeader className="pb-2 relative">
				<div className="absolute top-6 right-6">{getStatusBadge(goal.status)}</div>
				<CardTitle className="text-xl pr-24">{goal.name}</CardTitle>
				<CardDescription className="flex items-center gap-1">
					<Target className="h-3 w-3" />
					{goal.category}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-sm text-muted-foreground">Progress</span>
					<span className="text-sm font-medium">{goal.progress}%</span>
				</div>
				<Progress value={goal.progress} max={100} className={`h-2 ${getStatusColor(goal.status)}`} />

				<div className="grid grid-cols-2 gap-4 mt-4">
					<div className="space-y-1">
						<div className="text-xs text-muted-foreground">Saved</div>
						<div className="text-lg font-semibold">${goal.currentAmount.toLocaleString()}</div>
					</div>
					<div className="space-y-1 text-right">
						<div className="text-xs text-muted-foreground">Target</div>
						<div className="text-lg font-semibold">${goal.targetAmount.toLocaleString()}</div>
					</div>
				</div>

				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					{goal.status === "completed" ? (
						<>
							<CheckCircle2 className="h-4 w-4 text-green-500" />
							<span>Completed on {formatDate(goal.deadline)}</span>
						</>
					) : goal.status === "not-started" ? (
						<>
							<Calendar className="h-4 w-4" />
							<span>Target date: {formatDate(goal.deadline)}</span>
						</>
					) : (
						<>
							<Clock className="h-4 w-4" />
							<span>{calculateTimeLeft(goal.deadline)}</span>
						</>
					)}
				</div>

				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<Wallet className="h-3 w-3" />
					<span>Linked to {goal.walletName}</span>
				</div>

				<Button
					variant="ghost"
					size="sm"
					className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
					asChild
				>
					<Link href={`/goals/${goal.id}`}>
						View Details
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</CardContent>
		</Card>
	)
}
