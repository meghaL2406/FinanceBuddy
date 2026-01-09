export interface FuturePersona {
  title: string;
  description: string;
  advice: string;
  mood: "happy" | "neutral" | "worried";
}

export const generateFuturePersona = (
  currentSavings: number,
  monthlySavings: number,
  years: number = 10
): FuturePersona => {
  const futureValue =
    currentSavings + monthlySavings * 12 * years * 1.5; // Rough compounding approx

  if (futureValue > 10000000) {
    return {
      title: "The Freedom Architect",
      description:
        "You are living life on your own terms. Your early investments have compounded into a fortress of financial security. You travel often and worry little about bills.",
      advice:
        "You're on a fantastic path. Consider diversifying into real estate or angel investing to preserve wealth.",
      mood: "happy",
    };
  } else if (futureValue > 5000000) {
    return {
      title: "The Secure Planner",
      description:
        "You have a comfortable safety net. Major life events like weddings or education are covered, but you still budget carefully for luxury items.",
      advice:
        "You're doing well. diverse your portfolio to beat inflation consistently. A little more aggression in equity could push you to the next level.",
      mood: "happy",
    };
  } else if (futureValue > 2000000) {
    return {
      title: "The Cautious Saver",
      description:
        "You have some savings, but inflation is a concern. You can handle small emergencies, but a major health crisis or job loss could be stressful.",
      advice:
        "Try to increase your monthly savings by just 10%. It makes a huge difference over a decade. Cut down on subscription creep.",
      mood: "neutral",
    };
  } else {
    return {
      title: "The Stressed Survivor",
      description:
        "Financial anxiety is a constant companion. You are working hard just to stay afloat, and retirement seems like a distant, impossible dream.",
      advice:
        "It's not too late to start small. Even ₹500 a month in a SIP matters. Focus on clearing high-interest debt first.",
      mood: "worried",
    };
  }
};

export const getChatResponse = (
  message: string,
  currentSavings: number,
  monthlySavings: number
): string => {
  const msg = message.toLowerCase();

  if (msg.includes("save") || msg.includes("saving")) {
    return `Currently, you're saving ₹${monthlySavings.toLocaleString()} per month. If you can bump that to ₹${(
      monthlySavings * 1.2
    ).toLocaleString()}, your future self will thank you immensely!`;
  }

  if (msg.includes("invest") || msg.includes("stock") || msg.includes("fund")) {
    return "I recommend a diversified portfolio. a 70/30 Equity/Debt split is often good for long-term growth (10+ years), but always do your own research or consult a certified advisor.";
  }

  if (msg.includes("retirement") || msg.includes("retire")) {
    const projected = monthlySavings * 12 * 20; // very rough 20 year linear
    return `To retire comfortably, you usually need 20-25x your annual expenses. With your current path, you might fall short. Can we find an extra ₹5,000 in your monthly budget?`;
  }

  if (msg.includes("risk") || msg.includes("safe")) {
    return "Risk is the price you pay for growth. If you're young, you can afford more volatility. If you're nearing 50, prioritize capital protection.";
  }

  return "That's a great question. As your Future Self, I care most about consistency. Whatever you decide, stick to it for at least 5 years. Compounding needs time.";
};

export const getAlertMessage = (
  newSavings: number,
  prevSavings: number
): { title: string; description: string; type: "default" | "destructive" | "success" | "info" } => {
  const diff = newSavings - prevSavings;

  if (diff > 0) {
    return {
      title: "Good Choices Detected",
      description: `You've increased your monthly savings by ₹${diff.toLocaleString()}. Your Future Self is celebrating!`,
      type: "success",
    };
  } else if (diff < 0) {
    return {
      title: "Spending Creep Alert",
      description: `Careful! Decreased savings implies your expenses have risen by ₹${Math.abs(diff).toLocaleString()}.`,
      type: "destructive",
    };
  } else {
    // No change
    if (newSavings < 10000) {
      return {
        title: "Action Needed",
        description: "Your savings rate is dangerously low. Expenses seem too high relative to income.",
        type: "destructive",
      };
    }
    return {
      title: "Stable Path",
      description: "You are maintaining your course. Consistency is key!",
      type: "info",
    };
  }
};

export const generateFinancialAlerts = (transactions: any[]) => {
  const alerts = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter this month's transactions
  const thisMonthTxns = transactions.filter((t: any) => {
    const d = new Date(t.date); // Assuming transaction has a date field
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = thisMonthTxns
    .filter((t: any) => t.type === "income")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const expense = thisMonthTxns
    .filter((t: any) => t.type === "expense")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  // Logic 1: High Expense Alert
  if (expense > income && income > 0) {
    alerts.push({
      id: "gen-1",
      type: "warning",
      title: "Overspending Alert",
      message: `You've spent ₹${(expense - income).toLocaleString()} more than you earned this month.`,
      time: "Just now",
      read: false,
      actionable: true,
      icon: "AlertTriangle"
    });
  }

  // Logic 2: Low Savings Check
  const savingsRate = income > 0 ? (income - expense) / income : 0;
  if (savingsRate < 0.1 && income > 0) {
    alerts.push({
      id: "gen-2",
      type: "warning",
      title: "Low Savings Rate",
      message: `You're saving only ${(savingsRate * 100).toFixed(1)}% of your income. Aim for at least 20%.`,
      time: "Just now",
      read: false,
      actionable: true,
      icon: "PiggyBank"
    });
  } else if (savingsRate > 0.3) {
    alerts.push({
      id: "gen-3",
      type: "success",
      title: "Great Savings Rate!",
      message: `You're saving ${(savingsRate * 100).toFixed(1)}% of your income! Keep it up.`,
      time: "Just now",
      read: false,
      actionable: false,
      icon: "Target"
    });
  }

  // Fallback if no alerts
  if (alerts.length === 0) {
    alerts.push({
      id: "gen-default",
      type: "info",
      title: "All Looks Good",
      message: "Your spending is within limits this month. Keep tracking!",
      time: "Just now",
      read: true,
      actionable: false,
      icon: "Check"
    });
  }

  return alerts;
};
