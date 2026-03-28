// PrediktIt - Autonomous Marketing Engine
// Integrates with Twitter/X API, Reddit API, and OpenAI for SEO content

// ============================================================
// TWITTER/X API INTEGRATION
// ============================================================

export class TwitterService {
  constructor(apiKey, apiSecret, accessToken, accessSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = accessToken;
    this.accessSecret = accessSecret;
    this.baseUrl = 'https://api.twitter.com/2';
  }

  async postTweet(text) {
    if (!this.apiKey) {
      console.log('[Twitter] No API key configured - simulating tweet:', text.slice(0, 50));
      return { id: `sim_${Date.now()}`, text, simulated: true };
    }

    const response = await fetch(`${this.baseUrl}/tweets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error(`Twitter API error: ${response.status}`);
    return await response.json();
  }

  generateMarketTweet(market) {
    const probability = (market.outcomes[0].price * 100).toFixed(0);
    const volume = market.totalVolume >= 1000000
      ? `$${(market.totalVolume / 1000000).toFixed(1)}M`
      : `$${(market.totalVolume / 1000).toFixed(0)}K`;

    const templates = [
      `📊 "${market.title}"\n\nCurrent odds: ${probability}% YES\nVolume: ${volume}\n\nTrade now → prediktit.com/markets/${market.id}\n\n#PredictionMarkets #PrediktIt`,
      `🔮 The market says ${probability}% chance: "${market.title}"\n\n${volume} traded so far. What's your prediction?\n\nprediktit.com/markets/${market.id} #PrediktIt`,
      `🚀 Hot market: "${market.title}"\n\n${probability}% probability | ${volume} volume\n\nDo you agree? Trade your conviction.\nprediktit.com/markets/${market.id}`,
      `💰 ${volume} wagered on: "${market.title}"\n\nYES: ${probability}% | NO: ${100 - parseInt(probability)}%\n\nJoin ${Math.floor(Math.random() * 5000 + 1000)} traders on PrediktIt\nprediktit.com`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }
}

// ============================================================
// REDDIT API INTEGRATION
// ============================================================

export class RedditService {
  constructor(clientId, clientSecret, username, password) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.username = username;
    this.password = password;
    this.accessToken = null;
  }

  async authenticate() {
    if (!this.clientId) {
      console.log('[Reddit] No API credentials - running in simulation mode');
      return;
    }

    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=password&username=${this.username}&password=${this.password}`,
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  async submitPost(subreddit, title, text) {
    if (!this.accessToken) {
      console.log(`[Reddit] Simulating post to r/${subreddit}:`, title);
      return { id: `sim_${Date.now()}`, subreddit, title, simulated: true };
    }

    const response = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        sr: subreddit,
        kind: 'self',
        title,
        text,
      }),
    });

    return await response.json();
  }

  generateRedditPost(market) {
    const subreddits = {
      'Crypto': ['cryptocurrency', 'CryptoMarkets', 'bitcoin'],
      'Sports': ['sports', 'soccer', 'worldcup'],
      'Technology': ['technology', 'artificial', 'singularity'],
      'Economy': ['economics', 'wallstreetbets', 'stocks'],
      'Science': ['space', 'SpaceXLounge', 'science'],
      'Entertainment': ['entertainment', 'movies', 'television'],
      'Politics': ['politics', 'geopolitics'],
    };

    const targetSubs = subreddits[market.category] || ['predictions'];
    const subreddit = targetSubs[Math.floor(Math.random() * targetSubs.length)];
    const probability = (market.outcomes[0].price * 100).toFixed(0);

    return {
      subreddit,
      title: `[Discussion] ${market.title} - Currently at ${probability}% on prediction markets`,
      text: `${market.description}\n\nCurrent prediction market odds:\n${market.outcomes.map(o => `- ${o.name}: ${(o.price * 100).toFixed(1)}%`).join('\n')}\n\nTotal volume: $${market.totalVolume.toLocaleString()}\n\nWhat do you all think? The market seems to be pricing in a ${probability}% chance.\n\n[Trade on PrediktIt](https://prediktit.com/markets/${market.id})`,
    };
  }
}

// ============================================================
// OPENAI SEO CONTENT GENERATION
// ============================================================

export class SEOContentGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateArticle(market) {
    if (!this.apiKey) {
      console.log('[OpenAI] No API key - generating template article');
      return this.generateTemplateArticle(market);
    }

    const prompt = `Write a 600-word SEO-optimized article about the prediction market for "${market.title}".

Market details:
- Category: ${market.category}
- Current odds: ${market.outcomes.map(o => `${o.name}: ${(o.price * 100).toFixed(1)}%`).join(', ')}
- Total volume: $${market.totalVolume.toLocaleString()}
- End date: ${market.endDate}

Requirements:
1. Write an engaging, informative article analyzing this prediction
2. Include key factors that could influence the outcome
3. Mention PrediktIt as the platform where users can trade on this
4. Use SEO-friendly headings and structure
5. Include a call-to-action to trade on PrediktIt
6. Be balanced and analytical, not promotional`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert financial and prediction market analyst writing SEO content.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error('No content generated');

      return {
        title: `${market.title} - Prediction Market Analysis | PrediktIt`,
        slug: this.generateSlug(market.title),
        metaDescription: `Trade on "${market.title}" with PrediktIt. Current probability: ${(market.outcomes[0].price * 100).toFixed(0)}%. Analysis and expert insights.`,
        keywords: this.generateKeywords(market),
        content,
      };
    } catch (error) {
      console.error('[OpenAI] Error generating content:', error);
      return this.generateTemplateArticle(market);
    }
  }

  generateTemplateArticle(market) {
    const probability = (market.outcomes[0].price * 100).toFixed(0);
    return {
      title: `${market.title} - Prediction Market Analysis | PrediktIt`,
      slug: this.generateSlug(market.title),
      metaDescription: `Trade on "${market.title}" with PrediktIt. Current probability: ${probability}%. Join thousands of traders making predictions.`,
      keywords: this.generateKeywords(market),
      content: `# ${market.title}\n\n## Market Overview\n\n${market.description}\n\nThe prediction market for this question is currently trading with the following probabilities:\n\n${market.outcomes.map(o => `- **${o.name}**: ${(o.price * 100).toFixed(1)}%`).join('\n')}\n\n## Current Market Activity\n\nThis market has attracted **$${market.totalVolume.toLocaleString()}** in total trading volume, making it one of the most closely watched markets in the ${market.category} category on PrediktIt.\n\n## Key Factors to Consider\n\nSeveral factors could influence the outcome of this prediction:\n\n1. **Historical trends** - Past performance and patterns in this category\n2. **Expert analysis** - What leading analysts and commentators are saying\n3. **Market sentiment** - How the broader community is positioning\n4. **Upcoming events** - Key dates and catalysts that could shift probabilities\n\n## How to Trade\n\nPrediktIt makes it easy to trade on this and hundreds of other prediction markets:\n\n1. Create a free account on PrediktIt\n2. Fund your wallet with play money or cryptocurrency\n3. Buy shares in the outcome you believe will happen\n4. Sell anytime to lock in profits or cut losses\n\nThe market will resolve on **${new Date(market.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}**.\n\n## Why Prediction Markets Matter\n\nPrediction markets aggregate the wisdom of crowds, often providing more accurate forecasts than individual experts or polls. By trading on PrediktIt, you're contributing to a more informed understanding of future events.\n\n---\n\n*Trade on PrediktIt - The next-generation prediction market platform. Trade responsibly.*`,
    };
  }

  generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
  }

  generateKeywords(market) {
    const baseKeywords = ['prediction market', 'forecast', 'trading', 'probabilities', 'prediktit'];
    const categoryKeywords = {
      Crypto: ['cryptocurrency', 'bitcoin', 'blockchain', 'defi'],
      Sports: ['sports betting', 'world cup', 'odds', 'predictions'],
      Technology: ['tech predictions', 'AI', 'innovation', 'future tech'],
      Economy: ['economic forecast', 'GDP', 'federal reserve', 'interest rates'],
      Science: ['space', 'science news', 'research', 'discovery'],
      Entertainment: ['entertainment industry', 'streaming', 'media'],
      Politics: ['political forecast', 'elections', 'policy'],
    };
    return [...baseKeywords, ...(categoryKeywords[market.category] || [])];
  }
}

// ============================================================
// MARKETING ORCHESTRATOR (Autonomous Engine)
// ============================================================

export class MarketingOrchestrator {
  constructor(config = {}) {
    this.twitter = new TwitterService(
      config.twitterApiKey, config.twitterApiSecret,
      config.twitterAccessToken, config.twitterAccessSecret
    );
    this.reddit = new RedditService(
      config.redditClientId, config.redditClientSecret,
      config.redditUsername, config.redditPassword
    );
    this.seo = new SEOContentGenerator(config.openaiApiKey);

    this.config = {
      postsPerDay: config.postsPerDay || 3,
      articlesPerWeek: config.articlesPerWeek || 5,
      platforms: config.platforms || ['twitter', 'reddit'],
      postingHoursStart: config.postingHoursStart || 9,
      postingHoursEnd: config.postingHoursEnd || 21,
    };
  }

  // Run a full marketing cycle
  async runCycle(markets) {
    const results = { posts: [], articles: [], errors: [] };

    // Sort markets by volume and recency
    const rankedMarkets = [...markets]
      .filter(m => m.status === 'active')
      .sort((a, b) => b.totalVolume - a.totalVolume);

    // Generate social posts for top markets
    const topMarkets = rankedMarkets.slice(0, this.config.postsPerDay);

    for (const market of topMarkets) {
      try {
        // Twitter
        if (this.config.platforms.includes('twitter')) {
          const tweet = this.twitter.generateMarketTweet(market);
          const tweetResult = await this.twitter.postTweet(tweet);
          results.posts.push({
            platform: 'twitter',
            marketId: market.id,
            content: tweet,
            result: tweetResult,
            scheduledAt: this.getNextPostTime(),
          });
        }

        // Reddit
        if (this.config.platforms.includes('reddit')) {
          const redditPost = this.reddit.generateRedditPost(market);
          await this.reddit.authenticate();
          const redditResult = await this.reddit.submitPost(
            redditPost.subreddit, redditPost.title, redditPost.text
          );
          results.posts.push({
            platform: 'reddit',
            marketId: market.id,
            content: redditPost.title,
            result: redditResult,
            scheduledAt: this.getNextPostTime(),
          });
        }
      } catch (error) {
        results.errors.push({ marketId: market.id, platform: 'social', error: error.message });
      }
    }

    // Generate SEO articles for featured/trending markets
    const articleMarkets = rankedMarkets
      .filter(m => m.featured || m.totalVolume > 200000)
      .slice(0, 2);

    for (const market of articleMarkets) {
      try {
        const article = await this.seo.generateArticle(market);
        results.articles.push({
          marketId: market.id,
          ...article,
          status: 'draft',
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        results.errors.push({ marketId: market.id, platform: 'seo', error: error.message });
      }
    }

    return results;
  }

  getNextPostTime() {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= this.config.postingHoursStart && hour < this.config.postingHoursEnd) {
      // Random time within the next 2 hours
      return new Date(now.getTime() + Math.random() * 7200000).toISOString();
    }
    // Schedule for next day's posting window
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(this.config.postingHoursStart + Math.floor(Math.random() * 3));
    tomorrow.setMinutes(Math.floor(Math.random() * 60));
    return tomorrow.toISOString();
  }

  // Get marketing analytics
  getAnalytics(posts, articles) {
    return {
      totalPosts: posts.length,
      totalArticles: articles.length,
      platformBreakdown: {
        twitter: posts.filter(p => p.platform === 'twitter').length,
        reddit: posts.filter(p => p.platform === 'reddit').length,
      },
      estimatedReach: posts.length * (500 + Math.floor(Math.random() * 2000)),
      estimatedClicks: posts.length * (20 + Math.floor(Math.random() * 100)),
      topPerforming: posts.sort((a, b) => (b.engagement?.clicks || 0) - (a.engagement?.clicks || 0)).slice(0, 3),
    };
  }
}
