import { useState } from "react";

type Props = {
  report: any;
};

export default function AIFinancialAdvisor({ report }: Props) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
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

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setQuestion("");
    } catch (err) {
      console.error(err);
    }

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
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "text-right text-blue-600"
                : "text-left text-slate-700"
            }
          >
            {msg.content}
          </div>
        ))}
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
          className="financial-button px-6 py-3 rounded-xl text-white font-semibold"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
