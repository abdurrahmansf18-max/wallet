"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

export function BillDialog({ open, onOpenChange, onSubmit, success }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    due_date: "",
    payee: "",
    category: "",
    frequency: "once", // "no" can map to "once" in backend Model Period
  })

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id === "due-date" ? "due_date" : id.replace("bill-", "")]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Process "frequency" -> 'no' mapped to 'once'
    const finalData = { ...formData }
    if (finalData.frequency === "no") finalData.frequency = "once"
    if (finalData.name) finalData.name = finalData.name; // ID mapped to name

    finalData.amount = parseFloat(finalData.amount)
    
    onSubmit(e, finalData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-center">Bill Added Successfully!</h3>
            <p className="text-center text-muted-foreground mt-2">
              Your new bill has been added to your upcoming bills.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add New Bill</DialogTitle>
              <DialogDescription>Enter the details of your bill. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Bill Name
                  </Label>
                  <Input id="name" placeholder="e.g. Electricity Bill" className="col-span-3" required 
                    value={formData.name} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="relative col-span-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      step="0.01"
                      min="0.01"
                      required
                      value={formData.amount} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="due-date" className="text-right">
                    Due Date
                  </Label>
                  <Input id="due-date" type="date" className="col-span-3" required 
                    value={formData.due_date} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payee" className="text-right">
                    Payee
                  </Label>
                  <Input id="payee" placeholder="e.g. Electric Company" className="col-span-3" required 
                    value={formData.payee} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select required value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recurring" className="text-right">
                    Recurring
                  </Label>
                  <Select value={formData.frequency} onValueChange={(val) => handleSelectChange('frequency', val)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">No</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Bill</Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
