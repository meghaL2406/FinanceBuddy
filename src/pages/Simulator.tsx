import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { 
  Sparkles, TrendingUp, Calendar, Wallet, 
  ArrowRight, Play, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Generate projection data based on savings rate
const generateProjection = (currentSavings: number, monthlySavings: number, years: number = 10) => {
  const data = [];
  let current = currentSavings;
  let improved = currentSavings;
  const improvedSavings = monthlySavings * 1.5; // 50% more savings

  for (let year = 0; year <= years; year++) {
    data.push({
      year: `Year ${year}`,
      current: Math.round(current),
      improved: Math.round(improved),
    });
    current += monthlySavings * 12 * (1 + 0.08); // 8% annual return
    improved += improvedSavings * 12 * (1 + 0.08);
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-warm">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Simulator = () => {
  const [monthlySavings, setMonthlySavings] = useState(15000);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const projectionData = generateProjection(500000, monthlySavings);
  const currentFuture = projectionData[10].current;
  const improvedFuture = projectionData[10].improved;
  const difference = improvedFuture - currentFuture;

  const handleSimulate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Future You Simulator
          </h1>
          <p className="text-muted-foreground mt-2">
            See how small changes today can transform your financial future
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="soft" className="gap-2" onClick={() => setMonthlySavings(15000)}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="warm" className="gap-2" onClick={handleSimulate}>
            <Play className="h-4 w-4" />
            Simulate
          </Button>
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="card-warm p-8 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-accent" />
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Adjust Your Savings
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Monthly Savings</span>
              <span className="font-serif text-2xl font-bold text-primary">
                ₹{monthlySavings.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[monthlySavings]}
              onValueChange={(value) => setMonthlySavings(value[0])}
              min={5000}
              max={50000}
              step={1000}
              className="mb-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹5,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Path</p>
              <p className="font-serif text-2xl font-bold text-foreground">
                ₹{monthlySavings.toLocaleString()}/mo
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Improved Path</p>
              <p className="font-serif text-2xl font-bold text-success">
                ₹{Math.round(monthlySavings * 1.5).toLocaleString()}/mo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="card-warm p-6 mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
          10-Year Projection
        </h3>
        <div className={cn("h-80 transition-opacity duration-500", isAnimating && "opacity-50")}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="improvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="current" 
                name="Current Path"
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#currentGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="improved" 
                name="Improved Path"
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                fill="url(#improvedGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <div className="card-warm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">In 10 Years</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Path</p>
              <p className="font-serif text-2xl font-bold text-foreground">
                ₹{currentFuture.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Improved Path</p>
              <p className="font-serif text-2xl font-bold text-success">
                ₹{improvedFuture.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card-warm p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="text-muted-foreground">Extra Wealth</span>
          </div>
          <p className="font-serif text-3xl font-bold text-success">
            +₹{difference.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            By saving just ₹{(monthlySavings * 0.5).toLocaleString()} more per month
          </p>
        </div>

        <div className="card-warm p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">AI Insight</span>
          </div>
          <p className="text-foreground font-medium">
            "Small, consistent increases in savings compound dramatically over time. Even ₹2,000 extra per month can mean ₹5L+ more in 10 years!"
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Simulator;
