import { NextResponse } from 'next/server';

// Cron endpoint - runs every 4 hours via Vercel Cron
// Vercel Cron config in vercel.json: "0 */4 * * *"
export async function GET(request) {
  // Verify cron secret (Vercel sets this header)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Call our main marketing API to run a cycle
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/marketing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'run_cycle' }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
      message: 'Autonomous marketing cycle completed',
    });
  } catch (error) {
    console.error('[Marketing Cron] Error:', error);
    return NextResponse.json({ error: 'Marketing cycle failed', details: error.message }, { status: 500 });
  }
}
