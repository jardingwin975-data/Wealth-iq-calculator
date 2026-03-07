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

  const { mutate: saveCalculation, isPending } = useCreateCalculation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: undefined,
      rent: undefined,
      carPayment: undefined,
      otherExpenses: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    const { income, rent, carPayment, otherExpenses } = data;

    const expenses = rent + carPayment + otherExpenses;
    const leftover = income - expenses;

    let score = 0;
    let calculatedExpenseRatio = 0;
    let calculatedSavingsRate = 0;
    let calculatedHousingRatio = 0;
    let calculatedTransportRatio = 0;

    if (income > 0) {
      const rawScore = ((income - expenses) / income) * 100;
      score = Math.max(0, Math.min(100, Math.round(rawScore)));

      calculatedExpenseRatio = Math.round((expenses / income) * 100);
      calculatedSavingsRate = Math.max(
        0,
        Math.min(100, Math.round((leftover / income) * 100))
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
    []
  );

  return (
    <div className="min-h-screen app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] premium-card p-8 sm:p-10 lg:p-14 mb-10"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 mb-5">
                <Sparkles className="h-4 w-4" />
                Financial health scoring, simplified
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 leading-tight font-display">
                Wealth IQ{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Calculator
                </span>
              </h1>

              <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
                A clean financial score tool that turns your monthly income and
                expenses into a simple, visual health snapshot. See your score,
                spending ratios, cash flow, and history in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="soft-pill">Live score analysis</div>
                <div className="soft-pill">Expense ratio tracking</div>
                <div className="soft-pill">Savings health insights</div>
                <div className="soft-pill">Calculation history</div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {statCards.map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08 }}
                  className="rounded-3xl border border-white/70 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {card.value}
                      </p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: FORM */}
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
                {/* Income */}
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

                {/* Rent */}
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

                <button
                  type="submit"
                  disabled={isPending}
                  className="financial-button w-full mt-3 py-5 px-6 rounded-2xl font-bold text-white text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? "Calculating your score..." : "Calculate Wealth IQ"}
                </button>

                <p className="text-xs text-center text-slate-400 leading-relaxed">
                  Your score reflects how much of your income remains after your
                  recurring expenses. Lower burden and stronger savings usually
                  produce a healthier score.
                </p>
              </form>
            </div>
          </motion.section>

          {/* RIGHT: RESULTS */}
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
      </div>
    </div>
  );
}