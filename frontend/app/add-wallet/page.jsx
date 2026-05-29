"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { walletApi } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function AddWalletPage() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const [formData, setFormData] = useState({
		name: "",
		type: "checking",
		currency: "USD",
		initial_balance: "0",
		description: "",
		color: "#10b981",
	})

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData(prev => ({ ...prev, [id]: value }))
	}

	const handleSelectChange = (key, value) => {
		setFormData(prev => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		try {
			await walletApi.create({
				...formData,
				initial_balance: parseFloat(formData.initial_balance) || 0,
			})
			router.push("/")
		} catch (err) {
			console.error(err)
			setError("Failed to create wallet. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Layout>
			<div className="mx-auto max-w-2xl py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
				<div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
					<Button variant="outline" size="icon" asChild>
						<Link href="/">
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Back</span>
						</Link>
					</Button>
					<h3 className="text-lg sm:text-xl font-semibold">Add New Wallet</h3>
				</div>
				<form onSubmit={handleSubmit}>
					<Card>
						<CardHeader>
							<CardTitle>Create Wallet</CardTitle>
							<CardDescription>Add a new wallet to your account.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{error && <div className="text-red-500 text-sm">{error}</div>}

							<div className="space-y-2">
								<Label htmlFor="name">Wallet Name</Label>
								<Input
									id="name"
									placeholder="e.g. Main Savings, Travel Fund"
									value={formData.name}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="type">Wallet Type</Label>
								<Select value={formData.type} onValueChange={(val) => handleSelectChange("type", val)}>
									<SelectTrigger id="type">
										<SelectValue placeholder="Select wallet type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="savings">Savings</SelectItem>
										<SelectItem value="checking">Checking</SelectItem>
										<SelectItem value="investment">Investment</SelectItem>
										<SelectItem value="budget">Budget</SelectItem>
										<SelectItem value="emergency">Emergency Fund</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="currency">Currency</Label>
								<Select value={formData.currency} onValueChange={(val) => handleSelectChange("currency", val)}>
									<SelectTrigger id="currency">
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USD">USD - US Dollar</SelectItem>
										<SelectItem value="EUR">EUR - Euro</SelectItem>
										<SelectItem value="TRY">TRY - Turkish Lira</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="initial_balance">Initial Balance</Label>
								<div className="relative">
									<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
									<Input
										id="initial_balance"
										type="number"
										min="0"
										step="0.01"
										placeholder="0.00"
										className="pl-8"
										value={formData.initial_balance}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description (Optional)</Label>
								<Input
									id="description"
									placeholder="Add a description for this wallet"
									value={formData.description}
									onChange={handleChange}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
							<Button variant="outline" className="w-full sm:w-auto" asChild>
								<Link href="/">Cancel</Link>
							</Button>
							<Button className="w-full sm:w-auto" disabled={loading}>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Create Wallet
							</Button>
						</CardFooter>
					</Card>
				</form>
			</div>
		</Layout>
	)
}
