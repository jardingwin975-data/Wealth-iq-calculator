import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Wallet,
  Home as HomeIcon,
  Car,
  CreditCard,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { HistoryList } from "@/components/HistoryList";
import { useCreateCalculation } from "@/hooks/use-calculations";

// Local form schema for UI validation and string coercion
const formSchema = z.object({
  income: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
  rent: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
  carPayment: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
  otherExpenses: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(0, "Cannot be negative"),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const { mutate: saveCalculation, isPending } = useCreateCalculation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: undefined,
      rent: undefined,
      carPayment: undefined,
      otherExpenses: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    const { income, rent, carPayment, otherExpenses } = data;

    // Calculate Score
    let score = 0;
    if (income > 0) {
      const totalExpenses = rent + carPayment + otherExpenses;
      const rawScore = ((income - totalExpenses) / income) * 100;
      // Clamp between 0 and 100, then round
      score = Math.max(0, Math.min(100, Math.round(rawScore)));
    }

    setCurrentScore(score);

    // Save to backend
    saveCalculation({
      income,
      rent,
      carPayment,
      otherExpenses,
      score,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-display">
            Wealth IQ <span className="text-primary">Calculator</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Discover your financial health in seconds. Enter your monthly
            metrics below to calculate your personalized Wealth IQ score.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-8 sm:p-10 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-300" />

              <h2 className="text-2xl font-bold mb-8 font-display text-slate-800">
                Your Monthly Metrics
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Income */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-500" />
                    Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 rounded-xl glass-input text-lg font-medium text-slate-800 placeholder:text-slate-300"
                      {...register("income")}
                    />
                  </div>
                  {errors.income && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.income.message}
                    </p>
                  )}
                </div>

                <div className="h-px w-full bg-slate-100 my-8" />

                {/* Expenses Grid */}
                <div className="space-y-6">
                  {/* Rent */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <HomeIcon className="w-4 h-4 text-blue-500" />
                      Rent / Mortgage
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-4 rounded-xl glass-input text-lg font-medium text-slate-800 placeholder:text-slate-300"
                        {...register("rent")}
                      />
                    </div>
                    {errors.rent && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.rent.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Car Payment */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Car className="w-4 h-4 text-amber-500" />
                        Car Payment
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-4 rounded-xl glass-input text-lg font-medium text-slate-800 placeholder:text-slate-300"
                          {...register("carPayment")}
                        />
                      </div>
                      {errors.carPayment && (
                        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.carPayment.message}
                        </p>
                      )}
                    </div>

                    {/* Other Expenses */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-500" />
                        Other Expenses
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-4 rounded-xl glass-input text-lg font-medium text-slate-800 placeholder:text-slate-300"
                          {...register("otherExpenses")}
                        />
                      </div>
                      {errors.otherExpenses && (
                        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.otherExpenses.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-8 py-5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-emerald-400 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {isPending ? "Calculating..." : "Calculate Wealth IQ"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Display & History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            {/* Score Display Area */}
            <ScoreDisplay score={currentScore} />

            {/* History Area */}
            <div className="p-8 rounded-[2rem] glass-card">
              <h3 className="text-xl font-bold text-slate-800 font-display mb-6">
                Recent Calculations
              </h3>
              <HistoryList />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
