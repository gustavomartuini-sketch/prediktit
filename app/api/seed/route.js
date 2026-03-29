import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Seed the database with initial data
export async function POST(request) {
  try {
    // Check for auth (simple secret check)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    if (secret !== (process.env.CRON_SECRET || 'seed-prediktit')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = { users: 0, markets: 0, outcomes: 0 };

    // 1. Create admin + demo users if they don't exist
    const adminPassword = await bcrypt.hash('admin123456', 12);
    const demoPassword = await bcrypt.hash('demo123456', 12);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@prediktit.com' },
      update: {},
      create: {
        email: 'admin@prediktit.com',
        username: 'admin_chief',
        password: adminPassword,
        role: 'ADMIN',
        playBalance: 100000,
      },
    });
    results.users++;

    const demo = await prisma.user.upsert({
      where: { email: 'demo@prediktit.com' },
      update: {},
      create: {
        email: 'demo@prediktit.com',
        username: 'demo_trader',
        password: demoPassword,
        role: 'USER',
        playBalance: 10000,
      },
    });
    results.users++;

    // 2. Create markets with outcomes
    const marketsData = [
      {
        title: 'Will Bitcoin exceed $150,000 by end of 2026?',
        description: 'This market resolves YES if Bitcoin (BTC) trades above $150,000 on any major exchange before December 31, 2026 11:59 PM UTC.',
        category: 'Crypto', type: 'BINARY', featured: true,
        totalVolume: 487320, totalLiquidity: 50000,
        endDate: new Date('2026-12-31T23:59:00Z'),
        outcomes: [{ name: 'Yes', price: 0.62, volume: 301337 }, { name: 'No', price: 0.38, volume: 185983 }],
      },
      {
        title: 'Who will win the 2026 FIFA World Cup?',
        description: 'This market resolves to the team that wins the 2026 FIFA World Cup final.',
        category: 'Sports', type: 'MULTIPLE', featured: true,
        totalVolume: 892150, totalLiquidity: 100000,
        endDate: new Date('2026-07-19T23:59:00Z'),
        outcomes: [
          { name: 'Brazil', price: 0.22, volume: 196073 }, { name: 'France', price: 0.19, volume: 169508 },
          { name: 'Argentina', price: 0.18, volume: 160587 }, { name: 'Germany', price: 0.12, volume: 107058 },
          { name: 'England', price: 0.11, volume: 98136 }, { name: 'Spain', price: 0.09, volume: 80293 },
          { name: 'Other', price: 0.09, volume: 80493 },
        ],
      },
      {
        title: 'Will GPT-5 be released before July 2026?',
        description: 'Resolves YES if OpenAI officially releases GPT-5 (not preview/beta) before July 1, 2026.',
        category: 'Technology', type: 'BINARY', featured: true,
        totalVolume: 341000, totalLiquidity: 75000,
        endDate: new Date('2026-07-01T00:00:00Z'),
        outcomes: [{ name: 'Yes', price: 0.45, volume: 153450 }, { name: 'No', price: 0.55, volume: 187550 }],
      },
      {
        title: 'US GDP growth rate Q2 2026',
        description: 'What will the annualized US GDP growth rate be for Q2 2026?',
        category: 'Economy', type: 'MULTIPLE', featured: false,
        totalVolume: 225000, totalLiquidity: 30000,
        endDate: new Date('2026-07-30T00:00:00Z'),
        outcomes: [{ name: 'Below 0%', price: 0.12, volume: 27000 }, { name: '0-1%', price: 0.18, volume: 40500 }, { name: '1-2%', price: 0.30, volume: 67500 }, { name: '2-3%', price: 0.28, volume: 63000 }, { name: 'Above 3%', price: 0.12, volume: 27000 }],
      },
      {
        title: 'Will SpaceX Starship complete orbital flight by June 2026?',
        description: 'Resolves YES if SpaceX Starship completes a full orbital flight and lands successfully.',
        category: 'Science', type: 'BINARY', featured: false,
        totalVolume: 345000, totalLiquidity: 45000,
        endDate: new Date('2026-06-30T23:59:00Z'),
        outcomes: [{ name: 'Yes', price: 0.71, volume: 244950 }, { name: 'No', price: 0.29, volume: 100050 }],
      },
      {
        title: 'Next US Federal Reserve interest rate decision',
        description: 'What will the Fed do at their next FOMC meeting?',
        category: 'Economy', type: 'MULTIPLE', featured: false,
        totalVolume: 400000, totalLiquidity: 60000,
        endDate: new Date('2026-05-01T00:00:00Z'),
        outcomes: [{ name: 'Cut 50bp', price: 0.08, volume: 32000 }, { name: 'Cut 25bp', price: 0.35, volume: 140000 }, { name: 'Hold', price: 0.48, volume: 192000 }, { name: 'Raise 25bp', price: 0.09, volume: 36000 }],
      },
      {
        title: 'Will Ethereum ETF surpass $50B AUM in 2026?',
        description: 'Resolves YES if combined Ethereum spot ETF AUM exceeds $50 billion.',
        category: 'Crypto', type: 'BINARY', featured: false,
        totalVolume: 250000, totalLiquidity: 35000,
        endDate: new Date('2026-12-31T23:59:00Z'),
        outcomes: [{ name: 'Yes', price: 0.38, volume: 95000 }, { name: 'No', price: 0.62, volume: 155000 }],
      },
      {
        title: 'Which streaming service will have most subscribers by end of 2026?',
        description: 'Based on officially reported global subscriber counts.',
        category: 'Entertainment', type: 'MULTIPLE', featured: false,
        totalVolume: 200000, totalLiquidity: 20000,
        endDate: new Date('2027-01-15T00:00:00Z'),
        outcomes: [{ name: 'Netflix', price: 0.42, volume: 84000 }, { name: 'Disney+', price: 0.18, volume: 36000 }, { name: 'Amazon Prime', price: 0.22, volume: 44000 }, { name: 'YouTube Premium', price: 0.10, volume: 20000 }, { name: 'Other', price: 0.08, volume: 16000 }],
      },
    ];

    for (const md of marketsData) {
      const existing = await prisma.market.findFirst({ where: { title: md.title } });
      if (existing) continue;

      const { outcomes, ...marketData } = md;
      const market = await prisma.market.create({
        data: {
          ...marketData,
          creatorId: admin.id,
          outcomes: {
            create: outcomes.map(o => ({
              name: o.name,
              price: o.price,
              volume: o.volume || 0,
              shares: 1000,
            })),
          },
        },
      });
      results.markets++;
      results.outcomes += outcomes.length;
    }

    return NextResponse.json({
      success: true,
      message: `Seed complete: ${results.users} users, ${results.markets} markets, ${results.outcomes} outcomes created`,
      results,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message, stack: error.stack?.slice(0, 500) }, { status: 500 });
  }
}
