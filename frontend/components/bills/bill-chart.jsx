"use client"

import { useEffect, useState } from "react"
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts"

// Extended mock data for 12 months
const chartData = [
	{ month: "Jan", Utilities: 250, Housing: 1200, Communication: 75 },
	{ month: "Feb", Utilities: 230, Housing: 1200, Communication: 75 },
	{ month: "Mar", Utilities: 245, Housing: 1200, Communication: 75 },
	{ month: "Apr", Utilities: 260, Housing: 1200, Communication: 75 },
	{ month: "May", Utilities: 275, Housing: 1250, Communication: 80 },
	{ month: "Jun", Utilities: 290, Housing: 1250, Communication: 80 },
	{ month: "Jul", Utilities: 310, Housing: 1250, Communication: 80 },
	{ month: "Aug", Utilities: 325, Housing: 1250, Communication: 80 },
	{ month: "Sep", Utilities: 300, Housing: 1300, Communication: 85 },
	{ month: "Oct", Utilities: 280, Housing: 1300, Communication: 85 },
	{ month: "Nov", Utilities: 265, Housing: 1300, Communication: 85 },
	{ month: "Dec", Utilities: 285, Housing: 1300, Communication: 85 },
]

// Simplified data for mobile view (quarterly)
const mobileChartData = [
	{ month: "Q1", Utilities: 725, Housing: 3600, Communication: 225 },
	{ month: "Q2", Utilities: 825, Housing: 3700, Communication: 240 },
	{ month: "Q3", Utilities: 935, Housing: 3800, Communication: 245 },
	{ month: "Q4", Utilities: 830, Housing: 3900, Communication: 255 },
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, isMobile }) => {
	if (active && payload && payload.length) {
		return (
			<div className={`bg-white ${isMobile ? 'p-2' : 'p-4'} border border-gray-100 shadow-lg rounded-lg`}>
				<p className={`font-semibold text-gray-800 ${isMobile ? 'text-xs mb-1' : 'mb-2'}`}>{label}</p>
				<div className={`${isMobile ? 'space-y-1' : 'space-y-2'}`}>
					{payload.map((entry, index) => (
						<div key={`item-${index}`} className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
							<div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
							<span className="text-gray-600 font-medium">{entry.name}:</span>
							<span className="font-bold">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
									minimumFractionDigits: 0,
								}).format(entry.value)}
							</span>
						</div>
					))}
				</div>
			</div>
		)
	}
	return null
}

export function BillChart({ data }) {
	const [isMobile, setIsMobile] = useState(false)
	const [chartHeight, setChartHeight] = useState(350)

	// Check if screen is mobile size (iPhone SE is 375px)
	useEffect(() => {
		const checkIsMobile = () => {
			const isMobileView = window.innerWidth <= 375
			setIsMobile(isMobileView)
			setChartHeight(isMobileView ? 220 : 350)
		}

		// Initial check
		checkIsMobile()

		// Add event listener
		window.addEventListener("resize", checkIsMobile)

		// Cleanup
		return () => window.removeEventListener("resize", checkIsMobile)
	}, [])

	// Use provided data or fallback to mock data
	const chartDataToUse = data || (isMobile ? mobileChartData : chartData)

	// Currency formatter for axis
	const formatCurrency = (value) => {
		if (isMobile) {
			// Simplified format for mobile
			return value >= 1000 ? `$${value / 1000}k` : `$${value}`
		}

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(value)
	}

	return (
		<>
			<ResponsiveContainer width="100%" height={chartHeight}>
				<BarChart
					data={chartDataToUse}
					margin={{
						top: isMobile ? 10 : 20,
						right: isMobile ? 10 : 30,
						left: isMobile ? 0 : 20,
						bottom: isMobile ? 15 : 30,
					}}
					barGap={0}
					barSize={isMobile ? 12 : 20}
				>
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tickMargin={isMobile ? 8 : 12}
						tick={{ fill: '#64748b', fontSize: isMobile ? 10 : 12 }}
						interval={isMobile ? 0 : 'preserveStartEnd'}
					/>
					<YAxis
						tickFormatter={formatCurrency}
						tickLine={false}
						axisLine={false}
						tickMargin={isMobile ? 8 : 12}
						tick={{ fill: '#64748b', fontSize: isMobile ? 10 : 12 }}
						width={isMobile ? 40 : 80}
					/>
					<Tooltip
						content={<CustomTooltip isMobile={isMobile} />}
						cursor={{ opacity: 0.15 }}
					/>
					{!isMobile && (
						<Legend
							verticalAlign="top"
							height={50}
							iconType="circle"
							iconSize={isMobile ? 8 : 10}
							wrapperStyle={{ paddingBottom: isMobile ? "8px" : "15px" }}
							formatter={(value) => (
								<span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
									{value}
								</span>
							)}
						/>
					)}
					<Bar
						dataKey="Utilities"
						stackId="a"
						fill="#10B981" // Primary teal color
						name="Utilities"
						radius={[0, 0, 0, 0]}
					/>
					<Bar
						dataKey="Housing"
						stackId="a"
						fill="#0EA5E9" // Complementary blue
						name="Housing"
						radius={[0, 0, 0, 0]}
					/>
					<Bar
						dataKey="Communication"
						stackId="a"
						fill="#8B5CF6" // Complementary purple
						name="Communication"
						radius={[4, 4, 0, 0]} // Rounded top corners
					/>
				</BarChart>
			</ResponsiveContainer>

			{/* Mobile legend (shown below chart) */}
			{isMobile && (
				<div className="flex justify-center gap-3 mt-2 text-xs">
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-[#10B981]" />
						<span>Utilities</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
						<span>Housing</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
						<span>Comm.</span>
					</div>
				</div>
			)}
		</>
	)
}