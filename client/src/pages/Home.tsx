import { useState } from "react";
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

export default function Home() {
  const [income, setIncome] = useState(0);
  const [rent, setRent] = useState(0);
  const [car, setCar] = useState(0);
  const [groceries, setGroceries] = useState(0);
  const [other, setOther] = useState(0);

  const [score, setScore] = useState<number | null>(null);
  const [expenseRatio, setExpenseRatio] = useState<number | null>(null);
  const [savingsRate, setSavingsRate] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [disposable, setDisposable] = useState<number | null>(null);

  const calculate = () => {
    const expenses = rent + car + groceries + other;
    const leftover = income - expenses;

    const ratio = income > 0 ? (expenses / income) * 100 : 0;
    const savings = income > 0 ? (leftover / income) * 100 : 0;

    let calculatedScore = Math.round(100 - ratio + savings);
    calculatedScore = Math.max(0, Math.min(100, calculatedScore));

    setScore(calculatedScore);
    setExpenseRatio(Math.round(ratio));
    setSavingsRate(Math.round(savings));
    setTotalExpenses(expenses);
    setDisposable(leftover);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Wealth IQ Calculator</h1>

      <input
        type="number"
        placeholder="Income"
        onChange={(e) => setIncome(Number(e.target.value))}
      />

      <button onClick={calculate}>Calculate</button>

      {score !== null && (
        <div>
          <h2>Score: {score}</h2>
        </div>
      )}
    </div>
  );
}
