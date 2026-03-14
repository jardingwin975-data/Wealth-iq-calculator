import { useMemo, useState } from "react";
import {
  Wallet,
  Home as HomeIcon,
  Car,
  ShoppingCart,
  CreditCard,
  Sparkles,
  ShieldCheck,
  BarChart3,
  BadgeDollarSign,
  RotateCcw,
} from "lucide-react";

import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";
import AIFinancialAdvisor from "../components/AIFinancialAdvisor";
import { HistoryList } from "../components/HistoryList";
import { useCreateCalculation } from "../hooks/use-calculations";

export default function Home() {
  const [income, setIncome] = useState(0);
  const [rent, setRent] = useState(0);
  const [carPayment, setCarPayment] = useState(0);
  const [groceries, setGroceries] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const [score, setScore] = useState<number | null>(null);
  const [expenseRatio, setExpenseRatio] = useState<number | null>(null);
  const [savingsRate, setSavingsRate] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [disposableIncome, setDisposableIncome] = useState<number | null>(null);
  const [housingRatio, setHousingRatio] = useState<number | null>(null);
  const [transportRatio, setTransportRatio] = useState<number | null>(null);

  const createCalculation = useCreateCalculation();

  const statCards = [
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
  ];

  const calculate = () => {
    const expenses = rent + carPayment + groceries + otherExpenses;
    const disposable = income - expenses;

    const ratio = income > 0 ? (expenses / income) * 100 : 0;
    const savings = income > 0 ? (disposable / income) * 100 : 0;
    const housing = income > 0 ? (rent / income) * 100 : 0;
    const transport = income > 0 ? (carPayment / income) * 100 : 0;

    let calculatedScore = Math.round(100 - ratio + savings);
    calculatedScore = Math.max(0, Math.min(100, calculatedScore));

    setScore(calculatedScore);
    setExpenseRatio(Math.round(ratio));
    setSavingsRate(Math.max(0, Math.round(savings)));
    setTotalExpenses(expenses);
    setDisposableIncome(disposable);
    setHousingRatio(Math.round(housing));
    setTransportRatio(Math.round(transport));

    createCalculation.mutate({
      income,
      rent,
      carPayment,
      otherExpenses: groceries + otherExpenses,
      score: calculatedScore,
    });
  };

  const resetInputs = () => {
    setIncome(0);
    setRent(0);
    setCarPayment(0);
    setGroceries(0);
    setOtherExpenses(0);

    setScore(null);
    setExpenseRatio(null);
    setSavingsRate(null);
    setTotalExpenses(null);
    setDisposableIncome(null);
    setHousingRatio(null);
    setTransportRatio(null);
  };

  const report = useMemo(
    () => ({
      income,
      rent,
      carPayment,
      groceries,
      otherExpenses,
      score,
      expenseRatio,
      savingsRate,
      totalExpenses,
      disposableIncome,
      housingRatio,
      transportRatio,
    }),
    [
      income,
      rent,
      carPayment,
      groceries,
      otherExpenses,
      score,
      expenseRatio,
      savingsRate,
      totalExpenses,
      disposableIncome,
      housingRatio,
      transportRatio,
    ],
  );

  return (
    <div className="min-h-screen app-shell px-4 pb-14 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <a
            href="https://gwinanalytics.com"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#11161d] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            ← Gwin Analytics
          </a>
        </div>

        <section className="premium-card relative overflow-hidden rounded-[2.5rem] p-7 sm:p-10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_28%)]" />

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Financial health scoring, simplified
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">
                Wealth IQ <span className="text-primary">Financial Calculator</span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-[1.45rem]">
                A clean financial score tool that turns your monthly income and
                expenses into a simple, visual health snapshot. See your score,
                spending ratios, cash flow, and history in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
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

            <div className="grid gap-4 lg:col-span-5">
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
                        <h3 className="font-display mt-1 text-2xl font-bold text-slate-900">
                          {card.value}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="premium-card relative rounded-[2rem] p-8">
              <div className="absolute left-0 top-0 h-1.5 w-full rounded-t-[2rem] bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500" />

              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Input panel
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                    Your Monthly Metrics
                  </h2>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:flex">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-7">
                <InputField
                  label="Monthly Income"
                  icon={<Wallet className="h-4 w-4 text-emerald-500" />}
                  value={income}
                  onChange={setIncome}
                />

                <div className="section-divider" />

                <InputField
                  label="Rent / Mortgage"
                  icon={<HomeIcon className="h-4 w-4 text-blue-500" />}
                  value={rent}
                  onChange={setRent}
                />

                <InputField
                  label="Car Payment"
                  icon={<Car className="h-4 w-4 text-amber-500" />}
                  value={carPayment}
                  onChange={setCarPayment}
                />

                <InputField
                  label="Groceries"
                  icon={<ShoppingCart className="h-4 w-4 text-green-500" />}
                  value={groceries}
                  onChange={setGroceries}
                />

                <InputField
                  label="Other Expenses"
                  icon={<CreditCard className="h-4 w-4 text-purple-500" />}
                  value={otherExpenses}
                  onChange={setOtherExpenses}
                />

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={calculate}
                    className="financial-button w-full rounded-2xl px-6 py-5 text-lg font-bold text-white"
                  >
                    Calculate Wealth IQ
                  </button>

                  <button
                    type="button"
                    onClick={resetInputs}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-lg font-bold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Reset Inputs
                  </button>
                </div>

                <p className="text-center text-xs leading-relaxed text-slate-400">
                  Your score reflects how much of your income remains after your
                  recurring expenses. Lower burden and stronger savings usually
                  produce a healthier score.
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-8 lg:col-span-7">
            <ScoreDisplay
              score={score}
              expenseRatio={expenseRatio}
              savingsRate={savingsRate}
              totalExpenses={totalExpenses}
              disposableIncome={disposableIncome}
              housingRatio={housingRatio}
              transportRatio={transportRatio}
            />
          </section>
        </div>

        <div className="mt-8">
          <FinanceCharts
            income={income}
            rent={rent}
            carPayment={carPayment}
            Groceries={groceries}
            otherExpenses={otherExpenses}
          />
        </div>

        <div className="mt-8">
          <AIFinancialAdvisor report={report} />
        </div>

        <div className="mt-8">
          <section className="premium-card rounded-[2rem] p-7 sm:p-9">
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  History
                </p>
                <h3 className="font-display mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                  Recent Calculations
                </h3>
              </div>
            </div>
            <HistoryList />
          </section>
        </div>

        <footer className="mt-10 text-center text-sm text-slate-400">
          Wealth IQ Calculator • Created by Jardin Gwin • Financial analytics
          portfolio project
        </footer>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon}
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-300">
          $
        </span>
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="financial-input w-full py-4 pl-9 pr-4 text-lg font-semibold text-slate-900 placeholder:text-slate-300"
          placeholder="0"
        />
      </div>
    </div>
  );
}
