import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  Plus,
  ArrowRight,
  Home,
  Car,
  GraduationCapIcon as Graduation,
  Briefcase,
  Umbrella,
  Plane,
} from "lucide-react"
import Link from "next/link"

export function GoalsRecommendations({ existingGoals }) {
  // Common financial goals that might be recommended
  const recommendedGoals = [
    {
      id: "rec1",
      name: "Emergency Fund",
      description: "3-6 months of living expenses for unexpected events",
      icon: <Umbrella className="h-5 w-5" />,
      category: "Savings",
      priority: "High",
      targetAmount: 10000,
      timeframe: "6-12 months",
      alreadyExists: existingGoals.some(
        (g) =>
          g.name.toLowerCase().includes("emergency") ||
          (g.category === "Savings" && g.name.toLowerCase().includes("fund")),
      ),
    },
    {
      id: "rec2",
      name: "Home Down Payment",
      description: "Save for a down payment on a home purchase",
      icon: <Home className="h-5 w-5" />,
      category: "Major Purchase",
      priority: "Medium",
      targetAmount: 50000,
      timeframe: "3-5 years",
      alreadyExists: existingGoals.some(
        (g) =>
          g.name.toLowerCase().includes("home") ||
          g.name.toLowerCase().includes("house") ||
          g.name.toLowerCase().includes("down payment"),
      ),
    },
    {
      id: "rec3",
      name: "New Vehicle",
      description: "Save for your next vehicle purchase",
      icon: <Car className="h-5 w-5" />,
      category: "Major Purchase",
      priority: "Medium",
      targetAmount: 20000,
      timeframe: "1-3 years",
      alreadyExists: existingGoals.some(
        (g) =>
          g.name.toLowerCase().includes("car") ||
          g.name.toLowerCase().includes("vehicle") ||
          g.name.toLowerCase().includes("auto"),
      ),
    },
    {
      id: "rec4",
      name: "Vacation Fund",
      description: "Save for your dream vacation",
      icon: <Plane className="h-5 w-5" />,
      category: "Travel",
      priority: "Low",
      targetAmount: 3000,
      timeframe: "6-12 months",
      alreadyExists: existingGoals.some(
        (g) =>
          g.name.toLowerCase().includes("vacation") ||
          g.name.toLowerCase().includes("travel") ||
          g.name.toLowerCase().includes("trip"),
      ),
    },
    {
      id: "rec5",
      name: "Education Fund",
      description: "Save for education expenses or student loans",
      icon: <Graduation className="h-5 w-5" />,
      category: "Education",
      priority: "Medium",
      targetAmount: 25000,
      timeframe: "2-4 years",
      alreadyExists: existingGoals.some(
        (g) =>
          g.name.toLowerCase().includes("education") ||
          g.name.toLowerCase().includes("college") ||
          g.name.toLowerCase().includes("school") ||
          g.name.toLowerCase().includes("tuition"),
      ),
    },
    {
      id: "rec6",
      name: "Retirement Boost",
      description: "Additional retirement savings beyond your 401(k)",
      icon: <Briefcase className="h-5 w-5" />,
      category: "Retirement",
      priority: "High",
      targetAmount: 50000,
      timeframe: "Ongoing",
      alreadyExists: existingGoals.some(
        (g) => g.name.toLowerCase().includes("retirement") || g.category === "Retirement",
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>Recommended Goals</CardTitle>
        </div>
        <CardDescription>Popular financial goals you might want to consider</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedGoals.map((goal) => (
            <Card
              key={goal.id}
              className={cn("overflow-hidden transition-all hover:shadow-md", goal.alreadyExists && "opacity-60")}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">{goal.icon}</div>
                    <CardTitle className="text-base">{goal.name}</CardTitle>
                  </div>
                  {goal.alreadyExists && <Badge variant="outline">Already Created</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
                  <div className="text-muted-foreground">Target:</div>
                  <div className="font-medium">${goal.targetAmount.toLocaleString()}</div>
                  <div className="text-muted-foreground">Timeframe:</div>
                  <div className="font-medium">{goal.timeframe}</div>
                  <div className="text-muted-foreground">Priority:</div>
                  <div className="font-medium">{goal.priority}</div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant={goal.alreadyExists ? "outline" : "default"}
                  className="w-full"
                  asChild
                  disabled={goal.alreadyExists}
                >
                  <Link href={goal.alreadyExists ? "#" : `/goals/create?template=${goal.id}`}>
                    {goal.alreadyExists ? (
                      "View Similar Goal"
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Goal
                      </>
                    )}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/goals/create">
            Create Custom Goal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to conditionally join class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}
