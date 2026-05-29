"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { PlusCircle, Target, CheckCircle2, Clock, TrendingUp, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { goalApi } from "@/lib/api"
import Link from "next/link"

export function BudgetGoals({ className }) {
  const [hoveredGoal, setHoveredGoal] = useState(null)
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalApi.getAll()
        const formattedGoals = Array.isArray(data) ? data.map(g => {
            const target = Number(g.target_amount)
            const current = Number(g.current_amount)
            const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
            
            // Calculate status based on progress and deadline (simplified logic)
            // Ideally backend provides this or we calculate properly against time elapsed
            let status = "on-track"
            if (progress < 50) status = "at-risk" 
            
            return {
                id: g.id,
                name: g.name,
                target: target,
                current: current,
                deadline: g.deadline,
                progress: progress,
                status: status,
                monthlySaving: 0 // Placeholder as backend might not have this yet
            }
        }) : []
        setGoals(formattedGoals)
      } catch (error) {
        console.error("Failed to fetch goals", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "on-track":
        return (
          <Badge variant="success" size="sm">
            On Track
          </Badge>
        )
      case "at-risk":
        return (
          <Badge variant="warning" size="sm">
            At Risk
          </Badge>
        )
      case "behind":
        return (
          <Badge variant="destructive" size="sm">
            Behind
          </Badge>
        )
      default:
        return (
          <Badge variant="success" size="sm">
            On Track
          </Badge>
        )
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 90) return "bg-emerald-500"
    if (progress >= 50) return "bg-blue-500"
    return "bg-primary"
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className={cn("border-border/40 overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Budget Goals</CardTitle>
            <CardDescription>Track your progress towards financial goals.</CardDescription>
          </div>
          <Link href="/goals/create">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Goal
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && (
             <div className="text-center py-4 text-muted-foreground">Loading goals...</div>
          )}

          {!loading && goals.length === 0 && (
             <div className="text-center py-8 text-muted-foreground">
                No goals found. Create one to get started!
            </div>
          )}

          {!loading && goals.length > 0 && goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              onHoverStart={() => setHoveredGoal(goal.id)}
              onHoverEnd={() => setHoveredGoal(null)}
            >
              <div
                className={cn(
                  "rounded-lg border border-border/40 p-4 transition-all duration-200 relative",
                  hoveredGoal === goal.id ? "bg-muted/50" : "",
                )}
              >
                {/* Hover indicator */}
                {hoveredGoal === goal.id && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{goal.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>Due: {formatDate(goal.deadline)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(goal.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Goal</DropdownMenuItem>
                        <DropdownMenuItem>Add Funds</DropdownMenuItem>
                        <DropdownMenuItem>Adjust Timeline</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Goal</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span>
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress
                    value={goal.progress}
                    max={100}
                    className="h-2"
                    indicatorClassName={getProgressColor(goal.progress)}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>
                      {formatCurrency(goal.target - goal.current)} remaining
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
