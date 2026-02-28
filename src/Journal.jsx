import { useState } from "react";
import { C } from "./constants.js";
import { Card, Badge, Modal } from "./components.jsx";
import TradeForm from "./TradeForm.jsx";

export default function Journal({
  trades,
  onAdd,
  onEdit,
  onDelete,
  currentBalance,
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [showAdd, setShowAdd] = useState(null);
  const [editTrade, setEditTrade] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };
  const monthTrades = trades.filter((t) => {
    if (!t.entryDate) return false;
    const d = new Date(t.entryDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const closedMonthTrades = monthTrades.filter(
    (t) => t.pnl !== "" && t.pnl !== null && t.pnl !== undefined,
  );

  const totalPnl = closedMonthTrades.reduce((sum, t) => sum + Number(t.pnl), 0);

  const wins = closedMonthTrades.filter((t) => Number(t.pnl) > 0).length;

  const losses = closedMonthTrades.filter((t) => Number(t.pnl) <= 0).length;

  const winRate = closedMonthTrades.length
    ? (wins / closedMonthTrades.length) * 100
    : 0;

  const fmt = (n, d = 2) => Number(n).toFixed(d);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const dayMap = {};
  closedMonthTrades.forEach((t) => {
    const d = new Date(t.entryDate).getDate();
    dayMap[d] = (dayMap[d] || 0) + Number(t.pnl);
  });

  const weeks = [];
  let offset = (firstDay + 6) % 7;
  let day = 1 - offset;

  while (day <= daysInMonth) {
    const week = [];
    for (let wd = 0; wd < 7; wd++, day++) {
      week.push(day >= 1 && day <= daysInMonth ? day : null);
    }
    weeks.push(week);
  }
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
        <h1 style={{ fontSize: 18, letterSpacing: "0.1em" }}>
          TRADING JOURNAL
        </h1>
        <button
          onClick={() => {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, "0");
            const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            setShowAdd(dateStr);
          }}
          style={{
            background: C.green,
            borderRadius: 8,
            padding: "9px 18px",
            color: "#0a0a0c",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Trade
        </button>
      </div>
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: C.muted,
                marginBottom: 4,
              }}
            >
              {monthNames[month].toUpperCase()} {year} — SUMMARY
            </div>
            <div
              style={{
                fontFamily: C.mono,
                fontSize: 24,
                fontWeight: 700,
                color: totalPnl >= 0 ? C.green : C.red,
              }}
            >
              {totalPnl >= 0 ? "+" : ""}${fmt(totalPnl)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              ["Trades", monthTrades.length],
              ["Winners", wins],
              ["Losers", losses],
              ["Win Rate", `${fmt(winRate, 1)}%`],
            ].map(([label, value]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: C.mono,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {monthNames[month].toUpperCase()} {year}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={prevMonth}
              style={{
                background: C.surface2,
                border: `1px solid ${C.border2}`,
                borderRadius: 6,
                padding: "4px 12px",
                color: C.textDim,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              style={{
                background: C.surface2,
                border: `1px solid ${C.border2}`,
                borderRadius: 6,
                padding: "4px 12px",
                color: C.textDim,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4,
            marginBottom: 4,
          }}
        >
          {weekDays.map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                padding: "6px 0",
                fontFamily: C.mono,
                fontSize: 10,
                color: C.muted,
                letterSpacing: "0.08em",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              marginBottom: 4,
            }}
          >
            {week.map((d, di) => {
              const pnl = d ? dayMap[d] : null;
              const hasTrades = d && dayMap[d] !== undefined;
              return (
                <div
                  key={di}
                  onClick={() => {
                    if (!d) return;
                    const pad = (n) => String(n).padStart(2, "0");
                    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}T15:30`;
                    setShowAdd(dateStr);
                  }}
                  style={{
                    minHeight: 56,
                    padding: 6,
                    borderRadius: 7,
                    cursor: d ? "pointer" : "default",
                    background: hasTrades
                      ? pnl >= 0
                        ? "#14532d22"
                        : "#450a0a22"
                      : C.surface2,
                    border: `1px solid ${
                      hasTrades ? (pnl >= 0 ? "#14532d" : "#450a0a") : C.border
                    }`,
                    transition: "border-color 0.15s",
                  }}
                  onMouseOver={(e) => {
                    if (d) e.currentTarget.style.borderColor = C.accent;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = hasTrades
                      ? pnl >= 0
                        ? "#14532d"
                        : "#450a0a"
                      : C.border;
                  }}
                >
                  {d && (
                    <>
                      <div
                        style={{
                          fontSize: 12,
                          color: hasTrades ? C.text : C.muted,
                          fontFamily: C.mono,
                        }}
                      >
                        {d}
                      </div>
                      {hasTrades && (
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: C.mono,
                            color: pnl >= 0 ? C.green : C.red,
                            marginTop: 2,
                          }}
                        >
                          {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 12,
            justifyContent: "center",
          }}
        >
          {[
            ["Winner Day", C.green],
            ["Loser Day", C.red],
          ].map(([label, color]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: C.muted,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  display: "inline-block",
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </Card>
      <div
        style={{
          fontFamily: C.mono,
          fontSize: 11,
          letterSpacing: "0.1em",
          color: C.muted,
          marginBottom: 12,
        }}
      >
        TRADES THIS MONTH ({monthTrades.length})
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
                  "Risk",
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
              {monthTrades.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: C.muted,
                    }}
                  >
                    No trades this month
                  </td>
                </tr>
              )}
              {[...monthTrades]
                .sort((a, b) => b.entryDate?.localeCompare(a.entryDate))
                .map((t) => {
                  const pnl =
                    t.pnl !== "" && t.pnl !== null ? Number(t.pnl) : null;
                  return (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background:
                          pnl === null
                            ? "#6ee7b708"
                            : pnl >= 0
                              ? "#14532d0a"
                              : "#450a0a0a",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: C.mono,
                          fontSize: 12,
                          color: C.textDim,
                          whiteSpace: "nowrap",
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
                        {t.exitPrice || "—"}
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
                          fontWeight: 700,
                          color:
                            pnl === null
                              ? C.accent
                              : pnl >= 0
                                ? C.green
                                : C.red,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pnl === null
                          ? "OPEN"
                          : `${pnl >= 0 ? "+" : ""}$${Math.abs(pnl).toFixed(2)}`}
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
                            onMouseOver={(e) =>
                              (e.target.style.color = C.accent)
                            }
                            onMouseOut={(e) =>
                              (e.target.style.color = C.textDim)
                            }
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
      <Modal open={!!showAdd} onClose={() => setShowAdd(null)}>
        <TradeForm
          onSave={(t) => {
            onAdd(t);
            setShowAdd(null);
          }}
          onClose={() => setShowAdd(null)}
          currentBalance={currentBalance}
          allTrades={trades}
          initialDate={showAdd}
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
