"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Minus, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { transactionApi } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function TransactionHistoryCard({ walletId, className }) {
	const [filter, setFilter] = useState("all")
	const [searchTerm, setSearchTerm] = useState("")
	const [transactions, setTransactions] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchTransactions = async () => {
			if (!walletId) return
			try {
				setLoading(true)
				const data = await transactionApi.getAll({ wallet_id: walletId })
				
				const formatted = data.map(t => {
					const isExpense = t.type === "expense"
					const amount = isExpense ? -Math.abs(t.amount) : Math.abs(t.amount)
					
					return {
						id: t.id,
						description: t.description,
						amount: amount,
						date: new Date(t.date).toLocaleString(),
						status: t.status,
						category: t.category
					}
				})
				setTransactions(formatted)
			} catch (error) {
				console.error("Failed to fetch transactions", error)
			} finally {
				setLoading(false)
			}
		}

		fetchTransactions()
	}, [walletId])

	// Filter transactions based on selected filter and search term
	const filteredTransactions = transactions.filter((transaction) => {
		const matchesFilter =
			filter === "all" ||
			(filter === "income" && transaction.amount > 0) ||
			(filter === "expense" && transaction.amount < 0)

		const matchesSearch =
			transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

		return matchesFilter && matchesSearch
	})

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Transaction History</CardTitle>
				<CardDescription>View all transactions for this wallet.</CardDescription>
				<div className="flex flex-col sm:flex-row gap-4 mt-4">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search transactions..."
							className="pl-8"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Select value={filter} onValueChange={setFilter}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Transactions</SelectItem>
							<SelectItem value="income">Income</SelectItem>
							<SelectItem value="expense">Expense</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="flex justify-center p-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : filteredTransactions.length === 0 ? (
					<div className="text-center p-8 text-muted-foreground">
						No transactions found.
					</div>
				) : (
					<div className="space-y-4">
						{filteredTransactions.map((transaction) => (
							<div
								key={transaction.id}
								className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div
										className={`p-2 rounded-full ${
											transaction.amount > 0
												? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
												: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
										}`}
									>
										{transaction.amount > 0 ? (
											<ArrowUpRight className="h-4 w-4" />
										) : (
											<ArrowDownLeft className="h-4 w-4" />
										)}
									</div>
									<div>
										<p className="font-medium">{transaction.description}</p>
										<p className="text-sm text-muted-foreground">
											{transaction.category} • {transaction.date}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p
										className={`font-medium ${
											transaction.amount > 0 ? "text-emerald-600" : "text-red-600"
										}`}
									>
										{transaction.amount > 0 ? "+" : ""}
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(transaction.amount)}
									</p>
									<Badge variant="outline" className="mt-1">
										{transaction.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
