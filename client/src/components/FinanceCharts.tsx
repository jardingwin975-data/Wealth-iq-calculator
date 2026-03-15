import { useState } from "react";

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
  const [activeBreakdown, setActiveBreakdown] = useState<string | null>(null);
  const [activeCashFlow, setActiveCashFlow] = useState<string | null>(null);

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
      <div className="premium-card rounded-[2rem] p-6 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Analytics
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Expense Breakdown
            </h3>
            <p className="mt-2 text-slate-500 text-base sm:text-lg">
              See where your monthly expenses are concentrated.
            </p>
          </div>

          <div
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
              maxBreakdown > income * 0.35
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }`}
          >
            {maxBreakdown > income * 0.35 ? "Moderate Risk" : "Healthy"}
          </div>
        </div>

        {breakdown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            Enter expenses to see a breakdown.
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-5">
              {breakdown.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setActiveBreakdown((prev) =>
                      prev === item.name ? null : item.name
                    )
                  }
                  className={`w-full rounded-2xl p-2 text-left transition-all ${
                    activeBreakdown === item.name
                      ? "bg-slate-100/90 shadow-inner"
                      : "bg-transparent"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between text-sm sm:text-base">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{currency(item.value)}</span>
                  </div>

                  <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${(item.value / maxBreakdown) * 100}%`,
                        background: item.color,
                        filter:
                          activeBreakdown === item.name
                            ? "brightness(0.88)"
                            : "none",
                      }}
                    />
                  </div>

                  {activeBreakdown === item.name && (
                    <div className="mt-2 text-sm text-slate-500">
                      Amount: {currency(item.value)}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {breakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm sm:text-base text-slate-600"
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

      <div className="premium-card rounded-[2rem] p-6 sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Cash Flow
        </p>
        <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
          Income vs Expenses
        </h3>
        <p className="mt-2 text-slate-500 text-base sm:text-lg">
          Compare your income, spending, and remaining savings.
        </p>

        <div className="mt-8 grid min-h-[280px] grid-cols-3 gap-4 sm:gap-6 items-end">
          {cashFlow.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                setActiveCashFlow((prev) => (prev === item.name ? null : item.name))
              }
              className={`flex flex-col items-center justify-end rounded-2xl px-2 py-3 transition-all ${
                activeCashFlow === item.name
                  ? "bg-slate-100/90 shadow-inner"
                  : "bg-transparent"
              }`}
            >
              <div className="mb-3 text-sm sm:text-base text-slate-500">
                {currency(item.value)}
              </div>

              <div className="flex h-56 w-full items-end justify-center">
                <div
                  className="w-10 sm:w-12 rounded-t-2xl shadow-sm transition-all duration-200"
                  style={{
                    height: `${Math.max((item.value / maxCash) * 100, 4)}%`,
                    background: item.color,
                    filter:
                      activeCashFlow === item.name
                        ? "brightness(0.88)"
                        : "none",
                  }}
                />
              </div>

              <div className="mt-4 text-center text-sm sm:text-base font-medium text-slate-700">
                {item.name}
              </div>

              {activeCashFlow === item.name && (
                <div className="mt-2 text-xs sm:text-sm text-slate-500">
                  Amount: {currency(item.value)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
