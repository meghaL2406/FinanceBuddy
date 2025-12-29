import { Target, Car, Plane, Home, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  icon: React.ElementType;
  current: number;
  target: number;
  deadline: string;
  color: string;
}

const goals: Goal[] = [
  { 
    id: "1", 
    name: "Emergency Fund", 
    icon: Target, 
    current: 150000, 
    target: 200000, 
    deadline: "Dec 2024",
    color: "bg-success"
  },
  { 
    id: "2", 
    name: "New Car", 
    icon: Car, 
    current: 280000, 
    target: 800000, 
    deadline: "Jun 2025",
    color: "bg-primary"
  },
  { 
    id: "3", 
    name: "Vacation Fund", 
    icon: Plane, 
    current: 45000, 
    target: 100000, 
    deadline: "Mar 2024",
    color: "bg-accent"
  },
  { 
    id: "4", 
    name: "Home Down Payment", 
    icon: Home, 
    current: 500000, 
    target: 2000000, 
    deadline: "Dec 2026",
    color: "bg-warning"
  },
];

export function GoalsProgress() {
  return (
    <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Goals Progress
        </h3>
        <a href="/goals" className="text-primary text-sm font-medium hover:underline">
          View All
        </a>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    goal.color + "/10"
                  )}>
                    <goal.icon className={cn("h-5 w-5", goal.color.replace("bg-", "text-"))} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">Due {goal.deadline}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{percentage}%</span>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{goal.current.toLocaleString()}</span>
                  <span>₹{goal.target.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
