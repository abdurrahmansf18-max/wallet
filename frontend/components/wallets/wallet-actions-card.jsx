"use client"

import {
	AlertTriangle,
	ArrowRight,
	ArrowUpRight,
	CreditCard,
	Download,
	Edit,
	FileText,
	Plus,
	Settings,
	Wallet,
	MinusCircle,
	Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { transactionApi, walletApi } from "@/lib/api"

export function WalletActionsCard({ wallet, className, onUpdate }) {
	const router = useRouter()
	const [addFundsOpen, setAddFundsOpen] = useState(false)
	const [transferFundsOpen, setTransferFundsOpen] = useState(false)
	const [addExpenseOpen, setAddExpenseOpen] = useState(false)
	const [exportOpen, setExportOpen] = useState(false)
	const [editOpen, setEditOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	
	const [loading, setLoading] = useState(false)
	const [wallets, setWallets] = useState([])
	const [activeButton, setActiveButton] = useState(null)

	// Form states
	const [amount, setAmount] = useState("")
	const [description, setDescription] = useState("")
	const [category, setCategory] = useState("")
	const [targetWalletId, setTargetWalletId] = useState("")

	// Other independent states
	const [exportFormat, setExportFormat] = useState("pdf")
	const [exportDateRange, setExportDateRange] = useState("month")

	useEffect(() => {
		if (transferFundsOpen) {
			walletApi.getAll().then(data => setWallets(data.filter(w => w.id !== wallet?.id)))
		}
	}, [transferFundsOpen, wallet?.id])

	const resetForm = () => {
		setAmount("")
		setDescription("")
		setCategory("")
		setTargetWalletId("")
		setLoading(false)
	}

	const handleAddFunds = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await transactionApi.create({
				amount: parseFloat(amount),
				description: description || "Deposit",
				type: "income",
				category: category || "Income",
				wallet_id: wallet.id,
				status: "completed"
			})
			setAddFundsOpen(false)
			resetForm()
			onUpdate?.()
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleAddExpense = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await transactionApi.create({
				amount: parseFloat(amount),
				description: description || "Expense",
				type: "expense",
				category: category || "General",
				wallet_id: wallet.id,
				status: "completed"
			})
			setAddExpenseOpen(false)
			resetForm()
			onUpdate?.()
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleTransfer = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await transactionApi.create({
				amount: parseFloat(amount),
				description: description || "Transfer",
				type: "transfer",
				category: "Transfer",
				wallet_id: wallet.id,
				target_wallet_id: targetWalletId,
				status: "completed"
			})
			setTransferFundsOpen(false)
			resetForm()
			onUpdate?.()
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleExport = () => {
		console.log("Exporting statement:", { format: exportFormat, dateRange: exportDateRange })
		setExportOpen(false)
	}

	const handleEdit = (e) => {
		e.preventDefault()
		console.log("Editing wallet")
		setEditOpen(false)
	}

	const handleDelete = async () => {
		console.log("Deleting wallet", wallet.id)
		try {
			setLoading(true)
			await walletApi.delete(wallet.id)
			router.push("/")
		} catch (error) {
			console.error("Failed to delete wallet", error)
			setLoading(false)
			setDeleteOpen(false)
		}
	}

	const actionButtons = [
		{
			name: "add",
			label: "Add Funds",
			icon: Plus,
			secondaryIcon: CreditCard,
			color: "bg-emerald-500",
			lightColor: "bg-emerald-100",
			textColor: "text-emerald-500",
			onClick: () => setAddFundsOpen(true),
			variant: "default",
		},
		{
			name: "expense",
			label: "Add Expense",
			icon: MinusCircle,
			secondaryIcon: CreditCard,
			color: "bg-red-500",
			lightColor: "bg-red-100",
			textColor: "text-red-500",
			onClick: () => setAddExpenseOpen(true),
			variant: "default",
		},
		{
			name: "transfer",
			label: "Transfer Funds",
			icon: ArrowUpRight,
			secondaryIcon: Wallet,
			color: "bg-blue-500",
			lightColor: "bg-blue-100",
			textColor: "text-blue-500",
			onClick: () => setTransferFundsOpen(true),
			variant: "default",
		},
		{
			name: "export",
			label: "Export Statement",
			icon: Download,
			secondaryIcon: FileText,
			color: "bg-purple-500",
			lightColor: "bg-purple-100",
			textColor: "text-purple-500",
			onClick: () => setExportOpen(true),
			variant: "outline",
		},
		{
			name: "edit",
			label: "Edit Wallet",
			icon: Edit,
			secondaryIcon: Settings,
			color: "bg-amber-500",
			lightColor: "bg-amber-100",
			textColor: "text-amber-500",
			onClick: () => setEditOpen(true),
			variant: "outline",
		},
	]

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<div className="rounded-full bg-primary/10 p-1.5">
						<Wallet className="h-4 w-4 text-primary" />
					</div>
					<CardTitle>Wallet Actions</CardTitle>
				</div>
				<CardDescription>Manage your wallet operations.</CardDescription>
			</CardHeader>
			<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{actionButtons.map((button) => (
					<motion.div
						key={button.name}
						whileHover={{ y: -4 }}
						whileTap={{ scale: 0.98 }}
						onMouseEnter={() => setActiveButton(button.name)}
						onMouseLeave={() => setActiveButton(null)}
					>
						<Button
							variant={button.variant}
							className={cn(
								"relative w-full h-28 p-0 overflow-hidden border transition-all duration-300",
								button.variant === "outline" ? "hover:border-primary/40 hover:bg-muted/50" : "",
								button.variant === "default" ? `hover:opacity-95 hover:shadow-md` : "",
							)}
							onClick={button.onClick}
						>
							<div className="absolute inset-0 flex flex-col items-center justify-center z-10">
								<div
									className={cn(
										"rounded-full p-2 mb-2 transition-all duration-300",
										button.variant === "outline" ? button.lightColor : "bg-white/20",
									)}
								>
									<button.icon
										className={cn("h-5 w-5", button.variant === "outline" ? button.textColor : "text-white")}
									/>
								</div>
								<span className="font-medium">{button.label}</span>
							</div>

							{activeButton === button.name && (
								<motion.div
									className="absolute bottom-2 right-2 z-10"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.2 }}
								>
									<ArrowRight
										className={cn("h-4 w-4", button.variant === "outline" ? button.textColor : "text-white")}
									/>
								</motion.div>
							)}

							{button.variant === "default" && (
								<div className="absolute inset-0 opacity-90" style={{ backgroundColor: button.color }} />
							)}

							{activeButton === button.name && button.variant === "outline" && (
								<motion.div
									className="absolute -bottom-6 -right-6 rounded-full opacity-10 z-0"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.3 }}
									style={{
										backgroundColor: button.color,
										width: "100px",
										height: "100px",
									}}
								/>
							)}
						</Button>
					</motion.div>
				))}

				{/* Add Funds Dialog */}
				<Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Funds</DialogTitle>
							<DialogDescription>Add income to your wallet.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddFunds}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="amount_income" className="text-right">Amount</Label>
									<Input
										id="amount_income"
										type="number"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="col-span-3"
										required
										min="0.01"
										step="0.01"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="category_income" className="text-right">Category</Label>
									<Select onValueChange={setCategory} required>
										<SelectTrigger className="col-span-3">
											<SelectValue placeholder="Select Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Salary">Salary</SelectItem>
											<SelectItem value="Freelance">Freelance</SelectItem>
											<SelectItem value="Gift">Gift</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="desc_income" className="text-right">Description</Label>
									<Input
										id="desc_income"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className="col-span-3"
										placeholder="Optional"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Add Funds
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Add Expense Dialog */}
				<Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Expense</DialogTitle>
							<DialogDescription>Record a new expense.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddExpense}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="amount_expense" className="text-right">Amount</Label>
									<Input
										id="amount_expense"
										type="number"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="col-span-3"
										required
										min="0.01"
										step="0.01"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="category_expense" className="text-right">Category</Label>
									<Select onValueChange={setCategory} required>
										<SelectTrigger className="col-span-3">
											<SelectValue placeholder="Select Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Food">Food & Dining</SelectItem>
											<SelectItem value="Transport">Transportation</SelectItem>
											<SelectItem value="Shopping">Shopping</SelectItem>
											<SelectItem value="Bills">Bills & Utilities</SelectItem>
											<SelectItem value="Entertainment">Entertainment</SelectItem>
											<SelectItem value="Health">Health</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="desc_expense" className="text-right">Description</Label>
									<Input
										id="desc_expense"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className="col-span-3"
										placeholder="Optional"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" variant="destructive" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Add Expense
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Transfer Funds Dialog */}
				<Dialog open={transferFundsOpen} onOpenChange={setTransferFundsOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-blue-100 p-1.5">
									<ArrowUpRight className="h-4 w-4 text-blue-500" />
								</div>
								<DialogTitle>Transfer Funds</DialogTitle>
							</div>
							<DialogDescription>Move money to another wallet.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleTransfer}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="target-wallet" className="text-right">
										To
									</Label>
									<Select onValueChange={setTargetWalletId} required>
										<SelectTrigger className="col-span-3">
											<SelectValue placeholder="Select target wallet" />
										</SelectTrigger>
										<SelectContent>
											{wallets.map(w => (
												<SelectItem key={w.id} value={w.id}>{w.name} ({w.currency})</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="amount-transfer" className="text-right">
										Amount
									</Label>
									<Input
										id="amount-transfer"
										type="number"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="col-span-3"
										required
										min="0.01"
										step="0.01"
									/>
								</div>

								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="desc-transfer" className="text-right">
										Description
									</Label>
									<Input
										id="desc-transfer"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Optional note"
										className="col-span-3"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Transfer Funds
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Export Statement Dialog */}
				<Dialog open={exportOpen} onOpenChange={setExportOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-purple-100 p-1.5">
									<FileText className="h-4 w-4 text-purple-500" />
								</div>
								<DialogTitle>Export Statement</DialogTitle>
							</div>
							<DialogDescription>Download a statement of your wallet transactions.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="date-range" className="text-right">
									Date Range
								</Label>
								<Select value={exportDateRange} onValueChange={setExportDateRange}>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select date range" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="week">Last 7 days</SelectItem>
										<SelectItem value="month">Last 30 days</SelectItem>
										<SelectItem value="quarter">Last 3 months</SelectItem>
										<SelectItem value="year">Last 12 months</SelectItem>
										<SelectItem value="custom">Custom range</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{exportDateRange === "custom" && (
								<>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="start-date" className="text-right">
											Start Date
										</Label>
										<Input id="start-date" type="date" className="col-span-3" />
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="end-date" className="text-right">
											End Date
										</Label>
										<Input id="end-date" type="date" className="col-span-3" />
									</div>
								</>
							)}

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="format" className="text-right">
									Format
								</Label>
								<Select value={exportFormat} onValueChange={setExportFormat}>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select format" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pdf">PDF Document</SelectItem>
										<SelectItem value="csv">CSV Spreadsheet</SelectItem>
										<SelectItem value="excel">Excel Spreadsheet</SelectItem>
										<SelectItem value="json">JSON Data</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="transactions" className="text-right">
									Transactions
								</Label>
								<Select defaultValue="all">
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select transactions" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Transactions</SelectItem>
										<SelectItem value="income">Income Only</SelectItem>
										<SelectItem value="expense">Expenses Only</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={handleExport} className="bg-purple-500 hover:bg-purple-600">
								Download Statement
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Edit Wallet Dialog */}
				<Dialog open={editOpen} onOpenChange={setEditOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-amber-100 p-1.5">
									<Settings className="h-4 w-4 text-amber-500" />
								</div>
								<DialogTitle>Edit Wallet</DialogTitle>
							</div>
							<DialogDescription>Update your wallet details.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleEdit}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="wallet-name" className="text-right">
										Wallet Name
									</Label>
									<Input
										id="wallet-name"
										defaultValue={wallet?.name || "Main Savings"}
										className="col-span-3"
										required
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="wallet-type" className="text-right">
										Type
									</Label>
									<Select defaultValue={wallet?.type?.toLowerCase() || "savings"}>
										<SelectTrigger className="col-span-3">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="savings">Savings</SelectItem>
											<SelectItem value="checking">Checking</SelectItem>
											<SelectItem value="investment">Investment</SelectItem>
											<SelectItem value="budget">Budget</SelectItem>
											<SelectItem value="custom">Custom</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="wallet-currency" className="text-right">
										Currency
									</Label>
									<Select defaultValue={wallet?.currency?.toLowerCase() || "usd"}>
										<SelectTrigger className="col-span-3">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="usd">USD - US Dollar</SelectItem>
											<SelectItem value="eur">EUR - Euro</SelectItem>
											<SelectItem value="gbp">GBP - British Pound</SelectItem>
											<SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
											<SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="wallet-description" className="text-right">
										Description
									</Label>
									<Input
										id="wallet-description"
										placeholder="Optional description for this wallet"
										className="col-span-3"
									/>
								</div>
							</div>
							<DialogFooter className="flex justify-between sm:justify-between">
								<Button type="button" variant="outline" onClick={() => setDeleteOpen(true)}>
									Delete Wallet
								</Button>
								<Button type="submit" className="bg-amber-500 hover:bg-amber-600">
									Save Changes
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Delete Wallet Dialog */}
				<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle className="text-destructive flex items-center gap-2">
								<AlertTriangle className="h-5 w-5" />
								Delete Wallet
							</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your wallet and all associated data.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<div className="rounded-md bg-destructive/10 p-4 text-destructive">
								<div className="flex items-start gap-3">
									<AlertTriangle className="h-5 w-5 mt-0.5" />
									<div>
										<h3 className="font-medium">Warning: Deletion is permanent</h3>
										<p className="text-sm mt-1">
											Your wallet balance of ${wallet?.balance?.toLocaleString() || "0.00"} will be lost if you don't
											transfer it first.
										</p>
									</div>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleteOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={handleDelete}>
								Delete Wallet
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	)
}
