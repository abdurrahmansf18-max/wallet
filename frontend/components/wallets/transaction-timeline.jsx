"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Utensils, Home, Car, Film, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TransactionTimeline({ className, walletId }) {
  const [hoveredTransaction, setHoveredTransaction] = useState(null)

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
    Entertainment: Film,
  }

  // Mock data for demonstration
  const transactions = [
    {
      id: "t1",
      description: "Grocery Store",
      amount: -84.32,
      date: "2023-04-15T14:34:00Z",
      category: "Shopping",
      status: "completed",
    },
    {
      id: "t2",
      description: "Salary Deposit",
      amount: 2750.0,
      date: "2023-04-14T09:15:00Z",
      category: "Income",
      status: "completed",
    },
    {
      id: "t3",
      description: "Restaurant Dinner",
      amount: -65.5,
      date: "2023-04-13T19:45:00Z",
      category: "Food",
      status: "completed",
    },
    {
      id: "t4",
      description: "Movie Tickets",
      amount: -24.99,
      date: "2023-04-12T20:30:00Z",
      category: "Entertainment",
      status: "completed",
    },
    {
      id: "t5",
      description: "Gas Station",
      amount: -45.75,
      date: "2023-04-11T12:15:00Z",
      category: "Transportation",
      status: "completed",
    },
  ]

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Transaction Timeline</CardTitle>
        <CardDescription>Recent activity in chronological order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, dayTransactions], groupIndex) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-grow bg-border/40"></div>
                <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                <div className="h-px flex-grow bg-border/40"></div>
              </div>

              <div className="space-y-3">
                {dayTransactions.map((transaction, index) => {
                  const isIncome = transaction.amount > 0
                  const Icon = categoryIcons[transaction.category] || (isIncome ? ArrowUpRight : ArrowDownLeft)
                  const time = new Date(transaction.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })

                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: (groupIndex * dayTransactions.length + index) * 0.05 }}
                      onHoverStart={() => setHoveredTransaction(transaction.id)}
                      onHoverEnd={() => setHoveredTransaction(null)}
                    >
                      <div
                        className={cn(
                          "relative rounded-lg border border-border/40 p-4 transition-all duration-200",
                          hoveredTransaction === transaction.id ? "bg-muted/50" : "",
                        )}
                      >
                        {/* Timeline connector */}
                        {index < dayTransactions.length - 1 && (
                          <div className="absolute left-7 top-[52px] bottom-0 w-0.5 bg-border/40"></div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full",
                                isIncome ? "bg-primary/10" : "bg-muted",
                              )}
                            >
                              <Icon className={cn("h-5 w-5", isIncome ? "text-primary" : "text-muted-foreground")} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{transaction.description}</span>
                                <Badge variant={transaction.category === "Income" ? "default" : "secondary"} size="sm">
                                  {transaction.category}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{time}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={cn("font-medium", isIncome ? "text-primary" : "text-destructive")}>
                              {isIncome ? "+" : "-"}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Category</DropdownMenuItem>
                                <DropdownMenuItem>Add Note</DropdownMenuItem>
                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
