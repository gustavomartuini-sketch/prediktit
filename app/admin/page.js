'use client';
import { useState } from 'react';

const PENDING_MARKETS = [
  { id: 'p1', title: 'Will Tesla stock hit $500 by Q3 2026?', category: 'Economy', creator: 'elon_fan_42', createdAt: '2026-03-27', outcomes: ['Yes', 'No'] },
  { id: 'p2', title: 'Next iPhone will have foldable screen?', category: 'Technology', creator: 'apple_watcher', createdAt: '2026-03-26', outcomes: ['Yes', 'No'] },
  { id: 'p3', title: 'Will there be a ceasefire in Ukraine by July?', category: 'World Events', creator: 'geopolitics_pro', createdAt: '2026-03-25', outcomes: ['Yes', 'No'] },
];

const USERS = [
  { id: 'u1', username: 'whale_99', email: 'whale@mail.com', role: 'USER', balance: 87340, trades: 234, joined: '2026-01-15' },
  { id: 'u2', username: 'crypto_bull', email: 'bull@mail.com', role: 'USER', balance: 45200, trades: 156, joined: '2026-02-01' },
  { id: 'u3', username: 'day_trader', email: 'dt@mail.com', role: 'MODERATOR', balance: 23890, trades: 512, joined: '2025-12-20' },
  { id: 'u4', username: 'admin_chief', email: 'admin@prediktit.com', role: 'ADMIN', balance: 100000, trades: 0, joined: '2025-11-01' },
];

const REPORTS = [
  { id: 'r1', type: 'market', targetId: 'm5', reason: 'Duplicate of existing market', reporter: 'whale_99', status: 'pending', createdAt: '2026-03-27' },
  { id: 'r2', type: 'comment', targetId: 'c12', reason: 'Spam / self-promotion', reporter: 'crypto_bull', status: 'pending', createdAt: '2026-03-26' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('pending');
  const [approvedIds, setApprovedIds] = useState(new Set());
  const [rejectedIds, setRejectedIds] = useState(new Set());

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage markets, users, and platform settings.</p>
        </div>
        <span style={{
          padding: '4px 12px', borderRadius: '100px', fontSize: '11px',
          fontWeight: 700, background: 'var(--red-bg)', color: 'var(--red)',
          textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          Admin Only
        </span>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Users</div>
          <div className="stat-card-value">4,728</div>
          <div className="stat-card-change change-positive">+12.4% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active Markets</div>
          <div className="stat-card-value">156</div>
          <div className="stat-card-change change-positive">+8 new today</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Pending Approval</div>
          <div className="stat-card-value" style={{ color: 'var(--yellow)' }}>{PENDING_MARKETS.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Platform Volume</div>
          <div className="stat-card-value">$3.14M</div>
          <div className="stat-card-change change-positive">+23.7% this week</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '4px', width: 'fit-content' }}>
        {['pending', 'users', 'reports', 'settings'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
            background: tab === t ? 'var(--accent-primary)' : 'transparent',
            color: tab === t ? 'white' : 'var(--text-secondary)',
          }}>
            {t === 'pending' ? `Pending Markets (${PENDING_MARKETS.length})` :
             t === 'users' ? 'User Management' :
             t === 'reports' ? `Reports (${REPORTS.length})` : 'Settings'}
          </button>
        ))}
      </div>

      {/* Pending Markets Tab */}
      {tab === 'pending' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Markets Pending Approval</h2>
          {PENDING_MARKETS.map(m => (
            <div key={m.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)', padding: '20px', marginBottom: '12px',
              opacity: approvedIds.has(m.id) || rejectedIds.has(m.id) ? 0.5 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{m.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    <span>Category: <strong style={{ color: 'var(--text-secondary)' }}>{m.category}</strong></span>
                    <span>Creator: <strong style={{ color: 'var(--text-secondary)' }}>{m.creator}</strong></span>
                    <span>Outcomes: <strong style={{ color: 'var(--text-secondary)' }}>{m.outcomes.join(', ')}</strong></span>
                    <span>Submitted: {m.createdAt}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {approvedIds.has(m.id) ? (
                    <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: '13px' }}>Approved ✓</span>
                  ) : rejectedIds.has(m.id) ? (
                    <span style={{ color: 'var(--red)', fontWeight: 600, fontSize: '13px' }}>Rejected ✗</span>
                  ) : (
                    <>
                      <button onClick={() => setApprovedIds(prev => new Set([...prev, m.id]))} className="btn btn-sm btn-green">Approve</button>
                      <button onClick={() => setRejectedIds(prev => new Set([...prev, m.id]))} className="btn btn-sm btn-red">Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>User Management</h2>
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Balance</th>
                <th>Trades</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                      background: u.role === 'ADMIN' ? 'var(--red-bg)' : u.role === 'MODERATOR' ? 'var(--yellow-bg)' : 'var(--blue-bg)',
                      color: u.role === 'ADMIN' ? 'var(--red)' : u.role === 'MODERATOR' ? 'var(--yellow)' : 'var(--blue)',
                    }}>{u.role}</span>
                  </td>
                  <td>${u.balance.toLocaleString()}</td>
                  <td>{u.trades}</td>
                  <td>{u.joined}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" style={{ marginRight: '4px' }}>Edit</button>
                    <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Reports & Disputes</h2>
          {REPORTS.map(r => (
            <div key={r.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)', padding: '20px', marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                    {r.type.toUpperCase()} Report • Reported by {r.reporter} • {r.createdAt}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{r.reason}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-sm btn-outline">Review</button>
                  <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>Dismiss</button>
                  <button className="btn btn-sm btn-red">Take Action</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Platform Settings</h2>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '24px' }}>
            <div className="form-group">
              <label>Default Starting Balance</label>
              <input type="number" className="form-input" defaultValue={10000} />
            </div>
            <div className="form-group">
              <label>Minimum Market Liquidity</label>
              <input type="number" className="form-input" defaultValue={1000} />
            </div>
            <div className="form-group">
              <label>Trading Fee (%)</label>
              <input type="number" className="form-input" defaultValue={1} step="0.1" />
            </div>
            <div className="form-group">
              <label>Auto-Approve Markets</label>
              <select className="form-select">
                <option value="false">No - Require admin approval</option>
                <option value="true">Yes - Auto-approve all markets</option>
              </select>
            </div>
            <div className="form-group">
              <label>Marketing Automation</label>
              <select className="form-select">
                <option value="enabled">Enabled - Auto-generate posts & articles</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <button className="btn btn-primary btn-md">Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
}
