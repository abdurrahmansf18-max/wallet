import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, Download } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function GoalContributionHistory({ goal: externalGoal = null, formatDate = null }) {
	// Default format date function if none provided
	const defaultFormatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	// Use provided formatDate or default
	const formattedDate = formatDate || defaultFormatDate

	// Sample goal with 12 months of data if no goal is provided
	const defaultGoal = {
		id: "1",
		name: "New Car",
		targetAmount: 24000,
		currentAmount: 15600,
		deadline: "2024-12-31",
		status: "in-progress",
		progress: 65,
		contributions: [
			{ date: "2023-01-15", amount: 1000 },
			{ date: "2023-02-10", amount: 1200 },
			{ date: "2023-03-05", amount: 1100 },
			{ date: "2023-04-20", amount: 1300 },
			{ date: "2023-05-15", amount: 1500 },
			{ date: "2023-06-10", amount: 1400 },
			{ date: "2023-07-05", amount: 1600 },
			{ date: "2023-08-18", amount: 1500 },
			{ date: "2023-09-22", amount: 1700 },
			{ date: "2023-10-15", amount: 1300 },
			{ date: "2023-11-12", amount: 1500 },
			{ date: "2023-12-08", amount: 1500 },
		],
	}

	// Use provided goal or default
	const goal = externalGoal || defaultGoal

	// Sort contributions by date (newest first)
	const sortedContributions = [...goal.contributions].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	)

	// Prepare data for chart (oldest first for proper timeline)
	const chartData = [...goal.contributions]
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.reduce((acc, contribution, index, array) => {
			const previousTotal = index > 0 ? acc[index - 1].total : 0
			const total = previousTotal + contribution.amount

			return [
				...acc,
				{
					date: new Date(contribution.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
					amount: contribution.amount,
					total,
				},
			]
		}, [])

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex justify-between items-start">
						<div>
							<CardTitle>Contribution History</CardTitle>
							<CardDescription>Track your progress over time</CardDescription>
						</div>
						<Button variant="outline" size="sm">
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{chartData.length > 0 ? (
						<div className="h-[300px] mb-6">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
									<XAxis
										dataKey="date"
										axisLine={{ stroke: "#e5e7eb" }}
										tickLine={false}
										tick={{ fontSize: 12 }}
										interval="preserveStartEnd"
									/>
									<YAxis
										axisLine={{ stroke: "#e5e7eb" }}
										tickLine={false}
										tickFormatter={(value) => `$${value}`}
										tick={{ fontSize: 12 }}
									/>
									<Tooltip
										formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
										labelFormatter={(label) => `Date: ${label}`}
										contentStyle={{
											backgroundColor: "white",
											border: "1px solid #e5e7eb",
											borderRadius: "6px",
											boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
										}}
									/>
									<Line
										type="monotone"
										dataKey="total"
										stroke="#4f46e5"
										name="Total Saved"
										strokeWidth={3}
										dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
										activeDot={{ r: 6, fill: "#4f46e5", stroke: "white", strokeWidth: 2 }}
									/>
									<Line
										type="monotone"
										dataKey="amount"
										stroke="#10b981"
										name="Contribution"
										strokeWidth={2}
										dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
										activeDot={{ r: 6, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<p className="text-muted-foreground mb-4">No contributions have been made yet.</p>
							<Button>Add Your First Contribution</Button>
						</div>
					)}

					{sortedContributions.length > 0 && (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Change</TableHead>
										<TableHead className="text-right">Running Total</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sortedContributions.map((contribution, index) => {
										// Calculate running total up to this contribution
										const runningTotal = sortedContributions
											.slice(sortedContributions.length - index - 1)
											.reduce((sum, c) => sum + c.amount, 0)

										// Calculate percentage of goal
										const percentOfGoal = (contribution.amount / goal.targetAmount) * 100

										return (
											<TableRow key={`${contribution.date}-${index}`}>
												<TableCell>{formattedDate(contribution.date)}</TableCell>
												<TableCell className="font-medium">${contribution.amount.toLocaleString()}</TableCell>
												<TableCell>
													<Badge variant="outline" className="flex items-center w-fit">
														<ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
														{percentOfGoal.toFixed(1)}%
													</Badge>
												</TableCell>
												<TableCell className="text-right">${runningTotal.toLocaleString()}</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
