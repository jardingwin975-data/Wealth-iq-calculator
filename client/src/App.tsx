export default function App() {
  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >

      {/* Back Button */}
      <a
        href="https://gwinanalytics.com"
        style={{
          display: "inline-block",
          marginBottom: "30px",
          padding: "10px 16px",
          background: "#0f172a",
          color: "white",
          borderRadius: "12px",
          textDecoration: "none",
          fontWeight: "600",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)"
        }}
      >
        ← Gwin Analytics
      </a>

      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
        WealthIQ Financial Calculator
      </h1>

      <p style={{ marginBottom: "40px", color: "#555" }}>
        Estimate savings growth, investments, and financial projections.
      </p>

      {/* Calculator Card */}
      <div
        style={{
          padding: "30px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >

        <div style={{ marginBottom: "20px" }}>
          <label>Initial Investment</label>
          <input
            type="number"
            placeholder="$10,000"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Monthly Contribution</label>
          <input
            type="number"
            placeholder="$500"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Annual Return %</label>
          <input
            type="number"
            placeholder="7"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Years</label>
          <input
            type="number"
            placeholder="30"
            style={inputStyle}
          />
        </div>

        <button
          style={{
            marginTop: "20px",
            padding: "14px 24px",
            background: "#22c55e",
            color: "white",
            borderRadius: "12px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Calculate
        </button>

      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  marginTop: "6px",
};
