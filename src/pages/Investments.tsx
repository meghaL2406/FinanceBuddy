import { MainLayout } from "@/components/layout/MainLayout";
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell
} from "recharts";
import { 
  TrendingUp, TrendingDown, Shield, BarChart3, 
  Wallet, RefreshCw, AlertTriangle, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const portfolioHistory = [
  { month: "Jan", value: 250000 },
  { month: "Feb", value: 268000 },
  { month: "Mar", value: 255000 },
  { month: "Apr", value: 290000 },
  { month: "May", value: 310000 },
  { month: "Jun", value: 305000 },
  { month: "Jul", value: 340000 },
  { month: "Aug", value: 365000 },
];

const assetAllocation = [
  { name: "Stocks", value: 45, color: "hsl(25, 50%, 35%)", amount: 164250 },
  { name: "Mutual Funds", value: 30, color: "hsl(38, 90%, 50%)", amount: 109500 },
  { name: "Fixed Deposits", value: 15, color: "hsl(35, 60%, 45%)", amount: 54750 },
  { name: "Gold", value: 10, color: "hsl(45, 70%, 55%)", amount: 36500 },
];

const holdings = [
  { name: "Reliance Industries", type: "Stock", invested: 50000, current: 62000, change: 24 },
  { name: "HDFC Flexicap", type: "Mutual Fund", invested: 40000, current: 45200, change: 13 },
  { name: "SBI Blue Chip", type: "Mutual Fund", invested: 35000, current: 38500, change: 10 },
  { name: "TCS", type: "Stock", invested: 45000, current: 41000, change: -8.9 },
  { name: "ICICI Prudential", type: "Mutual Fund", invested: 30000, current: 34800, change: 16 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-warm">
        <p className="text-primary font-semibold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Investments = () => {
  const totalInvested = 319000;
  const currentValue = 365000;
  const totalReturns = currentValue - totalInvested;
  const returnsPercent = ((totalReturns / totalInvested) * 100).toFixed(1);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Investment Analyzer
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your investments and get AI-powered insights
          </p>
        </div>
        <Button variant="warm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Portfolio
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <Wallet className="h-5 w-5 text-primary mb-3" />
          <p className="text-muted-foreground text-sm">Total Invested</p>
          <p className="font-serif text-2xl font-bold text-foreground mt-1">
            ₹{totalInvested.toLocaleString()}
          </p>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          <TrendingUp className="h-5 w-5 text-success mb-3" />
          <p className="text-muted-foreground text-sm">Current Value</p>
          <p className="font-serif text-2xl font-bold text-foreground mt-1">
            ₹{currentValue.toLocaleString()}
          </p>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <BarChart3 className="h-5 w-5 text-accent mb-3" />
          <p className="text-muted-foreground text-sm">Total Returns</p>
          <p className="font-serif text-2xl font-bold text-success mt-1">
            +₹{totalReturns.toLocaleString()} ({returnsPercent}%)
          </p>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <Shield className="h-5 w-5 text-warning mb-3" />
          <p className="text-muted-foreground text-sm">Risk Level</p>
          <p className="font-serif text-2xl font-bold text-warning mt-1">Moderate</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Growth */}
        <div className="lg:col-span-2 card-warm p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Portfolio Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory}>
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
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
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
        </div>

        {/* Asset Allocation */}
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "350ms" }}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Asset Allocation
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {assetAllocation.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-sm text-muted-foreground">{asset.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings */}
        <div className="lg:col-span-2 card-warm p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Top Holdings
          </h3>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div 
                key={holding.name}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{holding.name}</p>
                  <p className="text-sm text-muted-foreground">{holding.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ₹{holding.current.toLocaleString()}
                  </p>
                  <p className={cn(
                    "text-sm font-medium flex items-center gap-1 justify-end",
                    holding.change >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {holding.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {holding.change >= 0 ? "+" : ""}{holding.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "450ms" }}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            AI Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Good Diversification</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your portfolio is well-balanced across asset classes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">High Stock Exposure</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consider adding more fixed-income instruments for stability
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Growth Potential</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your investments are showing positive momentum
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Investments;
