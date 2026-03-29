import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

// Demo fallback data
const DEMO_POSTS = [
  { id: '1', platform: 'TWITTER', content: 'ð Bitcoin at 62% YES on PrediktIt! $487K volume. Trade now â prediktit.com #PredictionMarkets', status: 'PUBLISHED', scheduledAt: '2026-03-27T14:00:00Z', impressions: 3420, clicks: 87, likes: 142 },
  { id: '2', platform: 'REDDIT', content: '[Discussion] Will Bitcoin exceed $150K? - Currently at 62% on prediction markets', status: 'PUBLISHED', scheduledAt: '2026-03-27T16:00:00Z', impressions: 8930, clicks: 234, likes: 89 },
  { id: '3', platform: 'TWITTER', content: 'ð® FIFA World Cup 2026 odds: Brazil 22%, France 19%, Argentina 18%. $892K traded! #WorldCup2026', status: 'PUBLISHED', scheduledAt: '2026-03-27T10:00:00Z', impressions: 5670, clicks: 156, likes: 231 },
  { id: '4', platform: 'DISCORD', content: 'New market alert! GPT-5 release odds: 45% YES before July. What do you think?', status: 'PUBLISHED', scheduledAt: '2026-03-27T12:00:00Z', impressions: 1200, clicks: 45, likes: 67 },
  { id: '5', platform: 'TWITTER', content: 'ð° $400K traded on Fed rate decision. Hold at 48%, Cut 25bp at 35%. Smart money is positioning.', status: 'SCHEDULED', scheduledAt: '2026-03-28T15:00:00Z', impressions: 0, clicks: 0, likes: 0 },
  { id: '6', platform: 'REDDIT', content: '[Analysis] SpaceX Starship orbital flight - 71% chance by June according to prediction markets', status: 'SCHEDULED', scheduledAt: '2026-03-28T17:00:00Z', impressions: 0, clicks: 0, likes: 0 },
];

const DEMO_ARTICLES = [
  { id: '1', title: 'Bitcoin Price Prediction 2026 - Market Analysis', slug: 'bitcoin-price-prediction-2026', status: 'PUBLISHED', pageViews: 2340, avgTimeOnPage: 4.2, keywords: ['bitcoin prediction', 'crypto forecast', 'btc 2026'] },
  { id: '2', title: '2026 FIFA World Cup Odds - Who Will Win?', slug: '2026-fifa-world-cup-odds', status: 'PUBLISHED', pageViews: 5670, avgTimeOnPage: 5.1, keywords: ['world cup odds', 'world cup 2026', 'brazil prediction'] },
  { id: '3', title: 'GPT-5 Release Date Predictions - AI Market Watch', slug: 'gpt-5-release-date-predictions', status: 'PUBLISHED', pageViews: 4120, avgTimeOnPage: 3.8, keywords: ['gpt-5', 'openai', 'ai predictions'] },
  { id: '4', title: 'Federal Reserve Rate Decision - What Markets Predict', slug: 'federal-reserve-rate-prediction', status: 'DRAFT', pageViews: 0, avgTimeOnPage: 0, keywords: ['fed rate', 'interest rates', 'fomc'] },
];

export async function GET() {
  let posts = DEMO_POSTS;
  let articles = DEMO_ARTICLES;
  let source = 'demo';

  try {
    // Try to fetch from database
    const dbPosts = await prisma.marketingPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const dbArticles = await prisma.sEOArticle.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (dbPosts.length > 0 || dbArticles.length > 0) {
      posts = dbPosts.map(p => ({
        id: p.id,
        platform: p.platform,
        content: p.content,
        status: p.status,
        scheduledAt: p.scheduledAt,
        publishedAt: p.publishedAt,
        impressions: p.impressions,
        clicks: p.clicks,
        likes: p.likes,
        shares: p.shares,
        marketId: p.marketId,
      }));
      articles = dbArticles.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: a.status,
        pageViews: a.pageViews,
        avgTimeOnPage: a.avgTimeOnPage,
        keywords: a.keywords,
        marketId: a.marketId,
      }));
      source = 'database';
    }
  } catch (error) {
    console.log('Marketing DB query failed, using demo data:', error.message);
  }

  const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
  const totalClicks = posts.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const totalViews = articles.reduce((sum, a) => sum + (a.pageViews || 0), 0);

  return NextResponse.json({
    stats: {
      totalPosts: posts.length,
      totalArticles: articles.length,
      totalImpressions,
      totalClicks,
      totalPageViews: totalViews,
      clickThroughRate: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0,
      avgEngagement: ((totalClicks + posts.reduce((s, p) => s + (p.likes || 0), 0)) / Math.max(posts.length, 1)).toFixed(1),
    },
    recentPosts: posts.slice(0, 6),
    recentArticles: articles.slice(0, 4),
    platforms: {
      twitter: posts.filter(p => p.platform === 'TWITTER').length,
      reddit: posts.filter(p => p.platform === 'REDDIT').length,
      discord: posts.filter(p => p.platform === 'DISCORD').length,
      linkedin: posts.filter(p => p.platform === 'LINKEDIN').length,
      tiktok: posts.filter(p => p.platform === 'TIKTOK').length,
    },
    source,
  });
}

export async function POST(request) {
  const body = await request.json();
  const { action, markets } = body;
  const orchestrator = getOrchestrator();

  if (action === 'run_cycle') {
    // Get markets from database or use provided ones
    let marketsList = markets;
    if (!marketsList) {
      try {
        const dbMarkets = await prisma.market.findMany({
          where: { status: 'ACTIVE', featured: true },
          include: { outcomes: true },
          take: 5,
        });
        if (dbMarkets.length > 0) {
          marketsList = dbMarkets.map(m => ({
            id: m.id,
            title: m.title,
            category: m.category,
            outcomes: m.outcomes.map(o => ({ name: o.name, price: o.price })),
            totalVolume: m.totalVolume,
            status: m.status.toLowerCase(),
            featured: m.featured,
            endDate: m.endDate,
          }));
        }
      } catch (error) {
        console.log('Failed to fetch markets for marketing:', error.message);
      }
    }

    // Fallback demo markets
    if (!marketsList || marketsList.length === 0) {
      marketsList = [
        { id: '1', title: 'Will Bitcoin exceed $150,000 by end of 2026?', category: 'Crypto', outcomes: [{ name: 'Yes', price: 0.62 }, { name: 'No', price: 0.38 }], totalVolume: 487320, status: 'active', featured: true, endDate: '2026-12-31' },
        { id: '2', title: 'Who will win the 2026 FIFA World Cup?', category: 'Sports', outcomes: [{ name: 'Brazil', price: 0.22 }], totalVolume: 892150, status: 'active', featured: true, endDate: '2026-07-19' },
        { id: '3', title: 'Will GPT-5 be released before July 2026?', category: 'Technology', outcomes: [{ name: 'Yes', price: 0.45 }, { name: 'No', price: 0.55 }], totalVolume: 341000, status: 'active', featured: true, endDate: '2026-07-01' },
      ];
    }

    const results = await orchestrator.runCycle(marketsList);

    // Save generated posts and articles to database
    try {
      for (const post of results.posts) {
        // Find a market to link to
        const market = marketsList[0];
        await prisma.marketingPost.create({
          data: {
            content: post.content || '',
            platform: (post.platform || 'TWITTER').toUpperCase(),
            status: 'SCHEDULED',
            scheduledAt: new Date(post.scheduledAt || Date.now() + 3600000),
            marketId: market.id,
          },
        });
      }
      for (const article of results.articles) {
        const market = marketsList[0];
        await prisma.sEOArticle.create({
          data: {
            title: article.title || 'Untitled',
            slug: article.slug || `article-${Date.now()}`,
            metaDescription: article.metaDescription || article.title || '',
            keywords: article.keywords || [],
            content: article.content || '',
            status: 'DRAFT',
            marketId: market.id,
          },
        });
      }
    } catch (dbError) {
      console.log('Failed to save marketing content to DB:', dbError.message);
    }

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
    const { platform } = body;
    const post = {
      platform: (platform || 'TWITTER').toUpperCase(),
      content: `ð Hot market on PrediktIt! Trade now and predict the future. #PredictionMarkets`,
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    };

    // Save to DB
    try {
      const markets = await prisma.market.findMany({ where: { status: 'ACTIVE' }, take: 1 });
      if (markets.length > 0) {
        await prisma.marketingPost.create({
          data: {
            content: post.content,
            platform: post.platform,
            status: 'SCHEDULED',
            scheduledAt: new Date(post.scheduledAt),
            marketId: markets[0].id,
          },
        });
      }
    } catch (e) {
      console.log('Failed to save post to DB:', e.message);
    }

    return NextResponse.json({ success: true, post });
  }

  if (action === 'generate_article') {
    let market = markets?.[0];
    if (!market) {
      try {
        const dbMarkets = await prisma.market.findMany({
          where: { status: 'ACTIVE' },
          include: { outcomes: true },
          take: 1,
        });
        if (dbMarkets.length > 0) {
          market = {
            title: dbMarkets[0].title,
            category: dbMarkets[0].category,
            outcomes: dbMarkets[0].outcomes.map(o => ({ name: o.name, price: o.price })),
            totalVolume: dbMarkets[0].totalVolume,
            endDate: dbMarkets[0].endDate,
          };
        }
      } catch (e) {
        console.log('Failed to fetch market for article:', e.message);
      }
    }

    if (!market) {
      market = { title: 'Prediction Market Trends', category: 'General', outcomes: [{ name: 'Yes', price: 0.5 }], totalVolume: 100000, endDate: '2026-12-31' };
    }

    const article = await orchestrator.seo.generateArticle(market);

    // Save to DB
    try {
      const dbMarkets = await prisma.market.findMany({ where: { status: 'ACTIVE' }, take: 1 });
      if (dbMarkets.length > 0) {
        await prisma.sEOArticle.create({
          data: {
            title: article.title || 'Untitled',
            slug: article.slug || `article-${Date.now()}`,
            metaDescription: article.metaDescription || '',
            keywords: article.keywords || [],
            content: article.content || '',
            status: 'DRAFT',
            marketId: dbMarkets[0].id,
          },
        });
      }
    } catch (e) {
      console.log('Failed to save article to DB:', e.message);
    }

    return NextResponse.json({ success: true, article });
  }

  return NextResponse.json({ error: 'Unknown action. Use: run_cycle, generate_post, generate_article' }, { status: 400 });
}
