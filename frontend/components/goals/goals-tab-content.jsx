import { GoalCard } from "@/components/goals/goal-card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function GoalsTabContent({ goals, filter, calculateTimeLeft, formatDate }) {
  // If no goals match the filter criteria
  if (goals.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No goals found</AlertTitle>
        <AlertDescription>
          {filter === "all"
            ? "You don't have any goals yet. Create a new goal to get started."
            : filter === "active"
              ? "You don't have any active goals. Goals that are in progress will appear here."
              : filter === "completed"
                ? "You don't have any completed goals yet. Keep working towards your goals!"
                : "You don't have any upcoming goals. Create a new goal to get started."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} calculateTimeLeft={calculateTimeLeft} formatDate={formatDate} />
      ))}
    </div>
  )
}
