'use client';
import { useState } from 'react';

const STATS = [
  { label: 'Play Balance', value: '$10,000.00', change: '+$1,240', positive: true },
  { label: 'Crypto Balance', value: '0.00 ETH', change: 'Connect wallet', positive: true },
  { label: 'Active Positions', value: '12', change: '+3 this week', positive: true },
  { label: 'Win Rate', value: '67%', change: '+5% vs last month', positive: true },
];

const POSITIONS = [
  { market: 'Will Bitcoin exceed $150,000 by end of 2026?', outcome: 'Yes', shares: 500, avgPrice: 0.55, currentPrice: 0.62, pnl: 35 },
  { market: 'Who will win the 2026 FIFA World Cup?', outcome: 'Brazil', shares: 300, avgPrice: 0.18, currentPrice: 0.22, pnl: 12 },
  { market: 'Will GPT-5 be released before July 2026?', outcome: 'No', shares: 200, avgPrice: 0.50, currentPrice: 0.55, pnl: 10 },
  { market: 'Will SpaceX Starship complete orbital flight?', outcome: 'Yes', shares: 150, avgPrice: 0.65, currentPrice: 0.71, pnl: 9 },
  { market: 'Ethereum ETF surpass $50B AUM?', outcome: 'No', shares: 400, avgPrice: 0.58, currentPrice: 0.62, pnl: 16 },
];

const RECENT_TRADES = [
  { time: '2 hours ago', market: 'Bitcoin > $150K', action: 'Bought 100 Yes @ 62¢', amount: '$62.00' },
  { time: '5 hours ago', market: 'FIFA World Cup', action: 'Bought 200 Brazil @ 21¢', amount: '$42.00' },
  { time: '1 day ago', market: 'GPT-5 Release', action: 'Sold 50 Yes @ 46¢', amount: '$23.00' },
  { time: '2 days ago', market: 'SpaceX Starship', action: 'Bought 150 Yes @ 65¢', amount: '$97.50' },
  { time: '3 days ago', market: 'Fed Rate Decision', action: 'Bought 300 Hold @ 45¢', amount: '$135.00' },
];

export default function DashboardPage() {
  const [tab, setTab] = useState('positions');

  const totalValue = POSITIONS.reduce((sum, p) => sum + p.shares * p.currentPrice, 0);
  const totalPnl = POSITIONS.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, demo_trader</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        {STATS.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-card-label">{stat.label}</div>
            <div className="stat-card-value">{stat.value}</div>
            <div className={`stat-card-change ${stat.positive ? 'change-positive' : 'change-negative'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Value Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
        borderRadius: 'var(--radius)', padding: '32px', marginBottom: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Total Portfolio Value</div>
          <div style={{ fontSize: '36px', fontWeight: 800 }}>${totalValue.toFixed(2)}</div>
          <div style={{ fontSize: '14px', color: '#a3e635', marginTop: '4px' }}>+${totalPnl.toFixed(2)} unrealized P&L</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            Explore Markets
          </a>
          <a href="/create" className="btn btn-lg" style={{ background: 'white', color: 'var(--accent-primary)' }}>
            Create Market
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '4px', width: 'fit-content' }}>
        {['positions', 'trades', 'wallet'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: '6px', fontFamily: 'inherit',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              background: tab === t ? 'var(--accent-primary)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-secondary)',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Positions Tab */}
      {tab === 'positions' && (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Position</th>
              <th>Shares</th>
              <th>Avg Price</th>
              <th>Current</th>
              <th>Value</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {POSITIONS.map((pos, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, maxWidth: '300px' }}>{pos.market}</td>
                <td>
                  <span style={{
                    padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                    background: 'var(--blue-bg)', color: 'var(--blue)',
                  }}>
                    {pos.outcome}
                  </span>
                </td>
                <td>{pos.shares}</td>
                <td>{(pos.avgPrice * 100).toFixed(0)}¢</td>
                <td style={{ fontWeight: 600 }}>{(pos.currentPrice * 100).toFixed(0)}¢</td>
                <td style={{ fontWeight: 600 }}>${(pos.shares * pos.currentPrice).toFixed(2)}</td>
                <td style={{ color: pos.pnl >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                  {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Trades Tab */}
      {tab === 'trades' && (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Market</th>
              <th>Action</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_TRADES.map((trade, idx) => (
              <tr key={idx}>
                <td style={{ color: 'var(--text-tertiary)' }}>{trade.time}</td>
                <td style={{ fontWeight: 600 }}>{trade.market}</td>
                <td>{trade.action}</td>
                <td style={{ fontWeight: 600 }}>{trade.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Wallet Tab */}
      {tab === 'wallet' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Play Money Wallet */}
          <div className="stat-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Play Money Wallet</h3>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--green)', marginBottom: '24px' }}>$10,000.00</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Play money is free and can be used to trade on any market. New users receive $10,000.
            </p>
            <button className="btn btn-primary btn-md btn-block">Get More Play Money</button>
          </div>

          {/* Crypto Wallet */}
          <div className="stat-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Crypto Wallet</h3>
            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>0.00 ETH</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Connect your Ethereum wallet to trade with crypto. Supports MetaMask, WalletConnect, and more.
            </p>
            <button className="btn btn-outline btn-md btn-block" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
