"use client"

import { Logo } from "@/components/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
	const router = useRouter()
	const [formData, setFormData] = useState({
		first_name: "", // Backend modeline uygun isimler
		last_name: "",
		email: "",
		password: "",
		confirm_password: "", // Backend modeline uygun
	})
	const [agreeTerms, setAgreeTerms] = useState(false)
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}))
	}

	const validatePassword = (password) => {
		// at least 8 chars, max 30 chars, number, upper, lower, special
		const hasNumber = /\d/.test(password)
		const hasUpper = /[A-Z]/.test(password)
		const hasLower = /[a-z]/.test(password)
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
		const isValidLength = password.length >= 8 && password.length <= 30
		return isValidLength && hasNumber && hasUpper && hasLower && hasSpecial
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		const { password, confirm_password, email, first_name, last_name } = formData

		// Validate passwords match
		if (password !== confirm_password) {
			setError("Passwords do not match")
			return
		}

		if (first_name.length < 3 || first_name.length > 30) {
			setError("First name must be between 3 and 30 characters.")
			return
		}

		if (!validatePassword(password)) {
			setError("Password must be 8-30 characters and include number, uppercase, lowercase, special char.")
			return
		}

		if (!agreeTerms) {
			setError("You must agree to the terms and conditions")
			return
		}

		setIsLoading(true)

		try {
			// API Çağrısı
			await authApi.register({
				first_name,
				last_name,
				email,
				password,
				confirm_password
			})
			
			// Başarılı ise login sayfasına yönlendir
			router.push("/auth/login?registered=true")
		} catch (err) {
			// Backend'den gelen hata mesajını göster
			const errorMessage = err.response?.data?.detail || "An error occurred during registration."
			setError(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="flex justify-center">
						<Logo size="large" showText={false} />
					</div>
					<h2 className="mt-4 text-3xl font-semibold">Create an account</h2>
					<p className="mt-2 text-muted-foreground">Sign up for Expenzo to manage your finances</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
						<CardDescription>Enter your information to create an account</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="first_name">First Name</Label>
									<div className="relative">
										<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="first_name"
											placeholder="John"
											className="pl-10"
											value={formData.first_name}
											onChange={handleChange}
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="last_name">Last Name</Label>
									<Input id="last_name" placeholder="Doe" value={formData.last_name} onChange={handleChange} required />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										className="pl-10"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type="password"
										placeholder="Create a password"
										className="pl-10"
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirm_password">Confirm Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="confirm_password"
										type="password"
										placeholder="Confirm your password"
										className="pl-10"
										value={formData.confirm_password}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="flex items-start space-x-2">
								{/* Checkbox for terms */}
								<Checkbox id="terms" checked={agreeTerms} onCheckedChange={setAgreeTerms} className="mt-1" />
								<Label htmlFor="terms" className="text-sm">
									I agree to the{" "}
									<Link href="#" className="text-primary hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link href="#" className="text-primary hover:underline">
										Privacy Policy
									</Link>
								</Label>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-primary hover:underline">
								Sign in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
