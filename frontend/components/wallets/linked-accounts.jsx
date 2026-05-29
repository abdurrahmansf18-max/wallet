"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PlusCircle, CreditCard, BanknoteIcon as Bank, Link2, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LinkedAccounts({ className, walletId }) {
  const [hoveredAccount, setHoveredAccount] = useState(null)

  // Mock data for demonstration
  const accounts = [
    {
      id: "a1",
      name: "Chase Checking",
      type: "Bank Account",
      number: "****5678",
      institution: "Chase Bank",
      icon: Bank,
      status: "active",
    },
    {
      id: "a2",
      name: "Visa Platinum",
      type: "Credit Card",
      number: "****4321",
      institution: "Bank of America",
      icon: CreditCard,
      status: "active",
    },
    {
      id: "a3",
      name: "Savings Account",
      type: "Bank Account",
      number: "****9876",
      institution: "Wells Fargo",
      icon: Bank,
      status: "pending",
    },
  ]

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-xl">Linked Accounts</CardTitle>
          <CardDescription>External accounts and cards linked to this wallet</CardDescription>
        </div>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-4 w-4" />
          Link Account
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account, index) => {
            const Icon = account.icon

            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                onHoverStart={() => setHoveredAccount(account.id)}
                onHoverEnd={() => setHoveredAccount(null)}
              >
                <div
                  className={cn(
                    "rounded-lg border border-border/40 p-4 transition-all duration-200",
                    hoveredAccount === account.id ? "bg-muted/50" : "",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{account.name}</span>
                          {account.status === "pending" && (
                            <Badge variant="warning" size="sm">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {account.type} • {account.number}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Link</DropdownMenuItem>
                          <DropdownMenuItem>Remove Link</DropdownMenuItem>
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
