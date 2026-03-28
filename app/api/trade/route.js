import { NextResponse } from 'next/server';
// Production: import { executeTrade } from '@/lib/tradeEngine';
// Production: import { getServerSession } from 'next-auth';
// Production: import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const body = await request.json();
    const { marketId, outcomeId, outcomeIndex, side, shares, userId } = body;

    // Validation
    if (!marketId || (outcomeId === undefined && outcomeIndex === undefined) || !side || !shares) {
      return NextResponse.json({ error: 'Missing required fields: marketId, outcomeId/outcomeIndex, side, shares' }, { status: 400 });
    }
    if (shares <= 0 || shares > 100000) {
      return NextResponse.json({ error: 'Shares must be between 1 and 100,000' }, { status: 400 });
    }
    if (!['buy', 'sell', 'BUY', 'SELL'].includes(side)) {
      return NextResponse.json({ error: 'Side must be buy or sell' }, { status: 400 });
    }

    /* Production code:
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await executeTrade({
      userId: session.user.id,
      marketId,
      outcomeId,
      side: side.toUpperCase(),
      shares,
    });
    return NextResponse.json(result);
    */

    // Demo mode: simulate trade execution with CPMM
    const basePrice = 0.3 + Math.random() * 0.4;
    const slippage = 1 + (shares / 10000) * 0.01;
    const effectivePrice = basePrice * slippage;
    const cost = shares * effectivePrice;

    const trade = {
      id: `trade_${Date.now()}`,
      marketId,
      outcomeId: outcomeId || `outcome_${outcomeIndex}`,
      side: side.toUpperCase(),
      shares,
      price: parseFloat(effectivePrice.toFixed(4)),
      cost: parseFloat(cost.toFixed(2)),
      slippage: parseFloat(((slippage - 1) * 100).toFixed(3)),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      trade,
      newBalance: parseFloat((10000 - cost).toFixed(2)),
      message: `${side.toUpperCase()} ${shares} shares at ${(effectivePrice * 100).toFixed(1)}¢ each. Total: $${cost.toFixed(2)}`,
    });
  } catch (error) {
    console.error('Trade error:', error);
    return NextResponse.json({ error: 'Trade execution failed', details: error.message }, { status: 500 });
  }
}
