"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Info, List } from "lucide-react"
import { useEffect, useState, useMemo } from "react"

export function BudgetCalendar({ className, transactions = [] }) {
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [selectedView, setSelectedView] = useState("calendar") // 'calendar' or 'list'
	const [selectedDay, setSelectedDay] = useState(null)
	const [isMobile, setIsMobile] = useState(false)

	// Check if screen is mobile size (iPhone SE is 375px)
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 640)
		}

		// Initial check
		checkIsMobile()

		// Add event listener
		window.addEventListener("resize", checkIsMobile)

		// Cleanup
		return () => window.removeEventListener("resize", checkIsMobile)
	}, [])

	// Reset to calendar view when switching from mobile to desktop
	useEffect(() => {
		if (!isMobile && selectedView === "list") {
			setSelectedView("calendar")
		}
	}, [isMobile, selectedView])

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value)
	}

	// Get days in month
	const getDaysInMonth = (year, month) => {
		return new Date(year, month + 1, 0).getDate()
	}

	// Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
	const getFirstDayOfMonth = (year, month) => {
		return new Date(year, month, 1).getDay()
	}

	// Calculate daily spending from transactions
	const dailySpending = useMemo(() => {
		const spending = {}
		const month = currentMonth.getMonth()
		const year = currentMonth.getFullYear()

		if (!Array.isArray(transactions)) return {}

		transactions.forEach((t) => {
			// Ensure date is valid
			const date = new Date(t.date)
			if (isNaN(date.getTime())) return

			// Filter by current month view and expense type
			if (
				date.getMonth() === month &&
				date.getFullYear() === year &&
				(t.type === "expense" || t.amount < 0)
			) {
				const day = date.getDate()
				const amount = Math.abs(Number(t.amount))

				if (!spending[day]) {
					spending[day] = {
						amount: 0,
						transactions: 0,
						category: "normal",
					}
				}

				spending[day].amount += amount
				spending[day].transactions += 1
			}
		})

		// Categorize spending levels
		Object.keys(spending).forEach((day) => {
			const item = spending[day]
			if (item.amount > 150) item.category = "high"
			else if (item.amount < 20) item.category = "low"
			// else normal
		})

		return spending
	}, [transactions, currentMonth])

	// Get month name
	const getMonthName = (date) => {
		return date.toLocaleString("default", { month: "long" })
	}

	// Navigate to previous month
	const goToPreviousMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
		setSelectedDay(null)
	}

	// Navigate to next month
	const goToNextMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
		setSelectedDay(null)
	}

	// Get color for spending category
	const getSpendingColor = (category) => {
		switch (category) {
			case "high":
				return "bg-rose-500"
			case "low":
				return "bg-emerald-500"
			default:
				return "bg-blue-500"
		}
	}

	// Get text color for spending category
	const getSpendingTextColor = (category) => {
		switch (category) {
			case "high":
				return "text-rose-600 dark:text-rose-400"
			case "low":
				return "text-emerald-600 dark:text-emerald-400"
			default:
				return "text-blue-600 dark:text-blue-400"
		}
	}

	// Get background color for spending category
	const getSpendingBgColor = (category) => {
		switch (category) {
			case "high":
				return "bg-rose-100 dark:bg-rose-950/40"
			case "low":
				return "bg-emerald-100 dark:bg-emerald-950/40"
			default:
				return "bg-blue-100 dark:bg-blue-950/40"
		}
	}

	// Handle day selection
	const handleDayClick = (day) => {
		setSelectedDay(selectedDay === day ? null : day)
	}

	// Handle swipe for mobile view switching
	const handleSwipe = () => {
		if (isMobile) {
			setSelectedView(selectedView === "calendar" ? "list" : "calendar")
		}
	}

	// Render calendar
	const renderCalendar = () => {
		const year = currentMonth.getFullYear()
		const month = currentMonth.getMonth()
		const daysInMonth = getDaysInMonth(year, month)
		const firstDayOfMonth = getFirstDayOfMonth(year, month)

		// Create array of day cells
		const days = []

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(
				<div
					key={`empty-${i}`}
					className="h-10 sm:h-20 p-1 sm:p-3 border border-border/20 rounded-lg sm:rounded-xl"
				></div>,
			)
		}

		// Add cells for each day of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day)
			const isToday = date.toDateString() === new Date().toDateString()
			const isSelected = selectedDay === day
			const spending = dailySpending[day]

			days.push(
				<div
					key={`day-${day}`}
					className={cn(
						"h-10 sm:h-20 p-1 sm:p-3 border border-border/40 relative rounded-lg sm:rounded-xl transition-colors",
						isToday ? "bg-primary/20" : "",
						isSelected ? "bg-primary/10 border-primary" : "",
						spending ? "cursor-pointer hover:border-primary/50" : "",
					)}
					onClick={() => spending && handleDayClick(day)}
				>
					<div className="flex justify-between items-start">
						<span
							className={cn(
								"inline-block w-5 h-5 sm:w-6 sm:h-6 text-center text-[10px] sm:text-xs leading-5 sm:leading-6",
								isToday ? "bg-primary text-primary-foreground rounded-full" : "",
								isSelected ? "font-bold" : "",
							)}
						>
							{day}
						</span>

						{spending && !isMobile && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Badge variant="outline" className={cn("text-[10px]", getSpendingTextColor(spending.category))}>
											{spending.transactions} tx
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<p>{spending.transactions} transactions on this day</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					{spending && (
						<div className="w-full pt-1 sm:pt-2">
							<div
								className={cn(
									"text-[9px] sm:text-xs font-medium px-0.5 sm:px-1 py-0.5 rounded text-center truncate",
									getSpendingBgColor(spending.category),
									getSpendingTextColor(spending.category),
								)}
							>
								{formatCurrency(spending.amount)}
							</div>
						</div>
					)}
				</div>,
			)
		}

		return days
	}

	// Render list view (mobile alternative)
	const renderListView = () => {
		const year = currentMonth.getFullYear()
		const month = currentMonth.getMonth()
		const daysInMonth = getDaysInMonth(year, month)
		const today = new Date()

		// Only show days up to today if we're in the current month
		const maxDay = year === today.getFullYear() && month === today.getMonth() ? today.getDate() : daysInMonth

		const daysWithSpending = []

		for (let day = 1; day <= maxDay; day++) {
			const spending = dailySpending[day]
			if (spending) {
				const date = new Date(year, month, day)
				const isToday = date.toDateString() === today.toDateString()
				const isSelected = selectedDay === day

				daysWithSpending.push(
					<div
						key={`list-day-${day}`}
						className={cn(
							"flex items-center justify-between p-2 border-b border-border/30 transition-colors",
							isToday ? "bg-primary/10" : "",
							isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "",
						)}
						onClick={() => handleDayClick(day)}
					>
						<div className="flex items-center gap-2">
							<div
								className={cn(
									"w-6 h-6 rounded-full flex items-center justify-center text-xs",
									isToday ? "bg-primary text-primary-foreground" : "bg-muted",
									isSelected ? "border border-primary" : "",
								)}
							>
								{day}
							</div>
							<div className="text-sm">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="text-xs text-muted-foreground">{spending.transactions} tx</div>
							<div
								className={cn(
									"text-xs font-medium px-2 py-1 rounded",
									getSpendingBgColor(spending.category),
									getSpendingTextColor(spending.category),
								)}
							>
								{formatCurrency(spending.amount)}
							</div>
						</div>
					</div>,
				)
			}
		}

		return (
			<div className="border border-border/40 rounded-lg overflow-hidden">
				<div className="flex items-center justify-between bg-muted/50 p-2 border-b border-border/30">
					<div className="text-xs font-medium">Day</div>
					<div className="text-xs font-medium">Amount</div>
				</div>
				<ScrollArea className="h-[250px]">
					{daysWithSpending.length > 0 ? (
						daysWithSpending
					) : (
						<div className="p-4 text-center text-sm text-muted-foreground">No spending data for this month</div>
					)}
				</ScrollArea>
			</div>
		)
	}

	// Render day details
	const renderDayDetails = () => {
		if (!selectedDay || !dailySpending[selectedDay]) return null

		const spending = dailySpending[selectedDay]
		const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay)

		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
				className="mt-3 p-3 border border-border/40 rounded-lg bg-muted/20"
			>
				<div className="flex items-center justify-between mb-2">
					<div className="font-medium text-sm">
						{date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
					</div>
					<Badge variant="outline" className={cn("text-xs", getSpendingTextColor(spending.category))}>
						{spending.category.charAt(0).toUpperCase() + spending.category.slice(1)} Spending
					</Badge>
				</div>

				<div className="flex justify-between items-center mb-2">
					<div className="text-sm text-muted-foreground">Total Spent</div>
					<div className={cn("font-semibold", getSpendingTextColor(spending.category))}>
						{formatCurrency(spending.amount)}
					</div>
				</div>

				<div className="flex justify-between items-center">
					<div className="text-sm text-muted-foreground">Transactions</div>
					<div className="text-sm">{spending.transactions}</div>
				</div>

				<Button variant="outline" size="sm" className="w-full mt-2 text-xs h-8" onClick={() => setSelectedDay(null)}>
					Close
				</Button>
			</motion.div>
		)
	}

	// Add touch swipe detection for mobile
	useEffect(() => {
		if (!isMobile) return

		let touchStartX = 0
		let touchEndX = 0

		const handleTouchStart = (e) => {
			touchStartX = e.changedTouches[0].screenX
		}

		const handleTouchEnd = (e) => {
			touchEndX = e.changedTouches[0].screenX
			handleSwipeGesture()
		}

		const handleSwipeGesture = () => {
			const swipeDistance = touchEndX - touchStartX
			// If swipe distance is significant (more than 50px)
			if (Math.abs(swipeDistance) > 50) {
				if (swipeDistance > 0) {
					// Swipe right
					if (selectedView === "list") setSelectedView("calendar")
				} else {
					// Swipe left
					if (selectedView === "calendar") setSelectedView("list")
				}
			}
		}

		const element = document.getElementById("calendar-container")
		if (element) {
			element.addEventListener("touchstart", handleTouchStart, { passive: true })
			element.addEventListener("touchend", handleTouchEnd, { passive: true })

			return () => {
				element.removeEventListener("touchstart", handleTouchStart)
				element.removeEventListener("touchend", handleTouchEnd)
			}
		}
	}, [isMobile, selectedView])

	return (
		<Card className={cn("border-border/40 overflow-hidden", className)}>
			<CardHeader className="pb-2 sm:pb-3">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<div>
						<CardTitle className="text-base sm:text-lg">Spending Calendar</CardTitle>
						<CardDescription className="text-xs sm:text-sm">View your daily spending patterns.</CardDescription>
					</div>
					<div className="flex items-center justify-between sm:justify-end gap-2">
						{isMobile && (
							<div className="flex border border-border/40 rounded-md overflow-hidden">
								<Button
									variant={selectedView === "calendar" ? "default" : "ghost"}
									size="sm"
									className="h-8 px-2 rounded-none"
									onClick={() => setSelectedView("calendar")}
								>
									<Calendar className="h-4 w-4" />
								</Button>
								<Button
									variant={selectedView === "list" ? "default" : "ghost"}
									size="sm"
									className="h-8 px-2 rounded-none"
									onClick={() => setSelectedView("list")}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						)}
						<div className="flex items-center gap-1 sm:gap-2">
							<Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="text-xs sm:text-sm font-medium min-w-[100px] sm:min-w-[120px] text-center">
								{getMonthName(currentMonth)} {currentMonth.getFullYear()}
							</div>
							<Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-2 sm:p-4">
				<motion.div
					id="calendar-container"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}-${selectedView}`}
				>
					{isMobile && selectedView === "list" ? (
						renderListView()
					) : (
						<>
							<div className="flex justify-between gap-1 mb-1">
								{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
									<div
										key={day + index}
										className="text-[10px] sm:text-xs font-medium text-center py-1 px-0.5"
										aria-label={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}
									>
										{isMobile ? day : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
									</div>
								))}
							</div>
							<div className="grid grid-cols-7 gap-0.5 sm:gap-3" style={{ touchAction: "manipulation" }}>
								{renderCalendar()}
							</div>
						</>
					)}

					{/* Day details section */}
					{selectedDay && dailySpending[selectedDay] && renderDayDetails()}

					{/* Only show legend if no day is selected or on desktop */}
					{(!selectedDay || !isMobile) && (
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground">
							<div className="flex flex-wrap items-center gap-2 sm:gap-4">
								<div className="flex items-center gap-1">
									<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-rose-500"></div>
									<span>High</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
									<span>Normal</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500"></div>
									<span>Low</span>
								</div>
							</div>
							<div className="flex items-center gap-1 mt-2 sm:mt-0">
								<Info className="h-3 w-3" />
								<span className="hidden sm:inline">Click on a day to view details</span>
								<span className="sm:hidden">Tap for details</span>
							</div>
						</div>
					)}

					{/* Swipe indicator for mobile */}
					{isMobile && !selectedDay && (
						<div className="flex justify-center mt-3 items-center gap-1 text-[10px] text-muted-foreground">
							<div className="w-8 h-1 rounded-full bg-muted-foreground/30"></div>
							<span>Swipe to {selectedView === "calendar" ? "list" : "calendar"} view</span>
						</div>
					)}
				</motion.div>
			</CardContent>
		</Card>
	)
}
