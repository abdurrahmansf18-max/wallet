"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeExpenseReport } from "@/components/reports/income-expense-report"
import { CategoryBreakdown } from "@/components/reports/category-breakdown"
import { SavingsReport } from "@/components/reports/savings-report"
import { TrendsReport } from "@/components/reports/trends-report"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Filter, Share2 } from "lucide-react"
import { reportsApi } from "@/lib/api"

export function ReportsTabs() {
const [activeTab, setActiveTab] = useState("overview")
const [reportData, setReportData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
const fetchReports = async () => {
try {
const data = await reportsApi.getReports("6months")
setReportData(data)
} catch(e) {
console.error(e)
} finally {
setLoading(false)
}
}
fetchReports()
}, [])

if (loading) return <div>Loading reports...</div>

return (
<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
<div className="flex justify-between items-center">
<TabsList>
<TabsTrigger value="overview">Overview</TabsTrigger>
<TabsTrigger value="categories">Categories</TabsTrigger>
<TabsTrigger value="savings">Savings</TabsTrigger>
</TabsList>
</div>

<TabsContent value="overview" className="space-y-4">
<IncomeExpenseReport apiData={reportData?.incomeExpense} />
<TrendsReport />
</TabsContent>

<TabsContent value="categories">
<CategoryBreakdown apiData={reportData?.categoryBreakdown} />
</TabsContent>

<TabsContent value="savings">
<SavingsReport apiData={reportData?.savingsStatus} />
</TabsContent>
</Tabs>
)
}
