import FinanceCharts from "@/components/FinanceCharts";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Wallet,
  Home as HomeIcon,
  Car,
  CreditCard,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  BarChart3,
  BadgeDollarSign,
  RotateCcw,
} from "lucide-react";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { HistoryList } from "@/components/HistoryList";
import { useCreateCalculation } from "@/hooks/use-calculations";

const formSchema = z.object({
  income: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
  rent: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
  carPayment: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
  otherExpenses: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [expenseRatio, setExpenseRatio] = useState<number | null>(null);
  const [savingsRate, setSavingsRate] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [disposableIncome, setDisposableIncome] = useState<number | null>(null);
  const [housingRatio, setHousingRatio] = useState<number | null>(null);
  const [transportRatio, setTransportRatio] = useState<number | null>(null);
  const [cashFlowWarning, setCashFlowWarning] = useState<string | null>(null);

  const { mutate: saveCalculation, isPending } = useCreateCalculation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 0,
      rent: 0,
      carPayment: 0,
      otherExpenses: 0,
    },
  });

  const watchedIncome = Number(watch("income") || 0);
  const watchedRent = Number(watch("rent") || 0);
  const watchedCarPayment = Number(watch("carPayment") || 0);
  const watchedOtherExpenses = Number(watch("otherExpenses") || 0);

  const resetDashboard = () => {
    reset({
      income: 0,
      rent: 0,
      carPayment: 0,
      otherExpenses: 0,
    });

    setCurrentScore(null);
    setExpenseRatio(null);
    setSavingsRate(null);
    setTotalExpenses(null);
    setDisposableIncome(null);
    setHousingRatio(null);
    setTransportRatio(null);
    setCashFlowWarning(null);
  };

  const onSubmit = (data: FormData) => {
    const { income, rent, carPayment, otherExpenses } = data;

    const expenses = rent + carPayment + otherExpenses;
    const leftover = income - expenses;

    let score = 0;
    let calculatedExpenseRatio = 0;
    let calculatedSavingsRate = 0;
    let calculatedHousingRatio = 0;
    let calculatedTransportRatio = 0;

    if (income <= 0 && expenses > 0) {
      setCashFlowWarning(
        "Please enter monthly income before calculating financial health.",
      );
    } else if (expenses > income) {
      setCashFlowWarning(
        "Warning: Your expenses exceed your income. This indicates negative cash flow.",
      );
    } else {
      setCashFlowWarning(null);
    }

    if (income > 0) {
      const rawScore = ((income - expenses) / income) * 100;
      score = Math.max(0, Math.min(100, Math.round(rawScore)));

      calculatedExpenseRatio = Math.round((expenses / income) * 100);
      calculatedSavingsRate = Math.max(
        0,
        Math.min(100, Math.round((leftover / income) * 100)),
      );
      calculatedHousingRatio = Math.round((rent / income) * 100);
      calculatedTransportRatio = Math.round((carPayment / income) * 100);
    }

    setCurrentScore(score);
    setExpenseRatio(calculatedExpenseRatio);
    setSavingsRate(calculatedSavingsRate);
    setTotalExpenses(expenses);
    setDisposableIncome(leftover);
    setHousingRatio(calculatedHousingRatio);
    setTransportRatio(calculatedTransportRatio);

    saveCalculation({
      income,
      rent,
      carPayment,
      otherExpenses,
      score,
    });
  };

  const statCards = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: "Financial Health",
        value: "Score-based",
        desc: "Quickly measure overall budget strength.",
      },
      {
        icon: BarChart3,
        title: "Expense Analytics",
        value: "Real-time",
        desc: "Track ratios, burden levels, and cash flow.",
      },
      {
        icon: BadgeDollarSign,
        title: "Budget Clarity",
        value: "Actionable",
        desc: "See how your income supports your lifestyle.",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card rounded-[2.25rem] p-7 sm:p-10 mb-10 overflow-hidden relative"
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_28%)]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 mb-6">
                <Sparkles className="h-4 w-4" />
                Financial health scoring, simplified
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-950 leading-tight font-display">
                Wealth IQ <span className="text-primary">Calculator</span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg md:text-[1.45rem] leading-8 text-slate-600">
                A clean financial score tool that turns your monthly income and
                expenses into a simple, visual health snapshot. See your score,
                spending ratios, cash flow, and history in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Live score analysis",
                  "Expense ratio tracking",
                  "Savings health insights",
                  "Calculation history",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid gap-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-[1.75rem] border border-slate-100 bg-white/80 p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {card.title}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold text-slate-900 font-display">
                          {card.value}
                        </h3>
                        <p className="mt-2 text-base leading-7 text-slate-500">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="premium-card rounded-[2rem] p-7 sm:p-9 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500" />

              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Input panel
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mt-1">
                    Your Monthly Metrics
                  </h2>
                </div>

                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-500" />
                    Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="financial-input w-full pl-9 pr-4 py-4 text-lg font-semibold text-slate-900 placeholder:text-slate-300"
                      {...register("income")}
                    />
                  </div>
                  {errors.income && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.income.message}
                    </p>
                  )}
                </div>

                <div className="section-divider" />

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-blue-500" />
                    Rent / Mortgage
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="financial-input w-full pl-9 pr-4 py-4 text-lg font-semibold text-slate-900 placeholder:text-slate-300"
                      {...register("rent")}
                    />
                  </div>
                  {errors.rent && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.rent.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Car className="w-4 h-4 text-amber-500" />
                      Car Payment
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="financial-input w-full pl-9 pr-4 py-4 text-lg font-semibold text-slate-900 placeholder:text-slate-300"
                        {...register("carPayment")}
                      />
                    </div>
                    {errors.carPayment && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.carPayment.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-500" />
                      Other Expenses
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="financial-input w-full pl-9 pr-4 py-4 text-lg font-semibold text-slate-900 placeholder:text-slate-300"
                        {...register("otherExpenses")}
                      />
                    </div>
                    {errors.otherExpenses && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.otherExpenses.message}
                      </p>
                    )}
                  </div>
                </div>

                {cashFlowWarning && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{cashFlowWarning}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="financial-button w-full py-5 px-6 rounded-2xl font-bold text-white text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Calculating your score..." : "Calculate Wealth IQ"}
                  </button>

                  <button
                    type="button"
                    onClick={resetDashboard}
                    className="w-full py-5 px-6 rounded-2xl font-bold text-slate-700 text-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Inputs
                  </button>
                </div>

                <p className="text-xs text-center text-slate-400 leading-relaxed">
                  Your score reflects how much of your income remains after your
                  recurring expenses. Lower burden and stronger savings usually
                  produce a healthier score.
                </p>
              </form>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <ScoreDisplay
              score={currentScore}
              expenseRatio={expenseRatio}
              savingsRate={savingsRate}
              totalExpenses={totalExpenses}
              disposableIncome={disposableIncome}
              housingRatio={housingRatio}
              transportRatio={transportRatio}
            />

            {currentScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FinanceCharts
                  income={watchedIncome}
                  rent={watchedRent}
                  carPayment={watchedCarPayment}
                  otherExpenses={watchedOtherExpenses}
                />
              </motion.div>
            )}

            <div className="premium-card rounded-[2rem] p-7 sm:p-9">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    History
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-display mt-1">
                    Recent Calculations
                  </h3>
                </div>
              </div>

              <HistoryList />
            </div>
          </motion.section>
        </div>

        <footer className="mt-10 text-center text-sm text-slate-400">
          Wealth IQ Calculator • Created by Jardin Gwin • Financial analytics portfolio project
        </footer>
      </div>
    </div>
  );
}
