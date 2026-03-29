import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fallback demo data (used if DB is empty or unavailable)
const DEMO_MARKETS = [
  {
    id: '1', title: 'Will Bitcoin exceed $150,000 by end of 2026?',
    description: 'This market resolves YES if Bitcoin (BTC) trades above $150,000 on any major exchange before December 31, 2026 11:59 PM UTC.',
    category: 'Crypto', type: 'BINARY', status: 'ACTIVE', featured: true,
    outcomes: [{ name: 'Yes', price: 0.62, volume: 301337 }, { name: 'No', price: 0.38, volume: 185983 }],
    totalVolume: 487320, totalLiquidity: 50000, endDate: '2026-12-31T23:59:00Z', createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: '2', title: 'Who will win the 2026 FIFA World Cup?',
    description: 'This market resolves to the team that wins the 2026 FIFA World Cup final.',
    category: 'Sports', type: 'MULTIPLE', status: 'ACTIVE', featured: true,
    outcomes: [
      { name: 'Brazil', price: 0.22, volume: 196073 }, { name: 'France', price: 0.19, volume: 169508 },
      { name: 'Argentina', price: 0.18, volume: 160587 }, { name: 'Germany', price: 0.12, volume: 107058 },
      { name: 'England', price: 0.11, volume: 98136 }, { name: 'Spain', price: 0.09, volume: 80293 },
      { name: 'Other', price: 0.09, volume: 80493 },
    ],
    totalVolume: 892150, totalLiquidity: 100000, endDate: '2026-07-19T23:59:00Z', createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: '3', title: 'Will GPT-5 be released before July 2026?',
    description: 'Resolves YES if OpenAI officially releases GPT-5 (not preview/beta) before July 1, 2026.',
    category: 'Technology', type: 'BINARY', status: 'ACTIVE', featured: true,
    outcomes: [{ name: 'Yes', price: 0.45, volume: 153450 }, { name: 'No', price: 0.55, volume: 187550 }],
    totalVolume: 341000, totalLiquidity: 75000, endDate: '2026-07-01T00:00:00Z', createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: '4', title: 'US GDP growth rate Q2 2026', description: 'What will the annualized US GDP growth rate be for Q2 2026?',
    category: 'Economy', type: 'MULTIPLE', status: 'ACTIVE', featured: false,
    outcomes: [{ name: 'Below 0%', price: 0.12 }, { name: '0-1%', price: 0.18 }, { name: '1-2%', price: 0.30 }, { name: '2-3%', price: 0.28 }, { name: 'Above 3%', price: 0.12 }],
    totalVolume: 225000, totalLiquidity: 30000, endDate: '2026-07-30T00:00:00Z', createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: '5', title: 'Will SpaceX Starship complete orbital flight by June 2026?',
    description: 'Resolves YES if SpaceX Starship completes a full orbital flight and lands successfully.',
    category: 'Science', type: 'BINARY', status: 'ACTIVE', featured: false,
    outcomes: [{ name: 'Yes', price: 0.71 }, { name: 'No', price: 0.29 }],
    totalVolume: 345000, totalLiquidity: 45000, endDate: '2026-06-30T23:59:00Z', createdAt: '2026-02-28T00:00:00Z',
  },
  {
    id: '6', title: 'Next US Federal Reserve interest rate decision',
    description: 'What will the Fed do at their next FOMC meeting?',
    category: 'Economy', type: 'MULTIPLE', status: 'ACTIVE', featured: false,
    outcomes: [{ name: 'Cut 50bp', price: 0.08 }, { name: 'Cut 25bp', price: 0.35 }, { name: 'Hold', price: 0.48 }, { name: 'Raise 25bp', price: 0.09 }],
    totalVolume: 400000, totalLiquidity: 60000, endDate: '2026-05-01T00:00:00Z', createdAt: '2026-03-15T00:00:00Z',
  },
  {
    id: '7', title: 'Will Ethereum ETF surpass $50B AUM in 2026?',
    description: 'Resolves YES if combined Ethereum spot ETF AUM exceeds $50 billion.',
    category: 'Crypto', type: 'BINARY', status: 'ACTIVE', featured: false,
    outcomes: [{ name: 'Yes', price: 0.38 }, { name: 'No', price: 0.62 }],
    totalVolume: 250000, totalLiquidity: 35000, endDate: '2026-12-31T23:59:00Z', createdAt: '2026-03-05T00:00:00Z',
  },
  {
    id: '8', title: 'Which streaming service will have most subscribers by end of 2026?',
    description: 'Based on officially reported global subscriber counts.',
    category: 'Entertainment', type: 'MULTIPLE', status: 'ACTIVE', featured: false,
    outcomes: [{ name: 'Netflix', price: 0.42 }, { name: 'Disney+', price: 0.18 }, { name: 'Amazon Prime', price: 0.22 }, { name: 'YouTube Premium', price: 0.10 }, { name: 'Other', price: 0.08 }],
    totalVolume: 200000, totalLiquidity: 20000, endDate: '2027-01-15T00:00:00Z', createdAt: '2026-03-20T00:00:00Z',
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  try {
    // Try to fetch from database
    const where = { status: 'ACTIVE' };
    if (category && category !== 'All') where.category = category;
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const markets = await prisma.market.findMany({
      where,
      include: { outcomes: true },
      orderBy: { createdAt: 'desc' },
    });

    if (markets.length > 0) {
      return NextResponse.json({ markets, total: markets.length, source: 'database' });
    }
  } catch (error) {
    console.log('DB query failed, using demo data:', error.message);
  }

  // Fallback to demo data
  let filtered = [...DEMO_MARKETS];
  if (category && category !== 'All') filtered = filtered.filter(m => m.category === category);
  if (featured === 'true') filtered = filtered.filter(m => m.featured);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  }

  return NextResponse.json({ markets: filtered, total: filtered.length, source: 'demo' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, category, type, outcomes, endDate, liquidity } = body;

    if (!title || !description || !outcomes || outcomes.length < 2) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create market in database
    const market = await prisma.market.create({
      data: {
        title,
        description,
        category: category || 'General',
        type: type === 'multiple' ? 'MULTIPLE' : 'BINARY',
        status: 'ACTIVE',
        totalLiquidity: liquidity || 1000,
        endDate: new Date(endDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
        creatorId: body.creatorId || 'system',
        outcomes: {
          create: outcomes.map((name) => ({
            name: typeof name === 'string' ? name : name.name,
            price: parseFloat((1 / outcomes.length).toFixed(4)),
            shares: 1000,
          })),
        },
      },
      include: { outcomes: true },
    });

    return NextResponse.json({ market, success: true }, { status: 201 });
  } catch (error) {
    console.error('Create market error:', error);
    // Fallback for when DB isn't available
    const { title, description, category, type, outcomes, endDate, liquidity } = await request.json().catch(() => ({}));
    const market = {
      id: Date.now().toString(), title, description, category, type,
      outcomes: (outcomes || []).map((name) => ({ name, price: parseFloat((1 / (outcomes?.length || 2)).toFixed(4)) })),
      totalVolume: 0, totalLiquidity: liquidity || 1000, endDate, status: 'ACTIVE', featured: false, createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ market, success: true, source: 'demo' }, { status: 201 });
  }
}
