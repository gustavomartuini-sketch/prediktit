'use client';

const POSITIONS = [
  { id: 1, market: 'Will Bitcoin exceed $150,000 by end of 2026?', outcome: 'Yes', shares: 500, avgPrice: 0.55, currentPrice: 0.62, marketEnd: '2026-12-31' },
  { id: 2, market: 'Who will win the 2026 FIFA World Cup?', outcome: 'Brazil', shares: 300, avgPrice: 0.18, currentPrice: 0.22, marketEnd: '2026-07-19' },
  { id: 3, market: 'Will GPT-5 be released before July 2026?', outcome: 'No', shares: 200, avgPrice: 0.50, currentPrice: 0.55, marketEnd: '2026-07-01' },
  { id: 4, market: 'Will SpaceX Starship complete orbital flight?', outcome: 'Yes', shares: 150, avgPrice: 0.65, currentPrice: 0.71, marketEnd: '2026-06-30' },
  { id: 5, market: 'Ethereum ETF surpass $50B AUM?', outcome: 'No', shares: 400, avgPrice: 0.58, currentPrice: 0.62, marketEnd: '2026-12-31' },
  { id: 6, market: 'Next US Federal Reserve interest rate decision', outcome: 'Hold', shares: 300, avgPrice: 0.42, currentPrice: 0.48, marketEnd: '2026-05-01' },
];

const RESOLVED = [
  { market: 'Will Apple launch AR glasses in Q1 2026?', outcome: 'No', shares: 200, buyPrice: 0.60, resolvePrice: 1.0, profit: 80 },
  { market: 'ETH merge upgrade successful?', outcome: 'Yes', shares: 500, buyPrice: 0.85, resolvePrice: 1.0, profit: 75 },
  { market: 'Twitter rebrand to X complete?', outcome: 'Yes', shares: 100, buyPrice: 0.92, resolvePrice: 1.0, profit: 8 },
];

export default function PortfolioPage() {
  const totalInvested = POSITIONS.reduce((sum, p) => sum + p.shares * p.avgPrice, 0);
  const totalValue = POSITIONS.reduce((sum, p) => sum + p.shares * p.currentPrice, 0);
  const totalPnl = totalValue - totalInvested;
  const totalRealized = RESOLVED.reduce((sum, p) => sum + p.profit, 0);

  return (
    <div className="container">
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Portfolio</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Track your active positions and resolved markets.</p>

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Invested</div>
          <div className="stat-card-value">${totalInvested.toFixed(0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Current Value</div>
          <div className="stat-card-value">${totalValue.toFixed(0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Unrealized P&L</div>
          <div className="stat-card-value" style={{ color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Realized Profit</div>
          <div className="stat-card-value" style={{ color: 'var(--green)' }}>+${totalRealized}</div>
        </div>
      </div>

      {/* Active Positions */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Active Positions ({POSITIONS.length})</h2>
      <table className="portfolio-table" style={{ marginBottom: '40px' }}>
        <thead>
          <tr>
            <th>Market</th>
            <th>Position</th>
            <th>Shares</th>
            <th>Avg Price</th>
            <th>Current</th>
            <th>Value</th>
            <th>P&L</th>
            <th>Ends</th>
          </tr>
        </thead>
        <tbody>
          {POSITIONS.map(pos => {
            const value = pos.shares * pos.currentPrice;
            const cost = pos.shares * pos.avgPrice;
            const pnl = value - cost;
            return (
              <tr key={pos.id}>
                <td style={{ fontWeight: 600, maxWidth: '280px' }}>{pos.market}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                    background: 'var(--blue-bg)', color: 'var(--blue)',
                  }}>
                    {pos.outcome}
                  </span>
                </td>
                <td>{pos.shares}</td>
                <td>{(pos.avgPrice * 100).toFixed(0)}¢</td>
                <td style={{ fontWeight: 600 }}>{(pos.currentPrice * 100).toFixed(0)}¢</td>
                <td style={{ fontWeight: 600 }}>${value.toFixed(2)}</td>
                <td style={{ color: pnl >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                </td>
                <td style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{pos.marketEnd}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Resolved Markets */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Resolved Markets ({RESOLVED.length})</h2>
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Market</th>
            <th>Your Position</th>
            <th>Shares</th>
            <th>Buy Price</th>
            <th>Resolved At</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {RESOLVED.map((pos, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 600 }}>{pos.market}</td>
              <td>
                <span style={{
                  padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                  background: 'var(--green-bg)', color: 'var(--green)',
                }}>
                  {pos.outcome} ✓
                </span>
              </td>
              <td>{pos.shares}</td>
              <td>{(pos.buyPrice * 100).toFixed(0)}¢</td>
              <td>{(pos.resolvePrice * 100).toFixed(0)}¢</td>
              <td style={{ color: 'var(--green)', fontWeight: 700 }}>+${pos.profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
