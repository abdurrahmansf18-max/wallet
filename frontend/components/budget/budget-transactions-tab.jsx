"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, Filter, ArrowDownLeft, ShoppingBag, Utensils, Home, Car, Film, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function BudgetTransactionsTab({ transactions }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredTransaction, setHoveredTransaction] = useState(null)

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Category icons mapping
  const categoryIcons = {
    Groceries: ShoppingBag,
    "Dining Out": Utensils,
    Housing: Home,
    Transportation: Car,
    Entertainment: Film,
  }

  // Category colors mapping
  const categoryColors = {
    Groceries: {
      bg: "bg-blue-100 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
    },
    "Dining Out": {
      bg: "bg-amber-100 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
    },
    Housing: {
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    Transportation: {
      bg: "bg-violet-100 dark:bg-violet-950/40",
      text: "text-violet-600 dark:text-violet-400",
    },
    Entertainment: {
      bg: "bg-rose-100 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
    },
  }

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Recent Budget Transactions</CardTitle>
            <CardDescription>Your latest spending across budget categories.</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => {
              const Icon = categoryIcons[transaction.category] || ArrowDownLeft
              const categoryColor = categoryColors[transaction.category] || {
                bg: "bg-muted",
                text: "text-muted-foreground",
              }

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onHoverStart={() => setHoveredTransaction(transaction.id)}
                  onHoverEnd={() => setHoveredTransaction(null)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 relative",
                      hoveredTransaction === transaction.id ? "bg-muted/30 rounded-lg p-2 -mx-2" : "p-2 -mx-2",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", categoryColor.bg)}>
                        <Icon className={cn("h-5 w-5", categoryColor.text)} />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <div className="font-medium text-destructive">-{formatCurrency(transaction.amount)}</div>

                      {hoveredTransaction === transaction.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                              <DropdownMenuItem>Change Category</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">No transactions found matching your search.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
