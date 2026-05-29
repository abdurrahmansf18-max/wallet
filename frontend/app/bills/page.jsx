"use client"

import { BillChart } from "@/components/bills/bill-chart"
import { BillDialog } from "@/components/bills/bill-dialog"
import { PaidBillsTab } from "@/components/bills/paid-bills-tab"
import { RecurringBillsTab } from "@/components/bills/recurring-bills-tab"
import { UpcomingBillsTab } from "@/components/bills/upcoming-bills-tab"
import { Layout } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
	AlertCircle,
	ArrowDownRight,
	ArrowUpRight,
	Clock,
	CreditCard,
	Download,
	Filter,
	Menu,
	Plus,
	Search,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { billApi } from "@/lib/api"

export default function BillsPage() {
	const [isMobile, setIsMobile] = useState(false)
	const [billsData, setBillsData] = useState([])
        const [billHistory, setBillHistory] = useState([])
        const [isLoading, setIsLoading] = useState(true)

        // Fetch bills from backend
        const fetchBills = async () => {
                try {
                        setIsLoading(true)
                        const [data, historyData] = await Promise.all([
                                billApi.getAll(),
                                billApi.getHistory()
                        ]);
                        setBillsData(data || [])
                        setBillHistory(historyData || [])
                } catch (err) {
                        console.error("Failed to fetch", err)
                } finally {
                        setIsLoading(false)
                }
        }

        // Check if screen is mobile size (iPhone SE is 375px)
        useEffect(() => {
                const checkIsMobile = () => {
                        setIsMobile(window.innerWidth <= 640)
                }
		// Add event listener
		window.addEventListener("resize", checkIsMobile)

		// Fetch initial data
		fetchBills()

		// Cleanup
		return () => window.removeEventListener("resize", checkIsMobile)
	}, [])

	// Derived states from backend data
	const upcomingBills = billsData.filter((bill) => !bill.is_paid && bill.due_date);
	const paidBills = billsData.filter((bill) => bill.is_paid);
	const recurringBills = billsData.filter((bill) => bill.frequency !== 'once');

	// Mapping due_date for frontend components compatibility
	upcomingBills.forEach(b => {
		if (b.due_date && !b.dueDate) b.dueDate = b.due_date;
	});
	paidBills.forEach(b => {
		if (b.due_date && !b.paidDate) b.paidDate = b.due_date; // Assuming paidDate is similar to record
	});
	recurringBills.forEach(b => {
		if (b.due_date && !b.nextDate) b.nextDate = b.due_date;
	});

        // Use real historical transaction aggregations
        const chartData = billHistory.length > 0 ? billHistory : [];
	// Format date to local string
	const formatDate = (dateString) => {
		if (!dateString) return ""
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		})
	}

	// Calculate days until due
	const getDaysUntilDue = (dueDate) => {
		const today = new Date()
		const due = new Date(dueDate)
		const diffTime = due - today
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays
	}

	// Get status badge color
	const getStatusColor = (days) => {
		if (days < 0) return "destructive"
		if (days <= 3) return "warning"
		return "secondary"
	}

	// Calculate total amounts
	const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + Number(bill.amount), 0)
	const totalPaid = paidBills.reduce((sum, bill) => sum + Number(bill.amount), 0)
	const totalRecurring = recurringBills.reduce((sum, bill) => sum + Number(bill.amount), 0)

	// Add state management for the dialog
	const [addBillOpen, setAddBillOpen] = useState(false)
	const [addBillSuccess, setAddBillSuccess] = useState(false)
	const [activeTab, setActiveTab] = useState("upcoming")

	// Add a function to handle form submission
	const handleAddBill = async (e, billData) => {
		if (e) e.preventDefault()
		try {
			await billApi.create(billData)
			setAddBillSuccess(true)
			fetchBills() // Refresh the list
			setTimeout(() => {
				setAddBillSuccess(false)
				setAddBillOpen(false)
			}, 2000)
		} catch (error) {
			console.error("Error creating bill", error);
		}
	}

	return (
		<Layout>
			<div className="px-2 sm:px-0">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6"
				>
					<div>
						<h1 className="text-xl sm:text-3xl font-semibold">Bills Management</h1>
						<p className="text-sm text-muted-foreground mt-1">Track, manage, and pay your bills in one place</p>
					</div>

					{isMobile ? (
						<div className="flex items-center gap-2">
							<Button asChild className="flex-1">
								<Link href="/bills/pay">
									<CreditCard className="mr-2 h-4 w-4" />
									Pay Bill
								</Link>
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="icon">
										<Menu className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => setAddBillOpen(true)}>
										<Plus className="mr-2 h-4 w-4" />
										Add Bill
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button asChild>
								<Link href="/bills/pay">
									<CreditCard className="mr-2 h-4 w-4" />
									Pay a Bill
								</Link>
							</Button>
							<Button variant="outline" onClick={() => setAddBillOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add Bill
							</Button>
						</div>
					)}

					<BillDialog
						open={addBillOpen}
						onOpenChange={setAddBillOpen}
						onSubmit={handleAddBill}
						success={addBillSuccess}
					/>
				</motion.div>

				{/* Summary Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3 mb-4 sm:mb-6"
				>
					<Card className="border-border/40">
						<CardContent className="p-3 sm:p-5">
							<div className="flex items-center justify-between mb-2 sm:mb-3">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-destructive/10">
										<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
									</div>
									<h3 className="text-xs sm:text-sm font-medium">Upcoming Bills</h3>
								</div>
								<div className="flex items-center text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-destructive/10 text-destructive">
									<ArrowUpRight className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
									{upcomingBills.length} bills
								</div>
							</div>
							<div className="space-y-0.5 sm:space-y-1">
								<div className="text-xl sm:text-3xl font-semibold">${totalUpcoming.toFixed(2)}</div>
								<p className="text-[10px] sm:text-xs text-muted-foreground">Due in the next 30 days</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="w-full mt-2 sm:mt-3 justify-between text-xs h-8"
								onClick={() => setActiveTab("upcoming")}
							>
								View Upcoming Bills
								<ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
							</Button>
						</CardContent>
					</Card>

					<Card className="border-border/40">
						<CardContent className="p-3 sm:p-5">
							<div className="flex items-center justify-between mb-2 sm:mb-3">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10">
										<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									</div>
									<h3 className="text-xs sm:text-sm font-medium">Recurring Bills</h3>
								</div>
								<div className="flex items-center text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary">
									<ArrowUpRight className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
									{recurringBills.length} bills
								</div>
							</div>
							<div className="space-y-0.5 sm:space-y-1">
								<div className="text-xl sm:text-3xl font-semibold">${totalRecurring.toFixed(2)}</div>
								<p className="text-[10px] sm:text-xs text-muted-foreground">Monthly recurring expenses</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="w-full mt-2 sm:mt-3 justify-between text-xs h-8"
								onClick={() => setActiveTab("recurring")}
							>
								View Recurring Bills
								<ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
							</Button>
						</CardContent>
					</Card>

					<Card className="border-border/40">
						<CardContent className="p-3 sm:p-5">
							<div className="flex items-center justify-between mb-2 sm:mb-3">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
										<ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
									</div>
									<h3 className="text-xs sm:text-sm font-medium">Paid Bills</h3>
								</div>
								<div className="flex items-center text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
									<ArrowDownRight className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
									{paidBills.length} bills
								</div>
							</div>
							<div className="space-y-0.5 sm:space-y-1">
								<div className="text-xl sm:text-3xl font-semibold">${totalPaid.toFixed(2)}</div>
								<p className="text-[10px] sm:text-xs text-muted-foreground">Paid in the last 30 days</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="w-full mt-2 sm:mt-3 justify-between text-xs h-8"
								onClick={() => setActiveTab("paid")}
							>
								View Paid Bills
								<ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
							</Button>
						</CardContent>
					</Card>
				</motion.div>

				{/* Chart and Search Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 mb-4 sm:mb-6"
				>
					<Card className="border-border/40 lg:col-span-2">
						<CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-base sm:text-lg">Monthly Spending</CardTitle>
									<CardDescription className="text-xs">Bill payments by category</CardDescription>
								</div>
								<Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
									<Download className="h-3 w-3 sm:h-4 sm:w-4" />
									<span className="hidden sm:inline">Export</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
							<div className="h-[200px] sm:h-[300px] w-full">
								<BillChart data={chartData} />
							</div>
						</CardContent>
					</Card>

					<Card className="border-border/40">
						<CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
							<CardTitle className="text-base sm:text-lg">Quick Filters</CardTitle>
							<CardDescription className="text-xs">Search and filter your bills</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
								<Input placeholder="Search bills..." className="pl-8 h-8 sm:h-10 text-xs sm:text-sm" />
							</div>

							<div className="space-y-1 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium">Category</label>
								<Select>
									<SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
										<SelectValue placeholder="All Categories" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										<SelectItem value="utilities">Utilities</SelectItem>
										<SelectItem value="housing">Housing</SelectItem>
										<SelectItem value="communication">Communication</SelectItem>
										<SelectItem value="entertainment">Entertainment</SelectItem>
										<SelectItem value="insurance">Insurance</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium">Date Range</label>
								<Select>
									<SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
										<SelectValue placeholder="Last 30 days" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="30">Last 30 days</SelectItem>
										<SelectItem value="60">Last 60 days</SelectItem>
										<SelectItem value="90">Last 90 days</SelectItem>
										<SelectItem value="custom">Custom range</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium">Status</label>
								<Select>
									<SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm">
										<SelectValue placeholder="All Statuses" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Statuses</SelectItem>
										<SelectItem value="paid">Paid</SelectItem>
										<SelectItem value="upcoming">Upcoming</SelectItem>
										<SelectItem value="overdue">Overdue</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button className="w-full mt-2 h-8 sm:h-10 text-xs sm:text-sm">
								<Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
								Apply Filters
							</Button>
						</CardContent>
					</Card>
				</motion.div>

				{/* Tabs Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.3 }}
				>
					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<ScrollArea className="w-full pb-2" orientation="horizontal">
							<TabsList className="inline-flex w-full min-w-max mb-4 sm:mb-6">
								<TabsTrigger value="upcoming" className="text-xs sm:text-sm">
									Upcoming
									<Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs">
										{upcomingBills.length}
									</Badge>
								</TabsTrigger>
								<TabsTrigger value="paid" className="text-xs sm:text-sm">
									Paid
									<Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs">
										{paidBills.length}
									</Badge>
								</TabsTrigger>
								<TabsTrigger value="recurring" className="text-xs sm:text-sm">
									Recurring
									<Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs">
										{recurringBills.length}
									</Badge>
								</TabsTrigger>
							</TabsList>
						</ScrollArea>

						<TabsContent value="upcoming">
							<UpcomingBillsTab
								bills={upcomingBills}
								formatDate={formatDate}
								getDaysUntilDue={getDaysUntilDue}
								getStatusColor={getStatusColor}
								isMobile={isMobile}
							/>
						</TabsContent>

						<TabsContent value="paid">
							<PaidBillsTab bills={paidBills} formatDate={formatDate} isMobile={isMobile} />
						</TabsContent>

						<TabsContent value="recurring">
							<RecurringBillsTab bills={recurringBills} formatDate={formatDate} isMobile={isMobile} />
						</TabsContent>
					</Tabs>
				</motion.div>
			</div>
		</Layout>
	)
}
