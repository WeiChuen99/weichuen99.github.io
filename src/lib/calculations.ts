import type { CarStats, RefuelReceipt, RefuelSummaryStats, MonthlyBudgetStats, Settings } from '../types';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function allocateCosts(totalCost: number, litersA: number, litersB: number) {
  const totalLiters = litersA + litersB;
  if (totalLiters <= 0) {
    return {
      totalLiters: 0,
      pricePerLiter: 0,
      carACost: 0,
      carBCost: 0,
    };
  }

  const pricePerLiter = totalCost / totalLiters;
  const carACost = pricePerLiter * litersA;
  const carBCost = pricePerLiter * litersB;

  return {
    totalLiters,
    pricePerLiter,
    carACost,
    carBCost,
  };
}

export function calculateSummaryStats(receipts: RefuelReceipt[]): RefuelSummaryStats {
  const receiptCount = receipts.length;
  const totalCost = receipts.reduce((sum, r) => sum + r.totalCost, 0);
  const totalLiters = receipts.reduce((sum, r) => sum + r.totalLiters, 0);
  const averageCost = receiptCount > 0 ? totalCost / receiptCount : 0;
  const averageLiters = receiptCount > 0 ? totalLiters / receiptCount : 0;

  return {
    receiptCount,
    totalCost,
    totalLiters,
    averageCost,
    averageLiters,
  };
}

export function calculateMonthlyBudgetStats(
  receipts: RefuelReceipt[],
  settings: Settings
): MonthlyBudgetStats {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const monthReceipts = receipts.filter((r) =>
    isWithinInterval(r.date, { start, end })
  );

  const totalSpent = monthReceipts.reduce((sum, r) => sum + r.totalCost, 0);
  const receiptCount = monthReceipts.length;
  const remainingBudget = settings.monthlyBudget - totalSpent;
  const percentUsed = (totalSpent / settings.monthlyBudget) * 100;

  return {
    totalSpent,
    remainingBudget,
    percentUsed,
    receiptCount,
  };
}

export function calculateCarStatsFromReceipts(
  receipts: RefuelReceipt[],
  carId: string,
  carName: string
): CarStats {
  const relevant = receipts.filter((r) => r.carAId === carId || r.carBId === carId);

  const totalSpent = relevant.reduce((sum, r) => {
    if (r.carAId === carId) return sum + r.carACost;
    return sum + r.carBCost;
  }, 0);

  const totalLiters = relevant.reduce((sum, r) => {
    if (r.carAId === carId) return sum + r.carALiters;
    return sum + r.carBLiters;
  }, 0);

  const refillCount = relevant.length;
  const averageLiters = refillCount > 0 ? totalLiters / refillCount : 0;

  const sorted = [...relevant].sort((a, b) => b.date.getTime() - a.date.getTime());
  const lastRefillDate = sorted[0]?.date;

  return {
    carId,
    carName,
    totalSpent,
    totalLiters,
    refillCount,
    averageLiters,
    lastRefillDate,
  };
}
