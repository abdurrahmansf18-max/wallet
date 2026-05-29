"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function CategoryBreakdown({ apiData = [] }) {
const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308"]
return (
<Card className="w-full border-none shadow-md">
<CardHeader>
<CardTitle>Spending by Category</CardTitle>
<CardDescription>Where your money goes</CardDescription>
</CardHeader>
<CardContent>
{apiData && apiData.length > 0 ? (
<div className="h-[400px] w-full">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie data={apiData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} paddingAngle={2} dataKey="value">
{apiData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
</Pie>
<Tooltip />
<Legend />
</PieChart>
</ResponsiveContainer>
</div>
) : (
<p>No expenses found.</p>
)}
</CardContent>
</Card>
)
}
