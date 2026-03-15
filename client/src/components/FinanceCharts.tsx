import { useMemo, useState } from "react";

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

  const cashFlow = [
    { name: "Income", value: income, color: "#22c55e" },
    { name: "Expenses", value: totalExpenses, color: "#3b82f6" },
    { name: "Savings", value: savings, color: "#8b5cf6" },
  ];

  const maxCash =
    cashFlow.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  const totalBreakdownValue =
    breakdown.reduce((sum, item) => sum + item.value, 0) || 1;

  const donutData = useMemo(() => {
    let runningOffset = 0;

    return breakdown.map((item) => {
      const percentage = item.value / totalBreakdownValue;
      const dash = percentage * 100;
      const gap = 100 - dash;

      const result = {
        ...item,
        dashArray: `${dash} ${gap}`,
        dashOffset: -runningOffset,
      };

      runningOffset += dash;
      return result;
    });
  }, [breakdown, totalBreakdownValue]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="premium-card rounded-[2rem] p-7 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
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
              totalBreakdownValue > income * 0.7
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }`}
          >
            {totalBreakdownValue > income * 0.7 ? "Moderate Risk" : "Healthy"}
          </div>
        </div>

        {breakdown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            Enter expenses to see a breakdown.
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <svg viewBox="0 0 42 42" className="h-64 w-64 sm:h-72 sm:w-72 -rotate-90">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />

                  {donutData.map((item) => (
                    <circle
                      key={item.name}
                      cx="21"
                      cy="21"
                      r="15.9155"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={activeBreakdown === item.name ? "5" : "4"}
                      strokeDasharray={item.dashArray}
                      strokeDashoffset={item.dashOffset}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter:
                          activeBreakdown === item.name
                            ? "brightness(0.88)"
                            : "none",
                      }}
                      onClick={() =>
                        setActiveBreakdown((prev) =>
                          prev === item.name ? null : item.name
                        )
                      }
                    />
                  ))}
                </svg>

                <div className="absolute text-center">
                  <div className="text-sm uppercase tracking-[0.16em] text-slate-400 font-semibold">
                    Total
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                    {currency(totalBreakdownValue)}
                  </div>
                </div>
              </div>

              {activeBreakdown && (
                <div className="mt-4 rounded-2xl bg-slate-100/90 px-4 py-3 text-sm sm:text-base text-slate-600 shadow-inner">
                  {
                    breakdown.find((item) => item.name === activeBreakdown)?.name
                  }
                  :{" "}
                  {currency(
                    breakdown.find((item) => item.name === activeBreakdown)?.value || 0
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {breakdown.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setActiveBreakdown((prev) =>
                      prev === item.name ? null : item.name
                    )
                  }
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm sm:text-base transition-all ${
                    activeBreakdown === item.name
                      ? "bg-slate-100 shadow-inner text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="premium-card rounded-[2rem] p-7 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Cash Flow
        </p>
        <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
          Income vs Expenses
        </h3>
        <p className="mt-2 text-slate-500 text-base sm:text-lg">
          Compare your income, spending, and remaining savings.
        </p>

        <div className="mt-8 grid min-h-[340px] sm:min-h-[380px] grid-cols-3 gap-4 sm:gap-6 items-end">
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

              <div className="flex h-64 sm:h-72 w-full items-end justify-center">
                <div
                  className="w-12 sm:w-14 rounded-t-[1.25rem] shadow-sm transition-all duration-200"
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
