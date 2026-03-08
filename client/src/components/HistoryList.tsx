import { useCalculations } from "@/hooks/use-calculations";
import {
  Calendar,
  Wallet,
  PiggyBank,
  TrendingUp,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

function getScoreMeta(score: number) {
  if (score >= 80) {
    return {
      badge: "bg-emerald-100 text-emerald-700",
      label: "Excellent",
    };
  }
  if (score >= 50) {
    return {
      badge: "bg-blue-100 text-blue-700",
      label: "Stable",
    };
  }
  if (score >= 20) {
    return {
      badge: "bg-amber-100 text-amber-700",
      label: "Caution",
    };
  }
  return {
    badge: "bg-red-100 text-red-700",
    label: "Critical",
  };
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export function HistoryList() {
  const { data: calculations, isLoading } = useCalculations();

  const handleExportCsv = () => {
    if (!calculations || calculations.length === 0) return;

    const sorted = [...calculations].sort((a, b) => b.id - a.id);

    const rows = sorted.map((calc) => {
      const totalExpenses = calc.rent + calc.carPayment + calc.otherExpenses;
      const disposableIncome = calc.income - totalExpenses;
      const expenseRatio =
        calc.income > 0 ? Math.round((totalExpenses / calc.income) * 100) : 0;
      const savingsRate =
        calc.income > 0
          ? Math.max(0, Math.round((disposableIncome / calc.income) * 100))
          : 0;

      return {
        calculationId: calc.id,
        income: calc.income,
        rent: calc.rent,
        carPayment: calc.carPayment,
        otherExpenses: calc.otherExpenses,
        totalExpenses,
        disposableIncome,
        expenseRatio,
        savingsRate,
        score: calc.score,
      };
    });

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row];
            return `"${String(value)}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "wealth-iq-history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-3xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!calculations || calculations.length === 0) {
    return (
      <div className="text-center p-10 rounded-3xl border-2 border-dashed border-slate-200 bg-white/70">
        <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-700 font-semibold text-lg">No calculations yet</p>
        <p className="text-sm text-slate-400 mt-2">
          Your financial history will appear here after you run your first score.
        </p>
      </div>
    );
  }

  const sorted = [...calculations].sort((a, b) => b.id - a.id);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export History to CSV
        </button>
      </div>

      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin">
        {sorted.map((calc, idx) => {
          const totalExpenses = calc.rent + calc.carPayment + calc.otherExpenses;
          const disposableIncome = calc.income - totalExpenses;
          const expenseRatio =
            calc.income > 0 ? Math.round((totalExpenses / calc.income) * 100) : 0;
          const savingsRate =
            calc.income > 0
              ? Math.max(0, Math.round((disposableIncome / calc.income) * 100))
              : 0;

          const meta = getScoreMeta(calc.score);

          return (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-3xl border border-slate-100 bg-white/85 shadow-[0_12px_32px_rgba(15,23,42,0.05)] p-5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-2xl font-bold text-slate-900 font-display">
                      {formatCurrency(calc.income)}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${meta.badge}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    Calc #{calc.id}
                  </div>
                </div>

                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${meta.badge}`}
                >
                  {calc.score}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold">
                    Total Expenses
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold">
                    Disposable
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {formatCurrency(disposableIncome)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Expense Ratio
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {expenseRatio}%
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold flex items-center gap-1">
                    <PiggyBank className="w-3.5 h-3.5" />
                    Savings Rate
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {savingsRate}%
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
