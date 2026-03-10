import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

type FinanceChartsProps = {
  income: number;
  rent: number;
  carPayment: number;
  Groceries: number;
  otherExpenses: number;
};

export default function FinanceCharts({
  income,
  rent,
  carPayment,
  Groceries,
  otherExpenses,
}: FinanceChartsProps) {
  const totalExpenses = rent + carPayment + Groceries + otherExpenses;
  const savings = income - totalExpenses;

  const expenseBreakdown = [
    { name: "Rent/Mortgage", value: rent },
    { name: "Car Payment", value: carPayment },
    { name: "Groceries", value: Groceries },
    { name: "Other Expenses", value: otherExpenses },
  ].filter((item) => item.value > 0);

  const incomeVsExpenses = [
    { name: "Income", value: income },
    { name: "Expenses", value: totalExpenses },
    { name: "Savings", value: Math.max(savings, 0) },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="premium-card rounded-[2rem] p-6">
        <h3 className="mb-4 text-xl font-bold text-slate-900">
          Expense Breakdown
        </h3>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="premium-card rounded-[2rem] p-6">
        <h3 className="mb-4 text-xl font-bold text-slate-900">
          Income vs Expenses
        </h3>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
  <BarChart data={incomeVsExpenses}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]} />
    <Legend />

    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
  {incomeVsExpenses.map((entry, index) => {
    const colors = ["#22c55e", "#ef4444", "#3b82f6"];
    return <Cell key={`cell-${index}`} fill={colors[index]} />;
  })}
</Bar>

    
      {incomeVsExpenses.map((entry, index) => {
        const colors = ["#22c55e", "#ef4444", "#3b82f6"]; 
        return <Cell key={index} fill={colors[index]} />;
      })}
    </Bar>

  </BarChart>
</ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
