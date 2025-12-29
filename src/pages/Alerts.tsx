import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  AlertTriangle, Target, Sparkles, TrendingDown, 
  PiggyBank, Bell, Check, X, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "success" | "info" | "danger";
  icon: React.ElementType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable: boolean;
}

const alertsData: Alert[] = [
  {
    id: "1",
    type: "warning",
    icon: AlertTriangle,
    title: "Overspending Alert",
    message: "You've exceeded your food budget by ₹3,500 this month. Consider reducing dining out expenses.",
    time: "2 hours ago",
    read: false,
    actionable: true,
  },
  {
    id: "2",
    type: "success",
    icon: Target,
    title: "Goal Milestone Reached!",
    message: "Congratulations! You're now 75% towards your Emergency Fund goal. Keep up the great work!",
    time: "1 day ago",
    read: false,
    actionable: false,
  },
  {
    id: "3",
    type: "info",
    icon: Sparkles,
    title: "AI Recommendation",
    message: "Reducing dining out by ₹2,000/month could help you reach your car goal 3 months earlier.",
    time: "2 days ago",
    read: false,
    actionable: true,
  },
  {
    id: "4",
    type: "danger",
    icon: TrendingDown,
    title: "Investment Alert",
    message: "Your TCS holdings have dropped 8.9% this week. Consider reviewing your portfolio.",
    time: "3 days ago",
    read: true,
    actionable: true,
  },
  {
    id: "5",
    type: "warning",
    icon: PiggyBank,
    title: "Emergency Fund Low",
    message: "Your emergency fund covers only 2 months of expenses. The recommended minimum is 6 months.",
    time: "5 days ago",
    read: true,
    actionable: true,
  },
  {
    id: "6",
    type: "success",
    icon: Target,
    title: "Savings Streak!",
    message: "You've saved consistently for 3 months in a row. Your financial discipline is improving!",
    time: "1 week ago",
    read: true,
    actionable: false,
  },
  {
    id: "7",
    type: "info",
    icon: Sparkles,
    title: "Tax Saving Opportunity",
    message: "You can save up to ₹15,000 in taxes by investing ₹1,50,000 more in ELSS funds before March.",
    time: "1 week ago",
    read: true,
    actionable: true,
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(alertsData);
  const [filter, setFilter] = useState<"all" | "unread" | "warning" | "success">("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "unread") return !alert.read;
    return alert.type === filter;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay informed about your financial health
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="soft" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {[
          { key: "all", label: "All" },
          { key: "unread", label: `Unread (${unreadCount})` },
          { key: "warning", label: "Warnings" },
          { key: "success", label: "Achievements" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              filter === f.key
                ? "bg-primary text-primary-foreground shadow-warm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card-warm p-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </div>
        <div className="card-warm p-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-warning">
                {alerts.filter((a) => a.type === "warning").length}
              </p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
        </div>
        <div className="card-warm p-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-success">
                {alerts.filter((a) => a.type === "success").length}
              </p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>
        </div>
        <div className="card-warm p-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alerts.filter((a) => a.type === "info").length}
              </p>
              <p className="text-sm text-muted-foreground">AI Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className={cn(
              "card-warm p-5 animate-fade-up transition-all duration-200",
              !alert.read && "ring-2 ring-primary/20"
            )}
            style={{ animationDelay: `${350 + index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  alert.type === "warning" && "bg-warning/10",
                  alert.type === "success" && "bg-success/10",
                  alert.type === "info" && "bg-primary/10",
                  alert.type === "danger" && "bg-destructive/10"
                )}
              >
                <alert.icon
                  className={cn(
                    "h-6 w-6",
                    alert.type === "warning" && "text-warning",
                    alert.type === "success" && "text-success",
                    alert.type === "info" && "text-primary",
                    alert.type === "danger" && "text-destructive"
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-foreground">{alert.title}</h3>
                    <p className="text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                  {!alert.read && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <div className="flex gap-2">
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark read
                      </Button>
                    )}
                    {alert.actionable && (
                      <Button variant="soft" size="sm" className="text-xs">
                        Take Action
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts to show</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Alerts;
