import { C } from './constants.js'

export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Label({ children, style = {} }) {
  return (
    <div
      style={{
        fontSize: 16,
        fontFamily: C.mono,
        letterSpacing: "0.12em",
        color: C.muted,
        textTransform: "uppercase",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, positive }) {
  return (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <Label>{label}</Label>
      <div
        style={{
          fontSize: 28,
          fontFamily: C.mono,
          fontWeight: 700,
          color: positive === undefined ? C.text : positive ? C.green : C.red,
          marginBottom: 2,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>}
    </Card>
  );
}

export function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: C.mono,
        background: color === "green" ? "#14532d33" : "#450a0a33",
        color: color === "green" ? C.green : C.red,
        border: `1px solid ${color === "green" ? "#14532d" : "#450a0a"}`,
      }}
    >
      {children}
    </span>
  );
}
