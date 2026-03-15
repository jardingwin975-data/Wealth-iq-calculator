import { useMemo, useState } from "react";
import {
  Wallet,
  House,
  Car,
  ShoppingCart,
  CreditCard,
  RotateCcw,
  Wand2,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";
import AIFinancialAdvisor from "../components/AIFinancialAdvisor";
import { HistoryList } from "../components/HistoryList";
import { useCreateCalculation } from "../hooks/use-calculations";

const queryClient = new QueryClient();

function WealthIQPage() {
  const [income, setIncome] = useState("");
  const [rent, setRent] = useState("");
  const [carPayment, setCarPayment] = useState("");
  const [groceries, setGroceries] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");

  const [hasCalculated, setHasCalculated] = useState(false);

  const createCalculation = useCreateCalculation();

  const toNumber = (value: string) => {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const incomeValue = useMemo(() => toNumber(income), [income]);
  const rentValue = useMemo(() => toNumber(rent), [rent]);
  const carPaymentValue = useMemo(() => toNumber(carPayment), [carPayment]);
  const groceriesValue = useMemo(() => toNumber(groceries), [groceries]);
  const otherExpensesValue = useMemo(
    () => toNumber(otherExpenses),
    [otherExpenses]
  );

  const totalExpenses = useMemo(
    () => rentValue + carPaymentValue + groceriesValue + otherExpensesValue,
    [rentValue, carPaymentValue, groceriesValue, otherExpensesValue]
  );

  const disposableIncome = useMemo(
    () => incomeValue - totalExpenses,
    [incomeValue, totalExpenses]
  );

  const expenseRatio = useMemo(
    () =>
      incomeValue > 0 ? Math.round((totalExpenses / incomeValue) * 100) : 0,
    [incomeValue, totalExpenses]
  );

  const savingsRate = useMemo(
    () =>
      incomeValue > 0
        ? Math.max(0, Math.round((disposableIncome / incomeValue) * 100))
        : 0,
    [incomeValue, disposableIncome]
  );

  const housingRatio = useMemo(
    () => (incomeValue > 0 ? Math.round((rentValue / incomeValue) * 100) : 0),
    [incomeValue, rentValue]
  );

  const transportRatio = useMemo(
    () =>
      incomeValue > 0 ? Math.round((carPaymentValue / incomeValue) * 100) : 0,
    [incomeValue, carPaymentValue]
  );

  const score = useMemo(() => {
    if (incomeValue <= 0) return 0;

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
    incomeValue,
    expenseRatio,
    savingsRate,
    housingRatio,
    transportRatio,
    disposableIncome,
  ]);

  const comparison = useMemo(() => {
    const targetSavingsRate = 20;
    const targetDisposable = Math.round((incomeValue * targetSavingsRate) / 100);
    const recommendedMaxExpenses = Math.max(incomeValue - targetDisposable, 0);
    const improvementNeeded = Math.max(
      totalExpenses - recommendedMaxExpenses,
      0
    );

    return {
      recommendedMaxExpenses,
      improvementNeeded,
    };
  }, [incomeValue, totalExpenses]);

  const report = {
    income: incomeValue,
    rent: rentValue,
    carPayment: carPaymentValue,
    groceries: groceriesValue,
    otherExpenses: otherExpensesValue,
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
      income: incomeValue,
      rent: rentValue,
      carPayment: carPaymentValue,
      groceries: groceriesValue,
      otherExpenses: otherExpensesValue,
      score,
    });
  };

  const handleReset = () => {
    setIncome("");
    setRent("");
    setCarPayment("");
    setGroceries("");
    setOtherExpenses("");
    setHasCalculated(false);
  };

  const handleLoadDemo = () => {
    setIncome("4200");
    setRent("1400");
    setCarPayment("420");
    setGroceries("450");
    setOtherExpenses("600");
    setHasCalculated(true);
  };

  const inputWrap =
    "rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.05)] p-5 sm:p-6";
  const inputClass =
    "financial-input w-full px-5 py-4 text-xl sm:text-2xl text-slate-900";
  const labelClass =
    "mb-3 flex items-center gap-3 text-lg sm:text-xl font-semibold text-slate-600";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_32%),linear-gradient(180deg,#eef8f4_0%,#edf4fb_45%,#f7f9fc_100%)]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        <a
          href="https://gwinanalytics.com"
          className="inline-flex items-center rounded-2xl bg-slate-950 px-6 py-4 text-lg sm:text-xl font-semibold text-white shadow-lg"
        >
          ← Gwin Analytics
        </a>

        <section className="premium-card mt-8 rounded-[2.5rem] p-7 sm:p-10">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-base sm:text-lg font-semibold text-emerald-700">
            Financial health scoring, simplified
          </div>

          <h1 className="mt-8 text-[3.15rem] leading-[0.95] font-black tracking-tight text-slate-950 sm:text-[4.5rem]">
            <span className="text-slate-950">Wealth IQ Financial</span>
            <br />
            <span className="text-emerald-500">Calculator</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg sm:text-[2rem] leading-9 sm:leading-[3.25rem] text-slate-500">
            A clean financial score tool that turns your monthly income and expenses
            into a simple health snapshot with visual insights, scoring, cash-flow
            clarity, AI guidance, and downloadable history.
          </p>
        </section>

        <section className="mt-8 grid gap-6">
          <div className="premium-card rounded-[2.5rem] p-7 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Monthly Inputs
            </h2>

            <div className="mt-8 grid gap-6">
              <div className={inputWrap}>
                <label className={labelClass}>
                  <Wallet className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500" />
                  Monthly Income
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <House className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500" />
                  Rent / Mortgage
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <Car className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500" />
                  Car Payment
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={carPayment}
                  onChange={(e) => setCarPayment(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500" />
                  Groceries
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={groceries}
                  onChange={(e) => setGroceries(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div className={inputWrap}>
                <label className={labelClass}>
                  <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500" />
                  Other Expenses
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleCalculate}
                className="financial-button rounded-2xl px-8 py-5 text-lg sm:text-xl font-bold text-white shadow-[0_16px_40px_rgba(16,185,129,0.18)]"
              >
                Calculate Wealth IQ
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-5 text-lg sm:text-xl font-bold text-emerald-700"
              >
                <Wand2 className="h-5 w-5" />
                Load Demo
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-slate-950 px-8 py-5 text-lg sm:text-xl font-bold text-white"
              >
                Save Calculation
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-5 text-lg sm:text-xl font-bold text-slate-700"
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
            income={incomeValue}
            rent={rentValue}
            carPayment={carPaymentValue}
            Groceries={groceriesValue}
            otherExpenses={otherExpensesValue}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="premium-card rounded-[2.5rem] p-7 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
              Scenario Comparison
            </h2>
            <p className="mt-5 text-lg sm:text-xl leading-9 sm:leading-10 text-slate-500">
              To hit a 20% savings rate, your target maximum monthly expenses would be:
            </p>
            <p className="mt-6 text-5xl sm:text-6xl font-black tracking-tight text-slate-950">
              ${comparison.recommendedMaxExpenses.toLocaleString()}
            </p>
            <p className="mt-6 text-lg sm:text-xl leading-9 text-slate-500">
              {comparison.improvementNeeded > 0
                ? `You would need to cut about $${comparison.improvementNeeded.toLocaleString()} in monthly expenses to reach that target.`
                : "You are already at or better than that target."}
            </p>
          </div>

          <AIFinancialAdvisor report={report} />
        </div>

        <div className="mt-8">
          <HistoryList />
        </div>

        <footer className="py-10 text-center text-base sm:text-lg text-slate-400">
          Wealth IQ Financial Calculator • Created By Jardin Gwin • Financial Analytics Application
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
