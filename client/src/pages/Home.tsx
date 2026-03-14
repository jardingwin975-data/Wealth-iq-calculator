import { useMemo, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  BarChart3,
  BadgeDollarSign,
  Wallet,
  Home as HomeIcon,
  Car,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { ScoreDisplay } from "../components/ScoreDisplay";
import FinanceCharts from "../components/FinanceCharts";
import AIFinancialAdvisor from "../components/AIFinancialAdvisor";
import { HistoryList } from "../components/HistoryList";
import { useCreateCalculation } from "../hooks/use-calculations";

export default function Home() {
  const [income, setIncome] = useState<number>(2100);
  const [rent, setRent] = useState<number>(350);
  const [carPayment, setCarPayment] = useState<number>(400);
  const [groceries, setGroceries] = useState<number>(250);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);

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
    const improvementNeeded = Math.max(
      totalExpenses - recommendedMaxExpenses,
      0
    );

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
    score,
    expenseRatio,
    savingsRate,
    totalExpenses,
    disposableIncome,
    housingRatio,
    transportRatio,
  };

  const featureCards = [
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
      desc: "Track ratios and cash flow.",
    },
    {
      icon: BadgeDollarSign,
      title: "Budget Clarity",
      value: "Actionable",
      desc: "See how income supports your lifestyle.",
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #dbe3ee",
    fontSize: 18,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };

  const labelRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 8,
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: "16px 22px",
    borderRadius: 16,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    border: "none",
  };

  const resetValues = () => {
    setIncome(2100);
    setRent(350);
    setCarPayment(400);
    setGroceries(250);
    setOtherExpenses(0);
  };

  const saveCalculation = () => {
    createCalculation.mutate({
      income,
      rent,
      carPayment,
      groceries,
      otherExpenses,
      score,
    });
  };

  return (
    <div
      className="app-shell"
      style={{
        padding: 24,
        minHeight: "100vh",
        color: "#111",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
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

        <section className="premium-card p-8 mb-10">
          <div
            style={{
              marginBottom: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              background: "#ecfdf5",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 700,
              color: "#047857",
            }}
          >
            <Sparkles size={16} />
            Financial health scoring, simplified
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#0f172a",
            }}
          >
            Wealth IQ{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #10b981 0%, #06b6d4 55%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Financial Calculator
            </span>
          </h1>

          <p
            style={{
              marginTop: 18,
              marginBottom: 0,
              maxWidth: 720,
              fontSize: 18,
              lineHeight: 1.7,
              color: "#64748b",
            }}
          >
            A clean financial score tool that turns your monthly income and
            expenses into a simple health snapshot with visual insights,
            scoring, and cash-flow clarity.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="premium-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-slate-700" />
                  <strong className="text-slate-900">{card.title}</strong>
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 8,
                  }}
                >
                  {card.value}
                </div>

                <p
                  style={{
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="premium-card p-8">
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginTop: 0,
                marginBottom: 22,
                color: "#0f172a",
              }}
            >
              Monthly Inputs
            </h2>

            <div style={{ marginBottom: 18 }}>
              <label style={labelRowStyle}>
                <Wallet size={18} />
                Monthly Income
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelRowStyle}>
                <HomeIcon size={18} />
                Rent / Mortgage
              </label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelRowStyle}>
                <Car size={18} />
                Car Payment
              </label>
              <input
                type="number"
                value={carPayment}
                onChange={(e) => setCarPayment(Number(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelRowStyle}>
                <ShoppingCart size={18} />
                Groceries
              </label>
              <input
                type="number"
                value={groceries}
                onChange={(e) => setGroceries(Number(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={labelRowStyle}>
                <CreditCard size={18} />
                Other Expenses
              </label>
              <input
                type="number"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={saveCalculation}
                disabled={createCalculation.isPending}
                style={{
                  ...actionButtonStyle,
                  background:
                    "linear-gradient(90deg, #10b981 0%, #06b6d4 55%, #3b82f6 100%)",
                  color: "white",
                  boxShadow: "0 12px 28px rgba(16,185,129,0.18)",
                }}
              >
                {createCalculation.isPending
                  ? "Saving..."
                  : "Save Calculation"}
              </button>

              <button
                type="button"
                onClick={resetValues}
                style={{
                  ...actionButtonStyle,
                  background: "white",
                  color: "#334155",
                  border: "1px solid #dbe3ee",
                }}
              >
                Reset Inputs
              </button>
            </div>

            <p
              style={{
                marginTop: 20,
                marginBottom: 0,
                color: "#94a3b8",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Your score reflects how much of your income remains after your
              recurring expenses. Lower burden and stronger savings usually
              produce a healthier score.
            </p>
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

        <div
          className="premium-card"
          style={{
            marginTop: 32,
            padding: 24,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              marginTop: 0,
              marginBottom: 12,
              color: "#0f172a",
            }}
          >
            Scenario Comparison
          </h2>

          <p style={{ color: "#64748b", marginBottom: 12 }}>
            To hit a 20% savings rate, your target maximum monthly expenses
            would be:
          </p>

          <p
            style={{
              fontSize: 32,
              fontWeight: 900,
              marginBottom: 8,
              marginTop: 0,
              color: "#0f172a",
            }}
          >
            ${comparison.recommendedMaxExpenses.toLocaleString()}
          </p>

          <p style={{ color: "#64748b", marginBottom: 0 }}>
            {comparison.improvementNeeded > 0
              ? `You would need to cut about $${comparison.improvementNeeded.toLocaleString()} in monthly expenses to reach that target.`
              : "You are already at or better than that target."}
          </p>
        </div>

        <div style={{ marginTop: 32 }}>
          <AIFinancialAdvisor report={report} />
        </div>

        <div className="premium-card p-8" style={{ marginTop: 32 }}>
          <p
            style={{
              marginTop: 0,
              marginBottom: 10,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            History
          </p>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 900,
              marginTop: 0,
              marginBottom: 20,
              color: "#0f172a",
            }}
          >
            Recent Calculations
          </h2>

          <HistoryList />
        </div>
      </div>
    </div>
  );
}
