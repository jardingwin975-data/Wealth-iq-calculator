import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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

  return httpServer;
}
