import { useMemo } from "react";
import {
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
  House,
  Car,
  ShieldAlert,
} from "lucide-react";

interface ScoreDisplayProps {
  score: number | null;
  expenseRatio: number | null;
  savingsRate: number | null;
  totalExpenses: number | null;
  disposableIncome: number | null;
  housingRatio: number | null;
  transportRatio: number | null;
}

export function ScoreDisplay({
  score,
  expenseRatio,
  savingsRate,
  totalExpenses,
  disposableIncome,
  housingRatio,
  transportRatio,
}: ScoreDisplayProps) {
  const details = useMemo(() => {
    if (score === null) {
      return {
        color: "text-slate-500",
        stroke: "#cbd5e1",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        message: "Ready to calculate",
        band: "No score yet",
      };
    }

    if (score >= 80) {
      return {
        color: "text-emerald-500",
        stroke: "#10b981",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        message: "Excellent Wealth Health!",
        band: "Elite financial position",
      };
    }

    if (score >= 50) {
      return {
        color: "text-blue-500",
        stroke: "#3b82f6",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        message: "Good Financial Baseline",
        band: "Stable, with room to optimize",
      };
    }

    if (score >= 20) {
      return {
        color: "text-amber-500",
        stroke: "#f59e0b",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        message: "Caution: High Expenses",
        band: "Spending pressure is building",
      };
    }

    return {
      color: "text-red-500",
      stroke: "#ef4444",
      badge: "bg-red-50 text-red-700 border-red-200",
      message: "Critical: Expenses exceed safe limits",
      band: "Immediate financial pressure",
    };
  }, [score]);

  const recommendation = useMemo(() => {
    if (score === null) {
      return "Enter your monthly numbers to generate a financial health snapshot.";
    }
    if ((housingRatio ?? 0) > 35) {
      return "Your housing burden is elevated. Keeping housing closer to 30–35% of income usually improves long-term stability.";
    }
    if ((expenseRatio ?? 0) > 70) {
      return "Your expense ratio is high. Look at recurring bills first because those usually create the fastest improvement.";
    }
    if ((transportRatio ?? 0) > 15) {
      return "Transportation costs may be taking too much of your income. Reducing that burden can improve flexibility.";
    }
    if ((savingsRate ?? 0) < 20) {
      return "Your savings rate is positive, but strengthening it further would improve resilience and long-term wealth building.";
    }
    return "You’re in a strong position. Focus on maintaining low expense pressure and increasing investable cash flow over time.";
  }, [score, housingRatio, expenseRatio, transportRatio, savingsRate]);

  const pressurePoint = useMemo(() => {
    if (score === null) return "Awaiting inputs";

    const ratios = [
      { label: "Housing burden", value: housingRatio ?? 0 },
      { label: "Transport burden", value: transportRatio ?? 0 },
      { label: "Expense ratio", value: expenseRatio ?? 0 },
    ];

    return ratios.sort((a, b) => b.value - a.value)[0].label;
  }, [score, housingRatio, transportRatio, expenseRatio]);

  const metricCards = [
    {
      label: "Expense Ratio",
      value: `${expenseRatio ?? 0}%`,
      icon: TrendingUp,
    },
    {
      label: "Savings Rate",
      value: `${savingsRate ?? 0}%`,
      icon: PiggyBank,
    },
    {
      label: "Total Expenses",
      value: `$${(totalExpenses ?? 0).toLocaleString()}`,
      icon: ShieldAlert,
    },
    {
      label: "Disposable Income",
      value: `$${(disposableIncome ?? 0).toLocaleString()}`,
      icon: ArrowUpRight,
    },
    {
      label: "Housing Burden",
      value: `${housingRatio ?? 0}%`,
      icon: House,
    },
    {
      label: "Transport Burden",
      value: `${transportRatio ?? 0}%`,
      icon: Car,
    },
  ];

  const safeScore = Math.max(0, Math.min(100, score ?? 0));
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="premium-card rounded-[2rem] p-7 sm:p-9 overflow-hidden relative">
      <div className="relative z-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Financial score
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mt-1">
            Your Wealth IQ
          </h3>
          <div
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold mt-4 ${details.badge}`}
          >
            {details.band}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          <div className="xl:col-span-5 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 -rotate-90" viewBox="0 0 256 256">
                <circle
                  cx="128"
                  cy="128"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r={radius}
                  stroke={details.stroke}
                  strokeWidth="12"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <div
                  className={`text-6xl font-extrabold tracking-tighter font-display ${details.color}`}
                >
                  {score !== null ? safeScore : "—"}
                </div>
                <div className="text-sm font-medium text-slate-400 mt-1">/ 100</div>
              </div>
            </div>

            <p className={`mt-6 text-center font-semibold text-xl ${details.color}`}>
              {details.message}
            </p>
          </div>

          <div className="xl:col-span-7">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {metricCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl bg-white/80 border border-slate-100 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold">
                      {item.label}
                    </span>
                    <item.icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 leading-none">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">
              Recommendation
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{recommendation}</p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">
              Strongest signal
            </p>
            <p className="mt-3 text-lg font-bold text-slate-900">
              {score === null
                ? "No signal yet"
                : (savingsRate ?? 0) >= 25
                ? "Healthy savings capacity"
                : "Spending needs attention"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              This reflects how much of your income remains after essential and recurring expenses.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-bold">
              Pressure point
            </p>
            <p className="mt-3 text-lg font-bold text-slate-900">{pressurePoint}</p>
            <p className="mt-2 text-sm text-slate-500">
              The largest burden category often has the biggest effect on long-term financial flexibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
