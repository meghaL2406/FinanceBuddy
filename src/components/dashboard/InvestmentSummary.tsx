import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";

const portfolioData = [
  { month: "Jan", value: 250000 },
  { month: "Feb", value: 268000 },
  { month: "Mar", value: 255000 },
  { month: "Apr", value: 290000 },
  { month: "May", value: 310000 },
  { month: "Jun", value: 305000 },
  { month: "Jul", value: 340000 },
  { month: "Aug", value: 365000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-warm">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-primary font-semibold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function InvestmentSummary() {
  const totalInvested = 365000;
  const returns = 46000;
  const returnsPercent = ((returns / (totalInvested - returns)) * 100).toFixed(1);

  return (
    <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Investment Portfolio
        </h3>
        <a href="/investments" className="text-primary text-sm font-medium hover:underline">
          Details
        </a>
      </div>

      {/* Portfolio Chart */}
      <div className="h-40 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioData}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fill="url(#portfolioGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <TrendingUp className="h-5 w-5 mx-auto text-success mb-2" />
          <p className="text-xs text-muted-foreground">Returns</p>
          <p className="font-semibold text-success">+{returnsPercent}%</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <Shield className="h-5 w-5 mx-auto text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Risk Level</p>
          <p className="font-semibold text-foreground">Moderate</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <BarChart3 className="h-5 w-5 mx-auto text-accent mb-2" />
          <p className="text-xs text-muted-foreground">Diversity</p>
          <p className="font-semibold text-foreground">Good</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Portfolio Value</span>
          <span className="font-serif text-xl font-semibold text-foreground">
            ₹{totalInvested.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
