import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Food & Dining", value: 18500, color: "hsl(25, 50%, 35%)" },
  { name: "Rent", value: 25000, color: "hsl(38, 90%, 50%)" },
  { name: "Transportation", value: 8000, color: "hsl(35, 60%, 45%)" },
  { name: "Shopping", value: 12000, color: "hsl(30, 40%, 55%)" },
  { name: "Utilities", value: 5500, color: "hsl(20, 35%, 40%)" },
  { name: "Entertainment", value: 6500, color: "hsl(45, 70%, 55%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-warm">
        <p className="font-medium text-foreground">{payload[0].name}</p>
        <p className="text-primary font-semibold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function SpendingChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card-warm p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Spending Breakdown
        </h3>
        <span className="text-muted-foreground text-sm">This Month</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-muted-foreground text-sm">Total Spending</p>
        <p className="font-serif text-2xl font-semibold text-foreground">
          ₹{total.toLocaleString()}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.slice(0, 4).map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
