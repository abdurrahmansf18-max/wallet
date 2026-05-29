"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"
import { useState } from "react"
import { ShoppingBag, Utensils, Home, Car, Plane, Film, Zap, Smartphone } from "lucide-react"

export function SpendingByCategory({ className, walletId, analyticsData = [] }) {
  const [activeTab, setActiveTab] = useState("month")
  const [activeIndex, setActiveIndex] = useState(null)

  // Format currency
  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Category icons mapping
  const categoryIcons = {
    Shopping: ShoppingBag,
    Food: Utensils,
    Housing: Home,
    Transportation: Car,
    Travel: Plane,
    Entertainment: Film,
    Utilities: Zap,
    Communication: Smartphone,
    Other: ShoppingBag,
  }

  // Category colors mapping
  const categoryColors = {
    Shopping: "hsl(var(--primary))",
    Food: "hsl(var(--secondary))",
    Housing: "hsl(var(--accent))",
    Transportation: "hsl(var(--destructive))",
    Entertainment: "hsl(var(--warning, 38 92% 50%))",
    Utilities: "hsl(var(--info, 195 85% 41%))",
    Communication: "hsl(var(--success, 142 71% 45%))",
    Other: "hsl(var(--muted-foreground))",
  }

  // Map real data
  const realData = analyticsData.map(item => ({
    ...item,
    color: categoryColors[item.name] || categoryColors.Other
  }));

  const data = realData.length > 0 ? realData : [];

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-border bg-background p-3 shadow-md">
          <p className="mb-1 font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Amount: <span className="font-medium text-foreground">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-foreground">{((data.value / total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Spending by Category</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
          </div>
          <Tabs defaultValue="month" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <div className="h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                      strokeWidth={activeIndex === index ? 2 : 0}
                      className="transition-all duration-200"
                      style={{
                        filter:
                          activeIndex === index ? "brightness(110%) drop-shadow(0 0 2px rgba(0,0,0,0.2))" : "none",
                        transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.2s ease-in-out",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 w-full">
            {data.map((category, index) => {
              const Icon = categoryIcons[category.name] || ShoppingBag
              const percentage = ((category.value / total) * 100).toFixed(1)

              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-lg border border-border/40 p-3",
                      activeIndex === index ? "bg-muted/50" : "",
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(category.value)}</div>
                      <Badge
                        variant={percentage > 30 ? "default" : percentage > 20 ? "secondary" : "muted"}
                        size="sm"
                        className="mt-1"
                      >
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
