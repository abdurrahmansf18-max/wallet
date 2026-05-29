import { Home, Wallet, PieChart, Receipt, Target, BarChart3, Settings, BookOpen } from "lucide-react"

// Centralized navigation items configuration
const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Budget", href: "/budget", icon: PieChart },
  { name: "Bills", href: "/bills", icon: Receipt },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Docs", href: "/docs", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default navItems
