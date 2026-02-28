export function calcStats(trades) {
  const closed = trades.filter(
    (t) => t.pnl !== "" && t.pnl !== null && t.pnl !== undefined,
  );

  if (!closed.length) {
    return {
      totalPnl: 0,
      winrate: 0,
      avgRrr: 0,
      wins: 0,
      losses: 0,
      totalTrades: 0,
    };
  }

  const totalPnl = closed.reduce((sum, t) => sum + Number(t.pnl), 0);

  const wins = closed.filter((t) => Number(t.pnl) > 0);
  const losses = closed.filter((t) => Number(t.pnl) <= 0);

  const winrate = (wins.length / closed.length) * 100;

  const rrrTrades = closed.filter(
    (t) => t.riskAmount && Number(t.riskAmount) > 0,
  );
  const avgRrr = rrrTrades.length
    ? rrrTrades.reduce(
        (sum, t) => sum + Math.abs(Number(t.pnl)) / Number(t.riskAmount),
        0,
      ) / rrrTrades.length
    : 0;

  return {
    totalPnl,
    winrate,
    avgRrr,
    wins: wins.length,
    losses: losses.length,
    totalTrades: closed.length,
  };
}

export function calcTradeRRR(trade) {
  if (
    trade.pnl === "" ||
    trade.pnl === null ||
    !trade.riskAmount ||
    Number(trade.riskAmount) === 0
  ) {
    return null;
  }
  return Math.abs(Number(trade.pnl)) / Number(trade.riskAmount);
}
