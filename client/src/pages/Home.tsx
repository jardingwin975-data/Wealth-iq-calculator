import { useState } from "react";
import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";
import AIFinancialAdvisor from "../components/AIFinancialAdvisor";
import { HistoryList } from "../components/HistoryList";

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
  };

  const report = {
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
  };

  return (
    <div className="min-h-screen p-6 space-y-10">

      <a
        href="https://gwinanalytics.com"
        className="inline-block px-4 py-2 rounded-lg bg-black text-white font-semibold"
      >
        ← Gwin Analytics
      </a>

      <h1 className="text-4xl font-bold">Wealth IQ Financial Calculator</h1>

      <div className="grid gap-4 max-w-md">
        <input type="number" placeholder="Income" onChange={(e)=>setIncome(Number(e.target.value))}/>
        <input type="number" placeholder="Rent / Mortgage" onChange={(e)=>setRent(Number(e.target.value))}/>
        <input type="number" placeholder="Car Payment" onChange={(e)=>setCarPayment(Number(e.target.value))}/>
        <input type="number" placeholder="Groceries" onChange={(e)=>setGroceries(Number(e.target.value))}/>
        <input type="number" placeholder="Other Expenses" onChange={(e)=>setOtherExpenses(Number(e.target.value))}/>

        <button
          onClick={calculate}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg"
        >
          Calculate
        </button>
      </div>

      <ScoreDisplay
        score={score}
        expenseRatio={expenseRatio}
        savingsRate={savingsRate}
        totalExpenses={totalExpenses}
        disposableIncome={disposableIncome}
        housingRatio={housingRatio}
        transportRatio={transportRatio}
      />

      <FinanceCharts
        income={income}
        rent={rent}
        carPayment={carPayment}
        Groceries={groceries}
        otherExpenses={otherExpenses}
      />

      <AIFinancialAdvisor report={report} />

      <HistoryList />

    </div>
  );
}
