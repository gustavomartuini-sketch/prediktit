'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Crypto', 'Sports', 'Technology', 'Economy', 'Science', 'Entertainment', 'Politics'];

function getCategoryClass(cat) {
  const map = { Crypto: 'cat-crypto', Sports: 'cat-sports', Technology: 'cat-technology', Politics: 'cat-politics', Economy: 'cat-economy', Science: 'cat-science', Entertainment: 'cat-entertainment' };
  return map[cat] || 'cat-default';
}

function daysLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatVolume(v) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(data => {
        setMarkets(data.markets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = markets.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>All Markets</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{markets.length} markets available</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search markets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '300px', flex: '1' }}
        />
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '40px 0' }}>Loading markets...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '40px 0' }}>No markets found matching your criteria.</p>
      ) : (
        <div className="markets-grid">
          {filtered.map(market => (
            <a href={`/markets/${market.id}`} key={market.id} className="market-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="market-card-header">
                <span className={`market-category ${getCategoryClass(market.category)}`}>{market.category}</span>
                <span className="market-status">● {market.status}</span>
              </div>
              <h3 className="market-card-title">{market.title}</h3>
              <div className="market-card-outcomes">
                {market.outcomes.slice(0, 4).map((o, idx) => (
                  <div key={idx} className="outcome-row">
                    <span className="outcome-name">{o.name}</span>
                    <div className="outcome-bar-wrapper">
                      <div
                        className={`outcome-bar ${market.type === 'binary' ? (idx === 0 ? 'yes' : 'no') : 'multi'}`}
                        style={{ width: `${o.price * 100}%` }}
                      />
                    </div>
                    <span className={`outcome-price ${market.type === 'binary' ? (idx === 0 ? 'price-yes' : 'price-no') : 'price-multi'}`}>
                      {(o.price * 100).toFixed(0)}¢
                    </span>
                  </div>
                ))}
                {market.outcomes.length > 4 && (
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    +{market.outcomes.length - 4} more outcomes
                  </p>
                )}
              </div>
              <div className="market-card-footer">
                <span>Vol: <strong>{formatVolume(market.totalVolume)}</strong></span>
                <span>{daysLeft(market.endDate)}d left</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
