import React, { useMemo, useState } from "react";
import {
  Wallet,
  Home as HomeIcon,
  Car,
  ShoppingCart,
  CreditCard,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  BarChart3,
  BadgeDollarSign,
  PiggyBank,
  TrendingUp,
  AlertCircle,
  Brain,
  History,
} from "lucide-react";

type HistoryItem = {
  id: number;
  date: string;
  score: number;
  expenseRatio: number;
  savingsRate: number;
  disposableIncome: number;
};

type FormState = {
  income: number;
  rent: number;
  carPayment: number;
  groceries: number;
  creditCard: number;
  utilities: number;
  insurance: number;
  subscriptions: number;
  otherExpenses: number;
};

const initialForm: FormState = {
  income: 0,
  rent: 0,
  carPayment: 0,
  groceries: 0,
  creditCard: 0,
  utilities: 0,
  insurance: 0,
  subscriptions: 0,
  otherExpenses: 0,
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const totalExpenses = useMemo(() => {
    return (
      form.rent +
      form.carPayment +
      form.groceries +
      form.creditCard +
      form.utilities +
      form.insurance +
      form.subscriptions +
      form.otherExpenses
    );
  }, [form]);

  const disposableIncome = Math.max(form.income - totalExpenses, 0);

  const expenseRatio = form.income > 0 ? (totalExpenses / form.income) * 100 : 0;
  const savingsRate = form.income > 0 ? (disposableIncome / form.income) * 100 : 0;
  const housingBurden = form.income > 0 ? (form.rent / form.income) * 100 : 0;
  const transportBurden = form.income > 0 ? (form.carPayment / form.income) * 100 : 0;

  const wealthIQ = useMemo(() => {
    if (form.income <= 0) return 0;

    let score = 100;

    if (expenseRatio > 95) score -= 35;
    else if (expenseRatio > 85) score -= 25;
    else if (expenseRatio > 75) score -= 15;
    else if (expenseRatio > 65) score -= 8;

    if (housingBurden > 40) score -= 18;
    else if (housingBurden > 30) score -= 10;

    if (transportBurden > 20) score -= 12;
    else if (transportBurden > 15) score -= 6;

    const creditCardRatio =
      form.income > 0 ? (form.creditCard / form.income) * 100 : 0;

    if (creditCardRatio > 20) score -= 15;
    else if (creditCardRatio > 10) score -= 8;

    if (savingsRate >= 25) score += 8;
    else if (savingsRate >= 15) score += 4;
    else if (savingsRate < 5) score -= 12;

    if (disposableIncome <= 0) score -= 15;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [
    form.income,
    form.creditCard,
    expenseRatio,
    housingBurden,
    transportBurden,
    savingsRate,
    disposableIncome,
  ]);

  const scoreLabel = useMemo(() => {
    if (!hasCalculated) return "No score yet";
    if (wealthIQ >= 80) return "Excellent";
    if (wealthIQ >= 65) return "Healthy";
    if (wealthIQ >= 50) return "Moderate";
    if (wealthIQ >= 35) return "Stressed";
    return "High Risk";
  }, [hasCalculated, wealthIQ]);

  const recommendation = useMemo(() => {
    if (!hasCalculated) {
      return "Enter your monthly numbers to generate a financial health snapshot.";
    }

    if (housingBurden > 35) {
      return "Housing is your biggest budget pressure. Lower housing costs or raise income to improve your score faster.";
    }

    if (transportBurden > 15) {
      return "Transportation costs are running high. Reducing your car burden could improve flexibility in your monthly cash flow.";
    }

    if (savingsRate < 10) {
      return "Your savings rate is low. Creating a buffer, even a small one, would strengthen your overall financial position.";
    }

    if (expenseRatio < 70 && savingsRate >= 15) {
      return "Your budget looks balanced. Focus on consistency and building reserves to keep your Wealth IQ strong.";
    }

    return "Your score is mainly driven by your recurring expenses versus take-home income. Small reductions across fixed costs can raise your score.";
  }, [hasCalculated, housingBurden, transportBurden, savingsRate, expenseRatio]);

  const strongestSignal = useMemo(() => {
    if (!hasCalculated) {
      return {
        title: "No signal yet",
        text: "This reflects how much of your income remains after essential and recurring expenses.",
      };
    }

    if (savingsRate >= 20) {
      return {
        title: "Strong savings capacity",
        text: "You are keeping a healthy share of income available after monthly obligations.",
      };
    }

    if (expenseRatio <= 65) {
      return {
        title: "Controlled expense load",
        text: "Your recurring expenses are staying within a manageable share of income.",
      };
    }

    if (housingBurden <= 25) {
      return {
        title: "Healthy housing ratio",
        text: "Your housing costs are taking up a reasonable portion of income.",
      };
    }

    return {
      title: "Positive income support",
      text: "Your current income is still supporting your core obligations, though there may be room to improve resilience.",
    };
  }, [hasCalculated, savingsRate, expenseRatio, housingBurden]);

  const pressurePoint = useMemo(() => {
    if (!hasCalculated) {
      return {
        title: "Awaiting inputs",
        text: "The largest burden category often has the biggest effect on long-term financial flexibility.",
      };
    }

    const categories = [
      {
        key: "Housing",
        ratio: housingBurden,
        text: "Housing costs appear to be the biggest constraint on your monthly flexibility.",
      },
      {
        key: "Transport",
        ratio: transportBurden,
        text: "Transportation costs are placing visible pressure on your available income.",
      },
      {
        key: "Credit",
        ratio: form.income > 0 ? (form.creditCard / form.income) * 100 : 0,
        text: "Credit card payments are consuming too much of your monthly budget.",
      },
      {
        key: "Groceries",
        ratio: form.income > 0 ? (form.groceries / form.income) * 100 : 0,
        text: "Food spending is becoming a meaningful drag on your monthly cash flow.",
      },
    ];

    const biggest = categories.sort((a, b) => b.ratio - a.ratio)[0];

    if (!biggest || biggest.ratio <= 0) {
      return {
        title: "No major pressure yet",
        text: "No single category is strongly dominating your budget right now.",
      };
    }

    return {
      title: `${biggest.key} burden`,
      text: biggest.text,
    };
  }, [
    hasCalculated,
    housingBurden,
    transportBurden,
    form.creditCard,
    form.groceries,
    form.income,
  ]);

  const aiAdvisor = useMemo(() => {
    if (!hasCalculated) {
      return "I’ll analyze your income, cost burden, savings strength, and budget pressure once you run your first score.";
    }

    const notes: string[] = [];

    if (housingBurden > 30) {
      notes.push(
        `Housing uses ${housingBurden.toFixed(
          0
        )}% of your income, which is above the healthier target range.`
      );
    }

    if (transportBurden > 15) {
      notes.push(
        `Transportation is consuming ${transportBurden.toFixed(
          0
        )}% of your monthly income.`
      );
    }

    if (savingsRate < 10) {
      notes.push(
        `Your savings rate is only ${savingsRate.toFixed(
          0
        )}%, so cash resilience is currently weak.`
      );
    }

    if (expenseRatio >= 85) {
      notes.push(
        `Your recurring expense load is very high at ${expenseRatio.toFixed(
          0
        )}% of income.`
      );
    }

    if (notes.length === 0) {
      notes.push(
        `Your budget appears relatively balanced, with expenses at ${expenseRatio.toFixed(
          0
        )}% and savings at ${savingsRate.toFixed(0)}%.`
      );
    }

    return `${notes.join(" ")} Focus on lowering your highest fixed burden first because that usually produces the biggest score improvement.`;
  }, [hasCalculated, housingBurden, transportBurden, savingsRate, expenseRatio]);

  const handleChange = (key: keyof FormState, value: string) => {
    const num = Number(value);
    setForm((prev) => ({
      ...prev,
      [key]: Number.isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const handleCalculate = () => {
    setHasCalculated(true);

    const item: HistoryItem = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      score: wealthIQ,
      expenseRatio: Number(expenseRatio.toFixed(0)),
      savingsRate: Number(savingsRate.toFixed(0)),
      disposableIncome: Number(disposableIncome.toFixed(0)),
    };

    setHistory((prev) => [item, ...prev].slice(0, 6));
  };

  const handleReset = () => {
    setForm(initialForm);
    setHasCalculated(false);
  };

  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const progress = hasCalculated ? wealthIQ / 100 : 0;
  const offset = circumference * (1 - progress);

  const inputFields = [
    { key: "income", label: "Monthly Income", icon: Wallet, color: "#10b981" },
    { key: "rent", label: "Rent / Mortgage", icon: HomeIcon, color: "#60a5fa" },
    { key: "carPayment", label: "Car Payment", icon: Car, color: "#f59e0b" },
    { key: "groceries", label: "Groceries", icon: ShoppingCart, color: "#f59e0b" },
    { key: "creditCard", label: "Credit Card", icon: CreditCard, color: "#ef4444" },
    { key: "utilities", label: "Utilities", icon: Sparkles, color: "#8b5cf6" },
    { key: "insurance", label: "Insurance", icon: ShieldCheck, color: "#6366f1" },
    { key: "subscriptions", label: "Subscriptions", icon: BadgeDollarSign, color: "#06b6d4" },
    { key: "otherExpenses", label: "Other Expenses", icon: BarChart3, color: "#64748b" },
  ] as const;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #f5f7fb 40%, #f9fafb 100%)",
        color: "#0f172a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 16px 56px",
        }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, #f4fff9 0%, #f8fbff 50%, #ffffff 100%)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: 28,
            padding: 28,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid #b7f1d4",
              color: "#0f8f68",
              fontWeight: 600,
              background: "#f2fff7",
              marginBottom: 18,
            }}
          >
            <Sparkles size={18} />
            Financial health scoring, simplified
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.25rem)",
              lineHeight: 1.02,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.04em",
            }}
          >
            Wealth IQ{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #14b87a 0%, #29c8ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Financial
              <br />
              Calculator
            </span>
          </h1>

          <p
            style={{
              maxWidth: 760,
              marginTop: 22,
              fontSize: "clamp(1.1rem, 2.6vw, 1.65rem)",
              lineHeight: 1.6,
              color: "#475569",
            }}
          >
            A clean financial score tool that turns your monthly income and
            expenses into a simple, visual health snapshot. See your score,
            spending ratios, cash flow, and history in one place.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 22,
            }}
          >
            {[
              "Live score analysis",
              "Expense ratio tracking",
              "Savings health insights",
              "Calculation history",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 18px",
                  borderRadius: 999,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#334155",
                  fontWeight: 500,
                  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.05)",
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
              marginTop: 34,
            }}
          >
            <FeatureCard
              icon={<ShieldCheck size={22} />}
              eyebrow="FINANCIAL HEALTH"
              title="Score-based"
              text="Quickly measure overall budget strength."
            />
            <FeatureCard
              icon={<BarChart3 size={22} />}
              eyebrow="EXPENSE ANALYTICS"
              title="Real-time"
              text="Track ratios, burden levels, and cash flow."
            />
            <FeatureCard
              icon={<BadgeDollarSign size={22} />}
              eyebrow="BUDGET CLARITY"
              title="Actionable"
              text="See how your income supports your lifestyle."
            />
          </div>
        </section>

        <div
          style={{
            height: 6,
            borderRadius: 999,
            margin: "26px 0 26px",
            background: "linear-gradient(90deg, #17c964 0%, #2ac3ff 100%)",
          }}
        />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 28,
              padding: 28,
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: "0.28em",
                fontWeight: 700,
                color: "#94a3b8",
                marginBottom: 8,
              }}
            >
              INPUT PANEL
            </div>
            <h2
              style={{
                fontSize: 28,
                margin: "0 0 24px",
                letterSpacing: "-0.03em",
              }}
            >
              Your Monthly Metrics
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 18,
              }}
            >
              {inputFields.map(({ key, label, icon: Icon, color }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#334155",
                    }}
                  >
                    <Icon size={18} color={color} />
                    {label}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 20,
                      padding: "0 16px",
                      minHeight: 68,
                      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.03)",
                    }}
                  >
                    <span
                      style={{
                        color: "#cbd5e1",
                        fontSize: 22,
                        marginRight: 8,
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#0f172a",
                        background: "transparent",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 24,
              }}
            >
              <button
                onClick={handleCalculate}
                style={{
                  minHeight: 68,
                  border: "none",
                  borderRadius: 22,
                  cursor: "pointer",
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #16c77a 0%, #27c6ff 100%)",
                  boxShadow: "0 20px 45px rgba(20, 184, 122, 0.25)",
                }}
              >
                Calculate Wealth IQ
              </button>

              <button
                onClick={handleReset}
                style={{
                  minHeight: 68,
                  borderRadius: 22,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#334155",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <RotateCcw size={22} />
                Reset Inputs
              </button>
            </div>

            <p
              style={{
                marginTop: 22,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Your score reflects how much of your income remains after your
              recurring expenses. Lower burden and stronger savings usually
              produce a healthier score.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 24,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 28,
                padding: 28,
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.28em",
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 8,
                }}
              >
                FINANCIAL SCORE
              </div>
              <h2
                style={{
                  fontSize: 28,
                  margin: "0 0 16px",
                  letterSpacing: "-0.03em",
                }}
              >
                Your Wealth IQ
              </h2>

              <div
                style={{
                  display: "inline-flex",
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 22,
                }}
              >
                {scoreLabel}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <div style={{ position: "relative", width: 260, height: 260 }}>
                  <svg width="260" height="260" viewBox="0 0 260 260">
                    <circle
                      cx="130"
                      cy="130"
                      r={radius}
                      fill="none"
                      stroke="#e8eef6"
                      strokeWidth="16"
                    />
                    <circle
                      cx="130"
                      cy="130"
                      r={radius}
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform="rotate(-90 130 130)"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#16c77a" />
                        <stop offset="100%" stopColor="#27c6ff" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: hasCalculated ? 48 : 42,
                        fontWeight: 800,
                        color: "#64748b",
                        lineHeight: 1,
                      }}
                    >
                      {hasCalculated ? wealthIQ : "—"}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        color: "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      / 100
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 14,
                  color: "#64748b",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {hasCalculated ? "Score generated" : "Ready to calculate"}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 28,
                padding: 28,
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.28em",
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 18,
                }}
              >
                AI ADVISOR
              </div>

              <div
                style={{
                  borderRadius: 24,
                  padding: 20,
                  background:
                    "linear-gradient(135deg, rgba(20, 184, 122, 0.08), rgba(39, 198, 255, 0.08))",
                  border: "1px solid rgba(20, 184, 122, 0.18)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  <Brain size={20} />
                  Wealth IQ Advisor
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: 16,
                    lineHeight: 1.8,
                  }}
                >
                  {aiAdvisor}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 28,
            marginTop: 24,
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              margin: "0 0 22px",
              color: "#64748b",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {hasCalculated ? "Financial snapshot ready" : "Ready to calculate"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <MetricCard
              icon={<TrendingUp size={16} />}
              label="EXPENSE RATIO"
              value={`${expenseRatio.toFixed(0)}%`}
            />
            <MetricCard
              icon={<PiggyBank size={16} />}
              label="SAVINGS RATE"
              value={`${savingsRate.toFixed(0)}%`}
            />
            <MetricCard
              icon={<AlertCircle size={16} />}
              label="TOTAL EXPENSES"
              value={`$${totalExpenses.toLocaleString()}`}
            />
            <MetricCard
              icon={<TrendingUp size={16} />}
              label="DISPOSABLE INCOME"
              value={`$${disposableIncome.toLocaleString()}`}
            />
            <MetricCard
              icon={<HomeIcon size={16} />}
              label="HOUSING BURDEN"
              value={`${housingBurden.toFixed(0)}%`}
            />
            <MetricCard
              icon={<Car size={16} />}
              label="TRANSPORT BURDEN"
              value={`${transportBurden.toFixed(0)}%`}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              marginTop: 22,
            }}
          >
            <InsightCard
              eyebrow="RECOMMENDATION"
              title=""
              text={recommendation}
            />
            <InsightCard
              eyebrow="STRONGEST SIGNAL"
              title={strongestSignal.title}
              text={strongestSignal.text}
            />
            <InsightCard
              eyebrow="PRESSURE POINT"
              title={pressurePoint.title}
              text={pressurePoint.text}
            />
            <InsightCard
              eyebrow="FINANCIAL POSITION"
              title={scoreLabel}
              text={
                hasCalculated
                  ? `Your current Wealth IQ is ${wealthIQ}/100 based on income support, recurring burden, and savings strength.`
                  : "Your score and position summary will appear here after calculation."
              }
            />
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 28,
            marginTop: 24,
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.28em",
              fontWeight: 700,
              color: "#94a3b8",
              marginBottom: 8,
            }}
          >
            HISTORY
          </div>
          <h2
            style={{
              fontSize: 28,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Recent Calculations
          </h2>

          {history.length === 0 ? (
            <div
              style={{
                marginTop: 24,
                border: "2px dashed #dbe4ee",
                borderRadius: 24,
                padding: "44px 20px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              <History size={42} style={{ marginBottom: 12 }} />
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#334155",
                  marginBottom: 8,
                }}
              >
                No calculations yet
              </div>
              <div style={{ fontSize: 18, lineHeight: 1.7 }}>
                Your financial history will appear here after you run your first
                score.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 24,
              }}
            >
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 22,
                    padding: 18,
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: 13,
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    {item.date}
                  </div>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      marginBottom: 10,
                    }}
                  >
                    {item.score}/100
                  </div>
                  <div style={{ color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
                    Expense Ratio: {item.expenseRatio}%<br />
                    Savings Rate: {item.savingsRate}%<br />
                    Disposable: ${item.disposableIncome.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginTop: 28,
            fontSize: 15,
          }}
        >
          Wealth IQ Financial Analytics Application
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  eyebrow,
  title,
  text,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 26,
        background: "#ffffff",
        border: "1px solid #edf2f7",
        padding: 24,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: "#020827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 14,
          letterSpacing: "0.24em",
          fontWeight: 700,
          color: "#94a3b8",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 8,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "#64748b",
          fontSize: 18,
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: 20,
        background: "#ffffff",
        border: "1px solid #e9eef5",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.03)",
        minHeight: 120,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
            letterSpacing: "0.18em",
            fontWeight: 800,
          }}
        >
          {label}
        </div>
        <div style={{ color: "#94a3b8" }}>{icon}</div>
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InsightCard({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        background: "#ffffff",
        border: "1px solid #eef2f7",
        padding: 22,
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.03)",
      }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: "0.24em",
          fontWeight: 700,
          color: "#94a3b8",
          marginBottom: 10,
        }}
      >
        {eyebrow}
      </div>
      {title ? (
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 10,
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          color: "#64748b",
          lineHeight: 1.8,
          fontSize: 17,
        }}
      >
        {text}
      </div>
    </div>
  );
}
