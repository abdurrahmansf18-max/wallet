"use client"

import { motion } from "framer-motion"
import { Edit, MoreHorizontal, PlusCircle, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { budgetApi } from "@/lib/api"

export function BudgetCategoriesTab({ categories }) {
	const [searchQuery, setSearchQuery] = useState("")
	const [hoveredCategory, setHoveredCategory] = useState(null)
	const [openMenuId, setOpenMenuId] = useState(null)
	
	const [editingCategory, setEditingCategory] = useState(null)
	const [newAmount, setNewAmount] = useState("")

	const router = useRouter()
	const { toast } = useToast()

	const handleDelete = async (id) => {
		try {
			await budgetApi.delete(id)
			toast({
				title: "Category deleted",
				description: "Budget category has been removed.",
			})
			router.refresh()
			// Optional: Force reload if router.refresh() doesn't update due to client fetching data in useEffect
			// but BudgetPage fetches on mount. 
			// Reload is safer for quick fix.
			window.location.reload()
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to delete category.",
			})
		}
	}

	const handleEdit = (category) => {
		setEditingCategory(category)
		setNewAmount(category.budgeted.toString())
	}

	const saveEdit = async () => {
		if (!editingCategory) return
		try {
			await budgetApi.update(editingCategory.id, { amount: parseFloat(newAmount) })
			toast({
				title: "Category updated",
				description: "Budget limit has been updated.",
			})
			setEditingCategory(null)
			window.location.reload()
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update category.",
			})
		}
	}

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value)
	}

	const getStatusColor = (status) => {
		switch (status) {
			case "on-track":
				return "bg-emerald-500"
			case "warning":
				return "bg-amber-500"
			case "exceeded":
				return "bg-destructive"
			default:
				return "bg-emerald-500"
		}
	}

	const getStatusBadge = (status) => {
		switch (status) {
			case "on-track":
				return (
					<Badge variant="success" size="sm">
						 Track
					</Badge>
				)
			case "warning":
				return (
					<Badge variant="warning" size="sm">
						Warning
					</Badge>
				)
			case "exceeded":
				return (
					<Badge variant="destructive" size="sm">
						Exceeded
					</Badge>
				)
			default:
				return (
					<Badge variant="success" size="sm">
						 Track
					</Badge>
				)
		}
	}

	const getProgressColor = (percentUsed) => {
		if (percentUsed >= 100) return "bg-destructive"
		if (percentUsed >= 85) return "bg-amber-500"
		return "bg-emerald-500"
	}

	// Filter categories based on search query
	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<Card className="space-y-6 p-4">
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search categories..."
						className="pl-9 h-9 w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2 w-full sm:w-auto">
					<Button variant="outline" size="sm" className="h-9 gap-1">
						<SlidersHorizontal className="h-4 w-4" />
						<span className="hidden sm:inline">Filter</span>
					</Button>
					<Button asChild className="ml-auto sm:ml-0">
						<Link href="/budget/create">
							<PlusCircle className="mr-2 h-4 w-4" />
							Add Category
						</Link>
					</Button>
				</div>
			</div>

			{/* Desktop Table View */}
			<div className="rounded-xl border border-border/40 overflow-hidden hidden md:block">
				<div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-muted/50">
					<div className="col-span-4">Category</div>
					<div className="col-span-2 text-right">Budgeted</div>
					<div className="col-span-2 text-right">Spent</div>
					<div className="col-span-2 text-right">Remaining</div>
					<div className="col-span-2 text-right">Progress</div>
				</div>

				<div className="divide-y">
					{filteredCategories.length > 0 ? (
						filteredCategories.map((category, index) => (
							<motion.div
								key={category.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.05 }}
								onHoverStart={() => setHoveredCategory(category.id)}
								onHoverEnd={() => setHoveredCategory(null)}
							>
								<div
									className={cn(
										"grid grid-cols-12 gap-4 p-4 items-center transition-colors relative",
										hoveredCategory === category.id ? "bg-muted/50" : "",
									)}
								>
									{/* Hover indicator */}
									{hoveredCategory === category.id && (
										<motion.div
											className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "100%" }}
											transition={{ duration: 0.2 }}
										/>
									)}

									<div className="col-span-4 flex items-center gap-3">
										<div className={`w-3 h-3 rounded-full ${getStatusColor(category.status)}`}></div>
										<span className="font-medium">{category.name}</span>
										{getStatusBadge(category.status)}
									</div>
									<div className="col-span-2 text-right font-medium">{formatCurrency(category.budgeted)}</div>
									<div className="col-span-2 text-right">{formatCurrency(category.spent)}</div>
									<div
										className={cn(
											"col-span-2 text-right font-medium",
											category.remaining < 0 ? "text-destructive" : "",
										)}
									>
										{formatCurrency(category.remaining)}
									</div>
									<div className="col-span-2">
										<div className="flex items-center justify-end gap-2">
											<Progress
												value={Math.min(category.percentUsed, 100)}
												max={100}
												className="h-2 w-24"
												indicatorClassName={getProgressColor(category.percentUsed)}
											/>
											<span className="text-xs w-12 text-right">{category.percentUsed.toFixed(0)}%</span>
										</div>
									</div>

									{/* Action button that appears on hover */}
									{(hoveredCategory === category.id || openMenuId === category.id) && (
										<motion.div
											className="absolute right-4 top-1/2 transform -translate-y-1/2"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.2 }}
										>
											<DropdownMenu onOpenChange={(open) => setOpenMenuId(open ? category.id : null)}>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem onClick={() => handleEdit(category)}>
														<Edit className="mr-2 h-4 w-4" />
														Edit Category
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link href={`/budget?tab=transactions&category=${category.name}`}>View Transactions</Link>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-destructive" onClick={() => handleDelete(category.id)}>Delete Category</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</motion.div>
									)}
								</div>
							</motion.div>
						))
					) : (
						<div className="p-8 text-center text-muted-foreground">No categories found matching your search.</div>
					)}
				</div>
			</div>

			<Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Budget Category</DialogTitle>
						<DialogDescription>
							Update the budget limit for {editingCategory?.name}.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="amount" className="text-right">
								Amount
							</Label>
							<Input
								id="amount"
								type="number"
								value={newAmount}
								onChange={(e) => setNewAmount(e.target.value)}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
						<Button onClick={saveEdit}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Mobile Card View */}
			<div className="md:hidden space-y-4">
				{filteredCategories.length > 0 ? (
					filteredCategories.map((category, index) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
							className="border rounded-lg overflow-hidden"
						>
							<div className="p-4 bg-muted/30 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className={`w-3 h-3 rounded-full ${getStatusColor(category.status)}`}></div>
									<span className="font-medium">{category.name}</span>
								</div>
								{getStatusBadge(category.status)}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full ml-auto">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleEdit(category)}>
											<Edit className="mr-2 h-4 w-4" />
											Edit Category
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href={`/budget?tab=transactions&category=${category.name}`}>View Transactions</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="text-destructive" onClick={() => handleDelete(category.id)}>Delete Category</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div className="p-4 space-y-3">
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="text-muted-foreground">Budgeted:</div>
									<div className="text-right font-medium">{formatCurrency(category.budgeted)}</div>

									<div className="text-muted-foreground">Spent:</div>
									<div className="text-right">{formatCurrency(category.spent)}</div>

									<div className="text-muted-foreground">Remaining:</div>
									<div className={cn("text-right font-medium", category.remaining < 0 ? "text-destructive" : "")}>
										{formatCurrency(category.remaining)}
									</div>
								</div>

								<div className="pt-2">
									<div className="flex items-center justify-between gap-2 mb-1">
										<span className="text-xs text-muted-foreground">Progress:</span>
										<span className="text-xs font-medium">{category.percentUsed.toFixed(0)}%</span>
									</div>
									<Progress
										value={Math.min(category.percentUsed, 100)}
										max={100}
										className="h-2 w-full"
										indicatorClassName={getProgressColor(category.percentUsed)}
									/>
								</div>
							</div>
						</motion.div>
					))
				) : (
					<div className="p-8 text-center text-muted-foreground">No categories found matching your search.</div>
				)}
			</div>
		</Card>
	)
}
