type FinanceChartsProps = {
  income: number;
  rent: number;
  carPayment: number;
  Groceries: number;
  otherExpenses: number;
};

function currency(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function FinanceCharts({
  income,
  rent,
  carPayment,
  Groceries,
  otherExpenses,
}: FinanceChartsProps) {
  const totalExpenses = rent + carPayment + Groceries + otherExpenses;
  const savings = Math.max(income - totalExpenses, 0);

  const breakdown = [
    { name: "Rent / Mortgage", value: rent, color: "#3b82f6" },
    { name: "Car Payment", value: carPayment, color: "#f59e0b" },
    { name: "Groceries", value: Groceries, color: "#10b981" },
    { name: "Other Expenses", value: otherExpenses, color: "#8b5cf6" },
  ].filter((item) => item.value > 0);

  const maxBreakdown =
    breakdown.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  const cashFlow = [
    { name: "Income", value: income, color: "#22c55e" },
    { name: "Expenses", value: totalExpenses, color: "#3b82f6" },
    { name: "Savings", value: savings, color: "#8b5cf6" },
  ];

  const maxCash =
    cashFlow.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="premium-card rounded-[2rem] p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Analytics
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              Expense Breakdown
            </h3>
            <p className="mt-2 text-slate-500">
              See where your monthly expenses are concentrated.
            </p>
          </div>
        </div>

        {breakdown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            Enter expenses to see a breakdown.
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-6">
              {breakdown.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {item.name}
                    </span>
                    <span className="text-slate-500">
                      {currency(item.value)}
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.value / maxBreakdown) * 100}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {breakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="premium-card rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Cash Flow
        </p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          Income vs Expenses
        </h3>
        <p className="mt-2 text-slate-500">
          Compare your income, spending, and remaining savings.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-6 items-end min-h-[280px]">
          {cashFlow.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center justify-end"
            >
              <div className="text-sm text-slate-500 mb-3">
                {currency(item.value)}
              </div>
              <div className="h-56 w-full flex items-end justify-center">
                <div
                  className="w-10 rounded-t-2xl"
                  style={{
                    height: `${Math.max((item.value / maxCash) * 100, 4)}%`,
                    background: item.color,
                  }}
                />
              </div>
              <div className="mt-4 text-center text-sm font-medium text-slate-700">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
