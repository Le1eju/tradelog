import { useState } from "react";
import { C } from "./constants.js";
import { Card, Badge, Modal } from "./components.jsx";
import TradeForm from "./TradeForm.jsx";
import { calcTradeRRR } from "./stats.js";

export default function History({
  trades,
  onAdd,
  onEdit,
  onDelete,
  currentBalance,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editTrade, setEditTrade] = useState(null);

  const sorted = [...trades].sort((a, b) =>
    b.entryDate?.localeCompare(a.entryDate),
  );
  const openTrades = sorted.filter(
    (t) => t.pnl === "" || t.pnl === null || t.pnl === undefined,
  );
  const closedTrades = sorted.filter(
    (t) => t.pnl !== "" && t.pnl !== null && t.pnl !== undefined,
  );

  const fmt = (n, d = 2) => Number(n).toFixed(d);

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 18, letterSpacing: "0.1em" }}>TRADE HISTORY</h1>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: C.green,
            borderRadius: 8,
            padding: "9px 18px",
            color: "#0A0A0C",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Trade
        </button>
      </div>
      {openTrades.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              letterSpacing: "0.1em",
              color: C.accent,
              marginBottom: 12,
            }}
          >
            OPEN POSITIONS ({openTrades.length})
          </div>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${C.border2}`,
                  }}
                >
                  {[
                    "Date",
                    "Instrument",
                    "Position",
                    "Strategy",
                    "Entry",
                    "Lots",
                    "Risk",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontFamily: C.mono,
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        color: C.muted,
                        fontWeight: 400,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {openTrades.map((t) => (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: "#6ee7b708",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: C.textDim,
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.entryDate?.slice(0, 10)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 700,
                      }}
                    >
                      {t.instrument}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={t.position === "Long" ? "green" : "red"}>
                        {t.position}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: C.textDim,
                      }}
                    >
                      {t.strategy}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.entryPrice || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.lots}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.riskPct ? `${t.riskPct}%` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setEditTrade(t)}
                          style={{
                            background: "none",
                            color: C.textDim,
                            fontSize: 15,
                            transition: "color 0.15s",
                          }}
                          onMouseOver={(e) => (e.target.style.color = C.accent)}
                          onMouseOut={(e) => (e.target.style.color = C.textDim)}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this trade?")) onDelete(t.id);
                          }}
                          style={{
                            background: "none",
                            color: C.muted,
                            fontSize: 15,
                            transition: "color 0.15s",
                          }}
                          onMouseOver={(e) => (e.target.style.color = C.red)}
                          onMouseOut={(e) => (e.target.style.color = C.muted)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
      <div
        style={{
          fontFamily: C.mono,
          fontSize: 11,
          letterSpacing: "0.1em",
          color: C.muted,
          marginBottom: 12,
        }}
      >
        CLOSED TRADES ({closedTrades.length})
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${C.border2}`,
                }}
              >
                {[
                  "Date",
                  "Instrument",
                  "Position",
                  "Strategy",
                  "Entry",
                  "Exit",
                  "Lots",
                  "Risk",
                  "RRR",
                  "P&L",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontFamily: C.mono,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: C.muted,
                      fontWeight: 400,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {closedTrades.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: C.muted,
                    }}
                  >
                    No closed trades yet
                  </td>
                </tr>
              )}
              {closedTrades.map((t) => {
                const pnl = Number(t.pnl);
                const rrr = calcTradeRRR(t);
                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: pnl >= 0 ? "#14532d0a" : "#450a0a0a",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: C.textDim,
                        fontFamily: C.mono,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.entryDate?.slice(0, 10)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.instrument}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={t.position === "Long" ? "green" : "red"}>
                        {t.position}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: C.textDim,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.strategy}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.entryPrice || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.exitPrice || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.lots}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                      }}
                    >
                      {t.riskPct ? `${t.riskPct}%` : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontSize: 12,
                        color: C.textDim,
                      }}
                    >
                      {rrr !== null ? fmt(rrr) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: C.mono,
                        fontWeight: 700,
                        color: pnl >= 0 ? C.green : C.red,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setEditTrade(t)}
                          style={{
                            background: "none",
                            color: C.textDim,
                            fontSize: 15,
                            transition: "color 0.15s",
                          }}
                          onMouseOver={(e) => (e.target.style.color = C.accent)}
                          onMouseOut={(e) => (e.target.style.color = C.textDim)}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this trade?")) onDelete(t.id);
                          }}
                          style={{
                            background: "none",
                            color: C.muted,
                            fontSize: 15,
                            transition: "color 0.15s",
                          }}
                          onMouseOver={(e) => (e.target.style.color = C.red)}
                          onMouseOut={(e) => (e.target.style.color = C.muted)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <TradeForm
          onSave={(t) => {
            onAdd(t);
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
          currentBalance={currentBalance}
          allTrades={trades}
        />
      </Modal>

      <Modal open={!!editTrade} onClose={() => setEditTrade(null)}>
        {editTrade && (
          <TradeForm
            initial={editTrade}
            onSave={(t) => {
              onEdit(t);
              setEditTrade(null);
            }}
            onClose={() => setEditTrade(null)}
            currentBalance={currentBalance}
            allTrades={trades}
          />
        )}
      </Modal>
    </div>
  );
}
