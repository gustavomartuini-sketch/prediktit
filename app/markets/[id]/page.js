'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';

// Demo market data
const ALL_MARKETS = {
  '1': {
    id: '1', title: 'Will Bitcoin exceed $150,000 by end of 2026?',
    description: 'This market resolves YES if Bitcoin (BTC) trades above $150,000 on any major exchange (Coinbase, Binance, Kraken) before December 31, 2026 11:59 PM UTC. Price must be sustained for at least 1 minute.',
    category: 'Crypto', type: 'binary',
    outcomes: [{ name: 'Yes', price: 0.62, volume: 301337 }, { name: 'No', price: 0.38, volume: 185983 }],
    totalVolume: 487320, totalLiquidity: 50000, endDate: '2026-12-31T23:59:00Z', status: 'active',
    tradeHistory: [
      { outcome: 'Yes', side: 'buy', shares: 500, price: 0.60, timestamp: '2026-03-27T14:30:00Z', user: 'whale_99' },
      { outcome: 'No', side: 'buy', shares: 200, price: 0.40, timestamp: '2026-03-27T12:15:00Z', user: 'crypto_bull' },
      { outcome: 'Yes', side: 'sell', shares: 150, price: 0.62, timestamp: '2026-03-27T10:00:00Z', user: 'day_trader' },
      { outcome: 'Yes', side: 'buy', shares: 1000, price: 0.58, timestamp: '2026-03-26T22:00:00Z', user: 'mega_bet' },
      { outcome: 'No', side: 'buy', shares: 300, price: 0.42, timestamp: '2026-03-26T18:30:00Z', user: 'bear_gang' },
    ],
  },
  '2': {
    id: '2', title: 'Who will win the 2026 FIFA World Cup?',
    description: 'This market resolves to the team that wins the 2026 FIFA World Cup final. If the tournament is cancelled, the market will be voided.',
    category: 'Sports', type: 'multiple',
    outcomes: [
      { name: 'Brazil', price: 0.22, volume: 196073 },
      { name: 'France', price: 0.19, volume: 169508 },
      { name: 'Argentina', price: 0.18, volume: 160587 },
      { name: 'Germany', price: 0.12, volume: 107058 },
      { name: 'England', price: 0.11, volume: 98136 },
      { name: 'Spain', price: 0.09, volume: 80293 },
      { name: 'Other', price: 0.09, volume: 80493 },
    ],
    totalVolume: 892150, totalLiquidity: 100000, endDate: '2026-07-19T23:59:00Z', status: 'active',
    tradeHistory: [
      { outcome: 'Brazil', side: 'buy', shares: 800, price: 0.21, timestamp: '2026-03-28T08:00:00Z', user: 'futbol_fan' },
      { outcome: 'France', side: 'buy', shares: 600, price: 0.18, timestamp: '2026-03-27T20:00:00Z', user: 'paris_punter' },
      { outcome: 'Argentina', side: 'sell', shares: 200, price: 0.19, timestamp: '2026-03-27T16:00:00Z', user: 'messi_fan' },
    ],
  },
  '3': {
    id: '3', title: 'Will GPT-5 be released before July 2026?',
    description: 'Resolves YES if OpenAI officially releases GPT-5 (not preview/beta) before July 1, 2026. An official blog post or API availability counts as release.',
    category: 'Technology', type: 'binary',
    outcomes: [{ name: 'Yes', price: 0.45, volume: 153450 }, { name: 'No', price: 0.55, volume: 187550 }],
    totalVolume: 341000, totalLiquidity: 75000, endDate: '2026-07-01T00:00:00Z', status: 'active',
    tradeHistory: [
      { outcome: 'No', side: 'buy', shares: 400, price: 0.54, timestamp: '2026-03-28T06:00:00Z', user: 'ai_skeptic' },
      { outcome: 'Yes', side: 'buy', shares: 250, price: 0.46, timestamp: '2026-03-27T22:00:00Z', user: 'tech_insider' },
    ],
  },
};

// Generate for remaining IDs
['4','5','6','7','8'].forEach(id => {
  if (!ALL_MARKETS[id]) {
    ALL_MARKETS[id] = {
      id, title: `Market #${id}`, description: 'Market details loading...',
      category: 'Economy', type: 'binary',
      outcomes: [{ name: 'Yes', price: 0.50, volume: 50000 }, { name: 'No', price: 0.50, volume: 50000 }],
      totalVolume: 100000, totalLiquidity: 10000, endDate: '2026-12-31T23:59:00Z', status: 'active',
      tradeHistory: [],
    };
  }
});

function getCategoryClass(cat) {
  const map = { Crypto: 'cat-crypto', Sports: 'cat-sports', Technology: 'cat-technology', Politics: 'cat-politics', Economy: 'cat-economy', Science: 'cat-science', Entertainment: 'cat-entertainment' };
  return map[cat] || 'cat-default';
}

export default function MarketDetailPage() {
  const params = useParams();
  const market = ALL_MARKETS[params.id] || ALL_MARKETS['1'];

  const [tradeTab, setTradeTab] = useState('buy');
  const [selectedOutcome, setSelectedOutcome] = useState(0);
  const [shares, setShares] = useState(100);
  const [tradeConfirmed, setTradeConfirmed] = useState(false);

  const selectedPrice = market.outcomes[selectedOutcome]?.price || 0.5;
  const cost = (shares * selectedPrice).toFixed(2);
  const potentialProfit = (shares * (1 - selectedPrice)).toFixed(2);

  // Generate fake price chart data
  const chartData = useMemo(() => {
    const bars = [];
    let price = 0.5;
    for (let i = 0; i < 60; i++) {
      price += (Math.random() - 0.48) * 0.04;
      price = Math.max(0.1, Math.min(0.9, price));
      bars.push(price);
    }
    // End at current price
    bars[bars.length - 1] = selectedPrice;
    return bars;
  }, [selectedPrice]);

  const handleTrade = () => {
    setTradeConfirmed(true);
    setTimeout(() => setTradeConfirmed(false), 3000);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '16px' }}>
        <a href="/" style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>← Back to Markets</a>
      </div>

      <div className="market-detail">
        {/* Left: Market Info */}
        <div>
          <div className="market-info">
            <div style={{ marginBottom: '16px' }}>
              <span className={`market-category ${getCategoryClass(market.category)}`}>{market.category}</span>
              <span style={{ marginLeft: '12px', color: 'var(--green)', fontSize: '13px' }}>● {market.status}</span>
            </div>
            <h1>{market.title}</h1>
            <p className="market-desc">{market.description}</p>

            <div className="market-meta">
              <div className="meta-item">
                <div className="meta-label">Total Volume</div>
                <div className="meta-value">${(market.totalVolume / 1000).toFixed(0)}K</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Liquidity</div>
                <div className="meta-value">${(market.totalLiquidity / 1000).toFixed(0)}K</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">End Date</div>
                <div className="meta-value" style={{ fontSize: '14px' }}>{new Date(market.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Price Chart */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Price History</h3>
            <div className="price-chart">
              {chartData.map((price, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${price * 100}%` }}
                />
              ))}
            </div>

            {/* Outcomes Detail */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Current Probabilities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {market.outcomes.map((o, idx) => (
                <div key={idx} className="outcome-row">
                  <span className="outcome-name" style={{ width: '120px' }}>{o.name}</span>
                  <div className="outcome-bar-wrapper">
                    <div
                      className={`outcome-bar ${market.type === 'binary' ? (idx === 0 ? 'yes' : 'no') : 'multi'}`}
                      style={{ width: `${o.price * 100}%` }}
                    />
                  </div>
                  <span className={`outcome-price ${market.type === 'binary' ? (idx === 0 ? 'price-yes' : 'price-no') : 'price-multi'}`}>
                    {(o.price * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Trade History */}
            <div className="trade-history">
              <h3>Recent Trades</h3>
              {market.tradeHistory.length > 0 ? (
                <table className="trade-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Side</th>
                      <th>Outcome</th>
                      <th>Shares</th>
                      <th>Price</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {market.tradeHistory.map((t, idx) => (
                      <tr key={idx}>
                        <td>{t.user}</td>
                        <td style={{ color: t.side === 'buy' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                          {t.side.toUpperCase()}
                        </td>
                        <td>{t.outcome}</td>
                        <td>{t.shares}</td>
                        <td>{(t.price * 100).toFixed(0)}¢</td>
                        <td>{new Date(t.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No trades yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Trade Panel */}
        <div>
          <div className="trade-panel">
            <h2>Trade</h2>

            {/* Buy / Sell Toggle */}
            <div className="trade-tabs">
              <button
                className={`trade-tab ${tradeTab === 'buy' ? 'active-buy' : ''}`}
                onClick={() => setTradeTab('buy')}
              >
                Buy
              </button>
              <button
                className={`trade-tab ${tradeTab === 'sell' ? 'active-sell' : ''}`}
                onClick={() => setTradeTab('sell')}
              >
                Sell
              </button>
            </div>

            {/* Outcome Selection */}
            <div className="outcome-select">
              {market.outcomes.map((o, idx) => (
                <div
                  key={idx}
                  className={`outcome-option ${selectedOutcome === idx ? 'selected' : ''}`}
                  onClick={() => setSelectedOutcome(idx)}
                >
                  <span className="outcome-option-name">{o.name}</span>
                  <span className="outcome-option-price">{(o.price * 100).toFixed(1)}¢</span>
                </div>
              ))}
            </div>

            {/* Shares Input */}
            <div className="trade-input-group">
              <label>Number of Shares</label>
              <input
                type="number"
                className="trade-input"
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
                min="1"
              />
            </div>

            {/* Summary */}
            <div className="trade-summary">
              <div className="trade-summary-row">
                <span className="trade-summary-label">Price per share</span>
                <span>{(selectedPrice * 100).toFixed(1)}¢</span>
              </div>
              <div className="trade-summary-row">
                <span className="trade-summary-label">Shares</span>
                <span>{shares}</span>
              </div>
              <div className="trade-summary-row">
                <span className="trade-summary-label">
                  {tradeTab === 'buy' ? 'Potential profit' : 'Proceeds'}
                </span>
                <span style={{ color: 'var(--green)' }}>${potentialProfit}</span>
              </div>
              <div className="trade-summary-row">
                <span className="trade-summary-label">Total {tradeTab === 'buy' ? 'Cost' : 'Return'}</span>
                <span>${cost}</span>
              </div>
            </div>

            {/* Trade Button */}
            <button
              className={`btn btn-lg btn-block ${tradeTab === 'buy' ? 'btn-green' : 'btn-red'}`}
              onClick={handleTrade}
            >
              {tradeConfirmed
                ? '✓ Order Placed!'
                : `${tradeTab === 'buy' ? 'Buy' : 'Sell'} ${market.outcomes[selectedOutcome]?.name} — $${cost}`}
            </button>

            {tradeConfirmed && (
              <div style={{
                marginTop: '12px', padding: '12px', background: 'var(--green-bg)',
                border: '1px solid var(--green-border)', borderRadius: 'var(--radius-sm)',
                fontSize: '13px', color: 'var(--green)', textAlign: 'center'
              }}>
                Trade executed successfully!
              </div>
            )}

            {/* Wallet Info */}
            <div style={{
              marginTop: '20px', padding: '16px', background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)', fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Play Balance</span>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>$10,000.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Crypto Balance</span>
                <span style={{ fontWeight: 700 }}>0.00 ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
