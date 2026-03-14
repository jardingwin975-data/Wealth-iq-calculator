import { useState } from "react";

type Props = {
  report?: any;
};

export default function AIFinancialAdvisor({ report }: Props) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const buildFallbackReply = () => {
    if (!report) {
      return "AI advisor is not connected yet. Your calculator is working, but this feature needs a backend service to provide live responses.";
    }

    const score = report?.score ?? null;
    const expenseRatio = report?.expenseRatio ?? 0;
    const savingsRate = report?.savingsRate ?? 0;
    const disposableIncome = report?.disposableIncome ?? 0;
    const housingRatio = report?.housingRatio ?? 0;
    const transportRatio = report?.transportRatio ?? 0;

    if (score === null) {
      return "Run the calculator first so I can give guidance based on your numbers.";
    }

    if (expenseRatio > 70) {
      return "Your expense ratio is high. Start by reviewing recurring costs first, because those usually have the biggest impact on improving your score.";
    }

    if (housingRatio > 35) {
      return "Your housing burden looks elevated. Keeping housing closer to 30–35% of income usually improves long-term flexibility.";
    }

    if (transportRatio > 15) {
      return "Transportation costs may be taking too much of your monthly income. Reducing that burden could improve your score.";
    }

    if (savingsRate < 20) {
      return "Your savings rate is positive, but increasing it further would improve financial resilience and long-term wealth building.";
    }

    if (disposableIncome < 0) {
      return "Your disposable income is negative right now. Focus on reducing essential recurring expenses until you return to positive cash flow.";
    }

    if (score >= 80) {
      return "You are in a strong position. Keep maintaining low expense pressure and continue growing savings or investments over time.";
    }

    if (score >= 50) {
      return "You have a solid financial baseline. Focus on optimizing spending and gradually improving your savings rate.";
    }

    return "Your finances show some pressure points, but there is room to improve. Start with the largest recurring expense category first.";
  };

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user" as const, content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/financial-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          report,
        }),
      });

      if (!res.ok) {
        throw new Error("AI service unavailable");
      }

      const data = await res.json();

      const aiMessage = {
        role: "assistant" as const,
        content:
          data?.reply ||
          "AI advisor is unavailable right now. Please try again later.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const fallbackMessage = {
        role: "assistant" as const,
        content: buildFallbackReply(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      console.error(err);
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
        Ask questions about your financial score and get personalized guidance.
      </p>

      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-slate-600 leading-8 text-base">
            {buildFallbackReply()}
          </div>
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
