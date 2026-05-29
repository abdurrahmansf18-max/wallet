"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { walletApi, goalApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CreateGoalPage() {
	const router = useRouter()
	const { toast } = useToast()
	const [wallets, setWallets] = useState([])
	const [loading, setLoading] = useState(false)
	
	const [formData, setFormData] = useState({
		name: "",
		target_amount: "",
		current_amount: "",
		target_date: "",
		category: "",
		wallet_id: "",
		priority: "medium",
		notes: ""
	})

	useEffect(() => {
		const loadWallets = async () => {
			try {
				const data = await walletApi.getAll()
				setWallets(data)
			} catch (error) {
				console.error("Failed to load wallets", error)
				toast({
					title: "Error",
					description: "Failed to load wallets. Please refresh the page.",
					variant: "destructive",
				})
			}
		}
		loadWallets()
	}, [toast])

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData((prev) => ({ ...prev, [id]: value }))
	}

	const handleSelectChange = (key, value) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			// Construct description from category, priority, notes
			const description = `[Category: ${formData.category || 'Uncategorized'}]\n[Priority: ${formData.priority}]\nNotes: ${formData.notes}`
			
			const payload = {
				name: formData.name,
				target_amount: parseFloat(formData.target_amount),
				current_amount: formData.current_amount ? parseFloat(formData.current_amount) : 0,
				target_date: formData.target_date ? new Date(formData.target_date).toISOString() : null,
				description: description,
				wallet_id: formData.wallet_id || null, // Optional
				is_completed: false
			}

			await goalApi.create(payload)
			
			toast({
				title: "Success",
				description: "Goal created successfully!",
			})
			router.push("/goals")
		} catch (error) {
			console.error("Failed to create goal:", error)
			toast({
				title: "Error",
				description: "Failed to create goal. Please try again.",
				variant: "destructive",
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<Layout>
			<div>

				<div className="mx-auto max-w-2xl">
					<div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
						<Button variant="outline" size="icon" asChild>
							<Link href="/goals">
								<ChevronLeft className="h-4 w-4" />
								<span className="sr-only">Back</span>
							</Link>
						</Button>
						<h1 className="text-xl sm:text-2xl font-semibold">Create New Goal</h1>
					</div>
					<form onSubmit={handleSubmit}>
						<Card>
							<CardHeader>
								<CardTitle>Goal Information</CardTitle>
								<CardDescription>Set up your new financial goal.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Goal Name</Label>
									<Input 
										id="name" 
										placeholder="e.g. New Car, Vacation Fund" 
										value={formData.name}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="category">Category</Label>
									<Select onValueChange={(val) => handleSelectChange("category", val)}>
										<SelectTrigger id="category">
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="savings">Savings</SelectItem>
											<SelectItem value="emergency">Emergency Fund</SelectItem>
											<SelectItem value="retirement">Retirement</SelectItem>
											<SelectItem value="major-purchase">Major Purchase</SelectItem>
											<SelectItem value="travel">Travel</SelectItem>
											<SelectItem value="education">Education</SelectItem>
											<SelectItem value="event">Event</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="target_amount">Target Amount</Label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
											<Input 
												id="target_amount" 
												type="number" 
												min="0" 
												step="0.01" 
												placeholder="0.00" 
												className="pl-8" 
												value={formData.target_amount}
												onChange={handleChange}
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="current_amount">Current Amount (Optional)</Label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
											<Input 
												id="current_amount" 
												type="number" 
												min="0" 
												step="0.01" 
												placeholder="0.00" 
												className="pl-8" 
												value={formData.current_amount}
												onChange={handleChange}
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											If you've already saved some amount towards this goal.
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="target_date">Target Date</Label>
									<Input 
										id="target_date" 
										type="date" 
										value={formData.target_date}
										onChange={handleChange}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="wallet_id">Associated Wallet</Label>
									<Select onValueChange={(val) => handleSelectChange("wallet_id", val)}>
										<SelectTrigger id="wallet_id">
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
									<p className="text-xs text-muted-foreground">The wallet where funds for this goal will be stored.</p>
								</div>

								<div className="space-y-2">
									<Label>Priority</Label>
									<RadioGroup 
										defaultValue="medium" 
										className="flex space-x-4" 
										onValueChange={(val) => handleSelectChange("priority", val)}
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="high" id="priority-high" />
											<Label htmlFor="priority-high" className="text-red-500">
												High
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="medium" id="priority-medium" />
											<Label htmlFor="priority-medium" className="text-yellow-500">
												Medium
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="low" id="priority-low" />
											<Label htmlFor="priority-low" className="text-green-500">
												Low
											</Label>
										</div>
									</RadioGroup>
								</div>

								<div className="space-y-2">
									<Label htmlFor="notes">Notes (Optional)</Label>
									<Textarea 
										id="notes" 
										placeholder="Add any additional details about this goal" 
										value={formData.notes}
										onChange={handleChange}
									/>
								</div>
							</CardContent>
							<CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
								<Button variant="outline" type="button" asChild className="w-full sm:w-auto">
									<Link href="/goals">Cancel</Link>
								</Button>
								<Button type="submit" disabled={loading} className="w-full sm:w-auto mt-2 sm:mt-0">
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Create Goal
								</Button>
							</CardFooter>
						</Card>
					</form>
				</div>
			</div>
		</Layout>
	)
}
