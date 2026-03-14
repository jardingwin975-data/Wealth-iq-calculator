import { useState } from "react";
import {
  Wallet,
  Home as HomeIcon,
  Car,
  ShoppingCart,
  CreditCard,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  BarChart3,
  BadgeDollarSign,
  RotateCcw,
} from "lucide-react";

export default function Home() {
  const [income, setIncome] = useState(0);
  const [rent, setRent] = useState(0);
  const [car, setCar] = useState(0);
  const [groceries, setGroceries] = useState(0);
  const [other, setOther] = useState(0);

  const [score, setScore] = useState<number | null>(null);
  const [expenseRatio, setExpenseRatio] = useState<number | null>(null);
  const [savingsRate, setSavingsRate] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [disposable, setDisposable] = useState<number | null>(null);

  const calculate = () => {
    const expenses = rent + car + groceries + other;
    const leftover = income - expenses;

    const ratio = income > 0 ? (expenses / income) * 100 : 0;
    const savings = income > 0 ? (leftover / income) * 100 : 0;

    let calculatedScore = Math.round(100 - ratio + savings);

    calculatedScore = Math.max(0, Math.min(100, calculatedScore));

    setScore(calculatedScore);
    setExpenseRatio(Math.round(ratio));
    setSavingsRate(Math.round(savings));
    setTotalExpenses(expenses);
    setDisposable(leftover);
  };

  const reset = () => {
    setIncome(0);
    setRent(0);
    setCar(0);
    setGroceries(0);
    setOther(0);
    setScore(null);
    setExpenseRatio(null);
    setSavingsRate(null);
    setTotalExpenses(null);
    setDisposable(null);
  };

  const statCards = [
    {
      icon: ShieldCheck,
      title: "Financial Health",
      value: "Score-based",
      desc: "Quickly measure overall budget strength.",
    },
    {
      icon: BarChart3,
      title: "Expense Analytics",
      value: "Real-time",
      desc: "Track ratios and cash flow.",
    },
    {
      icon: BadgeDollarSign,
      title: "Budget Clarity",
      value: "Actionable",
      desc: "See how income supports your lifestyle.",
    },
  ];

  return (
    <>
      <a
        href="https://gwinanalytics.com"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          padding: "10px 14px",
          background: "#11161d",
          color: "white",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: 600,
          zIndex: 999,
        }}
      >
        ← Gwin Analytics
      </a>

      <div className="min-h-screen app-shell pt-24 px-4 pb-10">
        <div className="mx-auto max-w-6xl">

          {/* HERO */}
          <section className="premium-card p-8 mb-10">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Sparkles size={16} />
              Financial health scoring, simplified
            </div>

            <h1 className="text-4xl font-bold">
              Wealth IQ <span style={{color:"#10b981"}}>Financial Calculator</span>
            </h1>

            <p style={{marginTop:16,color:"#555",maxWidth:600}}>
              A clean financial score tool that turns your monthly income and
              expenses into a simple health snapshot.
            </p>

          </section>

          {/* FEATURES */}

          <div className="grid md:grid-cols-3 gap-6 mb-10">

            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="premium-card p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon />
                    <strong>{card.title}</strong>
                  </div>
                  <div style={{fontSize:20,fontWeight:700}}>
                    {card.value}
                  </div>
                  <p style={{color:"#666"}}>{card.desc}</p>
                </div>
              );
            })}

          </div>

          {/* MAIN GRID */}

          <div className="grid lg:grid-cols-2 gap-10">

            {/* INPUT PANEL */}

            <div className="premium-card p-8">

              <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>
                Monthly Metrics
              </h2>

              <Input label="Monthly Income" icon={<Wallet />} value={income} setValue={setIncome}/>
              <Input label="Rent / Mortgage" icon={<HomeIcon />} value={rent} setValue={setRent}/>
              <Input label="Car Payment" icon={<Car />} value={car} setValue={setCar}/>
              <Input label="Groceries" icon={<ShoppingCart />} value={groceries} setValue={setGroceries}/>
              <Input label="Other Expenses" icon={<CreditCard />} value={other} setValue={setOther}/>

              <div style={{display:"flex",gap:12,marginTop:20}}>

                <button
                  onClick={calculate}
                  className="financial-button"
                  style={{
                    padding:"14px 20px",
                    borderRadius:12,
                    border:"none",
                    color:"white",
                    fontWeight:700
                  }}
                >
                  Calculate Wealth IQ
                </button>

                <button
                  onClick={reset}
                  style={{
                    padding:"14px 20px",
                    borderRadius:12,
                    border:"1px solid #ddd",
                    background:"white",
                    fontWeight:600
                  }}
                >
                  <RotateCcw size={16}/> Reset
                </button>

              </div>

            </div>

            {/* RESULTS */}

            <div className="premium-card p-8">

              <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>
                Financial Results
              </h2>

              <Result label="Wealth IQ Score" value={score !== null ? `${score}/100` : "—"} />
              <Result label="Expense Ratio" value={expenseRatio !== null ? `${expenseRatio}%` : "—"} />
              <Result label="Savings Rate" value={savingsRate !== null ? `${savingsRate}%` : "—"} />
              <Result label="Total Expenses" value={totalExpenses !== null ? `$${totalExpenses}` : "—"} />
              <Result label="Disposable Income" value={disposable !== null ? `$${disposable}` : "—"} />

            </div>

          </div>

          <footer style={{marginTop:40,textAlign:"center",color:"#777"}}>
            Wealth IQ Financial Calculator • Created by Jardin Gwin
          </footer>

        </div>
      </div>
    </>
  );
}

function Input({label,icon,value,setValue}:{label:string,icon:any,value:number,setValue:any}){

  return(
    <div style={{marginBottom:16}}>
      <label style={{display:"flex",gap:8,fontWeight:600}}>
        {icon} {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e)=>setValue(Number(e.target.value))}
        className="financial-input"
        style={{
          width:"100%",
          padding:12,
          marginTop:6
        }}
      />
    </div>
  )

}

function Result({label,value}:{label:string,value:string}){

  return(
    <div style={{
      border:"1px solid #eee",
      padding:12,
      borderRadius:12,
      marginBottom:12
    }}>
      <div style={{fontSize:12,color:"#777"}}>
        {label}
      </div>

      <div style={{fontSize:20,fontWeight:700}}>
        {value}
      </div>
    </div>
  )

}
