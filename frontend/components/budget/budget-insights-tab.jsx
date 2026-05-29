"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react"
import { budgetApi } from "@/lib/api"

export function BudgetInsightsTab() {
const [insights, setInsights] = useState(null)

useEffect(() => {
budgetApi.getInsights().then(setInsights).catch(console.error)
}, [])

if (!insights) return <div>Loading insights...</div>

return (
<div className="grid gap-4 md:grid-cols-2">
<Card>
<CardHeader><CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-amber-500" />Recommendations</CardTitle></CardHeader>
<CardContent>
<ul className="space-y-4">
{insights.recommendations.map((rec, i) => (
<li key={i} className="flex items-start gap-2">
<span className="mt-1 flex h-2 w-2 rounded-full bg-primary" />
<span className="text-sm">{rec}</span>
</li>
))}
</ul>
</CardContent>
</Card>
<Card>
<CardHeader><CardTitle>Spending Trends</CardTitle></CardHeader>
<CardContent>
<div className="space-y-4">
{insights.trends.map((t, i) => (
<div key={i} className="flex justify-between items-center">
<div>
<p className="text-sm font-medium">{t.category}</p>
<p className="text-xs text-muted-foreground">Budget: $</p>
</div>
<div className="text-right">
<p className="text-sm font-medium">$</p>
</div>
</div>
))}
</div>
</CardContent>
</Card>
</div>
)
}
