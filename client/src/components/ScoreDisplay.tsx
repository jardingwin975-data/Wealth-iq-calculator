import { useEffect, useMemo, useState } from "react";
import { motion, animate } from "framer-motion";
import {
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
  House,
  Car,
  ShieldAlert,
  Share2,
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
  const [displayValue, setDisplayValue] = useState(0);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (score !== null) {
      const controls = animate(0, score, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate(value) {
          setDisplayValue(Math.round(value));
        },
      });

      return () => controls.stop();
    }

    setDisplayValue(0);
  }, [score]);

  const getScoreDetails = (s: number | null) => {
    if (s === null) {
      return {
        color: "text-slate-500",
        circle: "stroke-slate-300",
        glow: "bg-slate-300",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        message: "Ready to calculate",
        band: "No score yet",
      };
    }
    if (s >= 80) {
      return {
        color: "text-emerald-500",
        circle: "stroke-emerald-500",
        glow: "bg-emerald-400",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        message: "Excellent Wealth Health!",
        band: "Elite financial position",
      };
    }
    if (s >= 50) {
      return {
        color: "text-blue-500",
        circle: "stroke-blue-500",
        glow: "bg-blue-400",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        message: "Good Financial Baseline",
        band: "Stable, with room to optimize",
      };
    }
    if (s >= 20) {
      return {
        color: "text-amber-500",
        circle: "stroke-amber-500",
        glow: "bg-amber-400",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        message: "Caution: High Expenses",
        band: "Spending pressure is building",
      };
    }
    return {
      color: "text-red-500",
      circle: "stroke-red-500",
      glow: "bg-red-400",
      badge: "bg-red-50 text-red-700 border-red-200",
      message: "Critical: Expenses exceed safe limits",
      band: "Immediate financial pressure",
    };
  };

  const details = getScoreDetails(score);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    score !== null
      ? circumference - (score / 100) * circumference
      : circumference;

  const recommendation = useMemo(() => {
    if (score === null) {
      return "Enter your monthly numbers to generate a financial health snapshot.";
    }

    if ((housingRatio ?? 0) > 35) {
      return "Your housing burden is elevated. Keeping housing closer to 30–35% of income usually improves long-term stability.";
    }

    if ((expenseRatio ?? 0) > 70) {
      return "Your expense ratio is high. Look at recurring bills first — that’s often the fastest way to improve your score.";
    }

    if ((transportRatio ?? 0) > 15) {
      return "Transportation costs may be taking too much of your income. Reducing that burden can lift your financial flexibility.";
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
      value: `$${totalExpenses?.toLocaleString() ?? "0"}`,
      icon: ShieldAlert,
    },
    {
      label: "Disposable Income",
      value: `$${disposableIncome?.toLocaleString() ?? "0"}`,
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

  const handleShare = async () => {
    if (score === null) return;

    const shareText =
      `My Wealth IQ score is ${score}/100.\n` +
      `Expense Ratio: ${expenseRatio ?? 0}%\n` +
      `Savings Rate: ${savingsRate ?? 0}%\n` +
      `Disposable Income: $${disposableIncome?.toLocaleString() ?? "0"}\n` +
      `Generated with Wealth IQ Financial Calculator by Gwin Analytics.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Wealth IQ Score",
          text: shareText,
          url: window.location.href,
        });
        setShareMessage("Result shared.");
        setTimeout(() => setShareMessage(""), 2500);
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setShareMessage("Result copied to clipboard.");
      setTimeout(() => setShareMessage(""), 2500);
    } catch {
      setShareMessage("Unable to share right now.");
      setTimeout(() => setShareMessage(""), 2500);
    }
  };

  return (
    <div className="premium-card rounded-[2rem] p-7 sm:p-9 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        {score !== null && (
          <>
            <div
              className={`absolute top-16 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full blur-3xl opacity-20 ${details.glow}`}
            />
            <div
              className={`absolute bottom-8 right-8 h-32 w-32 rounded-full blur-3xl opacity-10 ${details.glow}`}
            />
          </>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

          <div className="flex flex-col items-start sm:items-end gap-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={score === null}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" />
              Share Result
            </button>

            {shareMessage && (
              <p className="text-xs text-slate-500">{shareMessage}</p>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          <div className="xl:col-span-5 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r={radius}
                  className="stroke-slate-200"
                  strokeWidth="12"
                  fill="transparent"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r={radius}
                  className={`${details.circle} drop-shadow-md`}
                  strokeWidth="12"
                  fill="transparent"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <motion.div
                  className={`text-6xl font-extrabold tracking-tighter font-display ${details.color}`}
                >
                  {score !== null ? displayValue : "—"}
                </motion.div>
                <div className="text-sm font-medium text-slate-400 mt-1">
                  / 100
                </div>
              </div>
            </div>

            <motion.p
              key={details.message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 text-center font-semibold text-xl ${details.color}`}
            >
              {details.message}
            </motion.p>
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
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {recommendation}
            </p>
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
            <p className="mt-3 text-lg font-bold text-slate-900">
              {pressurePoint}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              The largest burden category often has the biggest effect on long-term financial flexibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
