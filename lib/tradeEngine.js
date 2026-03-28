// PrediktIt - Production Trade Engine
// Constant Product Market Maker (CPMM) implementation
// Similar to Polymarket's AMM model

import prisma from './prisma';

/**
 * Execute a trade using CPMM (Constant Product Market Maker)
 *
 * Price formula: price_i = shares_i / sum(all_shares)
 * Cost formula: cost = shares * price + slippage
 * Slippage increases with larger orders relative to liquidity
 */
export async function executeTrade({ userId, marketId, outcomeId, side, shares }) {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate market
    const market = await tx.market.findUnique({
      where: { id: marketId },
      include: { outcomes: true },
    });

    if (!market) throw new Error('Market not found');
    if (market.status !== 'ACTIVE') throw new Error('Market is not active');
    if (new Date(market.endDate) < new Date()) throw new Error('Market has ended');

    // 2. Validate user
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // 3. Find the outcome
    const outcome = market.outcomes.find(o => o.id === outcomeId);
    if (!outcome) throw new Error('Outcome not found');

    // 4. Calculate price with CPMM
    const totalShares = market.outcomes.reduce((sum, o) => sum + o.shares, 0);
    const currentPrice = outcome.shares / totalShares;

    // Calculate slippage (larger orders = more slippage)
    const slippageFactor = 1 + (shares / outcome.shares) * 0.01;
    const effectivePrice = currentPrice * slippageFactor;
    const cost = shares * effectivePrice;

    if (side === 'BUY') {
      // Check balance
      if (user.playBalance < cost) {
        throw new Error(`Insufficient balance. Need $${cost.toFixed(2)}, have $${user.playBalance.toFixed(2)}`);
      }

      // Deduct balance
      await tx.user.update({
        where: { id: userId },
        data: { playBalance: { decrement: cost } },
      });

      // Update outcome shares (more shares = higher price)
      await tx.outcome.update({
        where: { id: outcomeId },
        data: {
          shares: { increment: shares },
          volume: { increment: cost },
        },
      });

      // Upsert position
      await tx.position.upsert({
        where: {
          userId_marketId_outcomeId: { userId, marketId, outcomeId },
        },
        create: {
          userId,
          marketId,
          outcomeId,
          shares,
          avgPrice: effectivePrice,
        },
        update: {
          shares: { increment: shares },
          // Weighted average price
          avgPrice: await calculateNewAvgPrice(tx, userId, marketId, outcomeId, shares, effectivePrice),
        },
      });
    } else {
      // SELL
      const position = await tx.position.findUnique({
        where: { userId_marketId_outcomeId: { userId, marketId, outcomeId } },
      });

      if (!position || position.shares < shares) {
        throw new Error('Insufficient shares to sell');
      }

      // Credit balance
      await tx.user.update({
        where: { id: userId },
        data: { playBalance: { increment: cost } },
      });

      // Update outcome shares
      await tx.outcome.update({
        where: { id: outcomeId },
        data: {
          shares: { decrement: shares },
          volume: { increment: cost },
        },
      });

      // Update position
      const newShares = position.shares - shares;
      if (newShares <= 0) {
        await tx.position.delete({
          where: { userId_marketId_outcomeId: { userId, marketId, outcomeId } },
        });
      } else {
        await tx.position.update({
          where: { userId_marketId_outcomeId: { userId, marketId, outcomeId } },
          data: { shares: newShares },
        });
      }
    }

    // Update market volume
    await tx.market.update({
      where: { id: marketId },
      data: { totalVolume: { increment: cost } },
    });

    // Recalculate all prices
    const updatedOutcomes = await tx.outcome.findMany({ where: { marketId } });
    const newTotalShares = updatedOutcomes.reduce((sum, o) => sum + o.shares, 0);

    for (const o of updatedOutcomes) {
      await tx.outcome.update({
        where: { id: o.id },
        data: { price: o.shares / newTotalShares },
      });
    }

    // Record trade
    const trade = await tx.trade.create({
      data: {
        userId,
        marketId,
        outcomeId,
        side,
        shares,
        price: effectivePrice,
        cost,
      },
    });

    // Get updated user
    const updatedUser = await tx.user.findUnique({
      where: { id: userId },
      select: { playBalance: true },
    });

    return {
      trade,
      newBalance: updatedUser.playBalance,
      newPrices: updatedOutcomes.map(o => ({
        outcomeId: o.id,
        name: o.name,
        price: o.shares / newTotalShares,
      })),
    };
  });
}

async function calculateNewAvgPrice(tx, userId, marketId, outcomeId, newShares, newPrice) {
  const existing = await tx.position.findUnique({
    where: { userId_marketId_outcomeId: { userId, marketId, outcomeId } },
  });
  if (!existing) return newPrice;
  return (existing.avgPrice * existing.shares + newPrice * newShares) / (existing.shares + newShares);
}

/**
 * Resolve a market — pay out winning positions
 */
export async function resolveMarket(marketId, winningOutcomeId, adminId) {
  return await prisma.$transaction(async (tx) => {
    const market = await tx.market.findUnique({
      where: { id: marketId },
      include: { outcomes: true },
    });

    if (!market) throw new Error('Market not found');
    if (market.status === 'RESOLVED') throw new Error('Market already resolved');

    // Verify admin
    const admin = await tx.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') throw new Error('Unauthorized');

    // Get all positions for winning outcome
    const winningPositions = await tx.position.findMany({
      where: { marketId, outcomeId: winningOutcomeId },
    });

    // Pay out winners: each share = $1 payout
    for (const pos of winningPositions) {
      await tx.user.update({
        where: { id: pos.userId },
        data: { playBalance: { increment: pos.shares } },
      });
    }

    // Delete all positions for this market
    await tx.position.deleteMany({ where: { marketId } });

    // Update market status
    const winningOutcome = market.outcomes.find(o => o.id === winningOutcomeId);
    await tx.market.update({
      where: { id: marketId },
      data: {
        status: 'RESOLVED',
        resolution: winningOutcome?.name,
        resolvedAt: new Date(),
      },
    });

    return { success: true, winnersCount: winningPositions.length };
  });
}
