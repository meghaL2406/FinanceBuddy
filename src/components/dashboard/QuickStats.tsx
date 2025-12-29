import { Wallet, TrendingUp, Target, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, change, positive, delay = 0 }: StatCardProps) {
  return (
    <div 
      className="card-warm p-6 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {change && (
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-full",
            positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-serif text-2xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function QuickStats() {
  const stats = [
    { 
      icon: Wallet, 
      label: "Total Balance", 
      value: "₹4,52,840", 
      change: "+12.5%", 
      positive: true 
    },
    { 
      icon: TrendingUp, 
      label: "Monthly Income", 
      value: "₹85,000", 
      change: "+8.2%", 
      positive: true 
    },
    { 
      icon: PiggyBank, 
      label: "This Month's Savings", 
      value: "₹24,500", 
      change: "+15.3%", 
      positive: true 
    },
    { 
      icon: Target, 
      label: "Goals Progress", 
      value: "68%", 
      change: "+5.2%", 
      positive: true 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 100} />
      ))}
    </div>
  );
}
