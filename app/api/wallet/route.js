import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    playBalance: 10000,
    cryptoBalance: 0,
    cryptoWallet: null,
    transactions: [
      { type: 'credit', amount: 10000, description: 'Welcome bonus', timestamp: '2026-03-25T00:00:00Z' },
    ],
  });
}

export async function POST(request) {
  const body = await request.json();
  const { action, amount } = body;

  if (action === 'deposit_play') {
    return NextResponse.json({
      success: true,
      newBalance: 10000 + (amount || 1000),
      message: `Added $${amount || 1000} play money to your account`,
    });
  }

  if (action === 'connect_wallet') {
    return NextResponse.json({
      success: true,
      message: 'Wallet connection initiated. Please approve in MetaMask.',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD10',
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
