import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

interface ScoreDisplayProps {
  score: number | null;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (score !== null) {
      const controls = animate(0, score, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          setDisplayValue(Math.round(value));
        },
      });

      return () => controls.stop();
    } else {
      setDisplayValue(0);
    }
  }, [score]);

  const getScoreDetails = (s: number | null) => {
    if (s === null) {
      return {
        color: "text-muted-foreground",
        circle: "stroke-muted",
        message: "Ready to calculate",
      };
    }
    if (s >= 80) {
      return {
        color: "text-emerald-500",
        circle: "stroke-emerald-500",
        message: "Excellent Wealth Health!",
      };
    }
    if (s >= 50) {
      return {
        color: "text-blue-500",
        circle: "stroke-blue-500",
        message: "Good Financial Baseline",
      };
    }
    if (s >= 20) {
      return {
        color: "text-amber-500",
        circle: "stroke-amber-500",
        message: "Caution: High Expenses",
      };
    }
    return {
      color: "text-red-500",
      circle: "stroke-red-500",
      message: "Critical: Expenses exceed safe limits",
    };
  };

  const details = getScoreDetails(score);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    score !== null
      ? circumference - (score / 100) * circumference
      : circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-3xl glass-card overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 rounded-3xl pointer-events-none">
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-3xl rounded-full ${details.color.replace("text-", "bg-")}`}
          />
        )}
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
        Your Wealth IQ
      </h3>

      <div className="relative flex items-center justify-center">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="12"
            fill="transparent"
          />
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            className={`${details.circle} drop-shadow-md`}
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <motion.div
            className={`text-6xl font-extrabold tracking-tighter font-display ${details.color}`}
          >
            {score !== null ? displayValue : "—"}
          </motion.div>
          <div className="text-sm font-medium text-slate-400 mt-1">/ 100</div>
        </div>
      </div>

      <motion.p
        key={details.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-8 font-medium text-lg ${details.color}`}
      >
        {details.message}
      </motion.p>
    </div>
  );
}