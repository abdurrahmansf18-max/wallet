"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, LogOut, Mail, PencilLine, Phone, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await authApi.getCurrentUser()
				setUser(userData)
			} catch (error) {
				console.error("Failed to fetch user", error)
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	if (loading) {
		return (
			<Layout>
				<div className="flex h-screen items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<div className="container px-4 py-6 mx-auto max-w-5xl">
				<div className="mb-6 md:mb-8">
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
					<p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
				</div>

				{/* Mobile Tabs (visible on small screens only) */}
				<div className="md:hidden mb-6">
					<Tabs defaultValue="profile" className="w-full">
						<TabsList className="grid grid-cols-2 w-full">
							<TabsTrigger value="profile">Profile</TabsTrigger>
							<TabsTrigger value="settings">Settings</TabsTrigger>
						</TabsList>

						<TabsContent value="profile" className="mt-4 space-y-6">
							<ProfileCard user={user} setUser={setUser} />
							<PersonalInfoCard user={user} setUser={setUser} />
						</TabsContent>

						<TabsContent value="settings" className="mt-4 space-y-6">
							<FinancialPreferencesCard />
						</TabsContent>
					</Tabs>
				</div>

				{/* Desktop Layout (hidden on small screens) */}
				<div className="hidden md:grid md:grid-cols-[280px_1fr] md:gap-8">
					<div className="space-y-6">
						<ProfileCard user={user} setUser={setUser} />
					</div>

					<div className="space-y-6">
						<PersonalInfoCard user={user} setUser={setUser} />
						<FinancialPreferencesCard />
					</div>
				</div>
			</div>
		</Layout>
	)
}

function ProfileCard({ user, setUser }) {
	const [uploading, setUploading] = useState(false)
	const { toast } = useToast()

	const handleLogout = () => {
		authApi.logout()
	}

	const handleFileChange = async (e) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			setUploading(true)
			const updatedUser = await authApi.uploadAvatar(file)
			setUser(updatedUser)
			toast({
				title: "Success",
				description: "Profile picture updated.",
			})
		} catch (error) {
			console.error("Failed to upload avatar", error)
			toast({
				title: "Error",
				description: "Failed to upload profile picture.",
				variant: "destructive",
			})
		} finally {
			setUploading(false)
		}
	}

	return (
		<Card className="border-none shadow-md">
			<CardContent className="p-6">
				<div className="flex flex-col items-center space-y-4">
					<div className="relative group cursor-pointer">
						<label htmlFor="avatar-upload" className="block relative cursor-pointer">
							<div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background shadow-md bg-primary/10 flex items-center justify-center relative">
								{user?.profile_image_url ? (
									<img
										src={user.profile_image_url}
										className={`object-cover w-full h-full transition-transform group-hover:scale-105 ${uploading ? 'opacity-50' : ''}`}
										alt="Profile"
									/>
								) : (
									<span className={`text-4xl font-bold text-primary ${uploading ? 'opacity-50' : ''}`}>
										{user?.first_name?.charAt(0) || "U"}
									</span>
								)}
								{uploading && (
									<div className="absolute inset-0 flex items-center justify-center">
										<Loader2 className="h-6 w-6 animate-spin text-primary" />
									</div>
								)}
								<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									<PencilLine className="h-6 w-6 text-white" />
								</div>
							</div>
							<input 
								id="avatar-upload" 
								type="file" 
								accept="image/*" 
								className="hidden" 
								onChange={handleFileChange}
								disabled={uploading}
							/>
						</label>
					</div>

					<div className="text-center">
						<h2 className="text-xl font-bold">{user?.first_name} {user?.last_name || ""}</h2>
						<p className="text-sm text-muted-foreground flex items-center justify-center mt-1">
							<Mail className="h-3 w-3 mr-1" />
							{user?.email}
						</p>
					</div>

					<Separator />

					<div className="w-full space-y-3">
						<Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
							<LogOut className="mr-2 h-4 w-4" />
							Sign Out
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function PersonalInfoCard({ user, setUser }) {
	const { toast } = useToast()
	const [formData, setFormData] = useState({
		first_name: user?.first_name || "",
		last_name: user?.last_name || "",
		email: user?.email || ""
	})
	const [saving, setSaving] = useState(false)

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData(prev => ({ ...prev, [id]: value }))
	}

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

	return (
		<Card className="border-none shadow-md">
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription>Update your personal details.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="first_name">First Name</Label>
						<Input id="first_name" value={formData.first_name} onChange={handleChange} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="last_name">Last Name</Label>
						<Input id="last_name" value={formData.last_name} onChange={handleChange} />
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input id="email" type="email" value={formData.email} disabled className="pl-10" />
					</div>
					<p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
				<Button variant="outline" className="w-full sm:w-auto order-2 sm:order-1" onClick={() => setFormData({
					first_name: user?.first_name || "",
					last_name: user?.last_name || "",
					email: user?.email || ""
				})}>
					Cancel
				</Button>
				<Button className="w-full sm:w-auto order-1 sm:order-2" onClick={handleSave} disabled={saving}>
					{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	)
}

function FinancialPreferencesCard() {
	return (
		<Card className="border-none shadow-md">
			<CardHeader>
				<CardTitle>Financial Preferences</CardTitle>
				<CardDescription>Set your default financial preferences.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="default-currency">Default Currency</Label>
					<Select defaultValue="usd">
						<SelectTrigger id="default-currency">
							<SelectValue placeholder="Select currency" />
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
				<div className="space-y-2">
					<Label htmlFor="default-wallet">Default Wallet</Label>
					<Select defaultValue="w1">
						<SelectTrigger id="default-wallet">
							<SelectValue placeholder="Select wallet" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="w1">Main Savings</SelectItem>
							<SelectItem value="w2">Emergency Fund</SelectItem>
							<SelectItem value="w3">Travel Budget</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
				<Button variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
					Reset
				</Button>
				<Button className="w-full sm:w-auto order-1 sm:order-2">Save Preferences</Button>
			</CardFooter>
		</Card>
	)
}
