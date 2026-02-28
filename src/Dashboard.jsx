import { calcStats } from "./stats.js";
import { C } from "./constants.js";
import { Card, Label, StatCard } from "./components.jsx";

export default function Dashboard({ trades, initialBalance }) {
  const stats = calcStats(trades);

  const balance = initialBalance + stats.totalPnl;

  const openTrades = trades.filter(
    (t) => t.pnl === "" || t.pnl === null || t.pnl === undefined,
  );

  const fmt = (n, d = 2) => Number(n).toFixed(d);
  const fmtEur = (n) => {
    const sign = Number(n) >= 0 ? "+" : "";
    return `${sign}$${fmt(Math.abs(n))}`;
  };

  return (
    <div className="fade-in">
      <h1
        style={{
          fontSize: 18,
          letterSpacing: "0.1em",
          marginBottom: 24,
        }}
      >
        DASHBOARD
      </h1>

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Total P&L"
          value={fmtEur(stats.totalPnl)}
          positive={stats.totalPnl >= 0}
        />
        <StatCard
          label="Win Rate"
          value={`${fmt(stats.winrate, 1)}%`}
          sub={`${stats.wins}W · ${stats.losses}L`}
          positive={stats.winrate >= 50}
        />
        <StatCard label="Avg RRR" value={fmt(stats.avgRrr)} sub="reward/risk" />
        <StatCard
          label="Balance"
          value={`$${fmt(balance)}`}
          sub={`Initial: $${fmt(initialBalance)}`}
          positive={balance >= initialBalance}
        />
      </div>

      {openTrades.length > 0 && (
        <Card style={{ marginBottom: 20 }}>
          <Label>Open Positions</Label>
          <div style={{ marginTop: 10 }}>
            {openTrades.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: C.mono,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {t.instrument}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {t.entryDate?.slice(0, 10)} · {t.position}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: C.mono,
                    color: C.accent,
                    background: `${C.accent}18`,
                    border: `1px solid ${C.accent}44`,
                    borderRadius: 20,
                    padding: "3px 10px",
                  }}
                >
                  OPEN
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <Label>Recent Closed Trades</Label>
        <div style={{ marginTop: 10 }}>
          {trades
            .filter((t) => t.pnl !== "" && t.pnl !== null)
            .slice(0, 5)
            .map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: C.mono,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {t.instrument}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {t.entryDate?.slice(0, 10)}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: C.mono,
                    fontWeight: 700,
                    fontSize: 13,
                    color: Number(t.pnl) >= 0 ? C.green : C.red,
                  }}
                >
                  {Number(t.pnl) >= 0 ? "+" : ""}$
                  {Math.abs(Number(t.pnl)).toFixed(2)}
                </div>
              </div>
            ))}
          {trades.filter((t) => t.pnl !== "" && t.pnl !== null).length ===
            0 && (
            <div style={{ color: C.muted, fontSize: 13 }}>
              No closed trades yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
