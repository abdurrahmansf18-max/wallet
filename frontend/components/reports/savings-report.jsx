"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SavingsReport({ apiData = {} }) {
const progress = apiData.progress || 0
return (
<Card className="w-full border-none shadow-md">
<CardHeader>
<CardTitle>Savings Goals</CardTitle>
<CardDescription>Your progression towards your goals</CardDescription>
</CardHeader>
<CardContent className="space-y-6">
<div>
<div className="flex justify-between mb-2">
<span>Total Current Savings</span>
<span>$ / $</span>
</div>
<Progress value={progress} className="h-3" />
<p className="text-sm text-muted-foreground mt-2">{progress.toFixed(1)}% achieved</p>
</div>
</CardContent>
</Card>
)
}
