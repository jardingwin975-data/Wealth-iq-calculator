import { useMemo, useState } from "react";

type Report = {
  income?: number;
  rent?: number;
  carPayment?: number;
  groceries?: number;
  otherExpenses?: number;
  score?: number | null;
  expenseRatio?: number | null;
  savingsRate?: number | null;
  totalExpenses?: number | null;
  disposableIncome?: number | null;
  housingRatio?: number | null;
  transportRatio?: number | null;
};

type Props = {
  report?: Report;
};

export default function AIFinancialAdvisor({ report }: Props) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const baseAdvice = useMemo(() => {
    if (!report || report.score === null || report.score === undefined) {
      return "Run the calculator to get personalized guidance based on your financial numbers.";
    }

    const {
      score = 0,
      expenseRatio = 0,
      savingsRate = 0,
      housingRatio = 0,
      transportRatio = 0,
      disposableIncome = 0,
    } = report;

    if (disposableIncome < 0) {
      return "Your disposable income is negative. Focus on reducing recurring expenses until cash flow turns positive.";
    }

    if (housingRatio > 35) {
      return "Your housing burden is elevated. Lowering housing costs closer to 30–35% of income would usually improve stability.";
    }

    if (expenseRatio > 70) {
      return "Your expense ratio is high. Start with recurring bills first because those usually create the fastest improvement.";
    }

    if (transportRatio > 15) {
      return "Transportation is taking a meaningful share of income. Lowering that burden could improve flexibility.";
    }

    if (savingsRate < 20) {
      return "Your savings rate is positive, but increasing it would improve long-term resilience and wealth building.";
    }

    if (score >= 80) {
      return "You’re in a strong position. Keep expenses controlled and continue building savings or investments.";
    }

    if (score >= 50) {
      return "You have a solid baseline. The biggest opportunity now is tightening expenses and improving savings consistency.";
    }

    return "Your finances show pressure points, but there is room to improve. Start with the largest recurring expense category first.";
  }, [report]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user" as const, content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const fallbackReply =
      question.toLowerCase().includes("improve")
        ? `${baseAdvice} A practical next step is to reduce one recurring expense and rerun the calculator.`
        : baseAdvice;

    try {
      const res = await fetch("/api/financial-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, report }),
      });

      if (!res.ok) throw new Error("AI service unavailable");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.reply || fallbackReply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackReply,
        },
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="premium-card rounded-[2rem] p-7 sm:p-9">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        AI Financial Advisor
      </h3>

      <p className="text-slate-500 mb-6">
        Ask questions about your score and get guidance based on your numbers.
      </p>

      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-slate-700 leading-7">{baseAdvice}</div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "text-right text-blue-600 font-medium"
                  : "text-left text-slate-700"
              }
            >
              {msg.content}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your financial health..."
          className="financial-input flex-1 px-4 py-3"
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="financial-button px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-70"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
