"use client"

import { GoalContributionForm } from "@/components/goals/goal-contribution-form"
import { GoalDetails } from "@/components/goals/goal-details"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { goalApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function GoalDetailsPage() {
	const router = useRouter()
	const params = useParams()
	const { toast } = useToast()
	const [goal, setGoal] = useState(null)
	const [loading, setLoading] = useState(true)
	const [showContributionForm, setShowContributionForm] = useState(false)
	const isMobile = useIsMobile()

	// Use useParams hook for client components
	const goalId = params?.id

	useEffect(() => {
		if (goalId) {
			fetchGoal(goalId)
		}
	}, [goalId])

	const fetchGoal = async (id) => {
		try {
			const data = await goalApi.getOne(id)
			// Transform to match UI expectations
			// Parse description for metadata if any
			let category = "Savings"
			let priority = "Medium"
			let notes = data.description || ""
			
			if (data.description) {
				const catMatch = data.description.match(/\[Category: (.*?)\]/)
				if (catMatch) category = catMatch[1]
				
				const priMatch = data.description.match(/\[Priority: (.*?)\]/)
				if (priMatch) priority = priMatch[1]
				
				// Clean description if it contains metadata
				notes = data.description.replace(/\[Category: .*?\]\n?/, '').replace(/\[Priority: .*?\]\n?/, '').replace(/Notes: /, '').trim()
			}
			
			const transformedGoal = {
				id: data.id,
				name: data.name,
				targetAmount: data.target_amount,
				currentAmount: data.current_amount,
				progress: (data.current_amount / data.target_amount) * 100,
				deadline: data.target_date,
				status: data.is_completed ? "completed" : (data.target_date && new Date(data.target_date) < new Date() ? "overdue" : "on-track"),
				category,
				priority,
				walletId: data.wallet_id,
				walletName: "Wallet", // We could fetch wallet details if needed
				notes,
				contributions: [], // No contribution history in backend yet
			}
			setGoal(transformedGoal)
		} catch (error) {
			console.error("Failed to fetch goal:", error)
			toast({
				title: "Error",
				description: "Failed to load goal details.",
				variant: "destructive",
			})
			router.push("/goals")
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString) => {
		if (!dateString) return "No deadline";
		const options = { year: "numeric", month: "long", day: "numeric" }
		return new Date(dateString).toLocaleDateString(undefined, options)
	}

	const calculateTimeLeft = (deadline) => {
		if (!deadline) return "No deadline";
		const today = new Date()
		const targetDate = new Date(deadline)
		const timeLeft = targetDate - today

		// If deadline has passed
		if (timeLeft < 0) return "Deadline passed"

		const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

		if (daysLeft > 365) {
			const years = Math.floor(daysLeft / 365)
			return `${years} year${years > 1 ? "s" : ""} left`
		} else if (daysLeft > 30) {
			const months = Math.floor(daysLeft / 30)
			return `${months} month${months > 1 ? "s" : ""} left`
		} else {
			return `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
		}
	}

	const handleDelete = async (goalId) => {
		try {
			await goalApi.delete(goalId)
			toast({
				title: "Success",
				description: "Goal deleted successfully",
			})
			router.push("/goals")
		} catch (error) {
			console.error("Failed to delete goal:", error)
			toast({
				title: "Error",
				description: "Failed to delete goal. Please try again.",
				variant: "destructive",
			})
		}
	}

	const handleAddContribution = async (contribution) => {
		if (!goal) return
		
		const amount = contribution.amount
		
		try {
			// Update goal current amount
			const newAmount = goal.currentAmount + parseFloat(amount)
			// Ensure it doesn't exceed target if that's a rule, but usually saving more is fine.
			// Maybe check completion
			const isCompleted = newAmount >= goal.targetAmount
			
			await goalApi.update(goal.id, {
				current_amount: newAmount,
				is_completed: isCompleted
			})
			
			toast({
				title: "Success",
				description: "Contribution added successfully!",
			})
			
			// Refresh data
			fetchGoal(goal.id)
			setShowContributionForm(false)
		} catch (error) {
			console.error("Failed to add contribution:", error)
			toast({
				title: "Error",
				description: "Failed to update goal.",
				variant: "destructive",
			})
		}
	}

	if (loading) {
		return (
			<Layout>
				<div className="flex justify-center items-center h-screen">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			</Layout>
		)
	}

	if (!goal) return null

	return (
		<Layout>
			<div className="px-4 sm:px-6">
				<div className="max-w-4xl mx-auto">
					<div className="mb-4 sm:mb-6">
						<Button variant="ghost" size={isMobile ? "sm" : "default"} asChild className="mb-2">
							<Link href="/goals">
								<ArrowLeft className="mr-2 h-4 w-4" />
								{isMobile ? "Back" : "Back to Goals"}
							</Link>
						</Button>
					</div>
					<GoalDetails
						goal={goal}
						formatDate={formatDate}
						calculateTimeLeft={calculateTimeLeft}
						onDelete={handleDelete}
						onContribute={() => setShowContributionForm(true)}
					/>
					
					{/* Contribution Dialog */}
					<Dialog open={showContributionForm} onOpenChange={setShowContributionForm}>
						<DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
							<GoalContributionForm 
								goal={goal}
								onSubmit={handleAddContribution}
								onCancel={() => setShowContributionForm(false)}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</Layout>
	)
}
