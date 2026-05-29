"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeExpenseReport } from "./income-expense-report"
import { CategoryBreakdown } from "./category-breakdown"
import { SavingsReport } from "./savings-report"
import { TrendsReport } from "./trends-report"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function ReportsClient() {
  return (
    <Tabs defaultValue="income-expense" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-10 mb-6 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 p-1">
        <TabsTrigger value="income-expense" className="rounded-lg text-sm">
          Income & Expenses
        </TabsTrigger>
        <TabsTrigger value="categories" className="rounded-lg text-sm">
          Categories
        </TabsTrigger>
        <TabsTrigger value="savings" className="rounded-lg text-sm">
          Savings
        </TabsTrigger>
        <TabsTrigger value="trends" className="rounded-lg text-sm">
          Trends
        </TabsTrigger>
      </TabsList>

      <TabsContent value="income-expense" className="mt-0">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <IncomeExpenseReport />
          </motion.div>
        </motion.div>
      </TabsContent>

      <TabsContent value="categories" className="mt-0">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <CategoryBreakdown />
          </motion.div>
        </motion.div>
      </TabsContent>

      <TabsContent value="savings" className="mt-0">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <SavingsReport />
          </motion.div>
        </motion.div>
      </TabsContent>

      <TabsContent value="trends" className="mt-0">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <TrendsReport />
          </motion.div>
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}

export default ReportsClient
