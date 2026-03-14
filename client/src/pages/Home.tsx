import { useState } from "react";
import { ScoreDisplay } from "../components/ScoreDisplay";

export default function Home() {
  const [score] = useState<number | null>(52);
  const [expenseRatio] = useState<number | null>(48);
  const [savingsRate] = useState<number | null>(52);
  const [totalExpenses] = useState<number | null>(1000);
  const [disposableIncome] = useState<number | null>(1100);
  const [housingRatio] = useState<number | null>(26);
  const [transportRatio] = useState<number | null>(14);

  return (
    <div style={{ padding: 40, minHeight: "100vh", background: "white", color: "#111" }}>
      <a
        href="https://gwinanalytics.com"
        style={{
          display: "inline-block",
          marginBottom: 24,
          padding: "10px 14px",
          background: "#11161d",
          color: "white",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Gwin Analytics
      </a>

      <h1 style={{ marginBottom: 24 }}>Wealth IQ Calculator</h1>

      <ScoreDisplay
        score={score}
        expenseRatio={expenseRatio}
        savingsRate={savingsRate}
        totalExpenses={totalExpenses}
        disposableIncome={disposableIncome}
        housingRatio={housingRatio}
        transportRatio={transportRatio}
      />
    </div>
  );
}
