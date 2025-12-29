import { AlertTriangle, TrendingDown, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "info" | "success";
  icon: React.ElementType;
  title: string;
  message: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    icon: AlertTriangle,
    title: "Overspending Alert",
    message: "You've exceeded your food budget by ₹3,500 this month",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "success",
    icon: Target,
    title: "Goal Milestone",
    message: "You're 75% towards your Emergency Fund goal!",
    time: "1 day ago",
  },
  {
    id: "3",
    type: "info",
    icon: Sparkles,
    title: "AI Recommendation",
    message: "Reducing dining out by ₹2,000/month could help reach your car goal 3 months earlier",
    time: "2 days ago",
  },
];

export function RecentAlerts() {
  return (
    <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Recent Alerts
        </h3>
        <a href="/alerts" className="text-primary text-sm font-medium hover:underline">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "flex gap-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-soft",
              alert.type === "warning" && "bg-warning/5 border-warning/20",
              alert.type === "success" && "bg-success/5 border-success/20",
              alert.type === "info" && "bg-primary/5 border-primary/20"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              alert.type === "warning" && "bg-warning/10",
              alert.type === "success" && "bg-success/10",
              alert.type === "info" && "bg-primary/10"
            )}>
              <alert.icon className={cn(
                "h-5 w-5",
                alert.type === "warning" && "text-warning",
                alert.type === "success" && "text-success",
                alert.type === "info" && "text-primary"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{alert.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
