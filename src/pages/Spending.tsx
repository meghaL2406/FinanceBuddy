import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid
} from "recharts";
import { 
  TrendingUp, TrendingDown, AlertTriangle, 
  Coffee, Home, Car, ShoppingBag, Zap, Film, 
  MoreHorizontal, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const categoryData = [
  { name: "Food & Dining", value: 18500, budget: 15000, icon: Coffee, color: "hsl(25, 50%, 35%)" },
  { name: "Rent", value: 25000, budget: 25000, icon: Home, color: "hsl(38, 90%, 50%)" },
  { name: "Transportation", value: 8000, budget: 10000, icon: Car, color: "hsl(35, 60%, 45%)" },
  { name: "Shopping", value: 12000, budget: 8000, icon: ShoppingBag, color: "hsl(30, 40%, 55%)" },
  { name: "Utilities", value: 5500, budget: 6000, icon: Zap, color: "hsl(20, 35%, 40%)" },
  { name: "Entertainment", value: 6500, budget: 5000, icon: Film, color: "hsl(45, 70%, 55%)" },
];

const monthlyTrend = [
  { month: "Jan", spending: 68000 },
  { month: "Feb", spending: 72000 },
  { month: "Mar", spending: 65000 },
  { month: "Apr", spending: 78000 },
  { month: "May", spending: 71000 },
  { month: "Jun", spending: 75500 },
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

const Spending = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const totalSpending = categoryData.reduce((sum, cat) => sum + cat.value, 0);
  const totalBudget = categoryData.reduce((sum, cat) => sum + cat.budget, 0);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Spending Analyzer
          </h1>
          <p className="text-muted-foreground mt-2">
            Understand your spending patterns with AI-powered insights
          </p>
        </div>
        <Button variant="warm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Statement
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {["week", "month", "quarter", "year"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              selectedPeriod === period
                ? "bg-primary text-primary-foreground shadow-warm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          <p className="text-muted-foreground text-sm">Total Spending</p>
          <p className="font-serif text-3xl font-bold text-foreground mt-2">
            ₹{totalSpending.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <TrendingUp className="h-4 w-4 text-destructive" />
            <span className="text-destructive text-sm font-medium">+8.5% vs last month</span>
          </div>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <p className="text-muted-foreground text-sm">Budget Used</p>
          <p className="font-serif text-3xl font-bold text-foreground mt-2">
            {Math.round((totalSpending / totalBudget) * 100)}%
          </p>
          <Progress value={(totalSpending / totalBudget) * 100} className="mt-3" />
          <p className="text-muted-foreground text-xs mt-2">
            ₹{(totalBudget - totalSpending).toLocaleString()} remaining
          </p>
        </div>

        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <p className="text-muted-foreground text-sm">AI Insight</p>
          <div className="flex items-start gap-3 mt-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              You spend <span className="font-semibold text-warning">35% on food</span> — above the recommended 25% limit
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Spending by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "350ms" }}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Monthly Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
          Category Breakdown
        </h3>
        <div className="space-y-6">
          {categoryData.map((category) => {
            const percentage = (category.value / category.budget) * 100;
            const isOverBudget = category.value > category.budget;
            
            return (
              <div key={category.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <category.icon 
                        className="h-5 w-5" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Budget: ₹{category.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      isOverBudget ? "text-destructive" : "text-foreground"
                    )}>
                      ₹{category.value.toLocaleString()}
                    </p>
                    <p className={cn(
                      "text-xs",
                      isOverBudget ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {isOverBudget ? `${Math.round(percentage - 100)}% over` : `${Math.round(100 - percentage)}% left`}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={cn("h-2", isOverBudget && "[&>div]:bg-destructive")}
                />
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Spending;
