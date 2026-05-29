"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip as RechartsTooltip, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function IncomeExpenseReport({ apiData = [] }) {
const currentData = apiData || []
const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0)
const totalExpenses = currentData.reduce((sum, item) => sum + item.expense, 0)
const totalSavings = totalIncome - totalExpenses
const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0

return (
<Card className="w-full overflow-hidden border-none shadow-md">
<CardHeader>
<CardTitle>Income vs Expenses</CardTitle>
<CardDescription>Last 6 months comparison</CardDescription>
</CardHeader>
<CardContent>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div className="rounded-xl bg-muted/30 p-5 border border-border/50">
<div className="text-sm font-medium text-muted-foreground mb-1">Total Income</div>
<div className="text-3xl font-bold text-emerald-600">$</div>
</div>
<div className="rounded-xl bg-muted/30 p-5 border border-border/50">
<div className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</div>
<div className="text-3xl font-bold text-rose-600">$</div>
</div>
<div className="rounded-xl bg-muted/30 p-5 border border-border/50">
<div className="text-sm font-medium text-muted-foreground mb-1">Net Savings</div>
<div className="text-3xl font-bold text-indigo-600">$</div>
</div>
</div>
<div className="h-[400px] w-full mt-4">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barGap={0}>
<CartesianGrid strokeDasharray="3 3" vertical={false} />
<XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
<YAxis axisLine={false} tickLine={false} tickFormatter={(val) => "$"} />
<RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
<Legend />
<ReferenceLine y={0} stroke="#e2e8f0" />
<Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
<Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
</BarChart>
</ResponsiveContainer>
</div>
</CardContent>
</Card>
)
}
