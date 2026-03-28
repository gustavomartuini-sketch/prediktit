import { NextResponse } from 'next/server';
import { MarketingOrchestrator } from '@/lib/marketingEngine';

// Initialize orchestrator with env vars
function getOrchestrator() {
  return new MarketingOrchestrator({
    twitterApiKey: process.env.TWITTER_API_KEY,
    twitterApiSecret: process.env.TWITTER_API_SECRET,
    twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
    twitterAccessSecret: process.env.TWITTER_ACCESS_SECRET,
    redditClientId: process.env.REDDIT_CLIENT_ID,
    redditClientSecret: process.env.REDDIT_CLIENT_SECRET,
    redditUsername: process.env.REDDIT_USERNAME,
    redditPassword: process.env.REDDIT_PASSWORD,
    openaiApiKey: process.env.OPENAI_API_KEY,
  });
}

// In-memory storage for demo (in production: use Prisma)
let allPosts = [
  { id: '1', platform: 'twitter', content: '📊 Bitcoin at 62% YES on PrediktIt! $487K volume. Trade now → prediktit.com #PredictionMarkets', status: 'published', scheduledAt: '2026-03-27T14:00:00Z', impressions: 3420, clicks: 87, likes: 142 },
  { id: '2', platform: 'reddit', content: '[Discussion] Will Bitcoin exceed $150K? - Currently at 62% on prediction markets', status: 'published', scheduledAt: '2026-03-27T16:00:00Z', impressions: 8930, clicks: 234, likes: 89 },
  { id: '3', platform: 'twitter', content: '🔮 FIFA World Cup 2026 odds: Brazil 22%, France 19%, Argentina 18%. $892K traded! #WorldCup2026', status: 'published', scheduledAt: '2026-03-27T10:00:00Z', impressions: 5670, clicks: 156, likes: 231 },
  { id: '4', platform: 'discord', content: 'New market alert! GPT-5 release odds: 45% YES before July. What do you think?', status: 'published', scheduledAt: '2026-03-27T12:00:00Z', impressions: 1200, clicks: 45, likes: 67 },
  { id: '5', platform: 'twitter', content: '💰 $400K traded on Fed rate decision. Hold at 48%, Cut 25bp at 35%. Smart money is positioning.', status: 'scheduled', scheduledAt: '2026-03-28T15:00:00Z', impressions: 0, clicks: 0, likes: 0 },
  { id: '6', platform: 'reddit', content: '[Analysis] SpaceX Starship orbital flight - 71% chance by June according to prediction markets', status: 'scheduled', scheduledAt: '2026-03-28T17:00:00Z', impressions: 0, clicks: 0, likes: 0 },
];

let allArticles = [
  { id: '1', title: 'Bitcoin Price Prediction 2026 - Market Analysis', slug: 'bitcoin-price-prediction-2026', status: 'published', pageViews: 2340, avgTimeOnPage: 4.2, keywords: ['bitcoin prediction', 'crypto forecast', 'btc 2026'] },
  { id: '2', title: '2026 FIFA World Cup Odds - Who Will Win?', slug: '2026-fifa-world-cup-odds', status: 'published', pageViews: 5670, avgTimeOnPage: 5.1, keywords: ['world cup odds', 'world cup 2026', 'brazil prediction'] },
  { id: '3', title: 'GPT-5 Release Date Predictions - AI Market Watch', slug: 'gpt-5-release-date-predictions', status: 'published', pageViews: 4120, avgTimeOnPage: 3.8, keywords: ['gpt-5', 'openai', 'ai predictions'] },
  { id: '4', title: 'Federal Reserve Rate Decision - What Markets Predict', slug: 'federal-reserve-rate-prediction', status: 'draft', pageViews: 0, avgTimeOnPage: 0, keywords: ['fed rate', 'interest rates', 'fomc'] },
];

export async function GET() {
  const totalImpressions = allPosts.reduce((sum, p) => sum + (p.impressions || 0), 0);
  const totalClicks = allPosts.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const totalViews = allArticles.reduce((sum, a) => sum + (a.pageViews || 0), 0);

  return NextResponse.json({
    stats: {
      totalPosts: allPosts.length,
      totalArticles: allArticles.length,
      totalImpressions,
      totalClicks,
      totalPageViews: totalViews,
      clickThroughRate: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0,
      avgEngagement: ((totalClicks + allPosts.reduce((s, p) => s + (p.likes || 0), 0)) / Math.max(allPosts.length, 1)).toFixed(1),
    },
    recentPosts: allPosts.slice(-6).reverse(),
    recentArticles: allArticles.slice(-4).reverse(),
    platforms: {
      twitter: allPosts.filter(p => p.platform === 'twitter').length,
      reddit: allPosts.filter(p => p.platform === 'reddit').length,
      discord: allPosts.filter(p => p.platform === 'discord').length,
    },
  });
}

export async function POST(request) {
  const body = await request.json();
  const { action, markets } = body;
  const orchestrator = getOrchestrator();

  if (action === 'run_cycle') {
    // Run full marketing cycle
    const demoMarkets = markets || [
      { id: '1', title: 'Will Bitcoin exceed $150,000 by end of 2026?', category: 'Crypto', outcomes: [{ name: 'Yes', price: 0.62 }, { name: 'No', price: 0.38 }], totalVolume: 487320, status: 'active', featured: true, endDate: '2026-12-31' },
      { id: '2', title: 'Who will win the 2026 FIFA World Cup?', category: 'Sports', outcomes: [{ name: 'Brazil', price: 0.22 }], totalVolume: 892150, status: 'active', featured: true, endDate: '2026-07-19' },
      { id: '3', title: 'Will GPT-5 be released before July 2026?', category: 'Technology', outcomes: [{ name: 'Yes', price: 0.45 }, { name: 'No', price: 0.55 }], totalVolume: 341000, status: 'active', featured: true, endDate: '2026-07-01' },
    ];

    const results = await orchestrator.runCycle(demoMarkets);

    // Save generated content
    results.posts.forEach(p => {
      allPosts.push({ id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, ...p, impressions: 0, clicks: 0, likes: 0 });
    });
    results.articles.forEach(a => {
      allArticles.push({ id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, ...a, pageViews: 0, avgTimeOnPage: 0 });
    });

    return NextResponse.json({
      success: true,
      results: {
        postsGenerated: results.posts.length,
        articlesGenerated: results.articles.length,
        errors: results.errors,
      },
      message: `Marketing cycle complete: ${results.posts.length} posts, ${results.articles.length} articles generated`,
    });
  }

  if (action === 'generate_post') {
    const { marketId, platform } = body;
    return NextResponse.json({
      success: true,
      post: {
        platform: platform || 'twitter',
        content: `📊 Hot market on PrediktIt! Trade now and predict the future. #PredictionMarkets`,
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  }

  if (action === 'generate_article') {
    const { marketId } = body;
    const article = await orchestrator.seo.generateArticle(
      markets?.[0] || { title: 'Prediction Market Trends', category: 'General', outcomes: [{ name: 'Yes', price: 0.5 }], totalVolume: 100000, endDate: '2026-12-31' }
    );
    allArticles.push({ id: `art_${Date.now()}`, ...article, pageViews: 0, avgTimeOnPage: 0, status: 'draft' });
    return NextResponse.json({ success: true, article });
  }

  return NextResponse.json({ error: 'Unknown action. Use: run_cycle, generate_post, generate_article' }, { status: 400 });
}
