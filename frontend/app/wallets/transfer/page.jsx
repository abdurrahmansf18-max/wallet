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

export default function TransferPage() {
const [wallets, setWallets] = useState([])
const [fromWallet, setFromWallet] = useState("")
const [toWallet, setToWallet] = useState("")
const [amount, setAmount] = useState("")
const [notes, setNotes] = useState("")
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

const handleTransfer = async () => {
if (!fromWallet || !toWallet || !amount) {
toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
return
}
if (fromWallet === toWallet) {
toast({ title: "Error", description: "Cannot transfer to the same wallet", variant: "destructive" })
return
}

setLoading(true)
try {
await transactionApi.create({
amount: parseFloat(amount),
description: notes || "Wallet Transfer",
type: "transfer",
category: "Transfer",
wallet_id: fromWallet,
target_wallet_id: toWallet
})
toast({ title: "Success", description: "Transfer completed successfully" })
router.push('/')
} catch (err) {
toast({ title: "Error", description: err.response?.data?.detail || "Transfer failed", variant: "destructive" })
} finally {
setLoading(false)
}
}

return (
<Layout>
<div className="mb-4 sm:mb-6 flex items-center gap-3">
<Button variant="outline" size="icon" asChild><Link href="/"><ChevronLeft className="h-4 w-4" /></Link></Button>
<h1 className="text-xl sm:text-2xl font-semibold">Transfer Funds</h1>
</div>
<div className="grid gap-6 max-w-2xl">
<Card>
<CardHeader><CardTitle>Move Money</CardTitle></CardHeader>
<CardContent className="space-y-4">
<div className="space-y-2">
<Label>From Wallet</Label>
<Select value={fromWallet} onValueChange={setFromWallet}>
<SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
<SelectContent>
{wallets.map(w => <SelectItem key={w.id} value={w.id}>{w.name} (${w.balance})</SelectItem>)}
</SelectContent>
</Select>
</div>
<div className="space-y-2">
<Label>To Wallet</Label>
<Select value={toWallet} onValueChange={setToWallet}>
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
<Label>Notes</Label>
<Input value={notes} onChange={e => setNotes(e.target.value)} />
</div>
</CardContent>
<CardFooter className="flex justify-between">
<Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
<Button onClick={handleTransfer} disabled={loading}>{loading ? "Processing..." : "Transfer"}</Button>
</CardFooter>
</Card>
</div>
</Layout>
)
}
