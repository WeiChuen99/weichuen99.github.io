import { useMemo } from 'react';
import { CarCard } from './CarCard';
import { MonthlyBudget } from './WeeklyBudget';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import type { RefuelReceipt, Settings } from '../types';
import { CARS } from '../lib/constants';
import { calculateCarStatsFromReceipts, calculateSummaryStats, calculateMonthlyBudgetStats } from '../lib/calculations';

interface DashboardProps {
  receipts: RefuelReceipt[];
  settings: Settings;
}

export function Dashboard({ receipts, settings }: DashboardProps) {
  const monthlyBudget = useMemo(
    () => calculateMonthlyBudgetStats(receipts, settings),
    [receipts, settings]
  );

  const summary = useMemo(() => calculateSummaryStats(receipts), [receipts]);

  const carStats = useMemo(
    () =>
      CARS.map((car) =>
        calculateCarStatsFromReceipts(receipts, car.id, car.name)
      ),
    [receipts]
  );

  return (
    <div className="space-y-6">
      <MonthlyBudget stats={monthlyBudget} currency={settings.currency} />
      
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-2xl font-semibold">{summary.receiptCount}</div>
              <div className="text-xs text-muted-foreground">Receipts</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {settings.currency}{summary.totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Total Cost</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{summary.totalLiters.toFixed(1)}L</div>
              <div className="text-xs text-muted-foreground">Total Liters</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {settings.currency}{summary.averageCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Cost/Receipt</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{summary.averageLiters.toFixed(1)}L</div>
              <div className="text-xs text-muted-foreground">Avg Liters/Receipt</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Cars Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARS.map((car, index) => (
            <CarCard
              key={car.id}
              car={car}
              stats={carStats[index]}
              currency={settings.currency}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
