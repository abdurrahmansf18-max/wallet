"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, ArrowDownLeft, ArrowUpRight, MoreHorizontal, PlusCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function RecurringTransactions({ className, walletId, data = [] }) {
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

  // Use injected data natively
  const transactions = data && data.length > 0 ? data : []

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-xl">Recurring Transactions</CardTitle>
          <CardDescription>Regular income and expenses for this wallet</CardDescription>
        </div>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Recurring
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction, index) => {
            const isIncome = transaction.amount > 0
            const nextDate = new Date(transaction.nextDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                onHoverStart={() => setHoveredTransaction(transaction.id)}
                onHoverEnd={() => setHoveredTransaction(null)}
              >
                <div
                  className={cn(
                    "rounded-lg border border-border/40 p-4 transition-all duration-200",
                    hoveredTransaction === transaction.id ? "bg-muted/50" : "",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          isIncome ? "bg-primary/10" : "bg-destructive/10",
                        )}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.name}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" size="sm">
                            {transaction.frequency}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Next: {nextDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={cn("font-medium", isIncome ? "text-primary" : "text-destructive")}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Skip Next</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
