import { StatCard } from "./components";

export default function Dashboard() {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 18, letterSpacing: "0.1em", marginBottom: 24 }}>
        DASHBOARD
      </h1>
      <StatCard label="Total P&L" value="+$1,234.56" positive={true} />
    </div>
  );
}
