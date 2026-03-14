import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen">

      {/* Back Button */}
      <a
        href="https://gwinanalytics.com"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          padding: "10px 16px",
          background: "#0f172a",
          color: "white",
          borderRadius: "12px",
          textDecoration: "none",
          fontWeight: 600,
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          zIndex: 9999
        }}
      >
        ← Gwin Analytics
      </a>

      {/* ORIGINAL APP */}
      <Home />

    </div>
  );
}
