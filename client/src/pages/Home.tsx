import { useState } from "react";
import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";
export default function Home() {
  const [score] = useState<number | null>(52);
  const [expenseRatio] = useState<number | null>(48);
  const [savingsRate] = useState<number | null>(52);
  const [totalExpenses] = useState<number | null>(1000);
  const [disposableIncome] = useState<number | null>(1100);
  const [housingRatio] = useState<number | null>(26);
  const [transportRatio] = useState<number | null>(14);

  return (
    <div
  style={{
    padding: 40,
    minHeight: "100vh",
    background: "white",
    color: "#111",
    maxWidth: 900,
    margin: "0 auto"
  }}
>

  <a
    href="https://gwinanalytics.com"
    style={{
      display: "inline-block",
      marginBottom: 20,
      padding: "10px 16px",
      background: "#0f172a",
      color: "white",
      borderRadius: 12,
      textDecoration: "none",
      fontWeight: 600
    }}
  >
    ← Gwin Analytics
  </a>

  <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
    Wealth IQ Calculator
  </h1>

  <p style={{ color: "#64748b", marginBottom: 32 }}>
    Measure the health of your monthly finances.
  </p>
  <div style={{ marginTop: 32 }}>
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
  income={2100}
  rent={350}
  carPayment={400}
  Groceries={250}
  otherExpenses={0}
/>
</div>
</div>
  );
}
