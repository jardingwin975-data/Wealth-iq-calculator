import { useMemo, useState } from "react";
import { Wallet, House, Car, ShoppingCart, CreditCard, RotateCcw } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";
import AIFinancialAdvisor from "../components/AIFinancialAdvisor";
import { HistoryList } from "../components/HistoryList";
import { useCreateCalculation } from "../hooks/use-calculations";

const queryClient = new QueryClient();

function WealthIQPage() {
  const [income, setIncome] = useState<number>(2100);
  const [rent, setRent] = useState<number>(350);
  const [carPayment, setCarPayment] = useState<number>(400);
  const [groceries, setGroceries] = useState<number>(250);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);

  const [hasCalculated, setHasCalculated] = useState(false);

  const createCalculation = useCreateCalculation();

  const totalExpenses = useMemo(
    () => rent + carPayment + groceries + otherExpenses,
    [rent, carPayment, groceries, otherExpenses]
  );

  const disposableIncome = useMemo(
    () => income - totalExpenses,
    [income, totalExpenses]
  );

  const expenseRatio = useMemo(
    () => (income > 0 ? Math.round((totalExpenses / income) * 100) : 0),
    [income, totalExpenses]
  );

  const savingsRate = useMemo(
    () =>
      income > 0
        ? Math.max(0, Math.round((disposableIncome / income) * 100))
        : 0,
    [income, disposableIncome]
  );

  const housingRatio = useMemo(
    () => (income > 0 ? Math.round((rent / income) * 100) : 0),
    [income, rent]
  );

  const transportRatio = useMemo(
    () => (income > 0 ? Math.round((carPayment / income) * 100) : 0),
    [income, carPayment]
  );

  const score = useMemo(() => {
    if (income <= 0) return 0;

    let nextScore = 100;

    if (expenseRatio >= 90) nextScore -= 45;
    else if (expenseRatio >= 80) nextScore -= 35;
    else if (expenseRatio >= 70) nextScore -= 25;
    else if (expenseRatio >= 60) nextScore -= 15;
    else if (expenseRatio >= 50) nextScore -= 5;

    if (savingsRate >= 30) nextScore += 8;
    else if (savingsRate >= 20) nextScore += 4;
    else if (savingsRate < 10) nextScore -= 10;

    if (housingRatio > 35) nextScore -= 8;
    if (transportRatio > 15) nextScore -= 6;
    if (disposableIncome < 0) nextScore -= 20;

    return Math.max(0, Math.min(100, Math.round(nextScore)));
  }, [
    income,
    expenseRatio,
    savingsRate,
    housingRatio,
    transportRatio,
    disposableIncome,
  ]);

  const comparison = useMemo(() => {
    const targetSavingsRate = 20;
    const targetDisposable = Math.round((income * targetSavingsRate) / 100);
    const recommendedMaxExpenses = Math.max(income - targetDisposable, 0);
    const improvementNeeded = Math.max(totalExpenses - recommendedMaxExpenses, 0);

    return {
      recommendedMaxExpenses,
      improvementNeeded,
    };
  }, [income, totalExpenses]);

  const report = {
    income,
    rent,
    carPayment,
    groceries,
    otherExpenses,
    score: hasCalculated ? score : null,
    expenseRatio: hasCalculated ? expenseRatio : null,
    savingsRate: hasCalculated ? savingsRate : null,
    totalExpenses: hasCalculated ? totalExpenses : null,
    disposableIncome: hasCalculated ? disposableIncome : null,
    housingRatio: hasCalculated ? housingRatio : null,
    transportRatio: hasCalculated ? transportRatio : null,
  };

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  const handleSave = () => {
    setHasCalculated(true);

    createCalculation.mutate({
      income,
      rent,
      carPayment,
      groceries,
      otherExpenses,
      score,
    });
  };

  const handleReset = () => {
    setIncome(2100);
    setRent(350);
    setCarPayment(400);
    setGroceries(250);
    setOtherExpenses(0);
    setHasCalculated(false);
  };

  const inputWrap =
    "rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.05)] p-6 sm:p-8";
  const inputClass =
    "financial-input w-full px-5 py-5 text-2xl text-slate-900";
  const labelClass =
    "mb-3 flex items-center gap-3 text-xl font-semibold text-slate-600";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_28%),linear-gradient(180deg,#edf8f4_0%,#eef4fb_40%,#f7f9fc_100%)]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        <a
          href="https://gwinanalytics.com"
          className="inline-flex items-center rounded-2xl bg-slate-950 px-6 py-4 text-xl font-semibold text-white shadow-lg"
        >
          ← Gwin Analytics
        </a>

        <section className="premium-card mt-8 rounded-[2.5rem] p-8 sm:p-10">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-lg font-semibold text-emerald-700">
            Financial health scoring, simplified
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl leading-tight">
            <span className="text-slate-950">Wealth IQ Financial</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-10 text-slate-500 sm:text-2xl">
            A clean financial score tool that turns your monthly income and expenses
            into a simple health snapshot with visual insights, scoring, cash-flow
            clarity, AI guidance, and downloadable history.
          </p>
        </section>

        <section className="mt-10 grid gap-6">
          <div className="premium-card rounded-[2.5rem] p-8 sm:p-10">
            <h2 className="text-4xl font-black text-slate-950">Monthly Inputs</h2>

            <div className="mt-8 grid gap-6">
              <div className={inputWrap}>
                <label className={labelClass}>
                  <Wallet className="h-7 w-7 text-slate-500" />
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <House className="h-7 w-7 text-slate-500" />
                  Rent / Mortgage
                </label>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <Car className="h-7 w-7 text-slate-500" />
                  Car Payment
                </label>
                <input
                  type="number"
                  value={carPayment}
                  onChange={(e) => setCarPayment(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <ShoppingCart className="h-7 w-7 text-slate-500" />
                  Groceries
                </label>
                <input
                  type="number"
                  value={groceries}
                  onChange={(e) => setGroceries(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <CreditCard className="h-7 w-7 text-slate-500" />
                  Other Expenses
                </label>
                <input
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleCalculate}
                className="financial-button rounded-2xl px-8 py-5 text-xl font-bold text-white shadow-[0_16px_40px_rgba(16,185,129,0.18)]"
              >
                Calculate Wealth IQ
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-slate-950 px-8 py-5 text-xl font-bold text-white"
              >
                Save Calculation
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-5 text-xl font-bold text-slate-700"
              >
                <RotateCcw className="h-5 w-5" />
                Reset Inputs
              </button>
            </div>

            <p className="mt-8 text-lg leading-9 text-slate-400">
              Your score reflects how much of your income remains after your recurring
              expenses. Lower burden and stronger savings usually produce a healthier score.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <ScoreDisplay {...report} />
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

        <div className="mt-8 premium-card rounded-[2.5rem] p-8 sm:p-10">
          <h2 className="text-4xl font-black text-slate-950">Scenario Comparison</h2>
          <p className="mt-5 text-xl leading-10 text-slate-500">
            To hit a 20% savings rate, your target maximum monthly expenses would be:
          </p>
          <p className="mt-6 text-6xl font-black tracking-tight text-slate-950">
            ${comparison.recommendedMaxExpenses.toLocaleString()}
          </p>
          <p className="mt-6 text-xl leading-9 text-slate-500">
            {comparison.improvementNeeded > 0
              ? `You would need to cut about $${comparison.improvementNeeded.toLocaleString()} in monthly expenses to reach that target.`
              : "You are already at or better than that target."}
          </p>
        </div>

        <div className="mt-8">
          <AIFinancialAdvisor report={report} />
        </div>

        <div className="mt-8">
          <HistoryList />
        </div>

        <footer className="py-10 text-center text-lg text-slate-400">
          Wealth IQ Financial Calculator • Created by Jardin Gwin • Financial analytics portfolio project
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WealthIQPage />
    </QueryClientProvider>
  );
}
