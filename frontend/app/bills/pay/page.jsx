"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from 'lucide-react'
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"
import { billApi, walletApi, transactionApi } from "@/lib/api"
import { useRouter } from "next/navigation"

// Fix the dynamic import to correctly handle the default export
const BillChart = dynamic(() =>
	import("@/components/bills/bill-chart").then(mod => mod.BillChart),
	{ ssr: false }
)

export default function PayBillsPage() {
	const [isMobile, setIsMobile] = useState(false)
	const [unpaidBills, setUnpaidBills] = useState([])
	const [wallets, setWallets] = useState([])
	const [billHistoryData, setBillHistoryData] = useState([])
	const [selectedBillId, setSelectedBillId] = useState("")
	const [selectedWalletId, setSelectedWalletId] = useState("")
	const [amount, setAmount] = useState("")
	const [paymentDate, setPaymentDate] = useState("")
	const [notes, setNotes] = useState("")
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	// Check if screen is mobile size
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 640)
		}
		checkIsMobile()
		window.addEventListener("resize", checkIsMobile)

		// Fetch real data
		const fetchData = async () => {
			try {
				const [fetchedBills, fetchedWallets, fetchedHistory] = await Promise.all([
					billApi.getAll(),
					walletApi.getAll(),
					billApi.getHistory()
				])
				
				// Only show unpaid bills
				setUnpaidBills((fetchedBills || []).filter(b => !b.is_paid))
				setWallets(fetchedWallets || [])
				setBillHistoryData(fetchedHistory || [])
			} catch (error) {
				console.error("Failed to fetch data", error)
			}
		}
		fetchData()

		return () => window.removeEventListener("resize", checkIsMobile)
	}, [])

	// When bill is selected, auto-fill amount
	useEffect(() => {
		if (selectedBillId && selectedBillId !== "new") {
			const bill = unpaidBills.find(b => b.id === selectedBillId)
			if (bill) setAmount(bill.amount.toString())
		}
	}, [selectedBillId, unpaidBills])

	const handlePayBill = async () => {
		if (!selectedBillId || selectedBillId === "new" || !selectedWalletId || !amount) return;
		
		try {
			setLoading(true)
			// 1. Create a transaction for paying the bill
			const bill = unpaidBills.find(b => b.id === selectedBillId)
			await transactionApi.create({
				amount: parseFloat(amount),
				description: notes || `Paid bill: ${bill.name}`,
				type: "expense",
				category: bill.category || "Utilities",
				payee: bill.payee || bill.name,
				wallet_id: selectedWalletId,
				date: paymentDate ? new Date(paymentDate).toISOString() : new Date().toISOString()
			})

			// 2. Mark bill as paid
			await billApi.update(selectedBillId, { is_paid: true })
			
			router.push("/bills")
		} catch (error) {
			console.error("Failed to pay bill:", error)
		} finally {
			setLoading(false)
		}
	}

	// Format date for display
	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: isMobile ? "2-digit" : "numeric",
		})
	}

	// Use real historical transaction aggregations
	const validHistory = billHistoryData.length > 0 ? billHistoryData : [];

	// Calculate average monthly bill payments
	const averageMonthlyPayment = validHistory.length > 0 ? (
		validHistory.reduce((sum, item) => sum + (item.Utilities || 0) + (item.Housing || 0) + (item.Communication || 0), 0) /
		validHistory.length
	).toFixed(2) : "0.00"

	return (
		<Layout>
			<div className="px-2 sm:px-0">
				<div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-4">
					<Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
						<Link href="/bills">
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Back</span>
						</Link>
					</Button>
					<h1 className="text-lg sm:text-2xl font-semibold">Pay Bills</h1>
				</div>

				<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
					<Card className="border-border/40">
						<CardHeader className="pb-3 sm:pb-6 p-4 sm:p-6">
							<CardTitle className="text-base sm:text-lg">Pay a Bill</CardTitle>
							<CardDescription className="text-xs sm:text-sm">
								Select a bill to pay or add a new payee.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
							<div className="space-y-1.5 sm:space-y-2">
								<Label htmlFor="bill" className="text-xs sm:text-sm">
									Select Bill
								</Label>
								<Select value={selectedBillId} onValueChange={setSelectedBillId}>
									<SelectTrigger id="bill" className="h-8 sm:h-10 text-xs sm:text-sm">
										<SelectValue placeholder="Select a bill to pay" />
									</SelectTrigger>
									<SelectContent>
										{unpaidBills.map((bill) => (
											<SelectItem key={bill.id} value={bill.id} className="text-xs sm:text-sm">
												{isMobile ? (
													<>
														{bill.name} - ${bill.amount}
													</>
												) : (
													<>
														{bill.name} - ${bill.amount} (Due: {formatDate(bill.due_date || bill.dueDate)})
													</>
												)}
											</SelectItem>
										))}
										<SelectItem value="new" className="text-xs sm:text-sm">
											+ Add New Payee
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5 sm:space-y-2">
								<Label htmlFor="from-wallet" className="text-xs sm:text-sm">
									From Wallet
								</Label>
								<Select value={selectedWalletId} onValueChange={setSelectedWalletId}>
									<SelectTrigger id="from-wallet" className="h-8 sm:h-10 text-xs sm:text-sm">
										<SelectValue placeholder="Select wallet" />
									</SelectTrigger>
									<SelectContent>
										{wallets.map(w => (
											<SelectItem key={w.id} value={w.id} className="text-xs sm:text-sm">
												{w.name} (${w.balance})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5 sm:space-y-2">
								<Label htmlFor="amount" className="text-xs sm:text-sm">
									Amount
								</Label>
								<div className="relative">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
									<Input
										id="amount"
										type="number"
										min="0"
										step="0.01"
										placeholder="0.00"
										className="pl-8 h-8 sm:h-10 text-xs sm:text-sm"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
									/>
								</div>
							</div>

							<div className="space-y-1.5 sm:space-y-2">
								<Label htmlFor="payment-date" className="text-xs sm:text-sm">
									Payment Date
								</Label>
								<Input
									id="payment-date"
									type="date"
									className="h-8 sm:h-10 text-xs sm:text-sm"
									value={paymentDate}
									onChange={(e) => setPaymentDate(e.target.value)}
								/>
							</div>

							<div className="space-y-1.5 sm:space-y-2">
								<Label htmlFor="notes" className="text-xs sm:text-sm">
									Memo (Optional)
								</Label>
								<Input
									id="notes"
									placeholder="Add a memo for this payment"
									className="h-8 sm:h-10 text-xs sm:text-sm"
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between p-4 sm:p-6 pt-2 sm:pt-4">
							<Button
								variant="outline"
								asChild
								className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
							>
								<Link href="/bills">Cancel</Link>
							</Button>
							<Button 
								className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm"
								onClick={handlePayBill}
								disabled={loading || !selectedBillId || !selectedWalletId || !amount}
							>
								{loading ? "Processing..." : "Pay Bill"}
							</Button>
						</CardFooter>
					</Card>

					<Card className="border-border/40">
						<CardHeader className="pb-3 sm:pb-6 p-4 sm:p-6">
							<CardTitle className="text-base sm:text-lg">Bill Payment History</CardTitle>
							<CardDescription className="text-xs sm:text-sm">
								Your bill payments over the last {isMobile ? "6 mo" : "6 months"}
							</CardDescription>
						</CardHeader>
						<CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
							<div className="h-[200px] sm:h-[300px] w-full">
								<BillChart data={validHistory} />
							</div>
							<div className="mt-3 sm:mt-4 text-center text-[10px] sm:text-sm text-muted-foreground">
								<p>
									Average monthly bill payments: ${averageMonthlyPayment}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	)
}