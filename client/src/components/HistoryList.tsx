import { useCalculations } from "@/hooks/use-calculations";
import { format } from "date-fns";
import { Calendar, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function HistoryList() {
  const { data: calculations, isLoading } = useCalculations();

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!calculations || calculations.length === 0) {
    return (
      <div className="text-center p-8 rounded-2xl border-2 border-dashed border-slate-200">
        <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No calculations yet</p>
        <p className="text-sm text-slate-400 mt-1">Calculate your score to see history</p>
      </div>
    );
  }

  // Sort by id descending assuming id is sequential and relates to time
  const sorted = [...calculations].sort((a, b) => b.id - a.id);

  return (
    <div className="w-full space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
      {sorted.map((calc, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          key={calc.id}
          className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">
              Income: ${calc.income.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Calc #{calc.id}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">Total Expenses</span>
              <span className="text-sm text-slate-700 font-medium">
                ${(calc.rent + calc.carPayment + calc.otherExpenses).toLocaleString()}
              </span>
            </div>
            
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg
              ${calc.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                calc.score >= 50 ? 'bg-blue-100 text-blue-700' : 
                calc.score >= 20 ? 'bg-amber-100 text-amber-700' : 
                'bg-red-100 text-red-700'}
            `}>
              {calc.score}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
