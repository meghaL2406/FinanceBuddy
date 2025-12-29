import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WellBeingScoreProps {
  score: number;
  previousScore?: number;
}

export function WellBeingScore({ score, previousScore = 0 }: WellBeingScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const change = score - previousScore;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = score / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="card-warm p-8 animate-fade-up">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
        Financial Well-Being Score
      </h2>
      
      <div className="flex items-center justify-center gap-12">
        {/* Score Ring */}
        <div className="relative">
          <svg className="w-52 h-52 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="104"
              cy="104"
              r="90"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="104"
              cy="104"
              r="90"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-serif text-5xl font-bold", getScoreColor())}>
              {displayScore}
            </span>
            <span className="text-muted-foreground text-sm mt-1">out of 100</span>
          </div>
        </div>

        {/* Score Details */}
        <div className="space-y-4">
          <div>
            <span className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              score >= 80 ? "bg-success/10 text-success" :
              score >= 60 ? "bg-warning/10 text-warning" :
              "bg-destructive/10 text-destructive"
            )}>
              {getScoreLabel()}
            </span>
          </div>
          
          {previousScore > 0 && (
            <div className="flex items-center gap-2">
              {change > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">+{change} points</span>
                </>
              ) : change < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="text-destructive font-medium">{change} points</span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">No change</span>
                </>
              )}
              <span className="text-muted-foreground text-sm">from last month</span>
            </div>
          )}

          <p className="text-muted-foreground text-sm max-w-xs">
            Your score reflects your savings rate, expense balance, emergency fund, and investment diversity.
          </p>
        </div>
      </div>
    </div>
  );
}
