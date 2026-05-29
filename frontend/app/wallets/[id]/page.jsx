"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { TransactionHistoryCard } from "@/components/wallets/transaction-history-card"
import { WalletActionsCard } from "@/components/wallets/wallet-actions-card"
import { WalletDetailsCard } from "@/components/wallets/wallet-details-card"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { walletApi } from "@/lib/api"
import { useParams } from "next/navigation"

export default function WalletPage({ params }) {
	const { id } = useParams() || params // Fallback for some Next.js versions
	const [wallet, setWallet] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	const fetchWallet = async () => {
		try {
			setLoading(true)
			const data = await walletApi.getOne(id)
			setWallet(data)
		} catch (err) {
			console.error(err)
			setError("Failed to load wallet details")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (id) {
			fetchWallet()
		}
	}, [id])

	if (loading) {
		return (
			<Layout>
				<div className="flex items-center justify-center h-[50vh]">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			</Layout>
		)
	}

	if (error || !wallet) {
		return (
			<Layout>
				<div className="p-8 text-center text-red-500">
					{error || "Wallet not found"}
					<div className="mt-4">
						<Button asChild variant="outline">
							<Link href="/">Go Back</Link>
						</Button>
					</div>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<div>
				<div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
					<Button variant="outline" size="icon" asChild>
						<Link href="/">
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Back</span>
						</Link>
					</Button>
					<h1 className="text-xl sm:text-2xl font-semibold">Wallet Details</h1>
				</div>
				<div className="grid gap-4 sm:gap-6">
					<div className="grid gap-4 sm:gap-6  lg:grid-cols-1">
						<WalletDetailsCard wallet={wallet} onUpdate={fetchWallet} />
						{/* Callback to refresh wallet data after an action */}
						<WalletActionsCard wallet={wallet} onUpdate={fetchWallet} />
					</div>
					<TransactionHistoryCard walletId={wallet.id} key={wallet.balance} />
				</div>
			</div>
		</Layout>
	)
}
