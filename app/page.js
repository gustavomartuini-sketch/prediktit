'use client';
import { useState, useEffect } from 'react';

// Simulated market data (in production, fetched from API)
const SEED_MARKETS = [
  {
    id: '1',
    title: 'Will Bitcoin exceed $150,000 by end of 2026?',
    category: 'Crypto',
    type: 'binary',
    outcomes: [
      { name: 'Yes', price: 0.62 },
      { name: 'No', price: 0.38 },
    ],
    totalVolume: 487320,
    endDate: '2026-12-31T23:59:00Z',
    featured: true,
    status: 'active',
  },
  {
    id: '2',
    title: 'Who will win the 2026 FIFA World Cup?',
    category: 'Sports',
    type: 'multiple',
    outcomes: [
      { name: 'Brazil', price: 0.22 },
      { name: 'France', price: 0.19 },
      { name: 'Argentina', price: 0.18 },
      { name: 'Germany', price: 0.12 },
      { name: 'England', price: 0.11 },
      { name: 'Spain', price: 0.09 },
      { name: 'Other', price: 0.09 },
    ],
    totalVolume: 892150,
    endDate: '2026-07-19T23:59:00Z',
    featured: true,
    status: 'active',
  },
  {
    id: '3',
    title: 'Will GPT-5 be released before July 2026?',
    category: 'Technology',
    type: 'binary',
    outcomes: [
      { name: 'Yes', price: 0.45 },
      { name: 'No', price: 0.55 },
    ],
    totalVolume: 341000,
    endDate: '2026-07-01T00:00:00Z',
    featured: true,
    status: 'active',
  },
  {
    id: '4',
    title: 'US GDP growth rate Q2 2026',
    category: 'Economy',
    type: 'multiple',
    outcomes: [
      { name: 'Below 0%', price: 0.08 },
      { name: '0% - 1%', price: 0.15 },
      { name: '1% - 2%', price: 0.32 },
      { name: '2% - 3%', price: 0.30 },
      { name: 'Above 3%', price: 0.15 },
    ],
    totalVolume: 156000,
    endDate: '2026-07-30T00:00:00Z',
    featured: false,
    status: 'active',
  },
  {
    id: '5',
    title: 'Will SpaceX Starship complete orbital flight by June 2026?',
    category: 'Science',
    type: 'binary',
    outcomes: [
      { name: 'Yes', price: 0.71 },
      { name: 'No', price: 0.29 },
    ],
    totalVolume: 223400,
    endDate: '2026-06-30T23:59:00Z',
    featured: false,
    status: 'active',
  },
  {
    id: '6',
    title: 'Next US Federal Reserve interest rate decision',
    category: 'Economy',
    type: 'multiple',
    outcomes: [
      { name: 'Cut 50bp', price: 0.05 },
      { name: 'Cut 25bp', price: 0.35 },
      { name: 'Hold', price: 0.48 },
      { name: 'Raise 25bp', price: 0.12 },
    ],
    totalVolume: 567800,
    endDate: '2026-05-01T00:00:00Z',
    featured: false,
    status: 'active',
  },
  {
    id: '7',
    title: 'Will Ethereum ETF surpass $50B AUM in 2026?',
    category: 'Crypto',
    type: 'binary',
    outcomes: [
      { name: 'Yes', price: 0.38 },
      { name: 'No', price: 0.62 },
    ],
    totalVolume: 198500,
    endDate: '2026-12-31T23:59:00Z',
    featured: false,
    status: 'active',
  },
  {
    id: '8',
    title: 'Which streaming service will have the most subscribers by end of 2026?',
    category: 'Entertainment',
    type: 'multiple',
    outcomes: [
      { name: 'Netflix', price: 0.42 },
      { name: 'Disney+', price: 0.15 },
      { name: 'Amazon Prime', price: 0.22 },
      { name: 'YouTube Premium', price: 0.13 },
      { name: 'Other', price: 0.08 },
    ],
    totalVolume: 87600,
    endDate: '2027-01-15T00:00:00Z',
    featured: false,
    status: 'active',
  },
];

const CATEGORIES = ['All', 'Crypto', 'Sports', 'Technology', 'Economy', 'Science', 'Entertainment', 'Politics'];

function getCategoryClass(cat) {
  const map = {
    Crypto: 'cat-crypto', Sports: 'cat-sports', Technology: 'cat-technology',
    Politics: 'cat-politics', Economy: 'cat-economy', Science: 'cat-science',
    Entertainment: 'cat-entertainment',
  };
  return map[cat] || 'cat-default';
}

function formatVolume(vol) {
  if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
  if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
  return `$${vol}`;
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days}d left` : 'Ended';
}

function MarketCard({ market }) {
  const maxOutcomes = market.type === 'binary' ? 2 : 4;
  const displayOutcomes = market.outcomes.slice(0, maxOutcomes);

  return (
    <a href={`/markets/${market.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="market-card">
        <div className="market-card-header">
          <span className={`market-category ${getCategoryClass(market.category)}`}>
            {market.category}
          </span>
          <span className="market-status">● {market.status}</span>
        </div>
        <h3 className="market-title">{market.title}</h3>
        <div className="market-outcomes">
          {displayOutcomes.map((outcome, idx) => (
            <div key={idx} className="outcome-row">
              <span className="outcome-name">{outcome.name}</span>
              <div className="outcome-bar-wrapper">
                <div
                  className={`outcome-bar ${market.type === 'binary' ? (idx === 0 ? 'yes' : 'no') : 'multi'}`}
                  style={{ width: `${outcome.price * 100}%` }}
                />
              </div>
              <span className={`outcome-price ${market.type === 'binary' ? (idx === 0 ? 'price-yes' : 'price-no') : 'price-multi'}`}>
                {(outcome.price * 100).toFixed(0)}¢
              </span>
            </div>
          ))}
          {market.outcomes.length > maxOutcomes && (
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', paddingLeft: '92px' }}>
              +{market.outcomes.length - maxOutcomes} more outcomes
            </span>
          )}
        </div>
        <div className="market-footer">
          <span className="market-volume">Vol: <strong>{formatVolume(market.totalVolume)}</strong></span>
          <span className="market-end">{daysUntil(market.endDate)}</span>
        </div>
      </div>
    </a>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [markets, setMarkets] = useState(SEED_MARKETS);

  const filtered = markets.filter(m => {
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = markets.filter(m => m.featured);
  const totalVolume = markets.reduce((sum, m) => sum + m.totalVolume, 0);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>Trade on What You Believe</h1>
        <p>
          The next-generation prediction market. Buy and sell shares on real-world events
          with play money or crypto. Be right, earn rewards.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <a href="/create" className="btn btn-primary btn-lg">Create a Market</a>
          <a href="#markets" className="btn btn-outline btn-lg">Explore Markets</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{markets.length}</div>
            <div className="hero-stat-label">Active Markets</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{formatVolume(totalVolume)}</div>
            <div className="hero-stat-label">Total Volume</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">2,847</div>
            <div className="hero-stat-label">Active Traders</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">$150K</div>
            <div className="hero-stat-label">Paid Out</div>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <div className="container" id="markets">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Markets</h2>
            <p className="section-subtitle">Most popular markets right now</p>
          </div>
        </div>
        <div className="markets-grid" style={{ marginBottom: '48px' }}>
          {featured.map(m => <MarketCard key={m.id} market={m} />)}
        </div>

        {/* All Markets */}
        <div className="section-header">
          <div>
            <h2 className="section-title">All Markets</h2>
            <p className="section-subtitle">{filtered.length} markets available</p>
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="markets-grid">
          {filtered.map(m => <MarketCard key={m.id} market={m} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No markets found</p>
            <p>Try a different search or category, or <a href="/create">create a new market</a>.</p>
          </div>
        )}
      </div>
    </>
  );
}
