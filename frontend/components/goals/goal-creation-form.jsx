"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Wallet, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function GoalCreationForm({ wallets, onSubmit, isEditing = false, existingGoal = null }) {
  const [date, setDate] = useState(existingGoal?.deadline ? new Date(existingGoal.deadline) : new Date())
  const [targetAmount, setTargetAmount] = useState(existingGoal?.targetAmount || 1000)
  const [initialAmount, setInitialAmount] = useState(existingGoal?.currentAmount || 0)
  const [enableReminders, setEnableReminders] = useState(existingGoal?.reminders || false)
  const [priority, setPriority] = useState(existingGoal?.priority || "Medium")
  const [formError, setFormError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")

    // Form validation
    const name = e.target.goalName.value
    const category = e.target.category.value
    const walletId = e.target.wallet.value

    if (!name || !category || !walletId) {
      setFormError("Please fill in all required fields")
      return
    }

    if (targetAmount <= 0) {
      setFormError("Target amount must be greater than zero")
      return
    }

    if (initialAmount < 0 || initialAmount > targetAmount) {
      setFormError("Initial amount must be between 0 and the target amount")
      return
    }

    // Calculate progress percentage
    const progress = (initialAmount / targetAmount) * 100

    // Create goal object
    const goal = {
      id: existingGoal?.id || `g${Date.now()}`,
      name,
      targetAmount,
      currentAmount: initialAmount,
      progress,
      deadline: date.toISOString().split("T")[0],
      status: initialAmount >= targetAmount ? "completed" : progress > 0 ? "on-track" : "not-started",
      category,
      priority,
      walletId,
      walletName: wallets.find((w) => w.id === walletId)?.name || "",
      notes: e.target.notes.value,
      reminders: enableReminders,
      contributions: existingGoal?.contributions || [],
    }

    // If initial amount is greater than 0, add it as a contribution
    if (initialAmount > 0 && !isEditing) {
      goal.contributions.push({
        date: new Date().toISOString().split("T")[0],
        amount: initialAmount,
      })
    }

    onSubmit(goal)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Goal" : "Create New Goal"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your financial goal details"
              : "Set up a new financial goal to track your savings progress"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="goalName">Goal Name *</Label>
              <Input
                id="goalName"
                name="goalName"
                placeholder="e.g. Emergency Fund"
                defaultValue={existingGoal?.name || ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={existingGoal?.category || ""} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Major Purchase">Major Purchase</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Retirement">Retirement</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Target Amount *</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    className="pl-8"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                  />
                </div>
                <Slider
                  value={[targetAmount]}
                  min={100}
                  max={100000}
                  step={100}
                  onValueChange={(value) => setTargetAmount(value[0])}
                  className="w-1/2"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Initial Contribution {isEditing ? "(Current Amount)" : ""}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  max={targetAmount}
                  className="pl-8"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? "This is the current amount saved towards this goal"
                  : "Optional: Add an initial contribution to your goal"}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Target Date *</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="wallet">Link to Wallet *</Label>
              <Select name="wallet" defaultValue={existingGoal?.walletId || ""} required>
                <SelectTrigger id="wallet" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} (${wallet.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Priority</Label>
              <RadioGroup defaultValue={priority} onValueChange={setPriority} className="flex space-x-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">
                    Low
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="high" />
                  <Label htmlFor="high" className="cursor-pointer">
                    High
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional details about your goal"
                defaultValue={existingGoal?.notes || ""}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="reminders" checked={enableReminders} onCheckedChange={setEnableReminders} />
              <Label htmlFor="reminders" className="cursor-pointer">
                Enable contribution reminders
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Goal" : "Create Goal"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
