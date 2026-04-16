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

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper to summarize financial habits from transactions
const summarizeFinancials = (transactions: any[]) => {
  if (!transactions || transactions.length === 0) return "No recent transaction history available.";

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 1. Calculate Monthly Averages (Income vs Expense)
  const incomeMap = new Map<string, number>(); // month-year -> amount
  const expenseMap = new Map<string, number>();

  transactions.forEach((t) => {
    const d = new Date(t.date || t.createdAt?.toDate()); // Handle Firestore Timestamp or ISO string
    const key = `${d.getMonth()}-${d.getFullYear()}`;
    const amount = Number(t.amount);

    if (t.type === "income") {
      incomeMap.set(key, (incomeMap.get(key) || 0) + amount);
    } else if (t.type === "expense") {
      expenseMap.set(key, (expenseMap.get(key) || 0) + amount);
    }
  });

  const avgIncome =
    Array.from(incomeMap.values()).reduce((a, b) => a + b, 0) / (incomeMap.size || 1);
  const avgExpense =
    Array.from(expenseMap.values()).reduce((a, b) => a + b, 0) / (expenseMap.size || 1);

  // 2. Top Spending Categories
  const categoryMap = new Map<string, number>();
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.category || "Uncategorized";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(t.amount));
    });

  const topCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amount]) => `${cat} (₹${amount.toLocaleString()})`)
    .join(", ");

  return `
    - Average Monthly Income: ₹${Math.round(avgIncome).toLocaleString()}
    - Average Monthly Expense: ₹${Math.round(avgExpense).toLocaleString()}
    - Top Spending Areas: ${topCategories || "None"}
  `;
};

export const getChatResponse = async (
  message: string,
  currentSavings: number,
  monthlySavings: number,
  transactions: any[] = []
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const financialSummary = summarizeFinancials(transactions);

    const prompt = `
      You are a "Future Self" persona from 10 years in the future. 
      You are talking to your past self (the user).
      
      Current Financial Context (Your Past / User's Present):
      - Current Savings: ₹${currentSavings.toLocaleString()}
      - Monthly Savings: ₹${monthlySavings.toLocaleString()}
      ${financialSummary}
      
      The user asks: "${message}"

      Instructions:
      1. Answer as if you are living the life resulting from these specific financial habits.
      2. If the user asks about their spending, reference the "Top Spending Areas" specifically.
      3. Be encouraging but realistic. If savings are low (< 20% of income), warn them gently about the difficulties you face (lack of travel, anxiety).
      4. If savings are high, describe the freedom you enjoy (early retirement options, travel).
      5. If the question is NOT related to finance, life goals, or career, politely refuse and say "I can only remember our financial journey."
      6. Keep the response concise (under 3 sentences) and conversational.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm having trouble connecting to the timeline right now. (API Error: Please check your API key)";
  }
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
