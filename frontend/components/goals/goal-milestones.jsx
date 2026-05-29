import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, Trophy, Plus } from "lucide-react"

export function GoalMilestones({ goal, formatDate }) {
  // Generate milestones at 25%, 50%, 75%, and 100%
  const milestones = [
    {
      percentage: 25,
      amount: goal.targetAmount * 0.25,
      title: "First Quarter",
      description: "You've reached 25% of your goal!",
      reached: goal.progress >= 25,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      percentage: 50,
      amount: goal.targetAmount * 0.5,
      title: "Halfway There",
      description: "You're halfway to your goal!",
      reached: goal.progress >= 50,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      percentage: 75,
      amount: goal.targetAmount * 0.75,
      title: "Third Quarter",
      description: "Almost there! Just 25% more to go.",
      reached: goal.progress >= 75,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      percentage: 100,
      amount: goal.targetAmount,
      title: "Goal Complete",
      description: "Congratulations! You've reached your goal.",
      reached: goal.progress >= 100,
      icon: <Trophy className="h-5 w-5" />,
    },
  ]

  // Add custom milestones if needed
  const customMilestones = []

  // Combine all milestones and sort by percentage
  const allMilestones = [...milestones, ...customMilestones].sort((a, b) => a.percentage - b.percentage)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Goal Milestones</CardTitle>
            <CardDescription>Track your progress through key milestones</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Custom
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-muted" />

          <div className="space-y-6">
            {allMilestones.map((milestone, index) => (
              <div key={index} className="flex items-start relative">
                <div
                  className={`z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    milestone.reached
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/50 border-muted text-muted-foreground"
                  }`}
                >
                  {milestone.reached ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">{milestone.title}</h3>
                    <Badge variant={milestone.reached ? "success" : "outline"}>{milestone.percentage}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">${milestone.amount.toLocaleString()}</span>
                    {milestone.reached && (
                      <span className="text-xs text-muted-foreground">
                        Reached on{" "}
                        {formatDate(
                          goal.contributions.find(
                            (c) =>
                              goal.contributions.reduce(
                                (sum, prev) => sum + (new Date(prev.date) <= new Date(c.date) ? prev.amount : 0),
                                0,
                              ) >= milestone.amount,
                          )?.date || goal.deadline,
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
