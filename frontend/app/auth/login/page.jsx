"use client"

import { Logo } from "@/components/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api"
import Cookies from "js-cookie"

function LoginForm() {
	const router = useRouter()
    const searchParams = useSearchParams()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState(searchParams.get("registered") ? "Registration successful! Please sign in." : "")

	useEffect(() => {
		// Eğer kullanıcı daha önce beni hatırla dediyse emaili otomatik doldur
		const savedEmail = localStorage.getItem("rememberedEmail")
		if (savedEmail) {
			setEmail(savedEmail)
			setRememberMe(true)
		}
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
        setSuccessMessage("")
		setIsLoading(true)

		try {
			// API call to login (email and password as arguments matching api.js signature)
            // Note: login endpoint returns simple JSON with access_token.
			const response = await authApi.login(email, password)
            
            if (response.access_token) {
                // Store token in cookie
                const cookieOptions = rememberMe ? { expires: 30 } : {};
                Cookies.set('token', response.access_token, cookieOptions);
                
				if (rememberMe) {
					localStorage.setItem("rememberedEmail", email)
				} else {
					localStorage.removeItem("rememberedEmail")
				}

                // Redirect to dashboard
                router.push("/")
            } else {
                 setError("Login failed. No access token received.")
            }

		} catch (err) {
            console.error("Login error:", err)
			setError(err.response?.data?.detail || "Invalid email or password. Please try again.")
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
					<h2 className="mt-4 text-3xl font-semibold">Welcome back</h2>
					<p className="mt-2 text-muted-foreground">Sign in to your Expenzo account</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>Enter your credentials to access your account</CardDescription>
					</CardHeader>
					<CardContent>
                        {successMessage && (
                            <Alert className="mb-4 border-green-500 text-green-500">
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										className="pl-10"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
										Forgot password?
									</Link>
								</div>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										className="pl-10 pr-10"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
										tabIndex={-1}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox 
									id="remember" 
									checked={rememberMe} 
									onCheckedChange={setRememberMe} 
								/>
								<Label htmlFor="remember" className="text-sm cursor-pointer">
									Remember me for 30 days
								</Label>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							Don't have an account?{" "}
							<Link href="/auth/register" className="text-primary hover:underline">
								Sign up
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-muted/40">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
