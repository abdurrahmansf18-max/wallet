import { Layout } from "@/components/layout"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsTabs } from "@/components/reports/reports-tabs"

export const metadata = {
	title: "Financial Reports & Analytics",
	description: "Analyze your financial data and track your progress over time",
}

export default function ReportsPage() {
	return (
		<Layout>
			{/* <ReportsHeader /> */}
			<ReportsTabs />
		</Layout>
	)
}
