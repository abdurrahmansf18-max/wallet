"use client"

import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Layout } from "@/components/layout"
import { FinancialGoals } from "@/components/wallets/financial-goals"
import { WalletByCurrency } from "@/components/wallets/wallet-by-currency"
import { WalletCard } from "@/components/wallets/wallet-card"
import { WalletSummaryStats } from "@/components/wallets/wallet-summary-stats"
import { WalletsHeader } from "@/components/wallets/wallets-header"
import { useEffect, useState } from "react"
import { walletApi, transactionApi } from "@/lib/api"

export default function WalletsPage() {
	const [wallets, setWallets] = useState([])
	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState({
		totalBalance: 0,
		income: 0,
		expenses: 0,
		savingsRate: 0,
		sparklines: {
			balance: [0, 0, 0, 0, 0, 0, 0],
			income: [0, 0, 0, 0, 0, 0, 0],
			expenses: [0, 0, 0, 0, 0, 0, 0],
			savings: [0, 0, 0, 0, 0, 0, 0]
		},
		trends: {
			balance: { value: "+0%", isUp: true },
			income: { value: "+0%", isUp: true },
			expenses: { value: "+0%", isUp: false },
			savings: { value: "+0%", isUp: true }
		}
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [walletsData, transactionsData] = await Promise.all([
					walletApi.getAll(),
					transactionApi.getAll()
				])
				
				setWallets(walletsData)

				// Toplam Bakiye (Total Balance)
				const totalBalance = walletsData.reduce((sum, w) => sum + Number(w.balance || 0), 0)

				let income = 0
				let expenses = 0
				let incomeLastMonth = 0
				let expensesLastMonth = 0
				
				// Gerçek Veriyi 7 Günlük Periyotta Analiz Et (Sparklines için)
				const today = new Date()
				const lastMonthDate = new Date()
				lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
				
				const dailyIncome = Array(7).fill(0)
				const dailyExpenses = Array(7).fill(0)
				const dailyBalance = Array(7).fill(0)
				
				if (Array.isArray(transactionsData)) {
					transactionsData.forEach(t => {
						const date = new Date(t.date || t.created_at)
						const amount = Number(t.amount)
						
						// Bu ayın verileri (Ana istatistikler için):
						if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
							if (t.type === 'income') income += amount
							if (t.type === 'expense') expenses += amount
						}
						
						// Geçen ayın verileri (Oransal hesaplamalar için):
						if (date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear()) {
							if (t.type === 'income') incomeLastMonth += amount
							if (t.type === 'expense') expensesLastMonth += amount
						}

						// Son 7 günün istatistikleri (Sparklines için)
						const diffTime = Math.abs(today - date)
						const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
						
						if (diffDays < 7) {
							const index = 6 - diffDays // 6 is today, 0 is 6 days ago
							if (t.type === 'income') dailyIncome[index] += amount
							if (t.type === 'expense') dailyExpenses[index] += amount
						}
					})
				}

				// Generate synthetic history for Balance & Savings specifically for the trend chart
				let currentSimulatedBalance = totalBalance
				for (let i = 6; i >= 0; i--) {
					dailyBalance[i] = currentSimulatedBalance
					// reverse engineer yesterday's balance
					currentSimulatedBalance = currentSimulatedBalance - dailyIncome[i] + dailyExpenses[i]
				}

				// Tasarruf Oranı (Savings Rate)
				const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
				const savingsRateLastMonth = incomeLastMonth > 0 ? ((incomeLastMonth - expensesLastMonth) / incomeLastMonth) * 100 : 0
				
				// Gerçek oransal değişimleri hesaplama formülü
				const calculateTrend = (current, previous) => {
					if (previous === 0 && current === 0) return "0.0%"
					if (previous === 0) return current > 0 ? "+100.0%" : "-100.0%"
					const percent = ((current - previous) / Math.abs(previous)) * 100
					return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`
				}

				const incomeTrend = calculateTrend(income, incomeLastMonth)
				const expensesTrend = calculateTrend(expenses, expensesLastMonth)
				// Bakiye için son 7 günün başı ile bugünü karşılaştırıyoruz
				const balanceTrend = calculateTrend(dailyBalance[6], dailyBalance[0])
				const savingsTrend = calculateTrend(savingsRate, savingsRateLastMonth)

				setStats({ 
					totalBalance, 
					income, 
					expenses, 
					savingsRate: Math.max(0, savingsRate).toFixed(1),
					sparklines: {
						balance: dailyBalance,
						income: dailyIncome,
						expenses: dailyExpenses,
						savings: dailyIncome.map((inc, i) => inc > 0 ? ((inc - dailyExpenses[i]) / inc) * 100 : 0)
					},
					trends: {
						balance: { value: balanceTrend, isUp: dailyBalance[6] >= dailyBalance[0] },
						income: { value: incomeTrend, isUp: income >= incomeLastMonth },
						// Gider artışı genellikle "olumsuz" kabul edilir, bu yüzden expenses düştüyse isUp = true (yeşil renk) yansıttık
						expenses: { value: expensesTrend, isUp: expenses <= expensesLastMonth }, 
						savings: { value: savingsTrend, isUp: savingsRate >= savingsRateLastMonth }
					}
				})

			} catch (error) {
				console.error("Failed to fetch wallet data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<Layout>
			<div>
				<WalletsHeader />

				{/* Summary Statistics */}
				<WalletSummaryStats 
					className="mb-6" 
					totalBalance={stats.totalBalance}
					income={stats.income}
					expenses={stats.expenses}
					savingsRate={stats.savingsRate}
					sparklines={stats.sparklines}
					trends={stats.trends}
				/>

				<div className="grid gap-6 xl:grid-cols-3">
					{/* Wallets Section - 2/3 width */}
					<div className="xl:col-span-2 space-y-6">
						<div>
							<h2 className="mb-4 text-xl font-semibold">Your Wallets</h2>
							<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
								{loading ? (
									<p className="text-muted-foreground col-span-2">Loading wallets...</p>
								) : wallets.length > 0 ? (
									wallets.map((wallet) => (
										<WalletCard key={wallet.id} wallet={wallet} />
									))
								) : (
									<p className="text-muted-foreground col-span-2">No wallets found. Create one to get started!</p>
								)}
							</div>
						</div>

						<RecentTransactions />
					</div>

					{/* Right Sidebar - 1/3 width */}
					<div className="space-y-6">
						<FinancialGoals />
						<WalletByCurrency />
					</div>
				</div>
			</div>
		</Layout>
	)
}
