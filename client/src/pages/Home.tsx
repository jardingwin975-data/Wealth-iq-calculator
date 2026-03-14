import { useMemo, useState } from "react";
import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";

export default function Home() {
  const [income, setIncome] = useState(2100);
  const [rent, setRent] = useState(350);
  const [carPayment, setCarPayment] = useState(400);
  const [groceries, setGroceries] = useState(250);
  const [otherExpenses, setOtherExpenses] = useState(0);

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

  const resetValues = () => {
    setIncome(2100);
    setRent(350);
    setCarPayment(400);
    setGroceries(250);
    setOtherExpenses(0);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #dbe3ee",
    fontSize: 18,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        padding: 40,
        minHeight: "100vh",
        background: "white",
        color: "#111",
        maxWidth: 900,
        margin: "0 auto",
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
          fontWeight: 600,
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

      <div
        style={{
          marginBottom: 32,
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          background: "#f8fafc",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          Monthly Inputs
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <label style={labelStyle}>Monthly Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Rent / Mortgage</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Car Payment</label>
            <input
              type="number"
              value={carPayment}
              onChange={(e) => setCarPayment(Number(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Groceries</label>
            <input
              type="number"
              value={groceries}
              onChange={(e) => setGroceries(Number(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Other Expenses</label>
            <input
              type="number"
              value={otherExpenses}
              onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button
            onClick={resetValues}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              background: "white",
              color: "#0f172a",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Demo Values
          </button>
        </div>
      </div>

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
      </div>

      <div style={{ marginTop: 32 }}>
        <FinanceCharts
          income={income}
          rent={rent}
          carPayment={carPayment}
          Groceries={groceries}
          otherExpenses={otherExpenses}
        />
      </div>
    </div>
  );
}
