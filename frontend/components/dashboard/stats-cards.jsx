"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Activity, ArrowDown, ArrowUp, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { statsApi } from "@/lib/api"

export function StatsCards() {
const [loading, setLoading] = useState(true)
const [stats, setStats] = useState([])

useEffect(() => {
const fetchStats = async () => {
try {
const data = await statsApi.getOverview()

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
const formatPercent = (val) => val > 0 ? `+${Number(val).toFixed(2)}%` : `${Number(val).toFixed(2)}%`
const getTrend = (val) => val >= 0 ? "up" : "down"

setStats([
{
title: "Total Balance",
value: formatCurrency(data.totalBalance),
change: formatPercent(data.balanceChange),
trend: getTrend(data.balanceChange),
icon: DollarSign,
color: "from-emerald-500 to-teal-500",
lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
strokeColor: "#10b981",
fillColor: "#10b98120",
decorationColor: "emerald",
data: data.trendData.map(d => ({ value: d.balance || 0 })),
},
{
title: "Monthly Income",
value: formatCurrency(data.monthlyIncome),
change: formatPercent(data.incomeChange),
trend: getTrend(data.incomeChange),
icon: TrendingUp,
color: "from-blue-500 to-indigo-500",
lightColor: "bg-blue-50 dark:bg-blue-950/30",
strokeColor: "#3b82f6",
fillColor: "#3b82f620",
decorationColor: "blue",
data: data.trendData.map(d => ({ value: d.income || 0 })),
},
{
title: "Monthly Expenses",
value: formatCurrency(data.monthlyExpenses),
change: formatPercent(data.expenseChange),
trend: data.expenseChange >= 0 ? "down" : "up",
icon: CreditCard,
color: "from-rose-500 to-pink-500",
lightColor: "bg-rose-50 dark:bg-rose-950/30",
strokeColor: "#f43f5e",
fillColor: "#f43f5e20",
decorationColor: "rose",
data: data.trendData.map(d => ({ value: d.expense || 0 })),
},
{
title: "Savings Rate",
value: `${Number(data.savingsRate).toFixed(1)}%`,
change: formatPercent(data.savingsChange),
trend: getTrend(data.savingsChange),
icon: Activity,
color: "from-violet-500 to-purple-500",
lightColor: "bg-violet-50 dark:bg-violet-950/30",
strokeColor: "#8b5cf6",
fillColor: "#8b5cf620",
decorationColor: "violet",
data: data.trendData.map(d => ({ value: d.savingsRate || 0 })),
},
])
} catch (error) {
console.error("Failed to fetch stats", error)
} finally {
setLoading(false)
}
}

fetchStats()
}, [])

if (loading) {
return (
<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
{[...Array(4)].map((_, i) => (
<Card key={i} className="animate-pulse h-[140px] bg-muted/20" />
))}
</div>
)
}

return (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
			{stats.map((stat, index) => (
				<StatCard key={stat.title} stat={stat} index={index} />
			))}
		</div>
	)
}

function StatCard({ stat, index }) {
	const Icon = stat.icon

	// Custom tooltip that matches our design
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-background border border-border/40 rounded-lg shadow-sm p-2 text-xs">
					<p className="font-medium">{`Value: ${payload[0].value}`}</p>
				</div>
			)
		}
		return null
	}

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
			<Card
				className={cn(
					"overflow-hidden border-border/40 hover:shadow-md transition-all duration-300 group",
					"decoration-card decoration-" + stat.decorationColor,
				)}
			>
				<div className="relative p-6">
					{/* Background accent */}
					<div
						className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mt-8 -mr-8 opacity-10", stat.lightColor)}
					/>

					{/* Top row with icon and chart */}
					<div className="flex justify-between items-start mb-4">
						{/* Icon with gradient background */}
						<div className={cn("flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br", stat.color)}>
							<Icon className="h-6 w-6 text-white" />
						</div>

						{/* Recharts line chart in top right */}
						<div className="w-40 h-12 relative z-10">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={stat.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
									<defs>
										<linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor={stat.strokeColor} stopOpacity={0.3} />
											<stop offset="95%" stopColor={stat.strokeColor} stopOpacity={0} />
										</linearGradient>
									</defs>
									<Tooltip content={<CustomTooltip />} cursor={false} />
									<Area
										type="monotone"
										dataKey="value"
										stroke={stat.strokeColor}
										strokeWidth={2}
										fillOpacity={1}
										fill={`url(#gradient-${index})`}
										animationDuration={1000}
										animationEasing="ease-out"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Value and title */}
					<div className="flex justify-between items-center">
						<div className="space-y-1 relative z-10">
							<h3 className="text-3xl font-semibold tracking-tight">{stat.value}</h3>
							<p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
						</div>

						{/* Change indicator */}
						<div className="mt-4 flex items-center relative z-10">
							<div
								className={cn(
									"flex items-center justify-center rounded-full p-1 mr-2",
									stat.trend === "up"
										? "text-emerald-500 bg-emerald-100 dark:bg-emerald-950/30"
										: "text-rose-500 bg-rose-100 dark:bg-rose-950/30",
								)}
							>
								{stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
							</div>
							<p className={cn("text-xs font-medium", stat.trend === "up" ? "text-emerald-500" : "text-rose-500")}>
								{stat.change} from last month
							</p>
						</div>

					</div>
				</div>
			</Card>
		</div>
	)
}



