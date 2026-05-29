"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, DollarSign, History, TrendingUp } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { transactionApi, walletApi } from "@/lib/api"

export function WalletOverview({ className }) {
  const [activeTab, setActiveTab] = useState("week")
  const [transactions, setTransactions] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, walletsData] = await Promise.all([
          transactionApi.getAll({ limit: 1000 }), // Get more history for month/year views
          walletApi.getAll()
        ])
        if (Array.isArray(txData)) {
          setTransactions(txData)
        }
        if (Array.isArray(walletsData)) {
          const total = walletsData.reduce((acc, w) => acc + (Number(w.balance) || 0), 0)
          setTotalBalance(total)
        }
      } catch (error) {
        console.error("Failed to fetch data for overview", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Process data based on active tab
  const data = useMemo(() => {
    if (loading) return []

    const now = new Date()
    const result = []
    
    // Helper to format date key
    const formatDateKey = (date) => {
      return date.toISOString().split('T')[0] // YYYY-MM-DD
    }

    // Map net flow directly by date
    const dailyNetFlow = {}
    transactions.forEach(t => {
      const date = new Date(t.date || t.created_at)
      const key = formatDateKey(date)
      if (!dailyNetFlow[key]) dailyNetFlow[key] = 0
      
      const amount = Number(t.amount)
      if (t.type === 'income') dailyNetFlow[key] += amount
      else if (t.type === 'expense') dailyNetFlow[key] -= amount
    })

    // How many points to generate
    let daysToGenerate = 7
    let formatLabel = (d) => d.toLocaleDateString('en-US', { weekday: 'short' })
    if (activeTab === 'month') {
      daysToGenerate = 30
      formatLabel = (d) => d.getDate().toString()
    } else if (activeTab === 'year') {
      daysToGenerate = 365 
      // Instead of grouping by month, to keep the area chart shape similar we can just generate points,
      // but showing 365 points is heavy. We can aggregate by month.
    }

    if (activeTab === 'year') {
      // Aggregate by month for the last 12 months
      let currentBalance = totalBalance
      // first, calculate total net flow to backtrack overall
      let monthMap = Array(12).fill(0)
      let labelMap = Array(12).fill('')
      
      // setup buckets
      for(let i=11; i>=0; i--) {
        let d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labelMap[11-i] = d.toLocaleDateString('en-US', { month: 'short' })
      }
      
      // Calculate net flow per month
      transactions.forEach(t => {
        const date = new Date(t.date || t.created_at)
        const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
        if (diffMonths >= 0 && diffMonths < 12) {
          const index = 11 - diffMonths // 11 is current month
          const amount = Number(t.amount)
          if (t.type === 'income') monthMap[index] += amount
          else if (t.type === 'expense') monthMap[index] -= amount
        }
      })
      
      // Backtrack
      let runningBalance = currentBalance
      for (let i = 11; i >= 0; i--) {
        result.unshift({
          date: labelMap[i],
          value: runningBalance,
          previous: runningBalance * 0.9 // mocked previous year for comparison
        })
        runningBalance -= monthMap[i]
      }
      return result
    }

    // Backtrack daily
    let currentBalance = totalBalance
    for (let i = 0; i < daysToGenerate; i++) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        const key = formatDateKey(d)
        
        result.unshift({
          date: formatLabel(d),
          value: currentBalance,
          previous: currentBalance * 0.9 // For real previous period we'd look back 2x time, using simple 0.9 multiple for demo of "previous" shadow
        })

        // calculate yesterday's balance
        const netFlowToday = dailyNetFlow[key] || 0
        currentBalance -= netFlowToday
    }

    return result
  }, [activeTab, transactions, totalBalance, loading])

  // Calculate trend (simple comparison of last 2 data points)
  const trend = useMemo(() => {
    if (!data || data.length < 2) return 0
    const current = data[data.length - 1].value
    const prev = data[data.length - 2].value
    if (prev === 0) return 0
    return ((current - prev) / Math.abs(prev)) * 100
  }, [data])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Calculate growth percentage for display
  const growthPercentage = trend.toFixed(1)
  const isPositiveGrowth = trend >= 0

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-border rounded-lg shadow-md p-3">
          <p className="text-muted-foreground font-medium mb-1">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-foreground font-medium">Current: {formatCurrency(payload[0].value)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/40" />
              <p className="text-muted-foreground">Previous: {formatCurrency(payload[1].value)}</p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Wallet Overview</CardTitle>
            <CardDescription className="text-sm">Your financial summary across all wallets.</CardDescription>
          </div>
          <Tabs defaultValue="week" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="w-full flex">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="previous"
                stackId="1"
                stroke="hsl(var(--primary))"
                strokeOpacity={0.4}
                strokeWidth={1}
                fillOpacity={1}
                fill="url(#colorPrevious)"
              />

              <Area
                type="monotone"
                dataKey="value"
                stackId="1"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Card className="bg-primary/5 border overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mt-8 -mr-8"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              </div>
              <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(data.length > 0 ? data[data.length - 1].value : 0)}</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mt-8 -mr-8"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <History className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Previous Balance</p>
              </div>
              <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(data.length > 0 ? data[data.length - 1].previous : 0)}</p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border overflow-hidden relative",
              isPositiveGrowth ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-rose-50 dark:bg-rose-950/20",
            )}
          >
            <div
              className={cn(
                "absolute top-0 right-0 w-16 h-16 rounded-full -mt-8 -mr-8",
                isPositiveGrowth ? "bg-emerald-100 dark:bg-emerald-900/20" : "bg-rose-100 dark:bg-rose-900/20",
              )}
            ></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    isPositiveGrowth ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-rose-100 dark:bg-rose-900/30",
                  )}
                >
                  <TrendingUp
                    className={cn(
                      "h-4 w-4",
                      isPositiveGrowth ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                    )}
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Growth</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xl sm:text-2xl font-semibold">{growthPercentage}%</p>
                {isPositiveGrowth ? (
                  <ArrowUpRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
