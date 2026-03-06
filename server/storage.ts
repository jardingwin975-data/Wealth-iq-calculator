import { type Calculation, type InsertCalculation } from "@shared/schema";

export interface IStorage {
  getCalculations(): Promise<Calculation[]>;
  createCalculation(calc: InsertCalculation): Promise<Calculation>;
}

export class MemStorage implements IStorage {
  private calculations: Calculation[] = [];
  private currentId = 1;

  async getCalculations(): Promise<Calculation[]> {
    return this.calculations;
  }

  async createCalculation(insertCalc: InsertCalculation): Promise<Calculation> {
    const calc: Calculation = { ...insertCalc, id: this.currentId++ };
    this.calculations.push(calc);
    return calc;
  }
}

export const storage = new MemStorage();
