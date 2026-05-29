import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { WalletList } from "@/components/dashboard/wallet-list"
import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { Layout } from "@/components/layout"

export default function HomePage() {
	return (
		<Layout>
			<div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Dashboard</h1>
				<StatsCards />
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
					<div className="md:col-span-2 space-y-4 sm:space-y-6">
						<WalletOverview />
						<RecentTransactions />
					</div>
					<div className="space-y-4 sm:space-y-6">
						<WalletList />
						<QuickActions />
					</div>
				</div>
			</div>
		</Layout>
	)
}
