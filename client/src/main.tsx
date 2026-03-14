import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const rootEl = document.getElementById("root");

function showError(message: string) {
  if (!rootEl) return;
  rootEl.innerHTML = `
    <div style="padding:24px;font-family:Arial,sans-serif;background:white;color:#111;line-height:1.5">
      <h1 style="color:#b91c1c;margin:0 0 12px 0;">WealthIQ runtime error</h1>
      <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;padding:12px;border-radius:8px;">${String(message)}</pre>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  showError(String(event.error?.stack || event.message || "Unknown error"));
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = (event as PromiseRejectionEvent).reason;
  showError(String(reason?.stack || reason || "Unhandled promise rejection"));
});

async function boot() {
  try {
    if (!rootEl) {
      throw new Error('Missing root element: <div id="root"></div>');
    }

    const mod = await import("./App");
    const App = mod.default;

    createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    showError(String((error as Error)?.stack || error));
  }
}

boot();
