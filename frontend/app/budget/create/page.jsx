"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { budgetApi, walletApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { startOfMonth, endOfMonth, format } from "date-fns"

export default function CreateBudgetPage() {
	const router = useRouter()
	const { toast } = useToast()
	const [activeTab, setActiveTab] = useState("details")
	const [isMobile, setIsMobile] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// Form State
	const [budgetDetails, setBudgetDetails] = useState({
		name: "",
		period: "monthly",
		month: format(new Date(), "MMMM").toLowerCase(), // 'april' etc
		year: new Date().getFullYear().toString(),
		totalAmount: 0,
		primaryWallet: "",
		notes: "",
	})

	const [categories, setCategories] = useState([
		{ id: "1", name: "", amount: 0 },
	])

	const [wallets, setWallets] = useState([])

	// Check screen size
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 640)
		}
		checkIsMobile()
		window.addEventListener("resize", checkIsMobile)
		return () => window.removeEventListener("resize", checkIsMobile)
	}, [])

	// Fetch Wallets
	useEffect(() => {
		const loadWallets = async () => {
			try {
				const data = await walletApi.getAll()
				setWallets(data)
				if (data.length > 0) {
					setBudgetDetails(prev => ({ ...prev, primaryWallet: data[0].id }))
				}
			} catch (error) {
				console.error("Failed to load wallets:", error)
				toast({
					title: "Error",
					description: "Failed to load wallets. Please try again.",
					variant: "destructive",
				})
			}
		}
		loadWallets()
	}, [toast])

	// Calculations
	const totalAllocated = categories.reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0)
	const remainingAmount = (parseFloat(budgetDetails.totalAmount) || 0) - totalAllocated

	// Handlers
	const handleTabChange = (value) => setActiveTab(value)

	const handleContinue = () => {
		if (activeTab === "details") {
			if (!budgetDetails.name || !budgetDetails.totalAmount) {
				toast({
					title: "Missing Information",
					description: "Please fill in the Budget Name and Total Amount.",
					variant: "destructive",
				})
				return
			}
			setActiveTab("categories")
		} else if (activeTab === "categories") {
			if (categories.some(c => !c.name || c.amount <= 0)) {
				toast({
					title: "Invalid Categories",
					description: "Please ensure all categories have a name and an amount greater than 0.",
					variant: "destructive",
				})
				return
			}
			setActiveTab("review")
		}
	}

	const handleBack = () => {
		if (activeTab === "categories") setActiveTab("details")
		else if (activeTab === "review") setActiveTab("categories")
	}

	const addCategory = () => {
		setCategories([...categories, { id: crypto.randomUUID(), name: "", amount: 0 }])
	}

	const updateCategory = (id, field, value) => {
		setCategories(categories.map(cat => 
			cat.id === id ? { ...cat, [field]: value } : cat
		))
	}

	const removeCategory = (id) => {
		if (categories.length > 1) {
			setCategories(categories.filter(cat => cat.id !== id))
		}
	}

	const handleSaveBudget = async () => {
		setIsLoading(true)
		try {
			const monthIndex = new Date(`${budgetDetails.month} 1, 2000`).getMonth()
			const year = parseInt(budgetDetails.year)
			const startDate = new Date(year, monthIndex, 1)
			const endDate = endOfMonth(startDate)

			const promises = categories.map(cat => ({
				category: cat.name,
				amount: parseFloat(cat.amount),
				period: budgetDetails.period,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
			})).map(data => budgetApi.create(data))

			await Promise.all(promises)

			toast({
				title: "Budget Created",
				description: "Your budget has been successfully saved.",
			})
			router.push("/budget")
		} catch (error) {
			console.error("Failed to save budget:", error)
			toast({
				title: "Error",
				description: "Failed to save budget. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Layout>
			<div className="px-2 sm:px-0">
				<div className="mx-auto max-w-3xl">
					<div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
						<Button variant="outline" size="icon" asChild className="h-8 w-8 sm:h-10 sm:w-10">
							<Link href="/budget">
								<ChevronLeft className="h-4 w-4" />
								<span className="sr-only">Back</span>
							</Link>
						</Button>
						<h1 className="text-lg sm:text-xl font-semibold">Create New Budget</h1>
					</div>

					<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
						<ScrollArea className="w-full pb-2" orientation="horizontal">
							<TabsList className="inline-flex w-full min-w-max">
								<TabsTrigger value="details" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
									Budget Details
								</TabsTrigger>
								<TabsTrigger value="categories" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
									Categories
								</TabsTrigger>
								<TabsTrigger value="review" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
									{isMobile ? "Review" : "Review & Save"}
								</TabsTrigger>
							</TabsList>
						</ScrollArea>

						<TabsContent value="details" className="mt-4 sm:mt-6">
							<Card>
								<CardHeader className="pb-4 sm:pb-6">
									<CardTitle className="text-base sm:text-lg">Budget Information</CardTitle>
									<CardDescription className="text-xs sm:text-sm">
										Set up the basic details for your new budget.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="budget-name" className="text-xs sm:text-sm">
											Budget Name
										</Label>
										<Input 
											id="budget-name" 
											placeholder="e.g. April 2023 Budget" 
											className="h-9 sm:h-10 text-sm"
											value={budgetDetails.name}
											onChange={(e) => setBudgetDetails({...budgetDetails, name: e.target.value})}
										/>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="budget-period" className="text-xs sm:text-sm">
												Budget Period
											</Label>
											<Select 
												value={budgetDetails.period} 
												onValueChange={(val) => setBudgetDetails({...budgetDetails, period: val})}
											>
												<SelectTrigger id="budget-period" className="h-9 sm:h-10 text-xs sm:text-sm">
													<SelectValue placeholder="Select period" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="weekly">Weekly</SelectItem>
													<SelectItem value="monthly">Monthly</SelectItem>
													<SelectItem value="yearly">Yearly</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="budget-month" className="text-xs sm:text-sm">
												Month
											</Label>
											<Select 
												value={budgetDetails.month}
												onValueChange={(val) => setBudgetDetails({...budgetDetails, month: val})}
											>
												<SelectTrigger id="budget-month" className="h-9 sm:h-10 text-xs sm:text-sm">
													<SelectValue placeholder="Select month" />
												</SelectTrigger>
												<SelectContent>
													{["january", "february", "march", "april", "may", "june", 
													  "july", "august", "september", "october", "november", "december"]
													  .map(m => (
														  <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
													  ))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="total-amount" className="text-xs sm:text-sm">
											Total Budget Amount
										</Label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
											<Input
												id="total-amount"
												type="number"
												min="0"
												step="0.01"
												placeholder="0.00"
												className="pl-8 h-9 sm:h-10 text-sm"
												value={budgetDetails.totalAmount}
												onChange={(e) => setBudgetDetails({...budgetDetails, totalAmount: e.target.value})}
											/>
										</div>
										<p className="text-[10px] sm:text-xs text-muted-foreground">
											This is the total amount you plan to budget for this period.
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="primary-wallet" className="text-xs sm:text-sm">
											Primary Wallet
										</Label>
										<Select 
											value={budgetDetails.primaryWallet}
											onValueChange={(val) => setBudgetDetails({...budgetDetails, primaryWallet: val})}
										>
											<SelectTrigger id="primary-wallet" className="h-9 sm:h-10 text-xs sm:text-sm">
												<SelectValue placeholder="Select wallet" />
											</SelectTrigger>
											<SelectContent>
												{wallets.map((wallet) => (
													<SelectItem key={wallet.id} value={wallet.id}>
														{wallet.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<p className="text-[10px] sm:text-xs text-muted-foreground">
											The wallet from which this budget will be funded.
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="budget-notes" className="text-xs sm:text-sm">
											Notes (Optional)
										</Label>
										<Input
											id="budget-notes"
											placeholder="Add any notes about this budget"
											className="h-9 sm:h-10 text-sm"
											value={budgetDetails.notes}
											onChange={(e) => setBudgetDetails({...budgetDetails, notes: e.target.value})}
										/>
									</div>
								</CardContent>
								<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-4 sm:pt-6">
									<Button variant="outline" asChild className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">
										<Link href="/budget">Cancel</Link>
									</Button>
									<Button className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm" onClick={handleContinue}>
										Continue to Categories
									</Button>
								</CardFooter>
							</Card>
						</TabsContent>

						<TabsContent value="categories" className="mt-4 sm:mt-6">
							<Card>
								<CardHeader className="pb-4 sm:pb-6">
									<CardTitle className="text-base sm:text-lg">Budget Categories</CardTitle>
									<CardDescription className="text-xs sm:text-sm">
										Allocate your budget across different spending categories.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 sm:space-y-6">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
										<div>
											<h3 className="text-base sm:text-lg font-medium">Total Budget: ${parseInt(budgetDetails.totalAmount || 0).toLocaleString()}</h3>
											<p className="text-xs sm:text-sm text-muted-foreground">
												Allocated: ${totalAllocated.toLocaleString()} | Remaining: ${remainingAmount.toLocaleString()}
											</p>
										</div>
										<Button variant="outline" size="sm" onClick={addCategory} className="h-9 sm:h-10 text-xs sm:text-sm">
											<Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
											Add Category
										</Button>
									</div>

									<Separator />

									<div className="space-y-3 sm:space-y-4">
										{categories.map((category, index) => (
											<div key={category.id} className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
												<div className="col-span-5 sm:col-span-5">
													<Label htmlFor={`category-${index}`} className="sr-only">
														Category Name
													</Label>
													<Input
														id={`category-${index}`}
														value={category.name}
														placeholder="Category Name"
														onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
														className="h-9 sm:h-10 text-xs sm:text-sm"
													/>
												</div>
												<div className="col-span-5 sm:col-span-5">
													<Label htmlFor={`amount-${index}`} className="sr-only">
														Amount
													</Label>
													<div className="relative">
														<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
															$
														</span>
														<Input
															id={`amount-${index}`}
															type="number"
															min="0"
															step="0.01"
															className="pl-8 h-9 sm:h-10 text-xs sm:text-sm"
															value={category.amount}
															onChange={(e) => updateCategory(category.id, 'amount', e.target.value)}
														/>
													</div>
												</div>
												<div className="col-span-2 flex justify-end">
													<Button
														variant="ghost"
														size="icon"
														className="text-muted-foreground hover:text-destructive h-8 w-8"
														onClick={() => removeCategory(category.id)}
														disabled={categories.length <= 1}
													>
														<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
														<span className="sr-only">Delete category</span>
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-4 sm:pt-6">
									<Button
										variant="outline"
										className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
										onClick={handleBack}
									>
										Back to Details
									</Button>
									<Button className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm" onClick={handleContinue}>
										Continue to Review
									</Button>
								</CardFooter>
							</Card>
						</TabsContent>

						<TabsContent value="review" className="mt-4 sm:mt-6">
							<Card>
								<CardHeader className="pb-4 sm:pb-6">
									<CardTitle className="text-base sm:text-lg">Review Your Budget</CardTitle>
									<CardDescription className="text-xs sm:text-sm">
										Confirm the details before saving your budget.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 sm:space-y-6">
									<div className="rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
											<div>
												<h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Budget Name</h4>
												<p className="text-sm">{budgetDetails.name}</p>
											</div>
											<div>
												<h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Period</h4>
												<p className="text-sm">{budgetDetails.period} ({budgetDetails.month})</p>
											</div>
											<div>
												<h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Amount</h4>
												<p className="text-sm">${parseFloat(budgetDetails.totalAmount || 0).toLocaleString()}</p>
											</div>
											<div>
												<h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Primary Wallet</h4>
												<p className="text-sm">{wallets.find(w => w.id === budgetDetails.primaryWallet)?.name || 'None'}</p>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-base sm:text-lg font-medium mb-2">Category Allocation</h3>
										<div className="rounded-lg border overflow-hidden">
											<div className="grid grid-cols-12 gap-2 sm:gap-4 p-2 sm:p-3 font-medium text-xs sm:text-sm bg-muted/50">
												<div className="col-span-6">Category</div>
												<div className="col-span-3 text-right">Amount</div>
												<div className="col-span-3 text-right">% of Total</div>
											</div>

											<ScrollArea className="max-h-[380px] sm:max-h-none">
												{categories.map((category) => (
													<div key={category.id} className="grid grid-cols-12 gap-2 sm:gap-4 p-2 sm:p-3 border-t">
														<div className="col-span-6 text-xs sm:text-sm truncate">{category.name}</div>
														<div className="col-span-3 text-right text-xs sm:text-sm">
															${parseFloat(category.amount).toLocaleString()}
														</div>
														<div className="col-span-3 text-right text-xs sm:text-sm">
															{((parseFloat(category.amount) / parseFloat(budgetDetails.totalAmount || 1)) * 100).toFixed(1)}%
														</div>
													</div>
												))}
											</ScrollArea>

											<div className="grid grid-cols-12 gap-2 sm:gap-4 p-2 sm:p-3 border-t bg-muted/30 font-medium">
												<div className="col-span-6 text-xs sm:text-sm">Unallocated</div>
												<div className="col-span-3 text-right text-xs sm:text-sm">${remainingAmount.toLocaleString()}</div>
												<div className="col-span-3 text-right text-xs sm:text-sm">
													{((remainingAmount / parseFloat(budgetDetails.totalAmount || 1)) * 100).toFixed(1)}%
												</div>
											</div>
										</div>
									</div>
								</CardContent>
								<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-4 sm:pt-6">
									<Button
										variant="outline"
										className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
										onClick={handleBack}
										disabled={isLoading}
									>
										Back to Categories
									</Button>
									<Button 
										className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm" 
										onClick={handleSaveBudget}
										disabled={isLoading}
									>
										{isLoading ? "Saving..." : "Save Budget"}
									</Button>
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</Layout>
	)
}
