import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
export const metadata = {
	title: "Expenzo - Personal Finance Dashboard",
	description: "Manage your finances with ease using Expenzo.",
}
const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	// variable: "--Poppins-font-family",
	display: 'swap',
})
export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							try {
								let color = localStorage.getItem('primaryColor') || 'teal';
								document.documentElement.style.setProperty('--primary', 'var(--' + color + ')');
								document.documentElement.style.setProperty('--primary-foreground', 'var(--' + color + '-foreground)');
							} catch (e) {}
						`,
					}}
				/>
			</head>
			<body className={`${poppins.className}`}>
				<ThemeProvider>{children}<Toaster /></ThemeProvider>
			</body>
		</html>
	)
}
