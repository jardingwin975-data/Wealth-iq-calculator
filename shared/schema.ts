import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  income: integer("income").notNull(),
  rent: integer("rent").notNull(),
  carPayment: integer("car_payment").notNull(),
  otherExpenses: integer("other_expenses").notNull(),
  score: integer("score").notNull(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({ id: true });
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
