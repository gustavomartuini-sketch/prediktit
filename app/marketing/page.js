'use client';
import { useState } from 'react';

const SOCIAL_POSTS = [
  {
    id: 1, platform: 'Twitter / X',
    content: 'Will Bitcoin hit $150K by year end? Current odds: 62% YES on PrediktIt. The crowd is bullish. What do you think? Trade now! #PredictionMarkets #Bitcoin #PrediktIt',
    scheduledAt: '2026-03-28T14:00:00Z', status: 'scheduled',
    engagement: { likes: 0, shares: 0, clicks: 0 },
  },
  {
    id: 2, platform: 'Reddit',
    content: 'The 2026 FIFA World Cup market is heating up! Brazil leads at 22%, France at 19%. Over $892K in volume. Place your prediction on PrediktIt.',
    scheduledAt: '2026-03-28T16:00:00Z', status: 'scheduled',
    engagement: { likes: 0, shares: 0, clicks: 0 },
  },
  {
    id: 3, platform: 'Twitter / X',
    content: 'GPT-5 before July 2026? The market says 45% chance. AI insiders are split. Trade your conviction on PrediktIt! #AI #GPT5 #Predictions',
    scheduledAt: '2026-03-28T18:00:00Z', status: 'scheduled',
    engagement: { likes: 0, shares: 0, clicks: 0 },
  },
  {
    id: 4, platform: 'Discord',
    content: 'New markets alert! Fed rate decision, SpaceX Starship orbital flight, and ETH ETF AUM markets are now live. Join PrediktIt and start trading.',
    scheduledAt: '2026-03-28T20:00:00Z', status: 'scheduled',
    engagement: { likes: 0, shares: 0, clicks: 0 },
  },
  {
    id: 5, platform: 'Twitter / X',
    content: 'SpaceX Starship orbital flight odds: 71% YES. Will Elon deliver? $223K in volume and climbing. Make your prediction on PrediktIt! #SpaceX',
    scheduledAt: '2026-03-29T10:00:00Z', status: 'draft',
    engagement: { likes: 0, shares: 0, clicks: 0 },
  },
];

const SEO_ARTICLES = [
  {
    id: 1, title: 'Bitcoin Price Prediction 2026: Will BTC Exceed $150,000?',
    slug: 'bitcoin-price-prediction-2026',
    keywords: ['bitcoin prediction', 'btc price 2026', 'crypto forecast', 'prediction market'],
    status: 'published', views: 2340, clicks: 189,
  },
  {
    id: 2, title: '2026 FIFA World Cup Winner Odds and Predictions',
    slug: '2026-fifa-world-cup-winner-odds',
    keywords: ['world cup 2026', 'fifa predictions', 'world cup odds', 'brazil world cup'],
    status: 'published', views: 5670, clicks: 412,
  },
  {
    id: 3, title: 'When Will GPT-5 Be Released? Market Predictions',
    slug: 'gpt-5-release-date-predictions',
    keywords: ['gpt-5 release', 'openai gpt-5', 'ai predictions', 'technology forecast'],
    status: 'published', views: 3120, clicks: 256,
  },
  {
    id: 4, title: 'Federal Reserve Interest Rate Predictions 2026',
    slug: 'fed-interest-rate-predictions-2026',
    keywords: ['fed rate decision', 'interest rates 2026', 'fomc predictions', 'economy forecast'],
    status: 'draft', views: 0, clicks: 0,
  },
  {
    id: 5, title: 'SpaceX Starship Orbital Flight: What the Market Says',
    slug: 'spacex-starship-orbital-flight-predictions',
    keywords: ['spacex starship', 'orbital flight', 'space predictions', 'elon musk'],
    status: 'draft', views: 0, clicks: 0,
  },
];

const CAMPAIGN_STATS = [
  { label: 'Total Posts Generated', value: '47', change: '+12 this week' },
  { label: 'SEO Articles', value: '23', change: '+5 this week' },
  { label: 'Total Impressions', value: '124.5K', change: '+34% vs last week' },
  { label: 'Click-through Rate', value: '3.2%', change: '+0.8% improvement' },
];

export default function MarketingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runCycle = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Marketing Autopilot</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Autonomous marketing engine that generates social posts and SEO content for your markets.</p>
        </div>
        <button
          className={`btn btn-lg ${isRunning ? 'btn-outline' : 'btn-primary'}`}
          onClick={runCycle}
          disabled={isRunning}
        >
          {isRunning ? 'Running Cycle...' : 'Run Marketing Cycle'}
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        {CAMPAIGN_STATS.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-card-label">{stat.label}</div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-change change-positive">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '4px', width: 'fit-content' }}>
        {['overview', 'social', 'seo', 'settings'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: '6px', fontFamily: 'inherit',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              background: activeTab === t ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === t ? 'white' : 'var(--text-secondary)',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="marketing-grid">
          <div className="marketing-card">
            <h3>Recent Social Posts</h3>
            {SOCIAL_POSTS.slice(0, 3).map(post => (
              <div key={post.id} className="post-item">
                <div className="post-platform">{post.platform}</div>
                <div className="post-content">{post.content}</div>
                <div className="post-time">
                  <span style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                    background: post.status === 'scheduled' ? 'var(--blue-bg)' : 'var(--yellow-bg)',
                    color: post.status === 'scheduled' ? 'var(--blue)' : 'var(--yellow)',
                    marginRight: '8px',
                  }}>
                    {post.status.toUpperCase()}
                  </span>
                  {new Date(post.scheduledAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="marketing-card">
            <h3>SEO Articles</h3>
            {SEO_ARTICLES.slice(0, 3).map(article => (
              <div key={article.id} className="article-item">
                <div className="article-title">{article.title}</div>
                <div className="article-meta">
                  <span style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                    background: article.status === 'published' ? 'var(--green-bg)' : 'var(--yellow-bg)',
                    color: article.status === 'published' ? 'var(--green)' : 'var(--yellow)',
                    marginRight: '8px',
                  }}>
                    {article.status.toUpperCase()}
                  </span>
                  {article.views > 0 && <span>{article.views.toLocaleString()} views · {article.clicks} clicks</span>}
                </div>
                <div className="article-keywords">
                  {article.keywords.map((kw, idx) => (
                    <span key={idx} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <div className="marketing-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>All Social Posts ({SOCIAL_POSTS.length})</h3>
            <button className="btn btn-primary btn-sm">Generate New Posts</button>
          </div>
          {SOCIAL_POSTS.map(post => (
            <div key={post.id} className="post-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div className="post-platform">{post.platform}</div>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                  background: post.status === 'scheduled' ? 'var(--blue-bg)' : 'var(--yellow-bg)',
                  color: post.status === 'scheduled' ? 'var(--blue)' : 'var(--yellow)',
                }}>
                  {post.status.toUpperCase()}
                </span>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-time" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Scheduled: {new Date(post.scheduledAt).toLocaleString()}</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-sm btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }}>Edit</button>
                  <button className="btn btn-sm btn-outline" style={{ padding: '4px 12px', fontSize: '11px', borderColor: 'var(--green)', color: 'var(--green)' }}>Publish Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="marketing-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>SEO Content ({SEO_ARTICLES.length})</h3>
            <button className="btn btn-primary btn-sm">Generate New Article</button>
          </div>
          {SEO_ARTICLES.map(article => (
            <div key={article.id} className="article-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="article-title">{article.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    /{article.slug}
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                  background: article.status === 'published' ? 'var(--green-bg)' : 'var(--yellow-bg)',
                  color: article.status === 'published' ? 'var(--green)' : 'var(--yellow)',
                }}>
                  {article.status.toUpperCase()}
                </span>
              </div>
              <div className="article-meta" style={{ marginTop: '8px' }}>
                {article.views > 0 ? (
                  <span>{article.views.toLocaleString()} views · {article.clicks} clicks · {(article.clicks / article.views * 100).toFixed(1)}% CTR</span>
                ) : (
                  <span>Not yet published</span>
                )}
              </div>
              <div className="article-keywords">
                {article.keywords.map((kw, idx) => (
                  <span key={idx} className="keyword-tag">{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="marketing-grid">
          <div className="marketing-card">
            <h3>Automation Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {[
                { label: 'Auto-generate social posts', desc: 'Create posts for trending markets automatically', enabled: true },
                { label: 'Auto-generate SEO articles', desc: 'Create blog content for featured markets', enabled: true },
                { label: 'Auto-publish to Twitter/X', desc: 'Publish approved posts automatically', enabled: false },
                { label: 'Auto-publish to Reddit', desc: 'Post to relevant subreddits', enabled: false },
                { label: 'Auto-publish to Discord', desc: 'Post to server channels', enabled: true },
              ].map((setting, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{setting.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{setting.desc}</div>
                  </div>
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    background: setting.enabled ? 'var(--green)' : 'var(--border-color)',
                    position: 'relative', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '3px',
                      left: setting.enabled ? '23px' : '3px',
                      transition: 'left 0.2s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="marketing-card">
            <h3>Scheduling</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Posts per day</label>
                <input type="number" className="form-input" defaultValue={5} min={1} max={20} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Articles per week</label>
                <input type="number" className="form-input" defaultValue={3} min={1} max={10} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Best posting hours</label>
                <input type="text" className="form-input" defaultValue="9:00 AM, 12:00 PM, 6:00 PM" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Target platforms</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Twitter/X', 'Reddit', 'Discord', 'LinkedIn', 'TikTok'].map(p => (
                    <span key={p} className="filter-chip" style={{
                      background: ['Twitter/X', 'Reddit', 'Discord'].includes(p) ? 'var(--accent-primary)' : 'var(--bg-card)',
                      borderColor: ['Twitter/X', 'Reddit', 'Discord'].includes(p) ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: ['Twitter/X', 'Reddit', 'Discord'].includes(p) ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary btn-md btn-block">Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
