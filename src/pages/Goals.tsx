import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Target, Car, Plane, Home, GraduationCap, 
  Plus, Calendar, TrendingUp, Sparkles,
  CheckCircle2, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  icon: React.ElementType;
  current: number;
  target: number;
  deadline: string;
  monthlyRequired: number;
  probability: number;
  color: string;
  status: "on-track" | "at-risk" | "ahead";
}

const goals: Goal[] = [
  { 
    id: "1", 
    name: "Emergency Fund", 
    icon: Target, 
    current: 150000, 
    target: 200000, 
    deadline: "Dec 2024",
    monthlyRequired: 8334,
    probability: 92,
    color: "hsl(142, 70%, 40%)",
    status: "ahead"
  },
  { 
    id: "2", 
    name: "New Car", 
    icon: Car, 
    current: 280000, 
    target: 800000, 
    deadline: "Jun 2025",
    monthlyRequired: 43334,
    probability: 65,
    color: "hsl(25, 50%, 35%)",
    status: "at-risk"
  },
  { 
    id: "3", 
    name: "Vacation to Europe", 
    icon: Plane, 
    current: 45000, 
    target: 100000, 
    deadline: "Mar 2025",
    monthlyRequired: 6875,
    probability: 88,
    color: "hsl(38, 90%, 50%)",
    status: "on-track"
  },
  { 
    id: "4", 
    name: "Home Down Payment", 
    icon: Home, 
    current: 500000, 
    target: 2000000, 
    deadline: "Dec 2026",
    monthlyRequired: 50000,
    probability: 72,
    color: "hsl(35, 60%, 45%)",
    status: "on-track"
  },
  { 
    id: "5", 
    name: "MBA Fund", 
    icon: GraduationCap, 
    current: 100000, 
    target: 500000, 
    deadline: "Aug 2025",
    monthlyRequired: 28572,
    probability: 78,
    color: "hsl(30, 40%, 55%)",
    status: "on-track"
  },
];

const Goals = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Goal Planner
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your financial goals and get AI-powered recommendations
          </p>
        </div>
        <Button variant="warm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <p className="text-muted-foreground text-sm">Total Saved</p>
          <p className="font-serif text-3xl font-bold text-foreground mt-2">
            ₹{totalSaved.toLocaleString()}
          </p>
          <Progress value={(totalSaved / totalTarget) * 100} className="mt-3" />
          <p className="text-muted-foreground text-xs mt-2">
            {Math.round((totalSaved / totalTarget) * 100)}% of ₹{totalTarget.toLocaleString()}
          </p>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          <p className="text-muted-foreground text-sm">Active Goals</p>
          <p className="font-serif text-3xl font-bold text-foreground mt-2">
            {goals.length}
          </p>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-success">
              <CheckCircle2 className="h-3 w-3" /> 3 on track
            </span>
            <span className="flex items-center gap-1 text-xs text-warning">
              <Clock className="h-3 w-3" /> 1 at risk
            </span>
          </div>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">AI Suggestion</p>
              <p className="text-sm text-muted-foreground mt-1">
                Increase monthly savings by ₹5,000 to reach your Car goal 2 months earlier
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          
          return (
            <div 
              key={goal.id}
              className="card-warm p-6 animate-fade-up cursor-pointer hover:shadow-warm transition-all duration-300"
              style={{ animationDelay: `${250 + index * 50}ms` }}
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <goal.icon 
                      className="h-7 w-7" 
                      style={{ color: goal.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {goal.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                    </div>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  goal.status === "ahead" && "bg-success/10 text-success",
                  goal.status === "on-track" && "bg-primary/10 text-primary",
                  goal.status === "at-risk" && "bg-warning/10 text-warning"
                )}>
                  {goal.status === "ahead" ? "Ahead" : goal.status === "on-track" ? "On Track" : "At Risk"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Required</p>
                    <p className="font-semibold text-foreground">
                      ₹{goal.monthlyRequired.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Success Probability</p>
                    <p className={cn(
                      "font-semibold",
                      goal.probability >= 80 ? "text-success" :
                      goal.probability >= 60 ? "text-warning" : "text-destructive"
                    )}>
                      {goal.probability}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Goals;
