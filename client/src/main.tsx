import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <div style={{ padding: 40, color: "black", background: "white" }}>
    <h1>MAIN TSX DIRECT TEST</h1>
    <p>If you see this, the JS bundle is loading and React is mounting.</p>
  </div>
);
