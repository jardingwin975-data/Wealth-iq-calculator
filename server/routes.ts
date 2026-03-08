import OpenAI from "openai";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.calculations.list.path, async (req, res) => {
    const calculations = await storage.getCalculations();
    res.json(calculations);
  });

  app.post(api.calculations.create.path, async (req, res) => {
    try {
      const bodySchema = api.calculations.create.input.extend({
        income: z.coerce.number(),
        rent: z.coerce.number(),
        carPayment: z.coerce.number(),
        otherExpenses: z.coerce.number(),
        score: z.coerce.number(),
      });
      const input = bodySchema.parse(req.body);
      const calc = await storage.createCalculation(input);
      res.status(201).json(calc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

    // AI Financial Assistant Route
  app.post("/api/financial-assistant", async (req, res) => {
    try {
      const { message, report } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message required" });
      }

      const systemPrompt = `
You are Wealth IQ AI Assistant, a friendly financial health guide inside a financial analytics app.

Explain financial numbers clearly and simply.

User Financial Data:
Income: ${report?.income ?? 0}
Rent: ${report?.rent ?? 0}
Car Payment: ${report?.carPayment ?? 0}
Other Expenses: ${report?.otherExpenses ?? 0}
Total Expenses: ${report?.totalExpenses ?? 0}
Disposable Income: ${report?.disposableIncome ?? 0}
Expense Ratio: ${report?.expenseRatio ?? 0}%
Savings Rate: ${report?.savingsRate ?? 0}%
Housing Ratio: ${report?.housingRatio ?? 0}%
Transport Ratio: ${report?.transportRatio ?? 0}%
Financial Score: ${report?.score ?? 0}

Rules:
- Speak in simple, friendly language
- Explain what the numbers mean
- Give practical advice
- Encourage the user
- Do NOT give investment or legal guarantees
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

      const reply = completion.choices[0].message.content;

      res.json({ reply });

    } catch (error) {
      console.error("AI assistant error:", error);
      res.status(500).json({ error: "AI assistant failed" });
    }
  });

  return httpServer;
}
