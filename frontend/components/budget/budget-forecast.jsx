"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { budgetApi } from "@/lib/api"

export function BudgetForecast() {
const [data, setData] = useState([])

useEffect(() => {
budgetApi.getInsights().then(res => {
if(res && res.trends) {
setData(res.trends.map(t => ({
name: t.category,
actual: t.spent,
predicted: t.forecast
})))
}
}).catch(console.error)
}, [])

return (
<Card>
<CardHeader>
<CardTitle>Usage Forecast</CardTitle>
<CardDescription>Predicted spending for the rest of the month</CardDescription>
</CardHeader>
<CardContent>
<div className="h-[300px] mt-4">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Line type="monotone" dataKey="actual" stroke="#8884d8" name="Current Spent" />
<Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeDasharray="5 5" name="Predicted" />
</LineChart>
</ResponsiveContainer>
</div>
</CardContent>
</Card>
)
}
