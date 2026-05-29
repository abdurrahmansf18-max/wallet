"use client"
import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { walletApi, transactionApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AddMoneyPage() {
const [wallets, setWallets] = useState([])
const [selectedWallet, setSelectedWallet] = useState("")
const [amount, setAmount] = useState("")
const [source, setSource] = useState("")
const [loading, setLoading] = useState(false)
const { toast } = useToast()
const router = useRouter()

useEffect(() => {
const fetchWallets = async () => {
try {
const res = await walletApi.getAll()
setWallets(res)
} catch (err) {}
}
fetchWallets()
}, [])

const handleAdd = async () => {
if (!selectedWallet || !amount) {
toast({ title: "Error", description: "Select wallet and amount", variant: "destructive" })
return
}

setLoading(true)
try {
await transactionApi.create({
amount: parseFloat(amount),
description: source || "Deposit",
type: "income",
category: "Income",
wallet_id: selectedWallet
})
toast({ title: "Success", description: "Money added successfully" })
router.push('/')
} catch (err) {
toast({ title: "Error", description: "Failed to add money", variant: "destructive" })
} finally {
setLoading(false)
}
}

return (
<Layout>
<div className="mb-4 sm:mb-6 flex items-center gap-3">
<Button variant="outline" size="icon" asChild><Link href="/"><ChevronLeft className="h-4 w-4" /></Link></Button>
<h1 className="text-xl sm:text-2xl font-semibold">Add Money (Deposit)</h1>
</div>
<div className="grid gap-6 max-w-2xl">
<Card>
<CardHeader><CardTitle>Deposit to Wallet</CardTitle></CardHeader>
<CardContent className="space-y-4">
<div className="space-y-2">
<Label>Target Wallet</Label>
<Select value={selectedWallet} onValueChange={setSelectedWallet}>
<SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
<SelectContent>
{wallets.map(w => <SelectItem key={w.id} value={w.id}>{w.name} (${w.balance})</SelectItem>)}
</SelectContent>
</Select>
</div>
<div className="space-y-2">
<Label>Amount</Label>
<Input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
</div>
<div className="space-y-2">
<Label>Source / Notes</Label>
<Input value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Salary, ATM, etc." />
</div>
</CardContent>
<CardFooter className="flex justify-between">
<Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
<Button onClick={handleAdd} disabled={loading}>{loading ? "Processing..." : "Deposit"}</Button>
</CardFooter>
</Card>
</div>
</Layout>
)
}
