"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, CreditCard, PlusCircle, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { authApi, paymentMethodApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function AccountSettings() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [paymentType, setPaymentType] = useState("card")
	const { toast } = useToast()

	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [paymentMethods, setPaymentMethods] = useState([])
	const [fetchingPM, setFetchingPM] = useState(false)
	const [savingPM, setSavingPM] = useState(false)
	const [pmForm, setPmForm] = useState({
		name: "",
		provider: "",
		account_number: "",
		card_last_four: "",
		expiry_date: ""
	})
	
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: ""
	})

	const fetchPaymentMethods = async () => {
		try {
			setFetchingPM(true)
			const methods = await paymentMethodApi.getAll()
			setPaymentMethods(methods)
		} catch (error) {
			console.error("Failed to fetch payment methods", error)
		} finally {
			setFetchingPM(false)
		}
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await authApi.getCurrentUser()
				setUser(userData)
				setFormData({
					first_name: userData.first_name || "",
					last_name: userData.last_name || "",
					email: userData.email || ""
				})
			} catch (error) {
				console.error("Failed to fetch user", error)
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
		fetchPaymentMethods()
	}, [])

	const handleSave = async () => {
		try {
			setSaving(true)
			const updatedUser = await authApi.updateProfile({
				first_name: formData.first_name,
				last_name: formData.last_name,
			})
			setUser(updatedUser)
			toast({
				title: "Success",
				description: "Profile updated successfully.",
			})
		} catch (error) {
			console.error("Update failed", error)
			toast({
				title: "Error",
				description: "Failed to update profile.",
				variant: "destructive",
			})
		} finally {
			setSaving(false)
		}
	}

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData(prev => ({ ...prev, [id]: value }))
	}

	const handlePmChange = (e) => {
		const { id, value } = e.target
		setPmForm(prev => ({ ...prev, [id]: value }))
	}

	const handleAddPaymentMethod = async () => {
		if (!pmForm.name) {
			toast({ title: "Error", description: "Name is required.", variant: "destructive" })
			return
		}
		
		try {
			setSavingPM(true)
			await paymentMethodApi.create({
				name: pmForm.provider ? `${pmForm.provider} ${pmForm.name}` : pmForm.name,
				type: paymentType,
				last_four: paymentType === "bank_account" ? (pmForm.account_number || "0000").slice(-4) : (pmForm.card_last_four || "0000").slice(-4),
				specific_type: paymentType === "bank_account" ? "Checking" : "Credit",
				expiry_date: paymentType === "card" ? pmForm.expiry_date : null,
			})
			toast({ title: "Success", description: "Payment method added successfully." })
			setIsDialogOpen(false)
			setPmForm({ name: "", provider: "", account_number: "", card_last_four: "", expiry_date: "" })
			fetchPaymentMethods()
		} catch (error) {
			console.error("Failed to add payment method", error)
			toast({ title: "Error", description: "Failed to add payment method.", variant: "destructive" })
		} finally {
			setSavingPM(false)
		}
	}

	const handleDeletePaymentMethod = async (id) => {
		try {
			await paymentMethodApi.delete(id)
			toast({ title: "Success", description: "Payment method removed." })
			fetchPaymentMethods()
		} catch (error) {
			console.error("Delete failed", error)
			toast({ title: "Error", description: "Failed to remove payment method.", variant: "destructive" })
		}
	}

	if (loading) {
		return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
	}

	return (
		<Tabs defaultValue="profile" className="w-full">
			<TabsList className="flex flex-wrap h-auto w-full mb-4">
				<TabsTrigger value="profile" className="flex-1 h-9 text-xs sm:text-sm md:text-base">
					Profile
				</TabsTrigger>
				<TabsTrigger value="bank-accounts-cards" className="flex-1 h-9 text-xs sm:text-sm md:text-base">
					Bank Accounts & Cards
				</TabsTrigger>
			</TabsList>

			<TabsContent value="profile" className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Account Information</h3>
					<p className="text-sm text-muted-foreground">Update your account details and personal information.</p>
				</div>
				<Separator />
				<div className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first_name">First Name</Label>
							<Input id="first_name" value={formData.first_name} onChange={handleChange} />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last_name">Last Name</Label>
							<Input id="last_name" value={formData.last_name} onChange={handleChange} />
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" value={formData.email} disabled />
						<p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
					</div>
					<Button onClick={handleSave} disabled={saving}>
						{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
						Save Changes
					</Button>
				</div>
				<Separator />
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-medium">Delete Account</h3>
						<p className="text-sm text-muted-foreground">Permanently delete your account and all of your data.</p>
					</div>
					<Button variant="destructive">Delete Account</Button>
				</div>
			</TabsContent>

			<TabsContent value="bank-accounts-cards" className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-lg font-medium">Payment Methods</h3>
						<p className="text-sm text-muted-foreground">Manage your bank accounts and cards.</p>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="flex items-center gap-2 w-full sm:w-auto">
								<PlusCircle className="h-4 w-4" />
								Add New
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Add Payment Method</DialogTitle>
								<DialogDescription>Add a new bank account or card to your wallet.</DialogDescription>
							</DialogHeader>

							<div className="py-4 space-y-4">
								<RadioGroup
									defaultValue="card"
									value={paymentType}
									onValueChange={setPaymentType}
									className="flex flex-col sm:flex-row gap-4 mb-4"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="card" id="card" />
										<Label htmlFor="card" className="flex items-center gap-2">
											<CreditCard className="h-4 w-4" /> Card
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="bank_account" id="bank" />
										<Label htmlFor="bank" className="flex items-center gap-2">
											<Building className="h-4 w-4" /> Bank Account
										</Label>
									</div>
								</RadioGroup>

								<div className="space-y-4">
									<div className="grid gap-2">
										<Label htmlFor="name">Name / Label</Label>
										<Input id="name" value={pmForm.name} onChange={handlePmChange} placeholder="e.g. My Checking Account" />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="provider">Provider / Bank Name</Label>
										<Input id="provider" value={pmForm.provider} onChange={handlePmChange} placeholder="e.g. Chase" />
									</div>
								</div>

								{paymentType === "card" ? (
									<div className="space-y-4 pt-4">
										<div className="grid gap-2">
											<Label htmlFor="card_last_four">Last 4 Digits</Label>
											<Input id="card_last_four" value={pmForm.card_last_four} onChange={handlePmChange} placeholder="1234" maxLength={4} />
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="expiry_date">Expiry Date</Label>
												<Input id="expiry_date" value={pmForm.expiry_date} onChange={handlePmChange} placeholder="MM/YY" />
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-4 pt-4">
										<div className="grid gap-2">
											<Label htmlFor="account_number">Account Number / Last 4</Label>
											<Input id="account_number" value={pmForm.account_number} onChange={handlePmChange} placeholder="e.g. 6789" />
										</div>
									</div>
								)}
							</div>

							<DialogFooter className="flex-col sm:flex-row gap-2">
								<Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
									Cancel
								</Button>
								<Button onClick={handleAddPaymentMethod} disabled={savingPM} className="w-full sm:w-auto">
									{savingPM && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Add {paymentType === "card" ? "Card" : "Bank Account"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				<Separator />

				<div className="space-y-6">
					{fetchingPM ? (
						<div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
					) : (
						<>
							<div>
								<h4 className="text-md font-medium mb-4">Bank Accounts</h4>
								{paymentMethods.filter(pm => pm.type === "bank_account").length > 0 ? (
									<div className="space-y-3">
										{paymentMethods.filter(pm => pm.type === "bank_account").map((account) => (
											<div key={account.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
												<div className="flex items-center gap-3 mb-2 sm:mb-0">
													<Building className="h-8 w-8 text-muted-foreground" />
													<div>
														<p className="font-medium">{account.name}</p>
														<p className="text-sm text-muted-foreground">
															{account.specific_type} {account.last_four ? `• **${account.last_four}` : ''}
														</p>
													</div>
												</div>
												<Button variant="ghost" size="icon" onClick={() => handleDeletePaymentMethod(account.id)} className="ml-auto">
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">No bank accounts added yet.</p>
								)}
							</div>

							<div>
								<h4 className="text-md font-medium mb-4">Cards</h4>
								{paymentMethods.filter(pm => pm.type === "card").length > 0 ? (
									<div className="space-y-3">
										{paymentMethods.filter(pm => pm.type === "card").map((card) => (
											<div key={card.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
												<div className="flex items-center gap-3 mb-2 sm:mb-0">
													<CreditCard className="h-8 w-8 text-muted-foreground" />
													<div>
														<p className="font-medium">{card.name}</p>
														<p className="text-sm text-muted-foreground">
															{card.specific_type} {card.last_four ? `• **** ${card.last_four}` : ''} {card.expiry_date ? `• Expires ${card.expiry_date}` : ''}
														</p>
													</div>
												</div>
												<Button variant="ghost" size="icon" onClick={() => handleDeletePaymentMethod(card.id)} className="ml-auto">
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">No cards added yet.</p>
								)}
							</div>
						</>
					)}
				</div>
			</TabsContent>
</Tabs>
	)
}
