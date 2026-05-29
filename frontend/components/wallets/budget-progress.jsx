"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { ShoppingBag, Utensils, Home, Car, Film, Zap, Smartphone, AlertCircle } from "lucide-react"

export function BudgetProgress({ className, walletId }) {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  // Format currency
  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Category icons mapping
  const categoryIcons = {
    Shopping: ShoppingBag,
    Food: Utensils,
    Housing: Home,
    Transportation: Car,
    Entertainment: Film,
    Utilities: Zap,
    Communication: Smartphone,
  }

  // Mock data for demonstration
  const budgets = [
    {
      category: "Shopping",
      budget: 500,
      spent: 450,
    },
    {
      category: "Food",
      budget: 400,
      spent: 380,
    },
    {
      category: "Housing",
      budget: 800,
      spent: 800,
    },
    {
      category: "Transportation",
      budget: 300,
      spent: 200,
    },
    {
      category: "Entertainment",
      budget: 200,
      spent: 150,
    },
  ]

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = budgets.reduce((sum, item) => sum + item.spent, 0)
  const totalProgress = Math.round((totalSpent / totalBudget) * 100)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Budget Progress</CardTitle>
        <CardDescription>Track your spending against monthly budget</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Overall Budget</span>
            <span className="text-sm font-medium">
              {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
            </span>
          </div>
          <Progress
            value={totalProgress}
            className="h-3"
            indicatorClassName={
              totalProgress >= 90 ? "bg-destructive" : totalProgress >= 75 ? "bg-amber-500" : "bg-primary"
            }
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <Badge
              variant={totalProgress >= 90 ? "destructive" : totalProgress >= 75 ? "warning" : "success"}
              size="sm"
            >
              {totalProgress}% used
            </Badge>
            <span>{formatCurrency(totalBudget - totalSpent)} remaining</span>
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map((budget, index) => {
            const Icon = categoryIcons[budget.category] || ShoppingBag
            const progress = Math.round((budget.spent / budget.budget) * 100)
            const isOverBudget = budget.spent > budget.budget
            const isNearBudget = progress >= 90 && !isOverBudget

            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onHoverStart={() => setHoveredCategory(budget.category)}
                onHoverEnd={() => setHoveredCategory(null)}
              >
                <div
                  className={cn(
                    "rounded-lg border border-border/40 p-4 transition-all duration-200",
                    hoveredCategory === budget.category ? "bg-muted/50" : "",
                    isOverBudget ? "border-destructive/40" : "",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{budget.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.budget)}
                      </div>
                      <Badge variant={isOverBudget ? "destructive" : isNearBudget ? "warning" : "success"} size="sm">
                        {progress}% used
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress
                      value={progress}
                      className="h-2"
                      indicatorClassName={
                        isOverBudget ? "bg-destructive" : isNearBudget ? "bg-amber-500" : "bg-primary"
                      }
                    />
                  </div>

                  {isOverBudget && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span>Over budget by {formatCurrency(budget.spent - budget.budget)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
