import { useState, useMemo } from "react";
import {
  Wallet,
  Home as HomeIcon,
  Car,
  ShoppingCart,
  CreditCard,
  Brain,
} from "lucide-react";

type FormState = {
  income: number;
  rent: number;
  car: number;
  groceries: number;
  credit: number;
};

const initialState: FormState = {
  income: 0,
  rent: 0,
  car: 0,
  groceries: 0,
  credit: 0,
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialState);
  const [calculated, setCalculated] = useState(false);

  const totalExpenses = useMemo(() => {
    return form.rent + form.car + form.groceries + form.credit;
  }, [form]);

  const disposable = form.income - totalExpenses;

  const expenseRatio =
    form.income > 0 ? (totalExpenses / form.income) * 100 : 0;

  const savingsRate =
    form.income > 0 ? (disposable / form.income) * 100 : 0;

  const wealthScore = useMemo(() => {
    if (!calculated || form.income <= 0) return 0;

    let score = 100;

    if (expenseRatio > 90) score -= 35;
    else if (expenseRatio > 80) score -= 25;
    else if (expenseRatio > 70) score -= 15;

    if (savingsRate < 5) score -= 15;
    else if (savingsRate > 20) score += 5;

    if (disposable < 0) score -= 20;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [calculated, expenseRatio, savingsRate, disposable, form.income]);

  const aiAdvice = useMemo(() => {
    if (!calculated) return "Run the calculator to get insights.";

    if (expenseRatio > 80)
      return "Your expenses are consuming most of your income. Focus on lowering fixed costs.";

    if (savingsRate < 10)
      return "Your savings rate is low. Try allocating a small percentage to savings.";

    if (savingsRate > 20)
      return "Great savings discipline. Continue building financial reserves.";

    return "Your finances appear relatively balanced. Maintain consistency.";
  }, [calculated, expenseRatio, savingsRate]);

  const update = (key: keyof FormState, value: string) => {
    const num = Number(value);
    setForm({ ...form, [key]: num < 0 ? 0 : num });
  };

  const Input = ({
    label,
    icon,
    value,
    onChange,
  }: {
    label: string;
    icon: React.ReactNode;
    value: number;
    onChange: (v: string) => void;
  }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "flex", gap: 8, fontWeight: 600 }}>
        {icon} {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ddd",
          fontSize: 16,
          marginTop: 6,
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 24,
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: 34 }}>Wealth IQ Calculator</h1>

      <p style={{ color: "#666", marginBottom: 30 }}>
        A simple financial health snapshot based on your monthly income
        and expenses.
      </p>

      <Input
        label="Monthly Income"
        icon={<Wallet size={18} />}
        value={form.income}
        onChange={(v) => update("income", v)}
      />

      <Input
        label="Rent / Mortgage"
        icon={<HomeIcon size={18} />}
        value={form.rent}
        onChange={(v) => update("rent", v)}
      />

      <Input
        label="Car Payment"
        icon={<Car size={18} />}
        value={form.car}
        onChange={(v) => update("car", v)}
      />

      <Input
        label="Groceries"
        icon={<ShoppingCart size={18} />}
        value={form.groceries}
        onChange={(v) => update("groceries", v)}
      />

      <Input
        label="Credit Card Payments"
        icon={<CreditCard size={18} />}
        value={form.credit}
        onChange={(v) => update("credit", v)}
      />

      <button
        onClick={() => setCalculated(true)}
        style={{
          padding: "14px 20px",
          background: "#16c77a",
          border: "none",
          borderRadius: 10,
          color: "white",
          fontWeight: 700,
          fontSize: 16,
          marginTop: 10,
          cursor: "pointer",
        }}
      >
        Calculate Wealth IQ
      </button>

      {calculated && (
        <div style={{ marginTop: 40 }}>
          <h2>Results</h2>

          <p><strong>Wealth Score:</strong> {wealthScore} / 100</p>
          <p><strong>Total Expenses:</strong> ${totalExpenses}</p>
          <p><strong>Disposable Income:</strong> ${disposable}</p>
          <p><strong>Expense Ratio:</strong> {expenseRatio.toFixed(0)}%</p>
          <p><strong>Savings Rate:</strong> {savingsRate.toFixed(0)}%</p>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: "#f6f9ff",
              borderRadius: 10,
            }}
          >
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <Brain size={18} />
              <strong>AI Advisor</strong>
            </div>

            <p style={{ margin: 0 }}>{aiAdvice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
