"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function GoalProjection({ goal, formatDate }) {
  const [monthlyContribution, setMonthlyContribution] = useState(100)
  const [interestRate, setInterestRate] = useState(0)

  // Calculate months until deadline
  const calculateMonthsUntilDeadline = () => {
    const today = new Date()
    const deadline = new Date(goal.deadline)

    return (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth())
  }

  // Generate projection data
  const generateProjectionData = () => {
    const monthsLeft = calculateMonthsUntilDeadline()
    if (monthsLeft <= 0) return []

    const data = []
    let currentAmount = goal.currentAmount
    const today = new Date()

    for (let i = 0; i <= monthsLeft; i++) {
      const date = new Date(today)
      date.setMonth(date.getMonth() + i)

      // Add monthly contribution
      currentAmount += monthlyContribution

      // Add interest if applicable
      if (interestRate > 0) {
        const monthlyInterestRate = interestRate / 100 / 12
        currentAmount += currentAmount * monthlyInterestRate
      }

      data.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        amount: currentAmount,
        target: goal.targetAmount,
      })

      // Stop if we've reached the target
      if (currentAmount >= goal.targetAmount) {
        break
      }
    }

    return data
  }

  const projectionData = generateProjectionData()

  // Calculate when goal will be reached
  const calculateGoalCompletionDate = () => {
    if (goal.currentAmount >= goal.targetAmount) return "Goal already completed"
    if (monthlyContribution <= 0) return "Never (need contributions)"

    const amountNeeded = goal.targetAmount - goal.currentAmount
    const monthsNeeded = Math.ceil(amountNeeded / monthlyContribution)

    const completionDate = new Date()
    completionDate.setMonth(completionDate.getMonth() + monthsNeeded)

    return formatDate(completionDate.toISOString().split("T")[0])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Projection</CardTitle>
        <CardDescription>See how different contribution amounts affect your timeline</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Contribution</Label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="10"
                      className="pl-8"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    />
                  </div>
                  <Slider
                    value={[monthlyContribution]}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setMonthlyContribution(value[0])}
                    className="w-1/2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interest Rate (% APY)</Label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      className="pl-8"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>
                  <Slider
                    value={[interestRate]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="w-1/2"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg border space-y-2">
                <h3 className="text-sm font-medium">Projection Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Current Amount:</div>
                  <div className="text-sm font-medium">${goal.currentAmount.toLocaleString()}</div>

                  <div className="text-sm text-muted-foreground">Target Amount:</div>
                  <div className="text-sm font-medium">${goal.targetAmount.toLocaleString()}</div>

                  <div className="text-sm text-muted-foreground">Amount Needed:</div>
                  <div className="text-sm font-medium">
                    ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                  </div>

                  <div className="text-sm text-muted-foreground">Estimated Completion:</div>
                  <div className="text-sm font-medium">{calculateGoalCompletionDate()}</div>
                </div>
              </div>
            </div>

            <div className="h-[300px]">
              {projectionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      name="Projected Amount"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#82ca9d"
                      name="Target"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No projection data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
