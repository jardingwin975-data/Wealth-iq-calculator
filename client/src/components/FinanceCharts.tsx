import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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
  otherExpenses: number;
};

export default function FinanceCharts({
  income,
  rent,
  carPayment,
  otherExpenses,
}: FinanceChartsProps) {
  const totalExpenses = rent + carPayment + otherExpenses;
  const savings = Math.max(income - totalExpenses, 0);

  const hasExpenseData = totalExpenses > 0;

  const expenseData = hasExpenseData
    ? [
        { name: "Rent / Mortgage", value: rent },
        { name: "Car Payment", value: carPayment },
        { name: "Other Expenses", value: otherExpenses },
      ].filter((item) => item.value > 0)
    : [{ name: "No expenses entered", value: 1 }];

  const incomeData = [
    { name: "Income", amount: income },
    { name: "Expenses", amount: totalExpenses },
    { name: "Savings", amount: savings },
  ];

  const COLORS = hasExpenseData
    ? ["#3B82F6", "#F59E0B", "#8B5CF6"]
    : ["#CBD5E1"];

  const currencyFormatter = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="rounded-[2rem] glass-card p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
            Analytics
          </p>
          <h3 className="text-2xl font-bold text-slate-900 font-display mt-2">
            Expense Breakdown
          </h3>
          <p className="text-slate-500 mt-2">
            See where your monthly expenses are concentrated.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={expenseData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) => [currencyFormatter(value), "Amount"]}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-slate-600 text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2rem] glass-card p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
            Cash Flow
          </p>
          <h3 className="text-2xl font-bold text-slate-900 font-display mt-2">
            Income vs Expenses
          </h3>
          <p className="text-slate-500 mt-2">
            Compare your income, spending, and remaining savings.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={incomeData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              barCategoryGap={30}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                tick={{ fontSize: 14 }}
              />
              <YAxis
                stroke="#64748B"
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 13 }}
              />
              <Tooltip
                formatter={(value: number) => [currencyFormatter(value), "Amount"]}
              />
              <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                <Cell fill="#10B981" />
                <Cell fill="#3B82F6" />
                <Cell fill="#8B5CF6" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
