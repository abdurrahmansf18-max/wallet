"use client"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, Download, Filter, Share2 } from "lucide-react"
import { useState } from "react"

export function ReportsHeader() {
	const [date, setDate] = useState(new Date())

	return (
		<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8 space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Reports & Analytics</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Analyze your financial data and track your progress over time.
					</p>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<Button variant="outline" size="sm" className="h-9 gap-1.5">
						<Share2 className="h-4 w-4" />
						<span className="hidden sm:inline">Share</span>
					</Button>
					<Button variant="outline" size="sm" className="h-9 gap-1.5">
						<Download className="h-4 w-4" />
						<span className="hidden sm:inline">Export</span>
					</Button>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<Select defaultValue="all">
						<SelectTrigger className="w-full sm:w-[180px] h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
							<SelectValue placeholder="Select wallet" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Wallets</SelectItem>
							<SelectItem value="w1">Main Savings</SelectItem>
							<SelectItem value="w2">Emergency Fund</SelectItem>
							<SelectItem value="w3">Travel Budget</SelectItem>
						</SelectContent>
					</Select>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full sm:w-auto h-9 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
							>
								<Calendar className="h-4 w-4" />
								<span>{format(date, "MMM yyyy")}</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
						</PopoverContent>
					</Popover>
				</div>

				<div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto">
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
					>
						<Filter className="h-4 w-4" />
						<span>Filters</span>
					</Button>

					<Select defaultValue="month">
						<SelectTrigger className="w-full sm:w-[180px] h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
							<SelectValue placeholder="Select period" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">This Week</SelectItem>
							<SelectItem value="month">This Month</SelectItem>
							<SelectItem value="quarter">This Quarter</SelectItem>
							<SelectItem value="year">This Year</SelectItem>
							<SelectItem value="custom">Custom Range</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</motion.div>
	)
}

export default ReportsHeader
