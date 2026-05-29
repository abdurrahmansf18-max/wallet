import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IntroductionPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight">Introduction to Expenzo</h1>
				<p className="text-muted-foreground">
					Learn about Expenzo, its features, and how it can help you manage your personal finances.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-2xl font-semibold tracking-tight">What is Expenzo?</h2>
				<p>
					Expenzo is a comprehensive personal finance dashboard that helps you manage your money, track expenses,
					create budgets, and achieve your financial goals. With an intuitive interface and powerful features,
					Expenzo makes it easy to take control of your finances.
				</p>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Key Features</h2>
				<ul className="list-disc pl-6 space-y-2">
					<li>
						<strong>Wallet Management:</strong> Create and manage multiple wallets to track different accounts and
						financial assets.
					</li>
					<li>
						<strong>Budget Tracking:</strong> Set up budgets for different categories and track your spending against
						them.
					</li>
					<li>
						<strong>Bill Payments:</strong> Keep track of upcoming bills, set reminders, and never miss a payment.
					</li>
					<li>
						<strong>Savings Goals:</strong> Set financial goals and track your progress towards achieving them.
					</li>
					<li>
						<strong>Financial Reports:</strong> Generate detailed reports to analyze your spending habits and financial
						health.
					</li>
				</ul>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Why Choose Expenzo?</h2>
				<p>
					Expenzo stands out from other personal finance tools with its user-friendly interface, comprehensive
					feature set, and focus on security. Whether you're looking to get out of debt, save for a major purchase, or
					simply gain better control over your finances, Expenzo provides the tools you need to succeed.
				</p>

				<div className="flex gap-4 pt-4">
					<Button asChild>
						<Link href="/docs/installation">Next: Installation</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/docs">Back to Documentation</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
