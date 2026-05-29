"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function GoalContributionForm({ goal, onSubmit, onCancel }) {
  const [date, setDate] = useState(new Date())
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("")
  const [notes, setNotes] = useState("")
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")

    // Form validation
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setFormError("Please enter a valid contribution amount")
      return
    }

    // Create contribution object
    const contribution = {
      date: date.toISOString().split("T")[0],
      amount: Number.parseFloat(amount),
      source: source || "Manual contribution",
      notes: notes || "",
    }

    // Show success message
    setSuccess(true)

    // Submit after a short delay to show success message
    setTimeout(() => {
      onSubmit(contribution)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Contribution</CardTitle>
        <CardDescription>Record a new contribution to your {goal.name} goal</CardDescription>
      </CardHeader>
      <CardContent>
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Contribution Added!</h3>
            <p className="text-muted-foreground mb-4">
              Your contribution of ${Number.parseFloat(amount).toLocaleString()} has been added to your goal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Contribution Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contribution Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Bonus">Bonus</SelectItem>
                  <SelectItem value="Gift">Gift</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Side Income">Side Income</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details about this contribution"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {success ? (
          <Button className="w-full" onClick={onCancel}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Contribution</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
