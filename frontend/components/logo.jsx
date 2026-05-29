import { DollarSign } from "lucide-react"
import Link from "next/link"

export function Logo({ className, size = "default", showText = true }) {
	const logoSizes = {
		small: "h-5 w-5",
		default: "h-8 w-8",
		large: "h-10 w-10",
	}

	const logoSize = logoSizes[size] || logoSizes.default

	return (
		<Link href="/" className={`flex items-center gap-2 ${className || ""}`}>
			<div className={`relative ${logoSize} flex items-center justify-center`}>
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-md shadow-sm"></div>
				<DollarSign className="relative text-white w-3/4 h-3/4" strokeWidth={2.5} />
			</div>
			{showText && (
				<span className="font-semibold text-xl tracking-tight">
					<span className="text-emerald-600">Ex</span>
					<span>enzo</span>
				</span>
			)}
		</Link>
	)
}
