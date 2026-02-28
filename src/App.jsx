import { useState } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;600&display=swap";
document.head.appendChild(fontLink);

const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #0A0A0C;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #111116; }
  ::-webkit-scrollbar-thumb { background: #2A2A35; border-radius: 3px; }
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }
  input, select, textarea { font-family: inherit; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {animation: fadeIn 0.3s ease forwards; }
`;
document.head.appendChild(globalStyle);

const C = {
  bg: "#0a0a0c",
  surface: "#111116",
  surface2: "#18181f",
  border: "#1e1e28",
  border2: "#262630",
  green: "#22c55e",
  red: "#ef4444",
  accent: "#6ee7b7",
  muted: "#5a5a72",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  mono: "'Space Mono', monospace",
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "journal", label: "Journal" },
  { id: "history", label: "History" },
  { id: "settings", label: "Settings" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      <nav
        style={{
          width: 220,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "28px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "0 20px 24px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontFamily: C.mono,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.12em",
            }}
          >
            TRADE<span style={{ color: C.green }}>LOG</span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.muted,
              marginTop: 4,
            }}
          >
            Trading Journal
          </div>
        </div>

        <div style={{ marginTop: 16, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                background: page === item.id ? `${C.green}18` : "none",
                borderLeft: `3px solid ${page === item.id ? C.green : "transparent"}`,
                color: page === item.id ? C.green : C.textDim,
                fontSize: 13,
                fontWeight: page === item.id ? 600 : 400,
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 32px",
        }}
      >
        <p style={{ color: C.muted }}>Current page: {page}</p>
      </main>
    </div>
  );
}