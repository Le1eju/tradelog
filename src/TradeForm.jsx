import { useInsertionEffect, useState } from "react";
import { C } from "./constants.js";
import { generateId } from "./storage.js";
import { Label } from "./components.jsx";

function Input({ style = {}, ...props }) {
  return (
    <input
      style={{
        width: "100%",
        background: C.surface2,
        border: `1px solid ${C.border2}`,
        borderRadius: 7,
        padding: "9px 12px",
        color: C.text,
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.15s",
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderColor = C.accent)}
      onBlur={(e) => (e.target.style.borderColor = C.border2)}
      {...props}
    />
  );
}

function FormSelect({ children, style = {}, ...props }) { 
  return (
    <select
      style={{
        width: "100%",
        background: C.surface2,
        border: `1px solid ${C.border2}`,
        borderRadius: 7,
        padding: "9px 12px",
        color: C.text,
        fontSize: 14,
        outline: "none",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a72' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 32,
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}

function Row({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children, flex = 1 }) {
  return (
    <div style={{ flex }}>
      <Label style={{ fontSize: 14 }}>{label}</Label>
      {children}
    </div>
  );
}

export default function TradeForm({
  onSave,
  onClose,
  initial = {},
  currentBalance,
  allTrades,
}) {
  const instruments = [
    ...new Set(allTrades.map((t) => t.instrument).filter(Boolean)),
  ];

  const strategies = [
    ...new Set(
      allTrades.map((t) => t.strategy).filter((s) => s && s !== "Unspecified"),
    ),
  ];

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [form, setForm] = useState({
    instrument: "",
    instrumentCustom: "",
    position: "Long",
    strategy: "Unspecified",
    strategyCustom: "",
    entryPrice: "",
    exitPrice: "",
    lots: "0.01",
    riskPct: "",
    riskAmount: "",
    entryDate: localNow,
    exitDate: "",
    pnl: "",
    notes: "",
    ...initial,
  });

  const [instrumentMode, setInstrumentMode] = useState(
    initial.instrument && !instruments.includes(initial.instrument)
      ? "custom"
      : "select",
  );
  const [strategyMode, setStrategyMode] = useState(
    initial.strategy &&
      initial.strategy !== "Unspecified" &&
      !strategies.includes(initial.strategy)
      ? "custom"
      : "select",
  );

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const handleRiskPct = (value) => {
    set("riskPct", value);
    if (value && currentBalance) {
      set("riskAmount", ((Number(value) / 100) * currentBalance).toFixed(2));
    }
  };
  const handleSubmit = () => {
    const instrument =
      instrumentMode === "custom" ? form.instrumentCustom : form.instrument;
    const strategy =
      strategyMode === "custom" ? form.strategyCustom : form.strategy;

    if (!instrument) {
      alert("Instrument is required!");
      return;
    }

    onSave({
      ...form,
      instrument,
      strategy: strategy || "Unspecified",
      id: form.id || generateId(),
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: C.mono,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.05em",
          }}
        >
          {initial.id ? "EDIT TRADE" : "ADD NEW TRADE"}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            color: C.muted,
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      <Row>
        <Field label="Instrument">
          {instrumentMode === "select" ? (
            <FormSelect
              value={form.instrument}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setInstrumentMode("custom");
                } else {
                  set("instrument", e.target.value);
                }
              }}
            >
              <option value="">Select...</option>
              {instruments.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
              <option value="__custom__">+ New instrument</option>
            </FormSelect>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <Input
                placeholder="e.g. XAUUSD"
                value={form.instrumentCustom}
                onChange={(e) => set("instrumentCustom", e.target.value)}
              />
              {instruments.length > 0 && (
                <button
                  onClick={() => setInstrumentMode("select")}
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border2}`,
                    borderRadius: 7,
                    padding: "0 10px",
                    color: C.muted,
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  ← List
                </button>
              )}
            </div>
          )}
        </Field>
        <Field label="Position" flex={0.6}>
          <FormSelect
            value={form.position}
            onChange={(e) => set("position", e.target.value)}
          >
            <option>Long</option>
            <option>Short</option>
          </FormSelect>
        </Field>
      </Row>
      <Row>
        <Field label="Strategy">
          {strategyMode === "select" ? (
            <FormSelect
              value={form.strategy}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setStrategyMode("custom");
                } else {
                  set("strategy", e.target.value);
                }
              }}
            >
              <option value="Unspecified">Unspecified</option>
              {strategies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="__custom__">+ New strategy</option>
            </FormSelect>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <Input
                placeholder="Strategy name..."
                value={form.strategyCustom}
                onChange={(e) => set("strategyCustom", e.target.value)}
              />
              {strategies.length > 0 && (
                <button
                  onClick={() => setStrategyMode("select")}
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border2}`,
                    borderRadius: 7,
                    padding: "0 10px",
                    color: C.muted,
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  ← List
                </button>
              )}
            </div>
          )}
        </Field>
      </Row>

      <Row>
        <Field label="Entry Price">
          <Input
            type="number"
            step="0.0001"
            placeholder="0.0000"
            value={form.entryPrice}
            onChange={(e) => set("entryPrice", e.target.value)}
          />
        </Field>
        <Field label="Exit Price (optional)">
          <Input
            type="number"
            step="0.0001"
            placeholder="0.0000"
            value={form.exitPrice}
            onChange={(e) => set("exitPrice", e.target.value)}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Lots">
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.01"
            value={form.lots}
            onChange={(e) => set("lots", e.target.value)}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Risk %">
          <Input
            type="number"
            step="0.01"
            placeholder="1.00"
            value={form.riskPct}
            onChange={(e) => handleRiskPct(e.target.value)}
          />
        </Field>
        <Field label="Risk Amount ($)">
          <Input
            type="number"
            step="0.01"
            placeholder="auto"
            value={form.riskAmount}
            onChange={(e) => handleRiskAmt(e.target.value)}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Entry Date">
          <Input
            type="datetime-local"
            value={form.entryDate}
            onChange={(e) => set("entryDate", e.target.value)}
          />
        </Field>
        <Field label="Exit Date (optional)">
          <Input
            type="datetime-local"
            value={form.exitDate}
            onChange={(e) => set("exitDate", e.target.value)}
          />
        </Field>
      </Row>

      <Row>
        <Field label="P&L — leave empty for open trade">
          <Input
            type="number"
            step="0.01"
            placeholder="e.g. 24.05 or -12.56"
            value={form.pnl}
            onChange={(e) => set("pnl", e.target.value)}
          />
        </Field>
      </Row>

      <div style={{ marginBottom: 14 }}> 
        <Label>Notes (optional)</Label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Trade notes, market conditions..."
          style={{
            width: "100%",
            background: C.surface2,
            border: `1px solid ${C.border2}`,
            borderRadius: 7,
            padding: "9px 12px",
            color: C.text,
            fontSize: 14,
            resize: "vertical",
            minHeight: 80,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: `1px solid ${C.border2}`,
            borderRadius: 8,
            padding: "9px 18px",
            color: C.textDim,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
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
          Save Trade
        </button>
      </div>
    </div>
  );
}
