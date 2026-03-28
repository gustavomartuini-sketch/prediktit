// In-memory data store (replace with database in production)
// This simulates a backend database for the prediction market

const { v4: uuidv4 } = require('uuid');

// ============================================================
// USERS
// ============================================================
const users = new Map();

function createUser(username, email, password) {
  const id = uuidv4();
  const user = {
    id,
    username,
    email,
    password, // In production: hash this
    playBalance: 10000, // Starting play money
    cryptoBalance: 0,
    createdAt: new Date().toISOString(),
    positions: [], // { marketId, outcome, shares, avgPrice }
    transactions: [],
  };
  users.set(id, user);
  return user;
}

// Seed demo users
const demoUser = createUser('demo_trader', 'demo@prediktit.com', 'demo123');
const demoUser2 = createUser('whale_99', 'whale@prediktit.com', 'whale123');

// ============================================================
// MARKETS
// ============================================================
const markets = new Map();

const CATEGORIES = ['Politics', 'Crypto', 'Sports', 'Technology', 'Science', 'Entertainment', 'Economy', 'World Events'];

function createMarket({ title, description, category, type, outcomes, endDate, creatorId, liquidity = 1000 }) {
  const id = uuidv4();
  const now = new Date().toISOString();

  // Initialize outcome prices
  const initialPrice = 1 / outcomes.length;
  const outcomeData = outcomes.map((name, idx) => ({
    id: `${id}-outcome-${idx}`,
    name,
    price: parseFloat(initialPrice.toFixed(4)),
    shares: liquidity,
    volume: 0,
  }));

  const market = {
    id,
    title,
    description,
    category,
    type, // 'binary', 'multiple', 'scalar'
    outcomes: outcomeData,
    endDate,
    creatorId,
    status: 'active', // active, resolved, cancelled
    resolution: null,
    totalVolume: 0,
    totalLiquidity: liquidity,
    createdAt: now,
    updatedAt: now,
    comments: [],
    orderBook: { buys: [], sells: [] },
    tradeHistory: [],
    featured: false,
  };
  markets.set(id, market);
  return market;
}

// Seed markets
const seedMarkets = [
  {
    title: 'Will Bitcoin exceed $150,000 by end of 2026?',
    description: 'This market resolves YES if Bitcoin (BTC) trades above $150,000 on any major exchange before December 31, 2026 11:59 PM UTC.',
    category: 'Crypto',
    type: 'binary',
    outcomes: ['Yes', 'No'],
    endDate: '2026-12-31T23:59:00Z',
    creatorId: demoUser.id,
    liquidity: 50000,
  },
  {
    title: 'Who will win the 2026 FIFA World Cup?',
    description: 'This market resolves to the team that wins the 2026 FIFA World Cup final.',
    category: 'Sports',
    type: 'multiple',
    outcomes: ['Brazil', 'France', 'Argentina', 'Germany', 'England', 'Spain', 'Other'],
    endDate: '2026-07-19T23:59:00Z',
    creatorId: demoUser.id,
    liquidity: 100000,
  },
  {
    title: 'Will GPT-5 be released before July 2026?',
    description: 'Resolves YES if OpenAI officially releases GPT-5 (not preview/beta) before July 1, 2026.',
    category: 'Technology',
    type: 'binary',
    outcomes: ['Yes', 'No'],
    endDate: '2026-07-01T00:00:00Z',
    creatorId: demoUser2.id,
    liquidity: 75000,
  },
  {
    title: 'US GDP growth rate Q2 2026',
    description: 'What will the annualized US GDP growth rate be for Q2 2026?',
    category: 'Economy',
    type: 'multiple',
    outcomes: ['Below 0%', '0% - 1%', '1% - 2%', '2% - 3%', 'Above 3%'],
    endDate: '2026-07-30T00:00:00Z',
    creatorId: demoUser.id,
    liquidity: 30000,
  },
  {
    title: 'Will SpaceX Starship complete orbital flight by June 2026?',
    description: 'Resolves YES if SpaceX Starship completes a full orbital flight and lands successfully.',
    category: 'Science',
    type: 'binary',
    outcomes: ['Yes', 'No'],
    endDate: '2026-06-30T23:59:00Z',
    creatorId: demoUser2.id,
    liquidity: 45000,
  },
  {
    title: 'Next US Federal Reserve interest rate decision',
    description: 'What will the Fed do at their next FOMC meeting?',
    category: 'Economy',
    type: 'multiple',
    outcomes: ['Cut 50bp', 'Cut 25bp', 'Hold', 'Raise 25bp'],
    endDate: '2026-05-01T00:00:00Z',
    creatorId: demoUser.id,
    liquidity: 60000,
  },
  {
    title: 'Will Ethereum ETF surpass $50B AUM in 2026?',
    description: 'Resolves YES if combined Ethereum spot ETF assets under management exceed $50 billion.',
    category: 'Crypto',
    type: 'binary',
    outcomes: ['Yes', 'No'],
    endDate: '2026-12-31T23:59:00Z',
    creatorId: demoUser2.id,
    liquidity: 35000,
  },
  {
    title: 'Which streaming service will have the most subscribers by end of 2026?',
    description: 'Based on officially reported global subscriber counts.',
    category: 'Entertainment',
    type: 'multiple',
    outcomes: ['Netflix', 'Disney+', 'Amazon Prime', 'YouTube Premium', 'Other'],
    endDate: '2027-01-15T00:00:00Z',
    creatorId: demoUser.id,
    liquidity: 20000,
  },
];

// Create seeded markets with randomized prices
seedMarkets.forEach((m, idx) => {
  const market = createMarket(m);
  // Randomize prices to look realistic
  if (market.type === 'binary') {
    const yesPrice = 0.3 + Math.random() * 0.4;
    market.outcomes[0].price = parseFloat(yesPrice.toFixed(4));
    market.outcomes[1].price = parseFloat((1 - yesPrice).toFixed(4));
    market.totalVolume = Math.floor(Math.random() * 500000) + 10000;
  } else {
    let remaining = 1;
    market.outcomes.forEach((o, i) => {
      if (i === market.outcomes.length - 1) {
        o.price = parseFloat(remaining.toFixed(4));
      } else {
        const price = remaining * (0.1 + Math.random() * 0.3);
        o.price = parseFloat(price.toFixed(4));
        remaining -= price;
      }
    });
    market.totalVolume = Math.floor(Math.random() * 300000) + 5000;
  }
  if (idx < 3) market.featured = true;
  market.outcomes.forEach(o => {
    o.volume = Math.floor(Math.random() * 100000);
  });
});

// ============================================================
// TRADE ENGINE (CPMM - Constant Product Market Maker)
// ============================================================
function executeTrade(marketId, outcomeIndex, side, shares, userId) {
  const market = markets.get(marketId);
  if (!market || market.status !== 'active') return { error: 'Market not available' };

  const user = users.get(userId);
  if (!user) return { error: 'User not found' };

  const outcome = market.outcomes[outcomeIndex];
  const price = outcome.price;
  const cost = shares * price;

  if (side === 'buy') {
    if (user.playBalance < cost) return { error: 'Insufficient balance' };
    user.playBalance -= cost;
    outcome.shares += shares;
    outcome.volume += cost;
    market.totalVolume += cost;

    // Update position
    const existingPos = user.positions.find(p => p.marketId === marketId && p.outcome === outcome.name);
    if (existingPos) {
      existingPos.shares += shares;
      existingPos.avgPrice = (existingPos.avgPrice * (existingPos.shares - shares) + price * shares) / existingPos.shares;
    } else {
      user.positions.push({ marketId, outcome: outcome.name, shares, avgPrice: price });
    }
  } else {
    const pos = user.positions.find(p => p.marketId === marketId && p.outcome === outcome.name);
    if (!pos || pos.shares < shares) return { error: 'Insufficient shares' };
    user.playBalance += cost;
    pos.shares -= shares;
    outcome.volume += cost;
    market.totalVolume += cost;
    if (pos.shares === 0) {
      user.positions = user.positions.filter(p => !(p.marketId === marketId && p.outcome === outcome.name));
    }
  }

  // Recalculate prices using simplified CPMM
  const totalShares = market.outcomes.reduce((sum, o) => sum + o.shares, 0);
  market.outcomes.forEach(o => {
    o.price = parseFloat((o.shares / totalShares).toFixed(4));
  });

  const trade = {
    id: uuidv4(),
    marketId,
    userId,
    outcome: outcome.name,
    side,
    shares,
    price,
    cost,
    timestamp: new Date().toISOString(),
  };
  market.tradeHistory.push(trade);
  user.transactions.push(trade);
  market.updatedAt = new Date().toISOString();

  return { success: true, trade, newBalance: user.playBalance };
}

// ============================================================
// MARKETING ENGINE
// ============================================================
const marketingPosts = [];
const seoArticles = [];

function generateSocialPost(market) {
  const templates = [
    `🔮 Will "${market.title}" happen? Current odds: ${(market.outcomes[0].price * 100).toFixed(0)}% YES. Trade now on PrediktIt!`,
    `📊 Hot market alert! "${market.title}" - $${market.totalVolume.toLocaleString()} in volume. What's your prediction?`,
    `🚀 Trending: "${market.title}" - odds shifted to ${(market.outcomes[0].price * 100).toFixed(0)}%. Join the action on PrediktIt!`,
    `💰 Trade your conviction! "${market.title}" is heating up with ${market.tradeHistory.length}+ trades. #PredictionMarkets #PrediktIt`,
  ];
  const post = {
    id: uuidv4(),
    marketId: market.id,
    content: templates[Math.floor(Math.random() * templates.length)],
    platform: ['twitter', 'reddit', 'discord'][Math.floor(Math.random() * 3)],
    scheduledAt: new Date(Date.now() + Math.random() * 86400000).toISOString(),
    status: 'scheduled',
    engagement: { likes: 0, shares: 0, clicks: 0 },
    createdAt: new Date().toISOString(),
  };
  marketingPosts.push(post);
  return post;
}

function generateSEOArticle(market) {
  const article = {
    id: uuidv4(),
    marketId: market.id,
    title: `${market.title} - Prediction Market Analysis | PrediktIt`,
    slug: market.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
    metaDescription: `Trade on "${market.title}" with PrediktIt. Current probability: ${(market.outcomes[0].price * 100).toFixed(0)}%. Join thousands of traders making predictions.`,
    keywords: [market.category.toLowerCase(), 'prediction market', 'trading', 'forecast', market.title.split(' ').slice(0, 3).join(' ').toLowerCase()],
    content: generateArticleContent(market),
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
  seoArticles.push(article);
  return article;
}

function generateArticleContent(market) {
  return `
# ${market.title}

## Market Overview
${market.description}

## Current Odds
${market.outcomes.map(o => `- **${o.name}**: ${(o.price * 100).toFixed(1)}%`).join('\n')}

## Trading Volume
This market has attracted $${market.totalVolume.toLocaleString()} in total trading volume, making it one of the most active markets in the ${market.category} category.

## How to Trade
1. Create a free account on PrediktIt
2. Fund your wallet with play money or crypto
3. Buy shares in the outcome you believe will happen
4. Sell anytime to lock in profits or cut losses

## Market Details
- **Category**: ${market.category}
- **Type**: ${market.type}
- **End Date**: ${new Date(market.endDate).toLocaleDateString()}
- **Status**: ${market.status}

## Why PrediktIt?
PrediktIt is the next-generation prediction market platform where you can trade on real-world events. Our platform features advanced analytics, competitive pricing, and a vibrant community of traders.

---
*Trade responsibly. Past performance does not indicate future results.*
  `.trim();
}

function runMarketingCycle() {
  const activeMarkets = [...markets.values()].filter(m => m.status === 'active');
  const results = { posts: [], articles: [] };

  // Generate social posts for top markets by volume
  const topMarkets = activeMarkets.sort((a, b) => b.totalVolume - a.totalVolume).slice(0, 5);
  topMarkets.forEach(m => {
    results.posts.push(generateSocialPost(m));
  });

  // Generate SEO articles for featured markets
  activeMarkets.filter(m => m.featured).forEach(m => {
    results.articles.push(generateSEOArticle(m));
  });

  return results;
}

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  users,
  markets,
  CATEGORIES,
  createUser,
  createMarket,
  executeTrade,
  marketingPosts,
  seoArticles,
  generateSocialPost,
  generateSEOArticle,
  runMarketingCycle,
  demoUser,
};
