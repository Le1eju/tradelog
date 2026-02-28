import { useState } from "react"

const fontLink = document.createElement("link")
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;600&display=swap'
document.head.appendChild(fontLink)

const globalStyle = document.createElement("style")
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
`
document.head.appendChild(globalStyle)

const C = {
  bg: '#0a0a0c',
  surface: '#111116',
  surface2: '#18181f',
  border: '#1e1e28',
  border2: '#262630',
  green: '#22c55e',
  red: '#ef4444',
  accent: '#6ee7b7',
  muted: '#5a5a72',
  text: '#e2e8f0',
  textDim: '#94a3b8',
  mono: "'Space Mono', monospace",
}

export default function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontFamily: C.mono, color: C.green }}>TradeLog</h1>
      <p style={{ color: C.textDim, marginTop: 8 }}>Okey to działa!</p>
    </div>
  )
}